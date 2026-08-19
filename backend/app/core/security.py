from passlib.context import CryptContext

# Usar PBKDF2 que é mais compatível e não tem limite de 72 caracteres
CRIPTO = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

def gerar_senha_hash(senha: str) -> str:
    return CRIPTO.hash(senha)

def verificar_senha(senha: str, hash_senha: str) -> bool:
    '''
    Função para verificar se a senha está correta
    '''
    return CRIPTO.verify(senha, hash_senha)