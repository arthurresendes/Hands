from fastapi import APIRouter,status,HTTPException,Request
from src.mongo.query import listagem_clientes,listagem_prestadores
from src.mongo.criacao import adicionar_cliente,adicionar_prestador
from schemas.Cadastro import Cliente

router = APIRouter()

@router.get('/', tags=['GET'], status_code=status.HTTP_200_OK, summary='Rota base do projeto')
async def rota_base():
    return {'Projeto': 'Hands - Marktplace de serviços'}

@router.get('/ver_todos_clientes', tags=['GET'], status_code=status.HTTP_200_OK, summary='Ver todos os clientes cadastrados')
async def ver_todos_clientes():
    result = await listagem_clientes()
    return {'Clientes': result}

@router.get('/ver_todos_prestadores', tags=['GET'], status_code=status.HTTP_200_OK, summary='Ver todos os prestadores cadastrados')
async def ver_todos_prestadores():
    result = await listagem_prestadores()
    return {'Prestadores': result}

@router.post('/cadastrar_cliente', tags=["POST"], status_code=status.HTTP_201_CREATED, summary='Cadastro de clientes')
async def cadastro_cliente(cliente: Cliente):
    resultado = await adicionar_cliente(nome=cliente.nome, email=cliente.email, idade=cliente.idade, cep=cliente.cep, cpf=cliente.cpf, body=cliente.body, senha=cliente.senha)
    if "Erro" in resultado:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail=resultado)
    return {'Message': f'Sucesso ao cadastrar o cliente: {cliente.nome}'}