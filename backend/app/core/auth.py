from datetime import datetime, timedelta
from pytz import timezone
import jwt
from typing import Optional
from core.configs import settings
from core.security import verificar_senha
from core.database import cliente_col, prestador_col, admin_col

# Cria o token
def _criar_token(sub: str, role: str, tempo_vida: timedelta) -> str:
    sp = timezone("America/Sao_Paulo")
    agora = datetime.now(tz=sp)
    payload = {
        "sub": sub,
        "role": role,
        "type": "access_token",
        "iat": agora,
        "exp": agora + tempo_vida,
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.ALGORITHM)

def criar_token_acesso(sub: str, role: str) -> str:
    return _criar_token(
        sub=sub,
        role=role,
        tempo_vida=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    )
# Autenticação
async def autenticar_cliente(email: str, senha: str) -> Optional[dict]:
    usuario = await cliente_col.find_one({"email": email})
    if not usuario:
        return None
    if not verificar_senha(senha, usuario["senha"]):
        return None
    usuario["role"] = "cliente"
    return usuario

async def autenticar_prestador(email: str, senha: str) -> Optional[dict]:
    prestador = await prestador_col.find_one({"email": email})
    if not prestador:
        return None
    if not verificar_senha(senha, prestador["senha"]):
        return None
    prestador["role"] = "prestador"
    return prestador

async def autenticar_admin(email: str, senha: str)-> Optional[dict]:
    admin = await admin_col.find_one({"email": email})
    if not admin: 
        return None
    if not verificar_senha(senha, admin["senha"]):
        return None
    admin["role"] = "admin"
    return admin