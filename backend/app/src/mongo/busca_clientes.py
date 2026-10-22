import copy
from datetime import datetime
from math import ceil
from bson import ObjectId
from bson.errors import InvalidId
from fastapi import HTTPException, status
from core.database import cliente_col, prestador_col, feedback_cliente_col, feedback_prestador_col, favorito_col
from src.mongo.query import formatar_cidade
from src.mongo.busca import (
    PIPELINE_NOTA, _regex, _so_digitos, _endereco, _data_cadastro, _nota_arredondada,
    _chave_ordenacao, _referencia_cep, _na_regiao, _mascarar_cpf, distancia_km,
)

def pipeline_nota_clientes():
    pipeline = copy.deepcopy(PIPELINE_NOTA)
    pipeline[0]['$lookup']['from'] = 'feedback_cliente'
    return pipeline

def _data_avaliacao(doc: dict) -> str:
    return (doc.get('data_avaliacao') or doc['_id'].generation_time).isoformat()

def _distancia(doc: dict, referencia: dict | None):
    endereco = _endereco(doc)
    if (
        referencia and referencia['lat'] is not None
        and endereco.get('latitude') is not None and endereco.get('longitude') is not None
    ):
        return round(distancia_km(referencia['lat'], referencia['lon'], endereco['latitude'], endereco['longitude']), 1)
    return None

def montar_item_cliente(doc: dict, avaliados: set, referencia: dict | None = None) -> dict:
    return {
        '_id': str(doc['_id']),
        'nome': doc.get('nome'),
        'email': doc.get('email'),
        'cidade': formatar_cidade(doc),
        'nota_media': _nota_arredondada(doc.get('nota_media')),
        'total_avaliacoes': doc.get('total_avaliacoes') or 0,
        'distancia_km': _distancia(doc, referencia),
        'avaliado_por_mim': doc.get('email') in avaliados
    }

async def emails_avaliados_por(email_prestador: str | None) -> set:
    if not email_prestador:
        return set()
    docs = await feedback_cliente_col.find({'avaliador': email_prestador}, {'avaliado': 1}).to_list(length=None)
    return {d['avaliado'] for d in docs}

async def buscar_clientes(
    email_prestador: str | None, q=None, nome=None, email=None, cidade=None, estado=None, cep=None,
    raio_km=None, nota_minima=None, somente_avaliados=False, ordenar=None, pagina=1, limite=12,
):
    filtro = {}
    condicoes = []
    if q and q.strip():
        condicoes.append({'$or': [
            {'nome': _regex(q)}, {'email': _regex(q)}, {'endereco.cidade': _regex(q)}
        ]})
    if nome and nome.strip():
        filtro['nome'] = _regex(nome)
    if email and email.strip():
        filtro['email'] = _regex(email)
    if cidade and cidade.strip():
        filtro['endereco.cidade'] = _regex(cidade)
    if estado and estado.strip():
        filtro['endereco.estado'] = estado.strip().upper()

    avaliados = await emails_avaliados_por(email_prestador)
    if somente_avaliados:
        condicoes.append({'email': {'$in': list(avaliados)}})
    if condicoes:
        filtro['$and'] = condicoes

    pipeline = [{'$match': filtro}] + pipeline_nota_clientes()
    if nota_minima is not None:
        pipeline.append({'$match': {'nota_media': {'$gte': nota_minima}}})
    docs = await cliente_col.aggregate(pipeline).to_list(length=None)

    referencia = await _referencia_cep(cep) if cep and cep.strip() else None
    itens = []
    for doc in docs:
        item = montar_item_cliente(doc, avaliados, referencia)
        if referencia is None or _na_regiao(doc, item, referencia, raio_km):
            itens.append(item)

    por_distancia = referencia is not None and referencia['lat'] is not None
    itens.sort(key=_chave_ordenacao(ordenar or ('distancia' if por_distancia else 'nome')))

    total = len(itens)
    inicio = (pagina - 1) * limite
    return {
        'clientes': itens[inicio:inicio + limite],
        'total': total,
        'pagina': pagina,
        'limite': limite,
        'total_paginas': max(1, ceil(total / limite)),
        'referencia_cep': {'cidade': referencia['cidade'], 'estado': referencia['estado']} if referencia else None
    }

async def detalhe_cliente(id_cliente: str, email_prestador: str | None):
    nao_encontrado = HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cliente não encontrado.")
    try:
        oid = ObjectId(id_cliente)
    except InvalidId:
        raise nao_encontrado
    docs = await cliente_col.aggregate([{'$match': {'_id': oid}}] + pipeline_nota_clientes()).to_list(length=1)
    if not docs:
        raise nao_encontrado
    doc = docs[0]
    avaliados = await emails_avaliados_por(email_prestador)

    recebidas = await feedback_cliente_col.find({'avaliado': doc['email']}).sort('_id', -1).limit(50).to_list(length=50)
    emails_autores = list({a['avaliador'] for a in recebidas if a.get('avaliador')})
    autores = await prestador_col.find({'email': {'$in': emails_autores}}, {'nome': 1, 'email': 1}).to_list(length=None)
    por_email = {a['email']: a for a in autores}
    avaliacoes = [
        {
            '_id': str(a['_id']),
            'autor': por_email.get(a.get('avaliador'), {}).get('nome') or 'Profissional Hands',
            'autor_id': str(por_email[a['avaliador']]['_id']) if a.get('avaliador') in por_email else None,
            'nota': a.get('nota'),
            'mensagem': (a.get('mensagem') or '').strip(),
            'data': _data_avaliacao(a),
            'minha': a.get('avaliador') == email_prestador
        }
        for a in recebidas if isinstance(a.get('nota'), (int, float))
    ]
    minha = next((a for a in recebidas if a.get('avaliador') == email_prestador), None) if email_prestador else None
    if minha is None and email_prestador:
        minha = await feedback_cliente_col.find_one({'avaliador': email_prestador, 'avaliado': doc['email']})

    detalhe = montar_item_cliente(doc, avaliados)
    detalhe.update({
        'celular': doc.get('celular'),
        'informacoes': doc.get('informacoes') or '',
        'cadastrado_em': _data_cadastro(doc),
        'avaliacoes': avaliacoes,
        'minha_avaliacao': {
            'nota': minha.get('nota'),
            'mensagem': minha.get('mensagem') or '',
            'data': _data_avaliacao(minha)
        } if minha else None
    })
    return detalhe

async def perfil_prestador(id_prestador: str):
    nao_encontrado = HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Prestador não encontrado.")
    try:
        oid = ObjectId(id_prestador)
    except InvalidId:
        raise nao_encontrado
    docs = await prestador_col.aggregate([{'$match': {'_id': oid}}] + PIPELINE_NOTA).to_list(length=1)
    if not docs:
        raise nao_encontrado
    doc = docs[0]
    endereco = _endereco(doc)
    return {
        'id': str(doc['_id']),
        'nome': doc.get('nome'),
        'email': doc.get('email'),
        'celular': doc.get('celular'),
        'idade': doc.get('idade'),
        'cep': endereco.get('cep'),
        'cidade': formatar_cidade(doc),
        'informacoes': doc.get('informacoes') or '',
        'valor': doc.get('valor'),
        'servicos': doc.get('servicos') or [],
        'idiomas': doc.get('idiomas') or [],
        'certificados': doc.get('certificados') or [],
        'cpf_mascarado': _mascarar_cpf(doc.get('cpf')),
        'cadastrado_em': _data_cadastro(doc),
        'nota_media': _nota_arredondada(doc.get('nota_media')),
        'total_avaliacoes': doc.get('total_avaliacoes') or 0,
        'total_favoritos': await favorito_col.count_documents({'prestador': doc['email']}),
        'total_avaliacoes_feitas': await feedback_cliente_col.count_documents({'avaliador': doc['email']})
    }

async def avaliacoes_recebidas_prestador(email_prestador: str, pagina: int = 1, limite: int = 10):
    por_estrela = await feedback_prestador_col.aggregate([
        {'$match': {'avaliado': email_prestador, 'nota': {'$type': 'number'}}},
        {'$group': {'_id': {'$floor': {'$add': ['$nota', 0.5]}}, 'total': {'$sum': 1}, 'soma': {'$sum': '$nota'}}}
    ]).to_list(length=None)
    contagem = {estrelas: 0 for estrelas in range(1, 6)}
    soma = 0.0
    for item in por_estrela:
        contagem[min(5, max(1, int(item['_id'])))] += item['total']
        soma += item['soma']
    total = sum(contagem.values())
    resumo = {
        'media': round(soma / total, 1) if total else None,
        'total': total,
        'distribuicao': [
            {'estrelas': e, 'total': contagem[e], 'percentual': round(contagem[e] / total * 100) if total else 0}
            for e in range(5, 0, -1)
        ]
    }

    filtro = {'avaliado': email_prestador, 'nota': {'$type': 'number'}}
    docs = await feedback_prestador_col.find(filtro).sort('_id', -1).skip((pagina - 1) * limite).limit(limite).to_list(length=limite)
    emails = list({d['avaliador'] for d in docs if d.get('avaliador')})
    autores = await cliente_col.find({'email': {'$in': emails}}, {'nome': 1, 'email': 1, 'endereco.cidade': 1, 'endereco.estado': 1}).to_list(length=None)
    por_email = {a['email']: a for a in autores}
    avaliacoes = []
    for d in docs:
        autor = por_email.get(d.get('avaliador'), {})
        avaliacoes.append({
            '_id': str(d['_id']),
            'autor': autor.get('nome') or 'Cliente Hands',
            'autor_id': str(autor['_id']) if autor else None,
            'cidade': formatar_cidade(autor) if autor else None,
            'nota': d['nota'],
            'mensagem': (d.get('mensagem') or '').strip(),
            'data': _data_avaliacao(d)
        })
    return {
        'resumo': resumo,
        'avaliacoes': avaliacoes,
        'pagina': pagina,
        'limite': limite,
        'total_paginas': max(1, ceil(total / limite))
    }
