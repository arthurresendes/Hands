import csv
import io
from datetime import datetime, timedelta
from math import ceil
from core.database import (
    db, cliente_col, prestador_col, feedback_hands_col, feedback_prestador_col, contadores_col,
)
from src.mongo.busca import PIPELINE_NOTA, _regex, _endereco, _nota_arredondada
from src.mongo.query import formatar_cidade, extrair_nota_geral
from src.mongo.paginacao import paginar, listar_todos, calcular_pagina, filtro_cadastro, campo_data

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

def _contagem_por_mes(contagem: dict, quantidade: int = 6, referencia: datetime | None = None) -> list[dict]:
    return [
        {'mes': f'{ano}-{mes:02d}', 'rotulo': MESES[mes - 1], 'total': contagem.get((ano, mes), 0)}
        for ano, mes in ultimos_meses(quantidade, referencia)
    ]

async def _cadastros_por_mes_db(colecao, quantidade: int, referencia: datetime) -> list[dict]:
    ano, mes = ultimos_meses(quantidade, referencia)[0]
    inicio = datetime(ano, mes, 1)
    etapas = [
        {'$match': filtro_cadastro(inicio, None)},
        {'$group': {'_id': {'ano': {'$year': campo_data()}, 'mes': {'$month': campo_data()}}, 'total': {'$sum': 1}}},
    ]
    docs = await colecao.aggregate(etapas).to_list(length=None)
    return _contagem_por_mes({(d['_id']['ano'], d['_id']['mes']): d['total'] for d in docs}, quantidade, referencia)

async def dashboard_admin(referencia: datetime | None = None) -> dict:
    agora = referencia or datetime.now()
    limite_30_dias = agora - timedelta(days=30)
    recentes = filtro_cadastro(limite_30_dias, None)
    return {
        'total_clientes': await cliente_col.count_documents({}),
        'total_prestadores': await prestador_col.count_documents({}),
        'total_avaliacoes_hands': await feedback_hands_col.count_documents({}),
        'total_exportacoes': await total_exportacoes(),
        'novos_clientes_30_dias': await cliente_col.count_documents(recentes),
        'novos_prestadores_30_dias': await prestador_col.count_documents(recentes),
        'clientes_por_mes': await _cadastros_por_mes_db(cliente_col, 6, agora),
        'prestadores_por_mes': await _cadastros_por_mes_db(prestador_col, 6, agora),
    }

def _filtro_pessoas(q, cidade, estado, servico=None, cadastro_de=None, cadastro_ate=None) -> dict:
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
    periodo = filtro_cadastro(inicio_do_dia(cadastro_de), fim_do_dia(cadastro_ate))
    if periodo:
        condicoes.append(periodo)
    return {'$and': condicoes} if condicoes else {}

def _ordem_pessoas(ordenar: str | None) -> dict:
    if ordenar == 'nome':
        return {'nome_ord': 1, '_id': 1}
    if ordenar == 'antigos':
        return {'_id': 1}
    if ordenar == 'nota':
        return {'nota_media': -1, 'total_avaliacoes': -1, '_id': -1}
    return {'_id': -1}

ETAPA_NOME_ORDENACAO = {'$addFields': {'nome_ord': {'$toLower': {'$ifNull': ['$nome', '']}}}}
ETAPA_ARREDONDAR_NOTA = {'$addFields': {'nota_media': {'$round': ['$nota_media', 1]}}}

def _paginado(total: int, pagina: int, limite: int, itens: list, chave: str) -> dict:
    pagina, total_paginas = calcular_pagina(total, pagina, limite)
    return {chave: itens, 'total': total, 'pagina': pagina, 'limite': limite, 'total_paginas': total_paginas}

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

async def _avaliacoes_feitas(colecao_nome: str, emails: list) -> dict:
    if not emails:
        return {}
    etapas = [{'$match': {'avaliador': {'$in': emails}}}, {'$group': {'_id': '$avaliador', 'total': {'$sum': 1}}}]
    docs = await db[colecao_nome].aggregate(etapas).to_list(length=None)
    return {d['_id']: d['total'] for d in docs}

def _etapas_clientes(q, cidade, estado, cadastro_de, cadastro_ate, ordenar) -> tuple[list, list]:
    base = [{'$match': _filtro_pessoas(q, cidade, estado, None, cadastro_de, cadastro_ate)}]
    if ordenar == 'nome':
        base.append(ETAPA_NOME_ORDENACAO)
    return base, [{'$project': {'senha': 0, 'cpf': 0}}]

async def _itens_clientes(docs: list) -> list[dict]:
    feitas = await _avaliacoes_feitas('feedback_prestador', [d['email'] for d in docs if d.get('email')])
    return [_item_pessoa(d, feitas) for d in docs]

async def _carregar_clientes(q, cidade, estado, cadastro_de, cadastro_ate, ordenar) -> list[dict]:
    base, apos = _etapas_clientes(q, cidade, estado, cadastro_de, cadastro_ate, ordenar)
    return await _itens_clientes(await listar_todos(cliente_col, base, _ordem_pessoas(ordenar), apos))

async def listar_clientes_admin(q=None, cidade=None, estado=None, cadastro_de=None, cadastro_ate=None, ordenar=None, pagina=1, limite=10) -> dict:
    base, apos = _etapas_clientes(q, cidade, estado, cadastro_de, cadastro_ate, ordenar)
    docs, total, pagina, _ = await paginar(cliente_col, base, _ordem_pessoas(ordenar), pagina, limite, apos)
    return _paginado(total, pagina, limite, await _itens_clientes(docs), 'clientes')

def _etapas_prestadores(q, servico, cidade, estado, nota_minima, cadastro_de, cadastro_ate, ordenar) -> tuple[list, list]:
    base = [{'$match': _filtro_pessoas(q, cidade, estado, servico, cadastro_de, cadastro_ate)}]
    if ordenar == 'nome':
        base.append(ETAPA_NOME_ORDENACAO)
    etapas_nota = PIPELINE_NOTA + [ETAPA_ARREDONDAR_NOTA]
    if nota_minima is not None:
        etapas_nota = etapas_nota + [{'$match': {'nota_media': {'$gte': nota_minima}}}]
    if ordenar == 'nota' or nota_minima is not None:
        return base + etapas_nota, []
    return base, etapas_nota

async def _itens_prestadores(docs: list) -> list[dict]:
    feitas = await _avaliacoes_feitas('feedback_cliente', [d['email'] for d in docs if d.get('email')])
    itens = []
    for d in docs:
        item = _item_pessoa(d, feitas)
        item.update({
            'servicos': d.get('servicos') or [],
            'valor': d.get('valor'),
            'nota_media': _nota_arredondada(d.get('nota_media')),
            'total_avaliacoes': d.get('total_avaliacoes') or 0,
        })
        itens.append(item)
    return itens

async def _carregar_prestadores(q, servico, cidade, estado, nota_minima, cadastro_de, cadastro_ate, ordenar) -> list[dict]:
    base, apos = _etapas_prestadores(q, servico, cidade, estado, nota_minima, cadastro_de, cadastro_ate, ordenar)
    return await _itens_prestadores(await listar_todos(prestador_col, base, _ordem_pessoas(ordenar), apos))

async def listar_prestadores_admin(q=None, servico=None, cidade=None, estado=None, nota_minima=None, cadastro_de=None, cadastro_ate=None, ordenar=None, pagina=1, limite=10) -> dict:
    base, apos = _etapas_prestadores(q, servico, cidade, estado, nota_minima, cadastro_de, cadastro_ate, ordenar)
    docs, total, pagina, _ = await paginar(prestador_col, base, _ordem_pessoas(ordenar), pagina, limite, apos)
    return _paginado(total, pagina, limite, await _itens_prestadores(docs), 'prestadores')

def _nota_na_faixa(nota: float, alvo: float) -> bool:
    return alvo - 0.25 <= nota < alvo + 0.25

def _criterios(nota) -> dict | None:
    if not isinstance(nota, dict):
        return None
    return {c: nota.get(c) for c in ('facilidade', 'qualidade', 'confiabilidade')}

def _etapas_nota_geral() -> list:
    return [
        {'$addFields': {'nota_geral': {'$cond': [{'$isNumber': '$nota'}, '$nota', '$nota.notaGeral']}}},
        {'$match': {'nota_geral': {'$type': 'number'}}},
        {'$addFields': {'nota_geral': {'$round': ['$nota_geral', 1]}, 'data_ord': campo_data('data_avaliacao')}},
    ]

def _etapas_autor_hands() -> list:
    return [
        {'$lookup': {'from': 'cliente', 'localField': 'avaliador', 'foreignField': 'email', 'as': 'autor_cliente'}},
        {'$lookup': {'from': 'prestador', 'localField': 'avaliador', 'foreignField': 'email', 'as': 'autor_prestador'}},
        {'$addFields': {
            'autor_nome': {'$ifNull': [{'$arrayElemAt': ['$autor_cliente.nome', 0]}, {'$arrayElemAt': ['$autor_prestador.nome', 0]}]},
            'autor_id': {'$ifNull': [{'$arrayElemAt': ['$autor_cliente._id', 0]}, {'$arrayElemAt': ['$autor_prestador._id', 0]}]},
            'autor_papel': {'$cond': [
                {'$gt': [{'$size': '$autor_cliente'}, 0]}, 'cliente',
                {'$cond': [{'$gt': [{'$size': '$autor_prestador'}, 0]}, 'prestador', None]},
            ]},
        }},
        {'$project': {'autor_cliente': 0, 'autor_prestador': 0}},
    ]

def _etapas_hands(papel, q, nota) -> tuple[list, list]:
    base = _etapas_nota_geral()
    if nota is not None:
        base.append({'$match': {'nota_geral': {'$gte': nota - 0.25, '$lt': nota + 0.25}}})
    autor = _etapas_autor_hands()
    filtra_autor = bool(papel) or bool(q and q.strip())
    if filtra_autor:
        base += autor
        condicoes = []
        if papel:
            condicoes.append({'autor_papel': papel})
        if q and q.strip():
            condicoes.append({'$or': [{'autor_nome': _regex(q)}, {'avaliador': _regex(q)}, {'mensagem': _regex(q)}]})
        base.append({'$match': {'$and': condicoes}})
    return base, ([] if filtra_autor else autor)

def _item_hands(d: dict) -> dict:
    nota = d.get('nota')
    return {
        '_id': str(d['_id']),
        'autor': d.get('autor_nome') or 'Usuário removido',
        'autor_email': d.get('avaliador'),
        'autor_id': str(d['autor_id']) if d.get('autor_id') else None,
        'papel': d.get('autor_papel'),
        'nota': d['nota_geral'],
        'criterios': _criterios(nota),
        'mensagem': (d.get('mensagem') or '').strip(),
        'data': data_do_documento(d, 'data_avaliacao').isoformat(),
    }

async def _carregar_avaliacoes_hands(papel, q, nota) -> list[dict]:
    base, apos = _etapas_hands(papel, q, nota)
    return [_item_hands(d) for d in await listar_todos(feedback_hands_col, base, {'_id': -1}, apos)]

async def resumo_hands_admin(papel=None, referencia: datetime | None = None) -> dict:
    agora = referencia or datetime.now()
    base, _ = _etapas_hands(papel, None, None)
    etapas = base + [{'$group': {
        '_id': None,
        'media': {'$avg': '$nota_geral'},
        'total': {'$sum': 1},
        'novas': {'$sum': {'$cond': [{'$gte': ['$data_ord', agora - timedelta(days=7)]}, 1, 0]}},
    }}]
    docs = await feedback_hands_col.aggregate(etapas).to_list(length=1)
    if not docs:
        return {'media': None, 'total': 0, 'novas_semana': 0}
    return {'media': round(docs[0]['media'], 1), 'total': docs[0]['total'], 'novas_semana': docs[0]['novas']}

async def listar_avaliacoes_hands_admin(papel=None, q=None, nota=None, pagina=1, limite=10) -> dict:
    base, apos = _etapas_hands(papel, q, nota)
    docs, total, pagina, _ = await paginar(feedback_hands_col, base, {'_id': -1}, pagina, limite, apos)
    resposta = _paginado(total, pagina, limite, [_item_hands(d) for d in docs], 'avaliacoes')
    resposta['resumo'] = await resumo_hands_admin(papel)
    return resposta

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
