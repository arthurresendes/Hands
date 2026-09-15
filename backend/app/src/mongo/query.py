from core.database import cliente_col,prestador_col,db
#from motor.motor_asyncio import AsyncIOMotorClient
#from bson import ObjectId
from fastapi import HTTPException, status

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

