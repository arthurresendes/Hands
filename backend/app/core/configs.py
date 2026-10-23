from pydantic_settings import BaseSettings
from dotenv import load_dotenv
import os

load_dotenv()
'''
MONGO_URI -> Conecta com o uri do banco
Mongo_DB_NAME ->  Conecta com o nome do banco

JWT -> Pega a secret jwt
ACESS_TOKEN -> Quanto tempo expira o token, no caso 4 horas

'''
class Settings(BaseSettings):
    MONGO_URI: str = os.getenv("MONGO_URI")
    MONGO_DB_NAME: str = os.getenv("MONGO_DB_NAME")

    JWT_SECRET: str = os.getenv("JWT_SECRET")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 4
    ACCESS_TOKEN_LEMBRAR_DIAS: int = 30

    EMAIL_REMETENTE: str = os.getenv("EMAIL_REMETENTE", "")
    EMAIL_SENHA: str = os.getenv("EMAIL_SENHA", "")
    SMTP_HOST: str = os.getenv("SMTP_HOST", "smtp.gmail.com")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))

    RECUPERACAO_VALIDADE_MINUTOS: int = 10
    RECUPERACAO_MAX_TENTATIVAS: int = 5
    RECUPERACAO_REENVIO_SEGUNDOS: int = 60
    RECUPERACAO_COOKIE_NAME: str = "reset_token"
    RECUPERACAO_COOKIE_PATH: str = "/api/v1/recuperar-senha"

    COOKIE_NAME: str = "access_token"
    COOKIE_SECURE: bool = os.getenv("ENV", "dev") == "prod" 
    COOKIE_SAMESITE: str = "lax"

    class Config:
        case_sensitive = True

settings: Settings = Settings()