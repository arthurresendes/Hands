from fastapi import APIRouter, BackgroundTasks, HTTPException, Request, Response, status
from core.auth import (
    criar_token_redefinicao, ler_token_redefinicao, setar_cookie_redefinicao, limpar_cookie_redefinicao,
)
from core.configs import settings
from schemas.Recuperacao import SolicitarCodigo, ValidarCodigo, RedefinirSenha
from src.emails.envio import enviar_email
from src.emails.modelos import email_codigo_recuperacao
from src.mongo.recuperacao import criar_solicitacao, validar_codigo, redefinir_senha
from core.limitador import limiter, LIMITE_RECUPERACAO_REDEFINIR, LIMITE_RECUPERACAO_SOLICITAR, LIMITE_RECUPERACAO_VALIDAR

routerrecuperacao = APIRouter(prefix="/api/v1/recuperar-senha", tags=['RECUPERAÇÃO DE SENHA'])

MENSAGEM_SOLICITACAO = 'Se o e-mail estiver cadastrado, enviamos um código de 6 dígitos para ele.'

@routerrecuperacao.post('/solicitar', status_code=status.HTTP_200_OK, summary='Enviar código de recuperação por e-mail')
@limiter.limit(LIMITE_RECUPERACAO_SOLICITAR)
async def solicitar_codigo(request: Request, dados: SolicitarCodigo, tarefas: BackgroundTasks):
    solicitacao = await criar_solicitacao(dados.papel, dados.email)
    if solicitacao is not None:
        codigo, nome = solicitacao
        assunto, texto, html = email_codigo_recuperacao(nome, codigo, settings.RECUPERACAO_VALIDADE_MINUTOS)
        tarefas.add_task(enviar_email, dados.email.strip(), assunto, texto, html)
    return {'mensagem': MENSAGEM_SOLICITACAO}

@routerrecuperacao.post('/validar', status_code=status.HTTP_200_OK, summary='Validar o código recebido por e-mail')
@limiter.limit(LIMITE_RECUPERACAO_VALIDAR)
async def validar_codigo_recuperacao(request: Request, dados: ValidarCodigo, response: Response):
    id_solicitacao = await validar_codigo(dados.papel, dados.email, dados.codigo)
    setar_cookie_redefinicao(response, criar_token_redefinicao(id_solicitacao))
    return {'mensagem': 'Código confirmado.'}

@routerrecuperacao.post('/redefinir', status_code=status.HTTP_200_OK, summary='Definir a nova senha após validar o código')
@limiter.limit(LIMITE_RECUPERACAO_REDEFINIR)
async def redefinir_senha_recuperacao(dados: RedefinirSenha, request: Request, response: Response):
    id_solicitacao = ler_token_redefinicao(request.cookies.get(settings.RECUPERACAO_COOKIE_NAME))
    if id_solicitacao is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Sua verificação expirou. Solicite um novo código.')
    await redefinir_senha(id_solicitacao, dados.senha)
    limpar_cookie_redefinicao(response)
    return {'mensagem': 'Senha redefinida com sucesso.'}
