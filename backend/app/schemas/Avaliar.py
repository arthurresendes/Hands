from pydantic import BaseModel, Field

class Avaliacao(BaseModel):
    email: str | None = None
    facilidade: float = Field(ge=1, le=5)
    qualidade: float = Field(ge=1, le=5)
    confiabilidade: float = Field(ge=1, le=5)
    notaGeral: float = Field(ge=1, le=5)
    mensagem: str = Field(default='', max_length=1000)

class AvaliacaoPessoas(BaseModel):
    de: str | None = None
    para: str
    nota: float = Field(ge=1, le=5)
    mensagem: str = Field(default='', max_length=1000)
