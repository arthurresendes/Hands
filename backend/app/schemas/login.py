from pydantic import BaseModel

class LoginRequest(BaseModel):
    email: str
    senha: str

class LoginResponse(BaseModel):
    mensagem: str
    role: str

class UsuarioAtual(BaseModel):
    id: str
    role: str
    nome: str | None = None
    email: str | None = None
