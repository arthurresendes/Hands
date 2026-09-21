from fastapi import APIRouter,status,HTTPException,Request
from src.mongo.query import listagem_clientes,listagem_prestadores,deletar_por_email, busca_especifica_cliente,busca_especifica_prestador,atualizar,atualizar_senha,atualizar_cpf,atualizar_cep
from src.mongo.criacao import adicionar_cliente,adicionar_prestador
from schemas.Cadastro import Cliente,Prestador
from schemas.Atualizar import AtualizarCliente,AtualizarPrestador
from core.database import cliente_col,prestador_col

router = APIRouter()

# Rotas GET
@router.get('/', tags=['GET'], status_code=status.HTTP_200_OK, summary='Rota base do projeto')
async def rota_base():
    return {'Projeto': 'Hands - Marktplace de serviços'}

@router.get('/ver_todos_clientes', tags=['GET'], status_code=status.HTTP_200_OK, summary='Ver todos os clientes cadastrados')
async def ver_todos_clientes():
    result = await listagem_clientes()
    return {'clientes': result}

@router.get('/ver_todos_prestadores', tags=['GET'], status_code=status.HTTP_200_OK, summary='Ver todos os prestadores cadastrados')
async def ver_todos_prestadores():
    result = await listagem_prestadores()
    return {'prestadores': result}

# Rotas POST
@router.post('/cadastrar_cliente', tags=["POST"], status_code=status.HTTP_201_CREATED, summary='Cadastro de clientes')
async def cadastro_cliente(cliente: Cliente):
    check_user = await cliente_col.find_one({'email': cliente.email})
    if check_user is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Cliente com esse e-mail já cadastrado!"
        )
    resultado = await adicionar_cliente(nome=cliente.nome, email=cliente.email,celular=cliente.celular, idade=cliente.idade, cep=cliente.cep, cpf=cliente.cpf, informacoes=cliente.informacoes, senha=cliente.senha)
    if "Erro" in resultado:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail=resultado)
    return {'message': f'Sucesso ao cadastrar o cliente: {cliente.nome}'}

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
        celular=prestador.celular,
        idade=prestador.idade,
        cep=prestador.cep,
        cpf=prestador.cpf,
        informacoes=prestador.informacoes,
        valor=prestador.valor,
        senha=prestador.senha,
        servicos=prestador.servicos,
        idiomas=prestador.idiomas,
        certificacoes=prestador.certificacoes
    )
    if "Erro" in resultado:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail=resultado)
    return {'message': f'Sucesso ao cadastrar o prestador: {prestador.nome}'}

# Rotas PATCH
@router.patch('/atualizar_cliente', tags=["PATCH"], status_code=status.HTTP_202_ACCEPTED, summary="Atualizando dados do cliente")
async def atualizar_cliente(cliente: AtualizarCliente):
    cliente_busca = await busca_especifica_cliente(cliente.id)
    collection_name = "cliente"
    if cliente_busca is None:
        raise HTTPException(detail="Cliente não encontrado", status_code=status.HTTP_404_NOT_FOUND)
    if cliente.nome is not None:
        await atualizar(collection_name,cliente.id, "nome", cliente.nome)
    if cliente.email is not None:
        await atualizar(collection_name,cliente.id, "email", cliente.email)
    if cliente.celular is not None:
        await atualizar(collection_name,cliente.id, "celular", cliente.celular)
    if cliente.idade is not None:
        await atualizar(collection_name,cliente.id, "idade", cliente.idade)
    if cliente.informacoes is not None:
        await atualizar(collection_name,cliente.id, "informacoes", cliente.informacoes)
    if cliente.senha is not None:
        await atualizar_senha(collection_name,cliente.id, cliente.senha)
    if cliente.cpf is not None:
        resultado_cpf = await atualizar_cpf(collection_name,cliente.id, cliente.cpf)
        if isinstance(resultado_cpf, dict) and "Erro" in resultado_cpf:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=resultado_cpf["Erro"])
    if cliente.cep is not None:
        resultado_cep = await atualizar_cep(collection_name,cliente.id, cliente.cep)
        if isinstance(resultado_cep, dict) and "Erro" in resultado_cep:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=resultado_cep["Erro"])
    cliente_atualizado = await busca_especifica_cliente(cliente.id)
    return cliente_atualizado

@router.patch('/atualizar_prestador', tags=["PATCH"], status_code=status.HTTP_202_ACCEPTED, summary="Atualizando dados do prestador")
async def atualizar_prestador(prestador: AtualizarPrestador):
    prestador_busca = await busca_especifica_prestador(prestador.id)
    collection_name = "prestador"
    if prestador_busca is None:
        raise HTTPException(detail="Cliente não encontrado", status_code=status.HTTP_404_NOT_FOUND)
    if prestador.nome is not None:
        await atualizar(collection_name,prestador.id, "nome", prestador.nome)
    if prestador.email is not None:
        await atualizar(collection_name,prestador.id, "email", prestador.email)
    if prestador.celular is not None:
        await atualizar(collection_name,prestador.id, "celular", prestador.celular)
    if prestador.idade is not None:
        await atualizar(collection_name,prestador.id, "idade", prestador.idade)
    if prestador.informacoes is not None:
        await atualizar(collection_name,prestador.id, "informacoes", prestador.informacoes)
    if prestador.valor is not None:
        await atualizar(collection_name,prestador.id, "valor", prestador.valor)
    if prestador.senha is not None:
        await atualizar_senha(collection_name,prestador.id, prestador.senha)
    if prestador.cpf is not None:
        resultado_cpf = await atualizar_cpf(collection_name,prestador.id, prestador.cpf)
        if isinstance(resultado_cpf, dict) and "Erro" in resultado_cpf:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=resultado_cpf["Erro"])
    if prestador.cep is not None:
        resultado_cep = await atualizar_cep(collection_name,prestador.id, prestador.cep)
        if isinstance(resultado_cep, dict) and "Erro" in resultado_cep:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=resultado_cep["Erro"])
    if prestador.servicos is not None:
            await atualizar(collection_name,prestador.id, "servicos", prestador.servicos)
    if prestador.idiomas is not None:
            await atualizar(collection_name,prestador.id, "idiomas", prestador.idiomas)
    if prestador.certificacoes is not None:
            await atualizar(collection_name,prestador.id, "certificados", prestador.certificacoes)
    prestador_atualizado = await busca_especifica_prestador(prestador.id)
    return prestador_atualizado

# Rotas DELETE
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
