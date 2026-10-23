from core.database import db, cliente_col, prestador_col, feedback_cliente_col, feedback_prestador_col
from src.mongo.admin import data_do_documento, _paginado, _etapas_nota_geral
from src.mongo.busca import _endereco, _regex
from src.mongo.paginacao import paginar, contar, calcular_pagina
from bson import ObjectId
from bson.errors import InvalidId

COLECOES = {
    'cliente_para_prestador': {'colecao': 'feedback_prestador', 'autor': 'cliente', 'alvo': 'prestador'},
    'prestador_para_cliente': {'colecao': 'feedback_cliente', 'autor': 'prestador', 'alvo': 'cliente'},
}
PESSOAS = {'cliente': cliente_col, 'prestador': prestador_col}

async def _pessoas_por_email(papel: str, emails: set) -> dict:
    emails = [e for e in emails if e]
    if not emails:
        return {}
    docs = await PESSOAS[papel].find({'email': {'$in': emails}}, {'nome': 1, 'email': 1, 'endereco': 1}).to_list(length=None)
    return {d['email']: d for d in docs}

def _cidade(doc: dict | None) -> str | None:
    return _endereco(doc).get('cidade') if doc else None

def _nota_numerica(nota) -> float:
    if isinstance(nota, dict):
        nota = nota.get('notaGeral')
    return nota if isinstance(nota, (int, float)) else 0

async def avaliacoes_feitas(papel: str, email: str, pagina: int = 1, limite: int = 10) -> dict:
    origem = 'cliente_para_prestador' if papel == 'cliente' else 'prestador_para_cliente'
    config = COLECOES[origem]
    colecao = db[config['colecao']]
    filtro = {'avaliador': email}
    total = await colecao.count_documents(filtro)
    pagina, total_paginas = calcular_pagina(total, pagina, limite)
    docs = await colecao.find(filtro).sort('_id', -1).skip((pagina - 1) * limite).limit(limite).to_list(length=limite)
    alvos = await _pessoas_por_email(config['alvo'], {d.get('avaliado') for d in docs})
    itens = []
    for d in docs:
        alvo = alvos.get(d.get('avaliado'))
        itens.append({
            '_id': str(d['_id']),
            'alvo_id': str(alvo['_id']) if alvo else None,
            'alvo': alvo.get('nome') if alvo else 'Conta excluída',
            'alvo_papel': config['alvo'],
            'cidade': _cidade(alvo),
            'nota': _nota_numerica(d.get('nota')),
            'mensagem': (d.get('mensagem') or '').strip(),
            'data': data_do_documento(d, 'data_avaliacao').isoformat(),
        })
    return {'avaliacoes': itens, 'total': total, 'pagina': pagina, 'limite': limite, 'total_paginas': total_paginas}

def _etapas_origem(origem) -> tuple[object, list]:
    if origem == 'cliente_para_prestador':
        return feedback_prestador_col, [{'$addFields': {'origem': origem}}]
    if origem == 'prestador_para_cliente':
        return feedback_cliente_col, [{'$addFields': {'origem': origem}}]
    return feedback_prestador_col, [
        {'$addFields': {'origem': 'cliente_para_prestador'}},
        {'$unionWith': {'coll': 'feedback_cliente', 'pipeline': [{'$addFields': {'origem': 'prestador_para_cliente'}}]}},
    ]

def _nome_da_origem(campo_cliente: str, campo_prestador: str) -> dict:
    return {'$cond': [
        {'$eq': ['$origem', 'cliente_para_prestador']},
        {'$arrayElemAt': [campo_cliente, 0]},
        {'$arrayElemAt': [campo_prestador, 0]},
    ]}

def _etapas_busca_nomes() -> list:
    return [
        {'$lookup': {'from': 'cliente', 'localField': 'avaliador', 'foreignField': 'email', 'as': 'a_cli'}},
        {'$lookup': {'from': 'prestador', 'localField': 'avaliador', 'foreignField': 'email', 'as': 'a_pre'}},
        {'$lookup': {'from': 'cliente', 'localField': 'avaliado', 'foreignField': 'email', 'as': 'v_cli'}},
        {'$lookup': {'from': 'prestador', 'localField': 'avaliado', 'foreignField': 'email', 'as': 'v_pre'}},
        {'$addFields': {
            'autor_nome': _nome_da_origem('$a_cli.nome', '$a_pre.nome'),
            'alvo_nome': {'$cond': [
                {'$eq': ['$origem', 'cliente_para_prestador']},
                {'$arrayElemAt': ['$v_pre.nome', 0]},
                {'$arrayElemAt': ['$v_cli.nome', 0]},
            ]},
        }},
        {'$project': {'a_cli': 0, 'a_pre': 0, 'v_cli': 0, 'v_pre': 0}},
    ]

def _base_moderacao(origem, q, nota) -> tuple[object, list]:
    colecao, base = _etapas_origem(origem)
    base = base + _etapas_nota_geral()
    if nota is not None:
        base.append({'$match': {'nota_geral': {'$gte': nota - 0.25, '$lt': nota + 0.25}}})
    if q and q.strip():
        base += _etapas_busca_nomes()
        base.append({'$match': {'$or': [
            {'autor_nome': _regex(q)}, {'alvo_nome': _regex(q)},
            {'avaliador': _regex(q)}, {'avaliado': _regex(q)}, {'mensagem': _regex(q)},
        ]}})
    return colecao, base

async def _itens_moderacao(docs: list) -> list[dict]:
    autores, alvos = {}, {}
    for chave, config in COLECOES.items():
        da_origem = [d for d in docs if d['origem'] == chave]
        autores[chave] = await _pessoas_por_email(config['autor'], {d.get('avaliador') for d in da_origem})
        alvos[chave] = await _pessoas_por_email(config['alvo'], {d.get('avaliado') for d in da_origem})
    itens = []
    for d in docs:
        config = COLECOES[d['origem']]
        autor, alvo = autores[d['origem']].get(d.get('avaliador')), alvos[d['origem']].get(d.get('avaliado'))
        itens.append({
            '_id': str(d['_id']),
            'origem': d['origem'],
            'autor': autor.get('nome') if autor else 'Usuário removido',
            'autor_email': d.get('avaliador'),
            'autor_id': str(autor['_id']) if autor else None,
            'autor_papel': config['autor'],
            'alvo': alvo.get('nome') if alvo else 'Usuário removido',
            'alvo_email': d.get('avaliado'),
            'alvo_id': str(alvo['_id']) if alvo else None,
            'alvo_papel': config['alvo'],
            'nota': d['nota_geral'],
            'mensagem': (d.get('mensagem') or '').strip(),
            'data': data_do_documento(d, 'data_avaliacao').isoformat(),
        })
    return itens

async def listar_moderacao(origem=None, q=None, nota=None, pagina=1, limite=10) -> dict:
    colecao, base_geral = _base_moderacao(origem, None, None)
    total_geral = await contar(colecao, base_geral)
    colecao, base = _base_moderacao(origem, q, nota)
    docs, total, pagina, _ = await paginar(colecao, base, {'data_ord': -1, '_id': -1}, pagina, limite)
    resposta = _paginado(total, pagina, limite, await _itens_moderacao(docs), 'avaliacoes')
    resposta['total_geral'] = total_geral
    return resposta

async def excluir_avaliacao(origem: str, avaliacao_id: str) -> bool:
    try:
        oid = ObjectId(avaliacao_id)
    except InvalidId:
        return False
    resultado = await db[COLECOES[origem]['colecao']].delete_one({'_id': oid})
    return resultado.deleted_count == 1
