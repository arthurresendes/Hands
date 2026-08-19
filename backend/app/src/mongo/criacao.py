from dotenv import load_dotenv
from bson import ObjectId
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import sys
import os
raiz_do_projeto = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
sys.path.append(raiz_do_projeto)
from core.security import gerar_senha_hash

load_dotenv()

uri = (os.getenv('MONGO_URI'))
client = AsyncIOMotorClient(uri)

db = client['hands_marktplace']
admin = db['admin']
prestador = db['prestador']
cliente = db['cliente']


async def adicionar_admin(nome: str, email: str, senha: str):
    novo_admin = {'nome': nome, 'email': email, 'senha': gerar_senha_hash(senha)}
    result = await admin.insert_one(novo_admin)
    {'Sucesso': f'Novo admin adicionado com o id: {result.inserted_id}'}


if __name__ == '__main__':
    asyncio.run()