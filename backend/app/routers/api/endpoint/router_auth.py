from fastapi import APIRouter, HTTPException, status, Response, Depends
from schemas.login import LoginRequest, LoginResponse, UsuarioAtual
from core.auth import autenticar_cliente, autenticar_admin, autenticar_prestador, criar_token_acesso, setar_cookie_acesso
from core.configs import settings
from core.deps import usuario_documento

routerauth = APIRouter(prefix="/api/v1")

def _credenciais_invalidas():
    return HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="E-mail ou senha inválidos.")

@routerauth.post('/login/cliente', response_model=LoginResponse, tags=['AUTH'], summary='Login de cliente')
async def login_cliente(dados: LoginRequest, response: Response):
    usuario = await autenticar_cliente(dados.email.strip(), dados.senha)
    if not usuario:
        raise _credenciais_invalidas()
    setar_cookie_acesso(response, criar_token_acesso(sub=str(usuario["_id"]), role="cliente"))
    return {"mensagem": "Login realizado com sucesso.", "role": "cliente"}

@routerauth.post('/login/prestador', response_model=LoginResponse, tags=['AUTH'], summary='Login de prestador')
async def login_prestador(dados: LoginRequest, response: Response):
    prestador = await autenticar_prestador(dados.email.strip(), dados.senha)
    if not prestador:
        raise _credenciais_invalidas()
    setar_cookie_acesso(response, criar_token_acesso(sub=str(prestador["_id"]), role="prestador"))
    return {"mensagem": "Login realizado com sucesso.", "role": "prestador"}

@routerauth.post('/login/admin', response_model=LoginResponse, tags=['AUTH'], summary='Login de administrador')
async def login_admin(dados: LoginRequest, response: Response):
    admin = await autenticar_admin(dados.email.strip(), dados.senha)
    if not admin:
        raise _credenciais_invalidas()
    setar_cookie_acesso(response, criar_token_acesso(sub=str(admin["_id"]), role="admin"))
    return {"mensagem": "Login realizado com sucesso.", "role": "admin"}

@routerauth.get('/me', response_model=UsuarioAtual, tags=['AUTH'], summary='Usuário autenticado')
async def usuario_logado(usuario: dict = Depends(usuario_documento)):
    return usuario

@routerauth.post('/logout', tags=['AUTH'], summary='Logout')
async def logout(response: Response):
    response.delete_cookie(settings.COOKIE_NAME, path="/")
    return {"mensagem": "Logout realizado com sucesso."}
