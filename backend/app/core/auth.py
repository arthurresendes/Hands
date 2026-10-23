from datetime import datetime, timedelta
from pytz import timezone
import jwt
from typing import Optional
from fastapi import Response
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
def criar_token_redefinicao(id_solicitacao: str) -> str:
    sp = timezone("America/Sao_Paulo")
    agora = datetime.now(tz=sp)
    payload = {
        "sub": id_solicitacao,
        "type": "reset_password",
        "iat": agora,
        "exp": agora + timedelta(minutes=settings.RECUPERACAO_VALIDADE_MINUTOS),
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.ALGORITHM)

def ler_token_redefinicao(token: str | None) -> str | None:
    if not token:
        return None
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.ALGORITHM])
    except jwt.PyJWTError:
        return None
    return payload.get("sub") if payload.get("type") == "reset_password" else None

def setar_cookie_redefinicao(response: Response, token: str):
    response.set_cookie(
        key=settings.RECUPERACAO_COOKIE_NAME,
        value=token,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite=settings.COOKIE_SAMESITE,
        max_age=settings.RECUPERACAO_VALIDADE_MINUTOS * 60,
        path=settings.RECUPERACAO_COOKIE_PATH,
    )

def limpar_cookie_redefinicao(response: Response):
    response.delete_cookie(settings.RECUPERACAO_COOKIE_NAME, path=settings.RECUPERACAO_COOKIE_PATH)

def setar_cookie_acesso(response: Response, token: str):
    response.set_cookie(
        key=settings.COOKIE_NAME,
        value=token,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite=settings.COOKIE_SAMESITE,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/",
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