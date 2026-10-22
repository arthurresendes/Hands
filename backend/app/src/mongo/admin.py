import csv
import io
from datetime import datetime, timedelta
from math import ceil
from core.database import (
    db, cliente_col, prestador_col, feedback_hands_col, feedback_prestador_col, contadores_col,
)
from src.mongo.busca import PIPELINE_NOTA, _regex, _endereco, _nota_arredondada
from src.mongo.query import formatar_cidade, extrair_nota_geral

MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
TIPOS_EXPORTACAO = ('clientes', 'prestadores', 'avaliacoes_hands')
PREFIXOS_PERIGOSOS = ('=', '+', '-', '@', '\t', '\r')

def data_do_documento(doc: dict, campo: str = 'data_criacao') -> datetime:
    valor = doc.get(campo)
    if isinstance(valor, datetime):
        return valor.replace(tzinfo=None)
    return doc['_id'].generation_time.replace(tzinfo=None)

def inicio_do_dia(texto: str | None) -> datetime | None:
    if not texto:
        return None
    try:
        return datetime.strptime(texto, '%Y-%m-%d')
    except ValueError:
        return None

def fim_do_dia(texto: str | None) -> datetime | None:
    inicio = inicio_do_dia(texto)
    return inicio + timedelta(days=1) if inicio else None

def ultimos_meses(quantidade: int, referencia: datetime | None = None) -> list[tuple[int, int]]:
    agora = referencia or datetime.now()
    ano, mes = agora.year, agora.month
    meses = []
    for _ in range(quantidade):
        meses.append((ano, mes))
        mes -= 1
        if mes == 0:
            ano, mes = ano - 1, 12
    return list(reversed(meses))

def cadastros_por_mes(datas: list[datetime], quantidade: int = 6, referencia: datetime | None = None) -> list[dict]:
    contagem = {}
    for data in datas:
        chave = (data.year, data.month)
        contagem[chave] = contagem.get(chave, 0) + 1
    return [
        {'mes': f'{ano}-{mes:02d}', 'rotulo': MESES[mes - 1], 'total': contagem.get((ano, mes), 0)}
        for ano, mes in ultimos_meses(quantidade, referencia)
    ]

async def registrar_exportacao(tipo: str):
    await contadores_col.update_one(
        {'_id': 'exportacoes'},
        {'$inc': {'total': 1, f'por_tipo.{tipo}': 1}},
        upsert=True,
    )

async def total_exportacoes() -> int:
    doc = await contadores_col.find_one({'_id': 'exportacoes'})
    return (doc or {}).get('total', 0)

async def _datas_cadastro(colecao) -> list[datetime]:
    docs = await colecao.find({}, {'data_criacao': 1}).to_list(length=None)
    return [data_do_documento(d) for d in docs]

async def dashboard_admin(referencia: datetime | None = None) -> dict:
    agora = referencia or datetime.now()
    limite_30_dias = agora - timedelta(days=30)
    datas_clientes = await _datas_cadastro(cliente_col)
    datas_prestadores = await _datas_cadastro(prestador_col)
    return {
        'total_clientes': len(datas_clientes),
        'total_prestadores': len(datas_prestadores),
        'total_avaliacoes_hands': await feedback_hands_col.count_documents({}),
        'total_exportacoes': await total_exportacoes(),
        'novos_clientes_30_dias': sum(1 for d in datas_clientes if d >= limite_30_dias),
        'novos_prestadores_30_dias': sum(1 for d in datas_prestadores if d >= limite_30_dias),
        'clientes_por_mes': cadastros_por_mes(datas_clientes, 6, agora),
        'prestadores_por_mes': cadastros_por_mes(datas_prestadores, 6, agora),
    }

def _filtro_pessoas(q, cidade, estado, servico=None) -> dict:
    condicoes = []
    if q and q.strip():
        condicoes.append({'$or': [
            {'nome': _regex(q)}, {'email': _regex(q)}, {'celular': _regex(q)}, {'servicos': _regex(q)},
        ]})
    if cidade and cidade.strip():
        condicoes.append({'endereco.cidade': _regex(cidade)})
    if estado and estado.strip():
        condicoes.append({'endereco.estado': estado.strip().upper()})
    if servico and servico.strip():
        condicoes.append({'servicos': _regex(servico)})
    return {'$and': condicoes} if condicoes else {}

def _passa_periodo(data: datetime, inicio: datetime | None, fim: datetime | None) -> bool:
    return (inicio is None or data >= inicio) and (fim is None or data < fim)

def _ordenar_pessoas(itens: list[dict], ordenar: str | None) -> list[dict]:
    if ordenar == 'nome':
        return sorted(itens, key=lambda i: (i['nome'] or '').lower())
    if ordenar == 'antigos':
        return sorted(itens, key=lambda i: i['cadastrado_em'])
    if ordenar == 'nota':
        return sorted(itens, key=lambda i: (i.get('nota_media') or 0, i.get('total_avaliacoes') or 0), reverse=True)
    return sorted(itens, key=lambda i: i['cadastrado_em'], reverse=True)

def _paginar(itens: list, pagina: int, limite: int) -> tuple[list, int]:
    total_paginas = max(1, ceil(len(itens) / limite))
    pagina = min(pagina, total_paginas)
    inicio = (pagina - 1) * limite
    return itens[inicio:inicio + limite], pagina

def _item_pessoa(doc: dict, feitas: dict) -> dict:
    endereco = _endereco(doc)
    return {
        '_id': str(doc['_id']),
        'nome': doc.get('nome'),
        'email': doc.get('email'),
        'celular': doc.get('celular'),
        'cep': endereco.get('cep'),
        'cidade': formatar_cidade(doc),
        'cadastrado_em': data_do_documento(doc).isoformat(),
        'avaliacoes_feitas': feitas.get(doc.get('email'), 0),
    }

async def _avaliacoes_feitas(colecao_nome: str) -> dict:
    docs = await db[colecao_nome].aggregate([{'$group': {'_id': '$avaliador', 'total': {'$sum': 1}}}]).to_list(length=None)
    return {d['_id']: d['total'] for d in docs}

async def _carregar_clientes(q, cidade, estado, cadastro_de, cadastro_ate, ordenar) -> list[dict]:
    docs = await cliente_col.find(_filtro_pessoas(q, cidade, estado), {'senha': 0, 'cpf': 0}).to_list(length=None)
    feitas = await _avaliacoes_feitas('feedback_prestador')
    inicio, fim = inicio_do_dia(cadastro_de), fim_do_dia(cadastro_ate)
    itens = [_item_pessoa(d, feitas) for d in docs if _passa_periodo(data_do_documento(d), inicio, fim)]
    return _ordenar_pessoas(itens, ordenar)

async def listar_clientes_admin(q=None, cidade=None, estado=None, cadastro_de=None, cadastro_ate=None, ordenar=None, pagina=1, limite=10) -> dict:
    itens = await _carregar_clientes(q, cidade, estado, cadastro_de, cadastro_ate, ordenar)
    pagina_itens, pagina = _paginar(itens, pagina, limite)
    return {
        'clientes': pagina_itens, 'total': len(itens), 'pagina': pagina, 'limite': limite,
        'total_paginas': max(1, ceil(len(itens) / limite)),
    }

async def _carregar_prestadores(q, servico, cidade, estado, nota_minima, cadastro_de, cadastro_ate, ordenar) -> list[dict]:
    pipeline = [{'$match': _filtro_pessoas(q, cidade, estado, servico)}] + PIPELINE_NOTA
    docs = await prestador_col.aggregate(pipeline).to_list(length=None)
    feitas = await _avaliacoes_feitas('feedback_cliente')
    inicio, fim = inicio_do_dia(cadastro_de), fim_do_dia(cadastro_ate)
    itens = []
    for d in docs:
        if not _passa_periodo(data_do_documento(d), inicio, fim):
            continue
        nota = _nota_arredondada(d.get('nota_media'))
        if nota_minima is not None and (nota is None or nota < nota_minima):
            continue
        item = _item_pessoa(d, feitas)
        item.update({
            'servicos': d.get('servicos') or [],
            'valor': d.get('valor'),
            'nota_media': nota,
            'total_avaliacoes': d.get('total_avaliacoes') or 0,
        })
        itens.append(item)
    return _ordenar_pessoas(itens, ordenar)

async def listar_prestadores_admin(q=None, servico=None, cidade=None, estado=None, nota_minima=None, cadastro_de=None, cadastro_ate=None, ordenar=None, pagina=1, limite=10) -> dict:
    itens = await _carregar_prestadores(q, servico, cidade, estado, nota_minima, cadastro_de, cadastro_ate, ordenar)
    pagina_itens, pagina = _paginar(itens, pagina, limite)
    return {
        'prestadores': pagina_itens, 'total': len(itens), 'pagina': pagina, 'limite': limite,
        'total_paginas': max(1, ceil(len(itens) / limite)),
    }

def _nota_na_faixa(nota: float, alvo: float) -> bool:
    return alvo - 0.25 <= nota < alvo + 0.25

def _criterios(nota) -> dict | None:
    if not isinstance(nota, dict):
        return None
    return {c: nota.get(c) for c in ('facilidade', 'qualidade', 'confiabilidade')}

async def _autores(emails: set) -> dict:
    lista = list(emails)
    clientes = await cliente_col.find({'email': {'$in': lista}}, {'nome': 1, 'email': 1}).to_list(length=None)
    prestadores = await prestador_col.find({'email': {'$in': lista}}, {'nome': 1, 'email': 1}).to_list(length=None)
    autores = {p['email']: {'id': str(p['_id']), 'nome': p.get('nome'), 'papel': 'prestador'} for p in prestadores}
    autores.update({c['email']: {'id': str(c['_id']), 'nome': c.get('nome'), 'papel': 'cliente'} for c in clientes})
    return autores

async def _carregar_avaliacoes_hands(papel, q, nota) -> list[dict]:
    docs = await feedback_hands_col.find({}).sort('_id', -1).to_list(length=None)
    autores = await _autores({d.get('avaliador') for d in docs if d.get('avaliador')})
    itens = []
    for d in docs:
        geral = extrair_nota_geral(d.get('nota'))
        if not isinstance(geral, (int, float)):
            continue
        autor = autores.get(d.get('avaliador'))
        item = {
            '_id': str(d['_id']),
            'autor': autor['nome'] if autor else 'Usuário removido',
            'autor_email': d.get('avaliador'),
            'autor_id': autor['id'] if autor else None,
            'papel': autor['papel'] if autor else None,
            'nota': round(geral, 1),
            'criterios': _criterios(d.get('nota')),
            'mensagem': (d.get('mensagem') or '').strip(),
            'data': data_do_documento(d, 'data_avaliacao').isoformat(),
        }
        if papel and item['papel'] != papel:
            continue
        if nota is not None and not _nota_na_faixa(item['nota'], nota):
            continue
        if q and q.strip():
            termo = q.strip().lower()
            if termo not in (item['autor'] or '').lower() and termo not in item['mensagem'].lower():
                continue
        itens.append(item)
    return itens

def resumo_avaliacoes(itens: list[dict], referencia: datetime | None = None) -> dict:
    agora = referencia or datetime.now()
    semana = (agora - timedelta(days=7)).isoformat()
    total = len(itens)
    return {
        'media': round(sum(i['nota'] for i in itens) / total, 1) if total else None,
        'total': total,
        'novas_semana': sum(1 for i in itens if i['data'] >= semana),
    }

async def listar_avaliacoes_hands_admin(papel=None, q=None, nota=None, pagina=1, limite=10) -> dict:
    base = await _carregar_avaliacoes_hands(papel, None, None)
    itens = await _carregar_avaliacoes_hands(papel, q, nota) if (q or nota is not None) else base
    pagina_itens, pagina = _paginar(itens, pagina, limite)
    return {
        'avaliacoes': pagina_itens, 'total': len(itens), 'pagina': pagina, 'limite': limite,
        'total_paginas': max(1, ceil(len(itens) / limite)),
        'resumo': resumo_avaliacoes(base),
    }

def _celula(valor) -> str:
    if valor is None:
        return ''
    texto = str(valor).replace('\r', ' ').replace('\n', ' ')
    return "'" + texto if texto.startswith(PREFIXOS_PERIGOSOS) else texto

def montar_csv(cabecalho: list[str], linhas: list[list]) -> str:
    saida = io.StringIO()
    escritor = csv.writer(saida, delimiter=';', lineterminator='\r\n')
    escritor.writerow(cabecalho)
    for linha in linhas:
        escritor.writerow([_celula(c) for c in linha])
    return '﻿' + saida.getvalue()

def _data_br(iso: str | None) -> str:
    return datetime.fromisoformat(iso).strftime('%d/%m/%Y') if iso else ''

def _valor_br(valor) -> str:
    return '' if valor is None else f'{valor:.2f}'.replace('.', ',')

def _nota_br(valor) -> str:
    return '' if valor is None else f'{valor:.1f}'.replace('.', ',')

async def exportar_clientes_csv(q=None, cidade=None, estado=None, cadastro_de=None, cadastro_ate=None, ordenar=None) -> str:
    itens = await _carregar_clientes(q, cidade, estado, cadastro_de, cadastro_ate, ordenar)
    await registrar_exportacao('clientes')
    return montar_csv(
        ['Nome', 'E-mail', 'Telefone', 'CEP', 'Cidade', 'Avaliações feitas', 'Cadastro'],
        [[i['nome'], i['email'], i['celular'], i['cep'], i['cidade'], i['avaliacoes_feitas'], _data_br(i['cadastrado_em'])] for i in itens],
    )

async def exportar_prestadores_csv(q=None, servico=None, cidade=None, estado=None, nota_minima=None, cadastro_de=None, cadastro_ate=None, ordenar=None) -> str:
    itens = await _carregar_prestadores(q, servico, cidade, estado, nota_minima, cadastro_de, cadastro_ate, ordenar)
    await registrar_exportacao('prestadores')
    return montar_csv(
        ['Nome', 'E-mail', 'Telefone', 'CEP', 'Cidade', 'Serviços', 'Valor', 'Nota média', 'Avaliações recebidas', 'Cadastro'],
        [[i['nome'], i['email'], i['celular'], i['cep'], i['cidade'], ', '.join(i['servicos']),
          _valor_br(i['valor']), _nota_br(i['nota_media']), i['total_avaliacoes'], _data_br(i['cadastrado_em'])] for i in itens],
    )

async def exportar_avaliacoes_hands_csv(papel=None, q=None, nota=None) -> str:
    itens = await _carregar_avaliacoes_hands(papel, q, nota)
    await registrar_exportacao('avaliacoes_hands')
    def criterio(i, chave):
        return _nota_br(i['criterios'][chave]) if i['criterios'] else ''
    return montar_csv(
        ['Autor', 'E-mail', 'Perfil', 'Nota geral', 'Facilidade', 'Qualidade', 'Confiabilidade', 'Mensagem', 'Data'],
        [[i['autor'], i['autor_email'], (i['papel'] or '').capitalize(), _nota_br(i['nota']),
          criterio(i, 'facilidade'), criterio(i, 'qualidade'), criterio(i, 'confiabilidade'),
          i['mensagem'], _data_br(i['data'])] for i in itens],
    )
