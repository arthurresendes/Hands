import hmac
import secrets
from datetime import datetime, timedelta, timezone
from bson import ObjectId
from bson.errors import InvalidId
from fastapi import HTTPException, status
from pymongo import ReturnDocument
from core.configs import settings
from core.database import cliente_col, prestador_col, recuperacao_col
from core.security import gerar_senha_hash, verificar_senha

COLECOES = {'cliente': cliente_col, 'prestador': prestador_col}

def _codigo_invalido() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail='Código inválido ou expirado. Solicite um novo código.',
    )

def _agora() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)

def gerar_codigo() -> str:
    return f'{secrets.randbelow(10 ** 6):06d}'

def hash_codigo(papel: str, email: str, codigo: str) -> str:
    mensagem = f'{papel}:{email}:{codigo}'.encode()
    return hmac.new(settings.JWT_SECRET.encode(), mensagem, 'sha256').hexdigest()

async def criar_solicitacao(papel: str, email: str) -> tuple[str, str | None] | None:
    email = email.strip()
    usuario = await COLECOES[papel].find_one({'email': email}, {'nome': 1})
    if usuario is None:
        return None
    agora = _agora()
    anterior = await recuperacao_col.find_one({'email': email, 'papel': papel}, {'criado_em': 1})
    if anterior and agora - anterior['criado_em'] < timedelta(seconds=settings.RECUPERACAO_REENVIO_SEGUNDOS):
        return None
    codigo = gerar_codigo()
    await recuperacao_col.replace_one(
        {'email': email, 'papel': papel},
        {
            'email': email,
            'papel': papel,
            'codigo_hash': hash_codigo(papel, email, codigo),
            'criado_em': agora,
            'expira_em': agora + timedelta(minutes=settings.RECUPERACAO_VALIDADE_MINUTOS),
            'tentativas': 0,
            'verificado': False,
        },
        upsert=True,
    )
    return codigo, usuario.get('nome')

async def validar_codigo(papel: str, email: str, codigo: str) -> str:
    email = email.strip()
    agora = _agora()
    solicitacao = await recuperacao_col.find_one_and_update(
        {
            'email': email, 'papel': papel, 'verificado': False,
            'expira_em': {'$gt': agora},
            'tentativas': {'$lt': settings.RECUPERACAO_MAX_TENTATIVAS},
        },
        {'$inc': {'tentativas': 1}},
        return_document=ReturnDocument.AFTER,
    )
    if solicitacao is None:
        raise _codigo_invalido()
    if not hmac.compare_digest(solicitacao['codigo_hash'], hash_codigo(papel, email, codigo)):
        raise _codigo_invalido()
    await recuperacao_col.update_one(
        {'_id': solicitacao['_id']},
        {'$set': {'verificado': True, 'expira_em': agora + timedelta(minutes=settings.RECUPERACAO_VALIDADE_MINUTOS)}},
    )
    return str(solicitacao['_id'])

async def redefinir_senha(id_solicitacao: str, senha_nova: str):
    sessao_expirada = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail='Sua verificação expirou. Solicite um novo código.',
    )
    try:
        oid = ObjectId(id_solicitacao)
    except InvalidId:
        raise sessao_expirada
    solicitacao = await recuperacao_col.find_one({'_id': oid, 'verificado': True, 'expira_em': {'$gt': _agora()}})
    if solicitacao is None:
        raise sessao_expirada
    colecao = COLECOES[solicitacao['papel']]
    usuario = await colecao.find_one({'email': solicitacao['email']}, {'senha': 1})
    if usuario is None:
        await recuperacao_col.delete_one({'_id': oid})
        raise sessao_expirada
    if verificar_senha(senha_nova, usuario['senha']):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='A nova senha deve ser diferente da senha anterior.',
        )
    await colecao.update_one({'_id': usuario['_id']}, {'$set': {'senha': gerar_senha_hash(senha_nova)}})
    await recuperacao_col.delete_one({'_id': oid})
