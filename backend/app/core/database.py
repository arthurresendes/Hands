from motor.motor_asyncio import AsyncIOMotorClient
from core.configs import settings

client = AsyncIOMotorClient(settings.MONGO_URI)
db = client[settings.MONGO_DB_NAME]
# Conexão com as collections
cliente_col = db["cliente"]
prestador_col = db["prestador"]
admin_col = db["admin"]
# Criação de indices para evitar duplicidades de cadastros nas collections
async def criar_indices():
    await cliente_col.create_index("email", unique=True)
    await prestador_col.create_index("email", unique=True)
    await admin_col.create_index("email", unique=True)