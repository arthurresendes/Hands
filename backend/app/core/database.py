from motor.motor_asyncio import AsyncIOMotorClient
from core.configs import settings

client = AsyncIOMotorClient(settings.MONGO_URI)
db = client[settings.MONGO_DB_NAME]
# Conexão com as collections
cliente_col = db["cliente"]
prestador_col = db["prestador"]
admin_col = db["admin"]
feedback_hands_col = db["feedback_hands"]
feedback_cliente_col = db["feedback_cliente"]
feedback_prestador_col = db["feedback_prestador"]
favorito_col = db["favorito"]
# Criação de indices para evitar duplicidades de cadastros nas collections
async def criar_indices():
    await cliente_col.create_index("email", unique=True)
    await prestador_col.create_index("email", unique=True)
    await admin_col.create_index("email", unique=True)
    await favorito_col.create_index([("cliente", 1), ("prestador", 1)], unique=True)
    await favorito_col.create_index("prestador")
    await feedback_prestador_col.create_index("avaliado")
    await feedback_prestador_col.create_index([("avaliador", 1), ("avaliado", 1)])
