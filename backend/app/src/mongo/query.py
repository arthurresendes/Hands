from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import os
from dotenv import load_dotenv
load_dotenv()

uri = (os.getenv('MONGO_URI'))
client = AsyncIOMotorClient(uri)

db = client['hands_marktplace']
admin = db['admin']
prestador = db['prestador']
cliente = db['cliente']

protecao_dados_sensiveis = {
        '_id': 0,
        'senha': 0,
        'Endereco.cep': 0,
        'cpf': 0
}

async def listagem_clientes():
    return await cliente.find({}, protecao_dados_sensiveis).to_list(length=None)

async def listagem_prestadores():
    return await prestador.find({}, protecao_dados_sensiveis).to_list(length=None)

