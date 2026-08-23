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

    COOKIE_NAME: str = "access_token"
    COOKIE_SECURE: bool = os.getenv("ENV", "dev") == "prod" 
    COOKIE_SAMESITE: str = "lax"

    class Config:
        case_sensitive = True

settings: Settings = Settings()