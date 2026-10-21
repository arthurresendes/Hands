from pydantic import BaseModel

class Avaliacao(BaseModel):
    email: str
    facilidade: float
    qualidade: float
    confiabilidade: float
    notaGeral: float
    mensagem: str

class AvaliacaoPessoas(BaseModel):
    de: str
    para: str
    nota: float
    mensagem: str