from typing import Literal
from pydantic import BaseModel, Field

class SolicitarCodigo(BaseModel):
    email: str = Field(min_length=3, max_length=254)
    papel: Literal['cliente', 'prestador']

class ValidarCodigo(SolicitarCodigo):
    codigo: str = Field(pattern=r'^\d{6}$')

class RedefinirSenha(BaseModel):
    senha: str = Field(min_length=6, max_length=128)
