from core.database import cliente_col,prestador_col,db
#from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from bson.errors import InvalidId
from fastapi import HTTPException, status
from core.security import gerar_senha_hash
from src.mongo.criacao import validar_cpf,pegar_dados_cep

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

