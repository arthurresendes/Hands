from pydantic import BaseModel

class LoginRequest(BaseModel):
    email: str
    senha: str

class LoginResponse(BaseModel):
    mensagem: str
    role: str