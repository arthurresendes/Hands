import logging
from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pymongo.errors import PyMongoError
from slowapi.errors import RateLimitExceeded

logger = logging.getLogger(__name__)

MENSAGEM_INDISPONIVEL = 'Estamos com uma instabilidade no momento. Tente novamente em instantes.'
MENSAGEM_LIMITE = 'Muitas tentativas em pouco tempo. Aguarde um instante e tente novamente.'
MENSAGEM_INESPERADO = 'Algo deu errado do nosso lado. Tente novamente em instantes.'

ROTULOS = {
    'nome': 'nome', 'email': 'e-mail', 'celular': 'celular', 'idade': 'idade', 'cep': 'CEP', 'cpf': 'CPF',
    'senha': 'senha', 'senha_atual': 'senha atual', 'informacoes': 'sobre você', 'valor': 'valor',
    'servicos': 'serviços', 'idiomas': 'idiomas', 'certificacoes': 'certificações', 'codigo': 'código',
    'papel': 'tipo de conta', 'nota': 'nota', 'mensagem': 'mensagem', 'foto': 'foto', 'para': 'destinatário',
    'facilidade': 'facilidade', 'qualidade': 'qualidade', 'confiabilidade': 'confiabilidade',
    'notaGeral': 'nota geral', 'aceite_termos': 'aceite dos termos', 'pagina': 'página', 'limite': 'limite',
}

def _campo(loc) -> str:
    nomes = [parte for parte in loc if isinstance(parte, str) and parte not in ('body', 'query', 'path', 'form')]
    chave = nomes[-1] if nomes else 'campo'
    return ROTULOS.get(chave, chave.replace('_', ' '))

def mensagem_validacao(erro: dict) -> str:
    tipo = erro.get('type', '')
    campo = _campo(erro.get('loc', ()))
    ctx = erro.get('ctx') or {}
    if tipo == 'missing':
        return f'Preencha o campo {campo}.'
    if tipo == 'string_too_short':
        return f'O campo {campo} deve ter pelo menos {ctx.get("min_length")} caracteres.'
    if tipo == 'string_too_long':
        return f'O campo {campo} deve ter no máximo {ctx.get("max_length")} caracteres.'
    if tipo in ('int_parsing', 'float_parsing', 'int_from_float', 'decimal_parsing'):
        return f'O campo {campo} deve ser um número válido.'
    if tipo in ('greater_than_equal', 'greater_than'):
        return f'O campo {campo} deve ser no mínimo {ctx.get("ge", ctx.get("gt"))}.'
    if tipo in ('less_than_equal', 'less_than'):
        return f'O campo {campo} deve ser no máximo {ctx.get("le", ctx.get("lt"))}.'
    if tipo == 'json_invalid':
        return 'Os dados enviados estão em um formato inválido.'
    if tipo in ('string_pattern_mismatch', 'literal_error', 'enum', 'bool_parsing', 'string_type'):
        return f'O campo {campo} está em um formato inválido.'
    return f'O campo {campo} é inválido.'

async def tratar_validacao(request: Request, exc: RequestValidationError):
    mensagens = list(dict.fromkeys(mensagem_validacao(erro) for erro in exc.errors()))
    return JSONResponse(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, content={'detail': ' '.join(mensagens)})

async def tratar_banco(request: Request, exc: PyMongoError):
    logger.exception('Falha ao acessar o banco de dados')
    return JSONResponse(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, content={'detail': MENSAGEM_INDISPONIVEL})

async def tratar_inesperado(request: Request, exc: Exception):
    logger.exception('Erro inesperado em %s', request.url.path)
    return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={'detail': MENSAGEM_INESPERADO})

async def tratar_limite(request: Request, exc: RateLimitExceeded):
    return JSONResponse(status_code=status.HTTP_429_TOO_MANY_REQUESTS, content={'detail': MENSAGEM_LIMITE}, headers={'Retry-After': '60'})

def registrar_tratadores(app: FastAPI):
    app.add_exception_handler(RateLimitExceeded, tratar_limite)
    app.add_exception_handler(RequestValidationError, tratar_validacao)
    app.add_exception_handler(PyMongoError, tratar_banco)
    app.add_exception_handler(Exception, tratar_inesperado)
