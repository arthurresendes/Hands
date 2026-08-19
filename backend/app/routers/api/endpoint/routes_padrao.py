from fastapi import APIRouter,status,HTTPException,Request
from src.mongo.query import listagem_clientes,listagem_prestadores

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
