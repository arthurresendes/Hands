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
contadores_col = db["contadores"]
recuperacao_col = db["recuperacao_senha"]
# Criação de indices para evitar duplicidades de cadastros nas collections
async def criar_indices():
    await cliente_col.create_index("email", unique=True)
    await prestador_col.create_index("email", unique=True)
    await admin_col.create_index("email", unique=True)
    await favorito_col.create_index([("cliente", 1), ("prestador", 1)], unique=True)
    await favorito_col.create_index("prestador")
    await feedback_prestador_col.create_index("avaliado")
    await feedback_prestador_col.create_index([("avaliador", 1), ("avaliado", 1)])
    await feedback_hands_col.create_index("avaliador")
    await feedback_cliente_col.create_index("avaliado")
    await feedback_cliente_col.create_index([("avaliador", 1), ("avaliado", 1)])
    await cliente_col.create_index("data_criacao")
    await prestador_col.create_index("data_criacao")
    await cliente_col.create_index("endereco.estado")
    await prestador_col.create_index("endereco.estado")
    await cliente_col.create_index("endereco.cidade")
    await prestador_col.create_index("endereco.cidade")
    await prestador_col.create_index("servicos")
    await prestador_col.create_index("valor")
    await feedback_hands_col.create_index("data_avaliacao")
    await feedback_prestador_col.create_index([("avaliador", 1), ("_id", -1)])
    await feedback_cliente_col.create_index([("avaliador", 1), ("_id", -1)])
    await recuperacao_col.create_index([("email", 1), ("papel", 1)], unique=True)
    await recuperacao_col.create_index("expira_em", expireAfterSeconds=0)
