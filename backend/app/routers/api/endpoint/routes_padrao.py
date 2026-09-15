from fastapi import APIRouter,status,HTTPException,Request
from src.mongo.query import listagem_clientes,listagem_prestadores,deletar_por_email
from src.mongo.criacao import adicionar_cliente,adicionar_prestador
from schemas.Cadastro import Cliente,Prestador
from core.database import cliente_col,prestador_col

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
    check_user = await cliente_col.find_one({'email': cliente.email})
    if check_user is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Cliente com esse e-mail já cadastrado!"
        )
    resultado = await adicionar_cliente(nome=cliente.nome, email=cliente.email, idade=cliente.idade, cep=cliente.cep, cpf=cliente.cpf, body=cliente.body, senha=cliente.senha)
    if "Erro" in resultado:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail=resultado)
    return {'Message': f'Sucesso ao cadastrar o cliente: {cliente.nome}'}

@router.post('/cadastrar_prestador', tags=["POST"], status_code=status.HTTP_201_CREATED, summary='Cadastro de prestador')
async def cadastro_prestador(prestador: Prestador):
    check_user = await prestador_col.find_one({'email': prestador.email})
    if check_user is not None:
        raise HTTPException(
        status_code=status.HTTP_409_CONFLICT, detail="Prestador com esse email já cadastrado!"
        )
    resultado = await adicionar_prestador(
        nome=prestador.nome,
        email=prestador.email,
        idade=prestador.idade,
        cep=prestador.cep,
        cpf=prestador.cpf,
        body=prestador.body,
        valor=prestador.valor,
        senha=prestador.senha,
        servicos=prestador.servicos,
        idiomas=prestador.idiomas,
        certificacoes=prestador.certificacoes
    )
    if "Erro" in resultado:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail=resultado)
    return {'Message': f'Sucesso ao cadastrar o prestador: {prestador.nome}'}

@router.delete('/deletar_prestador/{email}', tags=["DELETE"], status_code=status.HTTP_204_NO_CONTENT, summary="Deletando prestador por email")
async def deletar_prestador(email: str):
    try:
        resultado = await deletar_por_email('prestador', email)
        return resultado
    except HTTPException:
        raise 
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro interno ao deletar prestador: {str(error)}"
        )

@router.delete('/deletar_cliente/{email}', tags=["DELETE"], status_code=status.HTTP_204_NO_CONTENT, summary="Deletando cliente por email")
async def deletar_cliente(email: str):
    try:
        resultado = await deletar_por_email('cliente', email)
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro interno ao deletar cliente: {str(error)}"
        )
