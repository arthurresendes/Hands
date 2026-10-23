from math import ceil
from bson import ObjectId
from bson.errors import InvalidId
from core.database import db, cliente_col, prestador_col
from src.mongo.admin import data_do_documento, _paginar, _nota_na_faixa
from src.mongo.busca import _endereco
from src.mongo.query import extrair_nota_geral

COLECOES = {
    'cliente_para_prestador': {'colecao': 'feedback_prestador', 'autor': 'cliente', 'alvo': 'prestador'},
    'prestador_para_cliente': {'colecao': 'feedback_cliente', 'autor': 'prestador', 'alvo': 'cliente'},
}
PESSOAS = {'cliente': cliente_col, 'prestador': prestador_col}

async def _pessoas_por_email(papel: str, emails: set) -> dict:
    docs = await PESSOAS[papel].find({'email': {'$in': list(emails)}}, {'nome': 1, 'email': 1, 'endereco': 1}).to_list(length=None)
    return {d['email']: d for d in docs}

def _cidade(doc: dict | None) -> str | None:
    return _endereco(doc).get('cidade') if doc else None

async def avaliacoes_feitas(papel: str, email: str, pagina: int = 1, limite: int = 10) -> dict:
    origem = 'cliente_para_prestador' if papel == 'cliente' else 'prestador_para_cliente'
    config = COLECOES[origem]
    docs = await db[config['colecao']].find({'avaliador': email}).sort('_id', -1).to_list(length=None)
    alvos = await _pessoas_por_email(config['alvo'], {d.get('avaliado') for d in docs})
    itens = []
    for d in docs:
        alvo = alvos.get(d.get('avaliado'))
        nota = extrair_nota_geral(d.get('nota'))
        itens.append({
            '_id': str(d['_id']),
            'alvo_id': str(alvo['_id']) if alvo else None,
            'alvo': alvo.get('nome') if alvo else 'Conta excluída',
            'alvo_papel': config['alvo'],
            'cidade': _cidade(alvo),
            'nota': nota if isinstance(nota, (int, float)) else 0,
            'mensagem': (d.get('mensagem') or '').strip(),
            'data': data_do_documento(d, 'data_avaliacao').isoformat(),
        })
    pagina_itens, pagina = _paginar(itens, pagina, limite)
    return {
        'avaliacoes': pagina_itens, 'total': len(itens), 'pagina': pagina, 'limite': limite,
        'total_paginas': max(1, ceil(len(itens) / limite)),
    }

async def _carregar_moderacao(origem, q, nota) -> list[dict]:
    origens = [origem] if origem else list(COLECOES)
    itens = []
    for chave in origens:
        config = COLECOES[chave]
        docs = await db[config['colecao']].find({}).to_list(length=None)
        autores = await _pessoas_por_email(config['autor'], {d.get('avaliador') for d in docs})
        alvos = await _pessoas_por_email(config['alvo'], {d.get('avaliado') for d in docs})
        for d in docs:
            valor = extrair_nota_geral(d.get('nota'))
            if not isinstance(valor, (int, float)):
                continue
            autor, alvo = autores.get(d.get('avaliador')), alvos.get(d.get('avaliado'))
            itens.append({
                '_id': str(d['_id']),
                'origem': chave,
                'autor': autor.get('nome') if autor else 'Usuário removido',
                'autor_email': d.get('avaliador'),
                'autor_id': str(autor['_id']) if autor else None,
                'autor_papel': config['autor'],
                'alvo': alvo.get('nome') if alvo else 'Usuário removido',
                'alvo_email': d.get('avaliado'),
                'alvo_id': str(alvo['_id']) if alvo else None,
                'alvo_papel': config['alvo'],
                'nota': round(valor, 1),
                'mensagem': (d.get('mensagem') or '').strip(),
                'data': data_do_documento(d, 'data_avaliacao').isoformat(),
            })
    if nota is not None:
        itens = [i for i in itens if _nota_na_faixa(i['nota'], nota)]
    if q and q.strip():
        termo = q.strip().lower()
        campos = ('autor', 'autor_email', 'alvo', 'alvo_email', 'mensagem')
        itens = [i for i in itens if any(termo in (i[c] or '').lower() for c in campos)]
    return sorted(itens, key=lambda i: i['data'], reverse=True)

async def listar_moderacao(origem=None, q=None, nota=None, pagina=1, limite=10) -> dict:
    total_geral = len(await _carregar_moderacao(origem, None, None))
    itens = await _carregar_moderacao(origem, q, nota)
    pagina_itens, pagina = _paginar(itens, pagina, limite)
    return {
        'avaliacoes': pagina_itens, 'total': len(itens), 'total_geral': total_geral, 'pagina': pagina, 'limite': limite,
        'total_paginas': max(1, ceil(len(itens) / limite)),
    }

async def excluir_avaliacao(origem: str, avaliacao_id: str) -> bool:
    try:
        oid = ObjectId(avaliacao_id)
    except InvalidId:
        return False
    resultado = await db[COLECOES[origem]['colecao']].delete_one({'_id': oid})
    return resultado.deleted_count == 1
