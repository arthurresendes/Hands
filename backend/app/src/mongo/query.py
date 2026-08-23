from core.database import cliente_col,prestador_col
#from motor.motor_asyncio import AsyncIOMotorClient
#from bson import ObjectId

protecao_dados_sensiveis = {
        'senha': 0,
        'Endereco.cep': 0,
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

