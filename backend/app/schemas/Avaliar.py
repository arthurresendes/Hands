from pydantic import BaseModel

class Avaliacao(BaseModel):
    email: str
    nota: float
    mensagem: str

class AvaliacaoPessoas(BaseModel):
    de: str
    para: str
    nota: float
    mensagem: str