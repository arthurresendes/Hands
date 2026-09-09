from pydantic import BaseModel

class Cliente(BaseModel):
    nome: str
    email: str
    idade: int
    cep: str
    cpf: str
    body: str
    senha: str

