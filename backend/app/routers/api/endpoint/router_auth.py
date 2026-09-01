from fastapi import APIRouter, HTTPException, status, Response
from schemas.login import LoginRequest,LoginResponse
from core.auth import autenticar_cliente,autenticar_admin, autenticar_prestador, criar_token_acesso
from core.configs import settings

routerauth = APIRouter()

def _setar_cookie(response: Response, token: str):
    response.set_cookie(
        key=settings.COOKIE_NAME,
        value=token,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite=settings.COOKIE_SAMESITE,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/",
    )

@routerauth.post('/login/cliente', response_model=LoginResponse, tags=['AUTH'], summary='Login de cliente ou admin')
async def login_cliente(dados: LoginRequest, response: Response):
    usuario = await autenticar_cliente(dados.email, dados.senha)
    if not usuario:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciais inválidas.")
    token = criar_token_acesso(sub=str(usuario["_id"]), role=usuario["role"])
    _setar_cookie(response, token)
    return {"mensagem": "Login realizado com sucesso.", "role": usuario["role"]}

@routerauth.post('/login/admin', response_model=LoginResponse, tags=['AUTH'], summary='Login de cliente ou admin')
async def login_admin(dados: LoginRequest, response: Response):
    usuario = await autenticar_admin(dados.email, dados.senha)
    if not usuario:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciais inválidas.")
    token = criar_token_acesso(sub=str(usuario["_id"]), role=usuario["role"])
    _setar_cookie(response, token)
    return {"mensagem": "Login realizado com sucesso.", "role": usuario["role"]}

@routerauth.post('/login/prestador', response_model=LoginResponse, tags=['AUTH'], summary='Login de prestador')
async def login_prestador(dados: LoginRequest, response: Response):
    prestador = await autenticar_prestador(dados.email, dados.senha)
    if not prestador:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciais inválidas.")
    token = criar_token_acesso(sub=str(prestador["_id"]), role="prestador")
    _setar_cookie(response, token)
    return {"mensagem": "Login realizado com sucesso.", "role": "prestador"}


@routerauth.post('/logout', tags=['AUTH'], summary='Logout')
async def logout(response: Response):
    response.delete_cookie(settings.COOKIE_NAME, path="/")
    return {"mensagem": "Logout realizado com sucesso."}