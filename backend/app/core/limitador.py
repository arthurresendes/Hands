from fastapi import Request
from slowapi import Limiter

def get_render_remote_address(request: Request) -> str:
    forwarded_for = request.headers.get("X-Forwarded-For")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()
    return request.client.host if request.client else "127.0.0.1"

limiter = Limiter(key_func=get_render_remote_address)

LIMITE_LOGIN = "10/minute"
LIMITE_CADASTRO = "10/hour"
LIMITE_RECUPERACAO_SOLICITAR = "5/hour"
LIMITE_RECUPERACAO_VALIDAR = "10/15 minutes"
LIMITE_RECUPERACAO_REDEFINIR = "10/hour"
LIMITE_ALTERAR_CONTA = "20/minute"
LIMITE_EXCLUIR_CONTA = "5/hour"
LIMITE_ESCRITA = "30/minute"
LIMITE_UPLOAD = "10/minute"
LIMITE_EXPORTACAO = "10/minute"
LIMITE_PUBLICO = "60/minute"
LIMITE_LEITURA = "120/minute"
