from fastapi import Request, Depends, HTTPException, status
import jwt
from bson import ObjectId
from bson.errors import InvalidId
from core.configs import settings
from core.database import cliente_col, prestador_col, admin_col

COLECOES_POR_ROLE = {"cliente": cliente_col, "prestador": prestador_col, "admin": admin_col}

# Pega o cookie gerado
async def obter_token_do_cookie(request: Request) -> str:
    token = request.cookies.get(settings.COOKIE_NAME)
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Não autenticado.",
        )
    return token

# Pegar o payload a partir do cookie/token
async def get_token_payload(token: str = Depends(obter_token_do_cookie)) -> dict:
    credential_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Não foi possível validar as credenciais.",
    )
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.ALGORITHM])
        return payload
    except jwt.PyJWTError:
        raise credential_exception

# Verifca role(admin,cliente ou prestador) para controle de acessos
def exigir_role(*roles_permitidas: str):
    async def verificador(payload: dict = Depends(get_token_payload)) -> dict:
        if payload.get("role") not in roles_permitidas:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Acesso não autorizado para este perfil.",
            )
        return payload
    return verificador

# Retorna o usuario atual, com o payload e seu devido role
async def usuario_atual(payload: dict = Depends(get_token_payload)) -> dict:
    return {"id": payload["sub"], "role": payload["role"]}

# Carrega o documento do usuario logado (sem senha e cpf) a partir do token
async def usuario_documento(payload: dict = Depends(get_token_payload)) -> dict:
    colecao = COLECOES_POR_ROLE.get(payload.get("role"))
    documento = None
    if colecao is not None:
        try:
            documento = await colecao.find_one({"_id": ObjectId(payload["sub"])}, {"senha": 0, "cpf": 0})
        except (InvalidId, KeyError, TypeError):
            documento = None
    if documento is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuário não encontrado.",
        )
    documento["id"] = str(documento.pop("_id"))
    documento["role"] = payload["role"]
    return documento

# Exige login e, se informado, um dos perfis permitidos; devolve o documento do usuario
def exigir_usuario(*roles_permitidas: str):
    async def verificador(usuario: dict = Depends(usuario_documento)) -> dict:
        if roles_permitidas and usuario["role"] not in roles_permitidas:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Acesso não autorizado para este perfil.",
            )
        return usuario
    return verificador
