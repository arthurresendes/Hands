from pydantic import BaseModel
from typing import Optional

class AtualizarCliente(BaseModel):
    id: str
    nome: Optional[str] = None
    email: Optional[str] = None
    celular: Optional[str] = None
    idade: Optional[int] = None
    cep: Optional[str] = None
    cpf: Optional[str] = None
    informacoes: Optional[str] = None
    senha: Optional[str] = None

class AtualizarPrestador(BaseModel):
    id: str
    nome: Optional[str] = None
    email: Optional[str] = None
    celular: Optional[str] = None
    idade: Optional[int] = None
    cep: Optional[str] = None
    cpf: Optional[str] = None
    informacoes: Optional[str] = None
    valor: Optional[float] = None
    senha: Optional[str] = None
    servicos: Optional[list[str]] = None
    idiomas: Optional[list[str]] = None
    certificacoes: Optional[list[str]] = None