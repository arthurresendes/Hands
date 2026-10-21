from core.database import cliente_col,prestador_col,db,feedback_hands_col,feedback_cliente_col,feedback_prestador_col
#from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from bson.errors import InvalidId
from fastapi import HTTPException, status
from core.security import gerar_senha_hash
from src.mongo.criacao import validar_cpf,pegar_dados_cep
from datetime import datetime, timedelta, timezone

protecao_dados_sensiveis = {
        'senha': 0,
        'endereco.cep': 0,
        'cpf': 0
}

async def listagem_clientes():
    docs =  await cliente_col.find({}, protecao_dados_sensiveis).to_list(length=None)
    for d in docs:
        d['_id'] = str(d['_id'])
    return docs

async def listagem_prestadores():
    docs = await prestador_col.find({}, protecao_dados_sensiveis).to_list(length=None)
    for d in docs:
            d['_id'] = str(d['_id'])
    return docs

async def listagem_avaliacoes_hands():
    docs = await feedback_hands_col.find({}, protecao_dados_sensiveis).to_list(length=None)
    for d in docs:
            d['_id'] = str(d['_id'])
    return docs

async def listagem_avaliacoes_clientes():
    docs = await feedback_cliente_col.find({}, protecao_dados_sensiveis).to_list(length=None)
    for d in docs:
            d['_id'] = str(d['_id'])
    return docs

async def listagem_avaliacoes_prestadores():
    docs = await feedback_prestador_col.find({}, protecao_dados_sensiveis).to_list(length=None)
    for d in docs:
            d['_id'] = str(d['_id'])
    return docs

async def busca_especifica_cliente(id: str):
    try:
        res = await cliente_col.find_one({"_id": ObjectId(id)}, protecao_dados_sensiveis)
        if res:
            res['_id'] = str(res['_id'])
        return res
    except InvalidId:
        return None

async def busca_especifica_prestador(id: str):
    try:
        res = await prestador_col.find_one({"_id": ObjectId(id)}, protecao_dados_sensiveis)
        if res:
            res['_id'] = str(res['_id'])
        return res
    except InvalidId:
        return None

async def atualizar(collection_name: str,id: str, campo: str, valor):
    try:
        collection = db[collection_name]
        filtro = {"_id": ObjectId(id)}
        alteracao = {"$set": {campo: valor}}
        res = await collection.update_one(filtro,alteracao)
        return res.modified_count > 0
    except InvalidId:
        return False

async def atualizar_senha(collection_name: str,id: str, senha: str):
    try:
        collection = db[collection_name]
        filtro = {"_id": ObjectId(id)}
        alteracao = {"$set": {"senha": gerar_senha_hash(senha)}}
        res = await collection.update_one(filtro,alteracao)
        return res.modified_count > 0
    except InvalidId:
        return False

async def atualizar_cpf(collection_name: str,id: str, cpf: str):
    try:
        collection = db[collection_name]
        cpf_valido = await validar_cpf(cpf)
        if cpf_valido != True:
            return {'Erro': 'CPF não validado, insira novamente.'}
        filtro = {"_id": ObjectId(id)}
        alteracao = {"$set": {"cpf": cpf}}
        res = await collection.update_one(filtro,alteracao)
        return res.modified_count > 0
    except InvalidId:
        return False

async def atualizar_cep(collection_name: str,id: str, cep: str):
    try:
        collection = db[collection_name]
        resultado_cep  = await pegar_dados_cep(cep)
        if "erro" in resultado_cep:
            return {"Erro": resultado_cep["erro"]}
        filtro = {"_id": ObjectId(id)}
        alteracao = {"$set": {"endereco": [{'cep': cep, 'rua': resultado_cep ['rua'], 'cidade': resultado_cep ['cidade'], 'estado': resultado_cep['estado'], 'latitude': resultado_cep['lat'], 'longitude': resultado_cep['lon']}]}}
        res = await collection.update_one(filtro,alteracao)
        return res.modified_count > 0
    except InvalidId:
        return False

async def deletar_por_email(collection_name: str, email: str):
    collection = db[collection_name]
    email_limpo = email.strip() 
    resultado = await collection.delete_one({'email': email_limpo})
    if resultado.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Cliente não encontrado"
        )
    return

async def avaliar_hands(email: str, facilidade: float,qualidade: float, confiabilidade: float, nota: float,mensagem: str):
    result = await feedback_hands_col.insert_one({'avaliador': email, 'nota': {'facilidade': facilidade, 'qualidade': qualidade ,'confiabilidade': confiabilidade, 'notaGeral': nota}, 'mensagem': mensagem, 'data_avaliacao': datetime.now()})
    return result.inserted_id

async def avaliar_pessoas(collectionName,de: str,para: str, nota: float, mensagem: str):
    collection = db[collectionName]
    result = await collection.insert_one({'avaliador': de,'avaliado': para, 'nota': nota,'mensagem': mensagem})
    return result.inserted_id

async def ver_avaliacoes_entregues(collectionName, email: str):
    collection = db[collectionName]
    res = await collection.find({'avaliador': email}).to_list(length=None)
    for r in res:
        r['_id'] = str(r['_id'])
    total_elementos = len(res)
    return res,total_elementos

async def ver_avaliacoes_recebidas(collectionName, email: str):
    collection = db[collectionName]
    res = await collection.find({'avaliado': email}).to_list(length=None)
    for r in res:
        r['_id'] = str(r['_id'])
    total_elementos = len(res)
    return res,total_elementos

async def top_3_prestadores_mais_bem_avaliados():
    cursor = feedback_prestador_col.find().sort("nota", -1).limit(3)
    notas_prestadores = {}
    async for r in cursor:
        notas_prestadores[r["avaliado"]] = r["nota"]
    lista_res_prestadores = []
    for email, nota in notas_prestadores.items():
        prestador_info = await prestador_col.find_one({"email": email})
        if prestador_info:
            prestador_info["_id"] = str(prestador_info["_id"])
            prestador_info["nota"] = nota 
            lista_res_prestadores.append(prestador_info)     
    return lista_res_prestadores

async def total_clientes():
    total = await cliente_col.count_documents({})
    return total

async def total_prestadores():
    total = await prestador_col.count_documents({})
    return total

projecao_publica_pessoa = {'nome': 1, 'endereco.cidade': 1, 'endereco.estado': 1}
projecao_publica_prestador = {'nome': 1, 'servicos': 1, 'endereco.cidade': 1, 'endereco.estado': 1}

def formatar_cidade(doc: dict):
    endereco = doc.get('endereco') or []
    if not endereco:
        return None
    cidade = endereco[0].get('cidade')
    estado = endereco[0].get('estado')
    return ', '.join(parte for parte in (cidade, estado) if parte) or None

def extrair_nota_geral(nota):
    if isinstance(nota, dict):
        return nota.get('notaGeral')
    return nota

async def resumo_avaliacoes_hands():
    pipeline = [
        {'$addFields': {
            'nota_geral': {'$cond': [{'$isNumber': '$nota'}, '$nota', '$nota.notaGeral']}
        }},
        {'$match': {'nota_geral': {'$type': 'number'}}},
        {'$group': {
            '_id': None,
            'media': {'$avg': '$nota_geral'},
            'total': {'$sum': 1},
            'recomendam': {'$sum': {'$cond': [{'$gte': ['$nota_geral', 4]}, 1, 0]}},
            'facilidade': {'$avg': '$nota.facilidade'},
            'qualidade': {'$avg': '$nota.qualidade'},
            'confiabilidade': {'$avg': '$nota.confiabilidade'}
        }}
    ]
    resultado = await feedback_hands_col.aggregate(pipeline).to_list(length=1)
    criterios_vazios = {'facilidade': None, 'qualidade': None, 'confiabilidade': None}
    if not resultado:
        return {'media': 0, 'total': 0, 'taxa_recomendacao': 0, 'criterios': criterios_vazios}
    resumo = resultado[0]
    total = resumo['total']
    return {
        'media': round(resumo['media'], 1),
        'total': total,
        'taxa_recomendacao': round(resumo['recomendam'] / total * 100),
        'criterios': {
            chave: round(resumo[chave], 1) if resumo[chave] is not None else None
            for chave in criterios_vazios
        }
    }

async def estatisticas_landing():
    total_prestadores = await prestador_col.count_documents({})
    total_clientes = await cliente_col.count_documents({})
    inicio_periodo = ObjectId.from_datetime(datetime.now(timezone.utc) - timedelta(days=30))
    novos_clientes_30_dias = await cliente_col.count_documents({'_id': {'$gte': inicio_periodo}})
    resumo = await resumo_avaliacoes_hands()
    return {
        'total_prestadores': total_prestadores,
        'total_clientes': total_clientes,
        'novos_clientes_30_dias': novos_clientes_30_dias,
        'total_avaliacoes': resumo['total'],
        'nota_media': resumo['media'],
        'taxa_recomendacao': resumo['taxa_recomendacao']
    }

async def categorias_populares(limite: int = 8):
    pipeline = [
        {'$unwind': '$servicos'},
        {'$group': {'_id': '$servicos', 'total': {'$sum': 1}}},
        {'$sort': {'total': -1, '_id': 1}},
        {'$limit': limite}
    ]
    docs = await prestador_col.aggregate(pipeline).to_list(length=limite)
    return [{'nome': d['_id'], 'total': d['total']} for d in docs]

async def prestadores_destaque(limite: int = 3):
    # Melhores médias de avaliação; empata pelo maior número de avaliações
    pipeline = [
        {'$group': {'_id': '$avaliado', 'media': {'$avg': '$nota'}, 'total': {'$sum': 1}}},
        {'$sort': {'media': -1, 'total': -1}},
        {'$limit': limite * 5}  # folga: avaliados que já foram deletados são descartados abaixo
    ]
    avaliados = await feedback_prestador_col.aggregate(pipeline).to_list(length=None)
    emails = [a['_id'] for a in avaliados if a['_id']]
    prestadores = await prestador_col.find(
        {'email': {'$in': emails}}, {**projecao_publica_prestador, 'email': 1}
    ).to_list(length=None)
    por_email = {p['email']: p for p in prestadores}

    destaques = []
    ids_usados = []
    for avaliado in avaliados:
        prestador = por_email.get(avaliado['_id'])
        if prestador is None:
            continue
        ids_usados.append(prestador['_id'])
        destaques.append({
            '_id': str(prestador['_id']),
            'nome': prestador.get('nome'),
            'servicos': prestador.get('servicos') or [],
            'cidade': formatar_cidade(prestador),
            'nota_media': round(avaliado['media'], 1),
            'total_avaliacoes': avaliado['total']
        })
        if len(destaques) == limite:
            return destaques

    # Se ainda não há prestadores avaliados suficientes, completa com prestadores sem avaliação
    restantes = limite - len(destaques)
    sem_avaliacao = await prestador_col.find(
        {'_id': {'$nin': ids_usados}}, projecao_publica_prestador
    ).limit(restantes).to_list(length=restantes)
    for prestador in sem_avaliacao:
        destaques.append({
            '_id': str(prestador['_id']),
            'nome': prestador.get('nome'),
            'servicos': prestador.get('servicos') or [],
            'cidade': formatar_cidade(prestador),
            'nota_media': None,
            'total_avaliacoes': 0
        })
    return destaques

async def avaliacoes_hands_landing(limite: int = 6):
    resumo = await resumo_avaliacoes_hands()
    docs = await feedback_hands_col.find(
        {'mensagem': {'$nin': [None, '']}}
    ).sort('_id', -1).limit(limite).to_list(length=limite)

    emails = list({d['avaliador'] for d in docs if d.get('avaliador')})
    clientes = await cliente_col.find(
        {'email': {'$in': emails}}, {**projecao_publica_pessoa, 'email': 1}
    ).to_list(length=None)
    prestadores = await prestador_col.find(
        {'email': {'$in': emails}}, {**projecao_publica_pessoa, 'email': 1}
    ).to_list(length=None)
    clientes_por_email = {c['email']: c for c in clientes}
    prestadores_por_email = {p['email']: p for p in prestadores}

    avaliacoes = []
    for doc in docs:
        nota = extrair_nota_geral(doc.get('nota'))
        if nota is None:
            continue
        email = doc.get('avaliador')
        if email in clientes_por_email:
            autor, tipo = clientes_por_email[email], 'Cliente'
        elif email in prestadores_por_email:
            autor, tipo = prestadores_por_email[email], 'Prestador'
        else:
            autor, tipo = {}, None
        avaliacoes.append({
            '_id': str(doc['_id']),
            'texto': doc['mensagem'].strip(),
            'nota': nota,
            'autor': autor.get('nome') or 'Usuário Hands',
            'cidade': formatar_cidade(autor),
            'tipo': tipo
        })
    return {'resumo': resumo, 'avaliacoes': avaliacoes}

