from fastapi import APIRouter, HTTPException, status, Response, Depends, Request
from schemas.login import LoginRequest, LoginResponse, UsuarioAtual
from core.auth import autenticar_cliente, autenticar_admin, autenticar_prestador, criar_token_acesso, setar_cookie_acesso, limpar_cookie_acesso
from core.configs import settings
from core.deps import usuario_documento
from core.limitador import limiter, LIMITE_ESCRITA, LIMITE_LEITURA, LIMITE_LOGIN

routerauth = APIRouter(prefix="/api/v1")

def _credenciais_invalidas():
    return HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="E-mail ou senha inválidos.")

@routerauth.post('/login/cliente', response_model=LoginResponse, tags=['AUTH'], summary='Login de cliente')
@limiter.limit(LIMITE_LOGIN)
async def login_cliente(request: Request, dados: LoginRequest, response: Response):
    usuario = await autenticar_cliente(dados.email.strip(), dados.senha)
    if not usuario:
        raise _credenciais_invalidas()
    setar_cookie_acesso(response, criar_token_acesso(sub=str(usuario["_id"]), role="cliente", lembrar=dados.lembrar, versao=usuario.get("sessao_versao", 0)), lembrar=dados.lembrar)
    return {"mensagem": "Login realizado com sucesso.", "role": "cliente"}

@routerauth.post('/login/prestador', response_model=LoginResponse, tags=['AUTH'], summary='Login de prestador')
@limiter.limit(LIMITE_LOGIN)
async def login_prestador(request: Request, dados: LoginRequest, response: Response):
    prestador = await autenticar_prestador(dados.email.strip(), dados.senha)
    if not prestador:
        raise _credenciais_invalidas()
    setar_cookie_acesso(response, criar_token_acesso(sub=str(prestador["_id"]), role="prestador", lembrar=dados.lembrar, versao=prestador.get("sessao_versao", 0)), lembrar=dados.lembrar)
    return {"mensagem": "Login realizado com sucesso.", "role": "prestador"}

@routerauth.post('/login/admin', response_model=LoginResponse, tags=['AUTH'], summary='Login de administrador')
@limiter.limit(LIMITE_LOGIN)
async def login_admin(request: Request, dados: LoginRequest, response: Response):
    admin = await autenticar_admin(dados.email.strip(), dados.senha)
    if not admin:
        raise _credenciais_invalidas()
    setar_cookie_acesso(response, criar_token_acesso(sub=str(admin["_id"]), role="admin", versao=admin.get("sessao_versao", 0)))
    return {"mensagem": "Login realizado com sucesso.", "role": "admin"}

@routerauth.get('/me', response_model=UsuarioAtual, tags=['AUTH'], summary='Usuário autenticado')
@limiter.limit(LIMITE_LEITURA)
async def usuario_logado(request: Request, usuario: dict = Depends(usuario_documento)):
    return usuario

@routerauth.post('/logout', tags=['AUTH'], summary='Logout')
@limiter.limit(LIMITE_ESCRITA)
async def logout(request: Request, response: Response):
    limpar_cookie_acesso(response)
    return {"mensagem": "Logout realizado com sucesso."}
