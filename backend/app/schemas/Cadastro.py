from pydantic import BaseModel

class Cliente(BaseModel):
    nome: str
    email: str
    celular: str
    idade: int
    cep: str
    cpf: str
    informacoes: str
    senha: str

class Prestador(BaseModel):
    nome: str
    email: str
    celular: str
    idade: int
    cep: str
    cpf: str
    informacoes: str
    valor: float
    senha: str
    servicos: list[str]
    idiomas: list[str]
    certificacoes: list[str] | None = None