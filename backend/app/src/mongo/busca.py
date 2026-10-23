import re
from datetime import datetime
from math import asin, ceil, cos, radians, sin, sqrt
from bson import ObjectId
from bson.errors import InvalidId
from fastapi import HTTPException, status
from core.database import cliente_col, prestador_col, feedback_cliente_col, feedback_prestador_col, feedback_hands_col, favorito_col
from src.mongo.criacao import pegar_dados_cep
from src.mongo.query import formatar_cidade
from src.mongo.paginacao import paginar

RAIO_TERRA_KM = 6371.0
NOTA_BASE = 4.0
PESO_NOTA_BASE = 3

PIPELINE_NOTA = [
    {'$lookup': {
        'from': 'feedback_prestador',
        'let': {'email_prestador': '$email'},
        'pipeline': [
            {'$match': {'$expr': {'$eq': ['$avaliado', '$$email_prestador']}}},
            {'$group': {'_id': None, 'media': {'$avg': '$nota'}, 'total': {'$sum': 1}}}
        ],
        'as': 'resumo_nota'
    }},
    {'$addFields': {
        'nota_media': {'$arrayElemAt': ['$resumo_nota.media', 0]},
        'total_avaliacoes': {'$ifNull': [{'$arrayElemAt': ['$resumo_nota.total', 0]}, 0]}
    }},
    {'$project': {'resumo_nota': 0, 'senha': 0, 'cpf': 0}}
]

ETAPA_CAMPOS_BUSCA = {'$addFields': {
    'nome_ord': {'$toLower': {'$ifNull': ['$nome', '']}},
    'valor_ord': {'$ifNull': ['$valor', 1e18]},
}}
ETAPA_ARREDONDAR = {'$addFields': {'nota_media': {'$round': ['$nota_media', 1]}}}
ETAPA_PONTUACAO = {'$addFields': {
    'nota_ord': {'$ifNull': ['$nota_media', -1]},
    'pont_ord': {'$cond': [
        {'$gt': ['$total_avaliacoes', 0]},
        {'$divide': [
            {'$add': [{'$multiply': ['$nota_media', '$total_avaliacoes']}, NOTA_BASE * PESO_NOTA_BASE]},
            {'$add': ['$total_avaliacoes', PESO_NOTA_BASE]},
        ]},
        -1,
    ]},
}}

def _ordem_mongo(ordenar: str | None) -> tuple[dict, bool]:
    if ordenar == 'preco':
        return {'valor_ord': 1, 'nome_ord': 1, '_id': 1}, False
    if ordenar in ('nome', 'distancia'):
        return {'nome_ord': 1, '_id': 1}, False
    if ordenar == 'avaliacoes':
        return {'total_avaliacoes': -1, 'nome_ord': 1, '_id': 1}, True
    if ordenar == 'nota':
        return {'nota_ord': -1, 'total_avaliacoes': -1, 'nome_ord': 1, '_id': 1}, True
    return {'pont_ord': -1, 'nome_ord': 1, '_id': 1}, True

async def buscar_pagina_db(colecao, filtro: dict, pipeline_nota: list, ordenar: str | None, nota_minima, pagina: int, limite: int):
    ordem, precisa_nota = _ordem_mongo(ordenar)
    etapas_nota = pipeline_nota + [ETAPA_ARREDONDAR]
    if nota_minima is not None:
        etapas_nota = etapas_nota + [{'$match': {'nota_media': {'$gte': nota_minima}}}]
    base = [{'$match': filtro}, ETAPA_CAMPOS_BUSCA]
    if precisa_nota or nota_minima is not None:
        return await paginar(colecao, base + etapas_nota + [ETAPA_PONTUACAO], ordem, pagina, limite)
    return await paginar(colecao, base, ordem, pagina, limite, etapas_nota)

def _regex(texto: str):
    return {'$regex': re.escape(texto.strip()), '$options': 'i'}

def _so_digitos(texto) -> str:
    return re.sub(r'\D', '', texto or '')

def _endereco(doc: dict) -> dict:
    enderecos = doc.get('endereco') or []
    return enderecos[0] if enderecos else {}

def _data_cadastro(doc: dict) -> str:
    return (doc.get('data_criacao') or doc['_id'].generation_time).isoformat()

def distancia_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    d_lat = radians(lat2 - lat1)
    d_lon = radians(lon2 - lon1)
    a = sin(d_lat / 2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(d_lon / 2) ** 2
    return 2 * RAIO_TERRA_KM * asin(sqrt(a))

def _nota_arredondada(valor):
    return round(valor, 1) if isinstance(valor, (int, float)) else None

def montar_item(doc: dict, favoritos: set, referencia: dict | None = None) -> dict:
    endereco = _endereco(doc)
    distancia = None
    if (
        referencia and referencia['lat'] is not None
        and endereco.get('latitude') is not None and endereco.get('longitude') is not None
    ):
        distancia = round(distancia_km(referencia['lat'], referencia['lon'], endereco['latitude'], endereco['longitude']), 1)
    return {
        '_id': str(doc['_id']),
        'nome': doc.get('nome'),
        'email': doc.get('email'),
        'celular': doc.get('celular'),
        'servicos': doc.get('servicos') or [],
        'valor': doc.get('valor'),
        'idiomas': doc.get('idiomas') or [],
        'cidade': formatar_cidade(doc),
        'nota_media': _nota_arredondada(doc.get('nota_media')),
        'total_avaliacoes': doc.get('total_avaliacoes') or 0,
        'distancia_km': distancia,
        'favorito': doc.get('email') in favoritos
    }

def _pontuacao(item: dict) -> float:
    total = item['total_avaliacoes']
    return ((item['nota_media'] or 0) * total + NOTA_BASE * PESO_NOTA_BASE) / (total + PESO_NOTA_BASE)

def _chave_ordenacao(ordenar: str):
    if ordenar == 'distancia':
        return lambda i: (i['distancia_km'] is None, i['distancia_km'] or 0, (i['nome'] or '').lower())
    if ordenar == 'preco':
        return lambda i: (i['valor'] is None, i['valor'] or 0, (i['nome'] or '').lower())
    if ordenar == 'nome':
        return lambda i: (i['nome'] or '').lower()
    if ordenar == 'avaliacoes':
        return lambda i: (-i['total_avaliacoes'], (i['nome'] or '').lower())
    if ordenar == 'nota':
        return lambda i: (i['nota_media'] is None, -(i['nota_media'] or 0), -i['total_avaliacoes'], (i['nome'] or '').lower())
    return lambda i: (i['nota_media'] is None, -_pontuacao(i), (i['nome'] or '').lower())

async def emails_favoritos(email_cliente: str | None) -> set:
    if not email_cliente:
        return set()
    docs = await favorito_col.find({'cliente': email_cliente}, {'prestador': 1}).to_list(length=None)
    return {d['prestador'] for d in docs}

async def _referencia_cep(cep: str) -> dict:
    digitos = _so_digitos(cep)
    dados = await pegar_dados_cep(digitos)
    if 'erro' in dados:
        if 'exatamente' in dados['erro'] or 'não encontrado' in dados['erro']:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=dados['erro'])
        return {'cep': digitos, 'lat': None, 'lon': None, 'cidade': None, 'estado': None}
    return {'cep': digitos, 'lat': dados.get('lat'), 'lon': dados.get('lon'), 'cidade': dados.get('cidade'), 'estado': dados.get('estado')}

def _na_regiao(doc: dict, item: dict, referencia: dict, raio_km: float | None) -> bool:
    if referencia['lat'] is not None:
        if raio_km is None:
            return True
        return item['distancia_km'] is not None and item['distancia_km'] <= raio_km
    endereco = _endereco(doc)
    if referencia['cidade']:
        return (
            (endereco.get('cidade') or '').lower() == referencia['cidade'].lower()
            and (endereco.get('estado') or '').lower() == (referencia['estado'] or '').lower()
        )
    return _so_digitos(endereco.get('cep'))[:5] == referencia['cep'][:5]

async def buscar_prestadores(
    email_cliente: str | None, q=None, nome=None, email=None, servico=None, cidade=None, estado=None,
    idioma=None, cep=None, raio_km=None, nota_minima=None, valor_min=None, valor_max=None,
    somente_favoritos=False, ordenar=None, pagina=1, limite=12,
):
    filtro = {}
    condicoes = []
    if q and q.strip():
        condicoes.append({'$or': [
            {'nome': _regex(q)}, {'email': _regex(q)}, {'servicos': _regex(q)}, {'informacoes': _regex(q)}
        ]})
    if nome and nome.strip():
        filtro['nome'] = _regex(nome)
    if email and email.strip():
        filtro['email'] = _regex(email)
    if servico and servico.strip():
        filtro['servicos'] = _regex(servico)
    if idioma and idioma.strip():
        filtro['idiomas'] = _regex(idioma)
    if cidade and cidade.strip():
        filtro['endereco.cidade'] = _regex(cidade)
    if estado and estado.strip():
        filtro['endereco.estado'] = estado.strip().upper()
    faixa_valor = {}
    if valor_min is not None:
        faixa_valor['$gte'] = valor_min
    if valor_max is not None:
        faixa_valor['$lte'] = valor_max
    if faixa_valor:
        filtro['valor'] = faixa_valor

    favoritos = await emails_favoritos(email_cliente)
    if somente_favoritos:
        condicoes.append({'email': {'$in': list(favoritos)}})
    if condicoes:
        filtro['$and'] = condicoes

    referencia = await _referencia_cep(cep) if cep and cep.strip() else None
    if referencia is None:
        docs, total, pagina, total_paginas = await buscar_pagina_db(
            prestador_col, filtro, PIPELINE_NOTA, ordenar, nota_minima, pagina, limite,
        )
        return {
            'prestadores': [montar_item(doc, favoritos) for doc in docs],
            'total': total, 'pagina': pagina, 'limite': limite, 'total_paginas': total_paginas,
            'referencia_cep': None,
        }

    pipeline = [{'$match': filtro}] + PIPELINE_NOTA
    if nota_minima is not None:
        pipeline.append({'$match': {'nota_media': {'$gte': nota_minima}}})
    docs = await prestador_col.aggregate(pipeline).to_list(length=None)

    itens = []
    for doc in docs:
        item = montar_item(doc, favoritos, referencia)
        if referencia is None or _na_regiao(doc, item, referencia, raio_km):
            itens.append(item)

    por_distancia = referencia is not None and referencia['lat'] is not None
    itens.sort(key=_chave_ordenacao(ordenar or ('distancia' if por_distancia else 'relevancia')))

    total = len(itens)
    inicio = (pagina - 1) * limite
    return {
        'prestadores': itens[inicio:inicio + limite],
        'total': total,
        'pagina': pagina,
        'limite': limite,
        'total_paginas': max(1, ceil(total / limite)),
        'referencia_cep': {'cidade': referencia['cidade'], 'estado': referencia['estado']} if referencia else None
    }

async def detalhe_prestador(id_prestador: str, email_cliente: str | None):
    nao_encontrado = HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Prestador não encontrado.")
    try:
        oid = ObjectId(id_prestador)
    except InvalidId:
        raise nao_encontrado
    docs = await prestador_col.aggregate([{'$match': {'_id': oid}}] + PIPELINE_NOTA).to_list(length=1)
    if not docs:
        raise nao_encontrado
    doc = docs[0]
    favoritos = await emails_favoritos(email_cliente)

    recebidas = await feedback_prestador_col.find({'avaliado': doc['email']}).sort('_id', -1).limit(50).to_list(length=50)
    emails_autores = list({a['avaliador'] for a in recebidas if a.get('avaliador')})
    autores = await cliente_col.find({'email': {'$in': emails_autores}}, {'nome': 1, 'email': 1}).to_list(length=None)
    nomes = {a['email']: a.get('nome') for a in autores}
    avaliacoes = [
        {
            '_id': str(a['_id']),
            'autor': nomes.get(a.get('avaliador')) or 'Cliente Hands',
            'nota': a.get('nota'),
            'mensagem': (a.get('mensagem') or '').strip(),
            'minha': a.get('avaliador') == email_cliente
        }
        for a in recebidas if isinstance(a.get('nota'), (int, float))
    ]
    minha = await feedback_prestador_col.find_one({'avaliador': email_cliente, 'avaliado': doc['email']}) if email_cliente else None

    detalhe = montar_item(doc, favoritos)
    detalhe.update({
        'informacoes': doc.get('informacoes') or '',
        'certificados': doc.get('certificados') or [],
        'cadastrado_em': _data_cadastro(doc),
        'avaliacoes': avaliacoes,
        'minha_avaliacao': {'nota': minha.get('nota'), 'mensagem': minha.get('mensagem') or ''} if minha else None
    })
    return detalhe

async def listar_favoritos(email_cliente: str):
    docs = await favorito_col.find({'cliente': email_cliente}).sort('data', -1).to_list(length=None)
    emails = [d['prestador'] for d in docs]
    if not emails:
        return []
    prestadores = await prestador_col.aggregate([{'$match': {'email': {'$in': emails}}}] + PIPELINE_NOTA).to_list(length=None)
    por_email = {p['email']: p for p in prestadores}
    favoritos = set(emails)
    return [montar_item(por_email[e], favoritos) for e in emails if e in por_email]

async def favoritar(email_cliente: str, email_prestador: str):
    email_prestador = email_prestador.strip()
    existe = await prestador_col.find_one({'email': email_prestador}, {'_id': 1})
    if existe is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Prestador não encontrado.")
    await favorito_col.update_one(
        {'cliente': email_cliente, 'prestador': email_prestador},
        {'$setOnInsert': {'data': datetime.now()}},
        upsert=True
    )

async def desfavoritar(email_cliente: str, email_prestador: str):
    await favorito_col.delete_one({'cliente': email_cliente, 'prestador': email_prestador.strip()})

def _mascarar_cpf(cpf) -> str | None:
    digitos = _so_digitos(cpf)
    return f'***.***.***-{digitos[-2:]}' if len(digitos) == 11 else None

async def perfil_cliente(id_cliente: str):
    nao_encontrado = HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cliente não encontrado.")
    try:
        doc = await cliente_col.find_one({'_id': ObjectId(id_cliente)}, {'senha': 0})
    except InvalidId:
        raise nao_encontrado
    if doc is None:
        raise nao_encontrado
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
        'cpf_mascarado': _mascarar_cpf(doc.get('cpf')),
        'cadastrado_em': _data_cadastro(doc),
        'total_avaliacoes_feitas': await feedback_prestador_col.count_documents({'avaliador': doc['email']}),
        'total_favoritos': await favorito_col.count_documents({'cliente': doc['email']})
    }

async def minha_avaliacao_hands(email: str):
    doc = await feedback_hands_col.find_one({'avaliador': email})
    if doc is None:
        return None
    nota = doc.get('nota')
    criterios = nota if isinstance(nota, dict) else {'notaGeral': nota}
    return {
        'facilidade': criterios.get('facilidade'),
        'qualidade': criterios.get('qualidade'),
        'confiabilidade': criterios.get('confiabilidade'),
        'notaGeral': criterios.get('notaGeral'),
        'mensagem': doc.get('mensagem') or '',
        'data_avaliacao': doc['data_avaliacao'].isoformat() if doc.get('data_avaliacao') else None
    }
