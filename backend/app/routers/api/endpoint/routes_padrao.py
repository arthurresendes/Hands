from fastapi import APIRouter,status,HTTPException,Request,Depends,Form,File,UploadFile,Response,Query
from bson import ObjectId
from bson.errors import InvalidId
from fastapi.responses import FileResponse
from datetime import datetime, timezone
import logging
from src.mongo.query import listagem_clientes,listagem_prestadores,deletar_por_email, busca_especifica_cliente,busca_especifica_prestador,atualizar,atualizar_senha,atualizar_cpf,atualizar_cep,avaliar_hands, listagem_avaliacoes_hands,avaliar_pessoas,listagem_avaliacoes_clientes,listagem_avaliacoes_prestadores,ver_avaliacoes_recebidas,ver_avaliacoes_entregues,total_prestadores,total_clientes,estatisticas_landing,categorias_populares,prestadores_destaque,avaliacoes_hands_landing
from src.mongo.criacao import adicionar_cliente,adicionar_prestador
from schemas.Cadastro import Cliente,Prestador
from schemas.Atualizar import AtualizarCliente,AtualizarPrestador
from schemas.Avaliar import Avaliacao,AvaliacaoPessoas
from schemas.Favorito import Favorito
from core.database import cliente_col,prestador_col,favorito_col
from core.security import verificar_senha
from src.mongo.busca_clientes import buscar_clientes,detalhe_cliente,perfil_prestador,avaliacoes_recebidas_prestador
from src.mongo.busca import buscar_prestadores,detalhe_prestador,listar_favoritos,favoritar,desfavoritar,perfil_cliente,minha_avaliacao_hands
from src.mongo.admin import dashboard_admin,listar_clientes_admin,listar_prestadores_admin,listar_avaliacoes_hands_admin,exportar_clientes_csv,exportar_prestadores_csv,exportar_avaliacoes_hands_csv
from core.auth import criar_token_acesso,setar_cookie_acesso
from core.deps import exigir_usuario,get_token_payload,obter_token_do_cookie
from src.documentos import gerar_pdf_termos, TERMOS_VERSAO
from src.armazenamento import preparar_foto,salvar_foto,caminho_foto,remover_foto

router = APIRouter(prefix="/api/v1")

COLECOES_ATUALIZAVEIS = {'cliente': cliente_col, 'prestador': prestador_col}

async def validar_alteracoes_sensiveis(papel: str, id_usuario: str, email_novo, senha_nova, senha_atual, usuario: dict, email_atual: str):
    if email_novo is not None and email_novo.strip() != email_atual:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Não é possível alterar o e-mail da conta.")
    if senha_nova is None:
        return
    if len(senha_nova) < 6:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="A nova senha deve ter pelo menos 6 caracteres.")
    if usuario['role'] == 'admin':
        return
    if not senha_atual:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Informe a senha atual para trocar a senha.")
    try:
        documento = await COLECOES_ATUALIZAVEIS[papel].find_one({'_id': ObjectId(id_usuario)}, {'senha': 1})
    except InvalidId:
        documento = None
    if documento is None or not verificar_senha(senha_atual, documento['senha']):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Senha atual incorreta.")
    if senha_nova == senha_atual:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="A nova senha deve ser diferente da senha atual.")

IDADE_MINIMA = 18
IDADE_MAXIMA = 100

logger = logging.getLogger(__name__)

def registrar_aceite_termos(aceite: bool) -> dict:
    if not aceite:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="É necessário aceitar os Termos de Uso e a Política de Privacidade para criar a conta.")
    return {'versao': TERMOS_VERSAO, 'data': datetime.now(timezone.utc)}

def validar_idade(idade: int | None):
    if idade is None:
        return
    if idade < IDADE_MINIMA:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"É necessário ter {IDADE_MINIMA} anos ou mais para usar o Hands.")
    if idade > IDADE_MAXIMA:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Informe uma idade válida.")

def garantir_dono_ou_admin(usuario: dict, email: str):
    if usuario['role'] != 'admin' and usuario.get('email') != email.strip():
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Você não tem permissão para acessar este recurso.")

# Rotas GET

def resposta_csv(conteudo: str, nome: str) -> Response:
    arquivo = f"{nome}-{datetime.now().strftime('%Y%m%d')}.csv"
    return Response(
        content=conteudo.encode('utf-8'),
        media_type='text/csv; charset=utf-8',
        headers={'Content-Disposition': f'attachment; filename="{arquivo}"'}
    )

@router.get('/termos-de-uso', tags=['GET'], status_code=status.HTTP_200_OK, summary='Termos de uso e política de privacidade em PDF')
async def baixar_termos_de_uso():
    return Response(
        content=gerar_pdf_termos(),
        media_type='application/pdf',
        headers={'Content-Disposition': 'attachment; filename="termos-de-uso-hands.pdf"'}
    )

@router.get('/admin/dashboard', tags=['ADMIN'], status_code=status.HTTP_200_OK, summary='Indicadores do dashboard do admin')
async def admin_dashboard(usuario: dict = Depends(exigir_usuario('admin'))):
    return await dashboard_admin()

@router.get('/admin/clientes', tags=['ADMIN'], status_code=status.HTTP_200_OK, summary='Listagem de clientes para o admin')
async def admin_clientes(
    q: str | None = Query(None, max_length=100),
    cidade: str | None = Query(None, max_length=60),
    estado: str | None = Query(None, max_length=2),
    cadastro_de: str | None = Query(None, pattern=r'^\d{4}-\d{2}-\d{2}$'),
    cadastro_ate: str | None = Query(None, pattern=r'^\d{4}-\d{2}-\d{2}$'),
    ordenar: str | None = Query(None, pattern='^(recentes|antigos|nome)$'),
    pagina: int = Query(1, ge=1),
    limite: int = Query(10, ge=1, le=100),
    usuario: dict = Depends(exigir_usuario('admin')),
):
    return await listar_clientes_admin(q, cidade, estado, cadastro_de, cadastro_ate, ordenar, pagina, limite)

@router.get('/admin/clientes/exportar', tags=['ADMIN'], status_code=status.HTTP_200_OK, summary='Exportar todos os clientes filtrados em CSV')
async def admin_exportar_clientes(
    q: str | None = Query(None, max_length=100),
    cidade: str | None = Query(None, max_length=60),
    estado: str | None = Query(None, max_length=2),
    cadastro_de: str | None = Query(None, pattern=r'^\d{4}-\d{2}-\d{2}$'),
    cadastro_ate: str | None = Query(None, pattern=r'^\d{4}-\d{2}-\d{2}$'),
    ordenar: str | None = Query(None, pattern='^(recentes|antigos|nome)$'),
    usuario: dict = Depends(exigir_usuario('admin')),
):
    return resposta_csv(await exportar_clientes_csv(q, cidade, estado, cadastro_de, cadastro_ate, ordenar), 'clientes')

@router.get('/admin/prestadores', tags=['ADMIN'], status_code=status.HTTP_200_OK, summary='Listagem de prestadores para o admin')
async def admin_prestadores(
    q: str | None = Query(None, max_length=100),
    servico: str | None = Query(None, max_length=60),
    cidade: str | None = Query(None, max_length=60),
    estado: str | None = Query(None, max_length=2),
    nota_minima: float | None = Query(None, ge=0, le=5),
    cadastro_de: str | None = Query(None, pattern=r'^\d{4}-\d{2}-\d{2}$'),
    cadastro_ate: str | None = Query(None, pattern=r'^\d{4}-\d{2}-\d{2}$'),
    ordenar: str | None = Query(None, pattern='^(recentes|antigos|nome|nota)$'),
    pagina: int = Query(1, ge=1),
    limite: int = Query(10, ge=1, le=100),
    usuario: dict = Depends(exigir_usuario('admin')),
):
    return await listar_prestadores_admin(q, servico, cidade, estado, nota_minima, cadastro_de, cadastro_ate, ordenar, pagina, limite)

@router.get('/admin/prestadores/exportar', tags=['ADMIN'], status_code=status.HTTP_200_OK, summary='Exportar todos os prestadores filtrados em CSV')
async def admin_exportar_prestadores(
    q: str | None = Query(None, max_length=100),
    servico: str | None = Query(None, max_length=60),
    cidade: str | None = Query(None, max_length=60),
    estado: str | None = Query(None, max_length=2),
    nota_minima: float | None = Query(None, ge=0, le=5),
    cadastro_de: str | None = Query(None, pattern=r'^\d{4}-\d{2}-\d{2}$'),
    cadastro_ate: str | None = Query(None, pattern=r'^\d{4}-\d{2}-\d{2}$'),
    ordenar: str | None = Query(None, pattern='^(recentes|antigos|nome|nota)$'),
    usuario: dict = Depends(exigir_usuario('admin')),
):
    return resposta_csv(await exportar_prestadores_csv(q, servico, cidade, estado, nota_minima, cadastro_de, cadastro_ate, ordenar), 'prestadores')

@router.get('/admin/avaliacoes-hands', tags=['ADMIN'], status_code=status.HTTP_200_OK, summary='Avaliações do Hands para o admin')
async def admin_avaliacoes_hands(
    papel: str | None = Query(None, pattern='^(cliente|prestador)$'),
    q: str | None = Query(None, max_length=100),
    nota: float | None = Query(None, ge=1, le=5),
    pagina: int = Query(1, ge=1),
    limite: int = Query(10, ge=1, le=100),
    usuario: dict = Depends(exigir_usuario('admin')),
):
    return await listar_avaliacoes_hands_admin(papel, q, nota, pagina, limite)

@router.get('/admin/avaliacoes-hands/exportar', tags=['ADMIN'], status_code=status.HTTP_200_OK, summary='Exportar todas as avaliações do Hands em CSV')
async def admin_exportar_avaliacoes_hands(
    papel: str | None = Query(None, pattern='^(cliente|prestador)$'),
    q: str | None = Query(None, max_length=100),
    nota: float | None = Query(None, ge=1, le=5),
    usuario: dict = Depends(exigir_usuario('admin')),
):
    return resposta_csv(await exportar_avaliacoes_hands_csv(papel, q, nota), 'avaliacoes-hands')

@router.get('/', tags=['GET'], status_code=status.HTTP_200_OK, summary='Rota base do projeto')
async def rota_base():
    return {'Projeto': 'Hands - Marktplace de serviços'}

@router.get('/ver_todos_clientes', tags=['GET'], status_code=status.HTTP_200_OK, summary='Ver todos os clientes cadastrados')
async def ver_todos_clientes(usuario: dict = Depends(exigir_usuario('admin'))):
    result = await listagem_clientes()
    return {'clientes': result}

@router.get('/ver_todos_prestadores', tags=['GET'], status_code=status.HTTP_200_OK, summary='Ver todos os prestadores cadastrados')
async def ver_todos_prestadores(usuario: dict = Depends(exigir_usuario())):
    result = await listagem_prestadores()
    return {'prestadores': result}

@router.get("/total_clientes", tags=["GET"], status_code=status.HTTP_200_OK, summary='Ver total de clientes na plataforma')
async def ver_total_cliente_api():
    total = await total_clientes()
    return {"totalClientes": total}

@router.get("/total_prestadores", tags=["GET"], status_code=status.HTTP_200_OK, summary='Ver total de prestadores na plataforma')
async def ver_total_prestadores_api():
    total = await total_prestadores()
    return {"totalPrestadores": total}

@router.get('/prestadores', tags=['GET'], status_code=status.HTTP_200_OK, summary='Buscar prestadores com filtros')
async def buscar_prestadores_endpoint(
    q: str | None = Query(None, max_length=100),
    nome: str | None = Query(None, max_length=100),
    email: str | None = Query(None, max_length=100),
    servico: str | None = Query(None, max_length=60),
    cidade: str | None = Query(None, max_length=60),
    estado: str | None = Query(None, max_length=2),
    idioma: str | None = Query(None, max_length=40),
    cep: str | None = Query(None, max_length=10),
    raio_km: float | None = Query(None, gt=0, le=500),
    nota_minima: float | None = Query(None, ge=0, le=5),
    valor_min: float | None = Query(None, ge=0),
    valor_max: float | None = Query(None, ge=0),
    somente_favoritos: bool = False,
    ordenar: str | None = Query(None, pattern='^(relevancia|nota|preco|nome|distancia|avaliacoes)$'),
    pagina: int = Query(1, ge=1),
    limite: int = Query(12, ge=1, le=50),
    usuario: dict = Depends(exigir_usuario('cliente','admin')),
):
    return await buscar_prestadores(
        usuario.get('email'), q=q, nome=nome, email=email, servico=servico, cidade=cidade, estado=estado,
        idioma=idioma, cep=cep, raio_km=raio_km, nota_minima=nota_minima, valor_min=valor_min,
        valor_max=valor_max, somente_favoritos=somente_favoritos, ordenar=ordenar, pagina=pagina, limite=limite
    )

@router.get('/prestadores/{id_prestador}', tags=['GET'], status_code=status.HTTP_200_OK, summary='Perfil completo de um prestador')
async def ver_prestador(id_prestador: str, usuario: dict = Depends(exigir_usuario('cliente','admin'))):
    return await detalhe_prestador(id_prestador, usuario.get('email'))

@router.get('/clientes', tags=['GET'], status_code=status.HTTP_200_OK, summary='Buscar clientes com filtros')
async def buscar_clientes_endpoint(
    q: str | None = Query(None, max_length=100),
    nome: str | None = Query(None, max_length=100),
    email: str | None = Query(None, max_length=100),
    cidade: str | None = Query(None, max_length=60),
    estado: str | None = Query(None, max_length=2),
    cep: str | None = Query(None, max_length=10),
    raio_km: float | None = Query(None, gt=0, le=500),
    nota_minima: float | None = Query(None, ge=0, le=5),
    somente_avaliados: bool = False,
    ordenar: str | None = Query(None, pattern='^(relevancia|nota|nome|distancia|avaliacoes)$'),
    pagina: int = Query(1, ge=1),
    limite: int = Query(12, ge=1, le=50),
    usuario: dict = Depends(exigir_usuario('prestador','admin')),
):
    return await buscar_clientes(
        usuario.get('email'), q=q, nome=nome, email=email, cidade=cidade, estado=estado, cep=cep,
        raio_km=raio_km, nota_minima=nota_minima, somente_avaliados=somente_avaliados,
        ordenar=ordenar, pagina=pagina, limite=limite
    )

@router.get('/clientes/{id_cliente}', tags=['GET'], status_code=status.HTTP_200_OK, summary='Perfil completo de um cliente')
async def ver_cliente(id_cliente: str, usuario: dict = Depends(exigir_usuario('prestador','admin'))):
    return await detalhe_cliente(id_cliente, usuario.get('email'))

@router.get('/prestador/perfil', tags=['GET'], status_code=status.HTTP_200_OK, summary='Dados do perfil do prestador logado')
async def ver_perfil_prestador(usuario: dict = Depends(exigir_usuario('prestador'))):
    return await perfil_prestador(usuario['id'])

@router.get('/prestador/avaliacoes', tags=['GET'], status_code=status.HTTP_200_OK, summary='Avaliações recebidas pelo prestador logado')
async def ver_avaliacoes_do_prestador(
    pagina: int = Query(1, ge=1),
    limite: int = Query(10, ge=1, le=50),
    usuario: dict = Depends(exigir_usuario('prestador')),
):
    return await avaliacoes_recebidas_prestador(usuario['email'], pagina, limite)

@router.get('/favoritos', tags=['GET'], status_code=status.HTTP_200_OK, summary='Prestadores favoritos do cliente')
async def ver_favoritos(usuario: dict = Depends(exigir_usuario('cliente'))):
    return {'prestadores': await listar_favoritos(usuario['email'])}

@router.get('/cliente/perfil', tags=['GET'], status_code=status.HTTP_200_OK, summary='Dados do perfil do cliente logado')
async def ver_perfil_cliente(usuario: dict = Depends(exigir_usuario('cliente'))):
    return await perfil_cliente(usuario['id'])

@router.get('/avaliar_hands/minha', tags=['GET'], status_code=status.HTTP_200_OK, summary='Minha avaliação do Hands')
async def ver_minha_avaliacao_hands(usuario: dict = Depends(exigir_usuario('cliente','prestador'))):
    return {'avaliacao': await minha_avaliacao_hands(usuario['email'])}

@router.get('/ver_avaliacoes_hands', tags=['GET'], status_code=status.HTTP_200_OK, summary='Ver todas avaliações')
async def ver_avaliacoes_hands(usuario: dict = Depends(exigir_usuario('admin'))):
    result = await listagem_avaliacoes_hands()
    return {'avaliacoes': result}

@router.get('/ver_avaliacoes_clientes', tags=['GET'], status_code=status.HTTP_200_OK, summary='Ver todas avaliações clientes')
async def ver_avaliacoes_clientes(usuario: dict = Depends(exigir_usuario('admin'))):
    result = await listagem_avaliacoes_clientes()
    return {'avaliacoes': result}

@router.get('/ver_avaliacoes_prestadores', tags=['GET'], status_code=status.HTTP_200_OK, summary='Ver todas avaliações prestadores')
async def ver_avaliacoes_prestadores(usuario: dict = Depends(exigir_usuario('admin'))):
    result = await listagem_avaliacoes_prestadores()
    return {'avaliacoes': result}

@router.get('/ver_minhas_avaliacoes_cliente/{email}', tags=['GET'], status_code=status.HTTP_200_OK, summary='Ver avaliações recebidas (cliente)')
async def ver_minhas_avaliacoes_cliente(email:str, usuario: dict = Depends(exigir_usuario())):
    result,total_avaliacoes = await ver_avaliacoes_recebidas('feedback_cliente',email)
    return {'avaliacoes_recebidas': result, 'total':total_avaliacoes}

@router.get('/ver_minhas_avaliacoes_prestador/{email}', tags=['GET'], status_code=status.HTTP_200_OK, summary='Ver avaliações recebidas (prestador)')
async def ver_minhas_avaliacoes_prestador(email:str, usuario: dict = Depends(exigir_usuario())):
    result,total_avaliacoes = await ver_avaliacoes_recebidas('feedback_prestador',email)
    return {'avaliacoes_recebidas': result,'total':total_avaliacoes }

@router.get('/ver_avaliacoes_preenchidas_cliente/{email}', tags=['GET'], status_code=status.HTTP_200_OK, summary='Ver avaliações feitas (cliente)')
async def ver_avaliacoes_preenchidas_cliente(email:str, usuario: dict = Depends(exigir_usuario('cliente','admin'))):
    garantir_dono_ou_admin(usuario, email)
    result,total_avaliacoes = await ver_avaliacoes_entregues('feedback_cliente',email)
    return {'avaliacoes_recebidas': result, 'total':total_avaliacoes}

@router.get('/ver_avaliacoes_preenchidas_prestador/{email}', tags=['GET'], status_code=status.HTTP_200_OK, summary='Ver avaliações recebidas (prestador)')
async def ver_avaliacoes_preenchidas_prestador(email:str, usuario: dict = Depends(exigir_usuario('prestador','admin'))):
    garantir_dono_ou_admin(usuario, email)
    result,total_avaliacoes = await ver_avaliacoes_entregues('feedback_prestador',email)
    return {'avaliacoes_recebidas': result,'total':total_avaliacoes }

@router.get('/landing/estatisticas', tags=['GET'], status_code=status.HTTP_200_OK, summary='Estatísticas da página inicial')
async def landing_estatisticas():
    return await estatisticas_landing()

@router.get('/landing/categorias', tags=['GET'], status_code=status.HTTP_200_OK, summary='Categorias mais populares da página inicial')
async def landing_categorias():
    result = await categorias_populares()
    return {'categorias': result}

@router.get('/landing/prestadores_destaque', tags=['GET'], status_code=status.HTTP_200_OK, summary='Prestadores em destaque da página inicial')
async def landing_prestadores_destaque():
    result = await prestadores_destaque()
    return {'prestadores': result}

@router.get('/landing/avaliacoes_hands', tags=['GET'], status_code=status.HTTP_200_OK, summary='Resumo e últimas avaliações do Hands para a página inicial')
async def landing_avaliacoes_hands():
    return await avaliacoes_hands_landing()

@router.get('/foto/{papel}/{id_usuario}', tags=['GET'], status_code=status.HTTP_200_OK, summary='Foto de perfil de cliente ou prestador')
async def ver_foto(papel: str, id_usuario: str, request: Request):
    if papel == 'cliente':
        await get_token_payload(await obter_token_do_cookie(request))
    caminho = caminho_foto(papel, id_usuario)
    if caminho is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Foto não encontrada.")
    return FileResponse(caminho, media_type='image/jpeg', headers={'Cache-Control': 'no-cache'})

# Rotas POST
@router.post('/cadastrar_cliente', tags=["POST"], status_code=status.HTTP_201_CREATED, summary='Cadastro de clientes')
async def cadastro_cliente(
    response: Response,
    nome: str = Form(..., min_length=1),
    email: str = Form(..., min_length=3),
    celular: str = Form(..., min_length=1),
    idade: int = Form(...),
    cep: str = Form(..., min_length=8),
    cpf: str = Form(..., min_length=11),
    informacoes: str = Form(''),
    senha: str = Form(..., min_length=6),
    aceite_termos: bool = Form(False),
    foto: UploadFile | None = File(None),
):
    validar_idade(idade)
    aceite = registrar_aceite_termos(aceite_termos)
    email = email.strip()
    foto_pronta = await preparar_foto(foto)
    check_user = await cliente_col.find_one({'email': email})
    if check_user is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Cliente com esse e-mail já cadastrado!"
        )
    resultado = await adicionar_cliente(nome=nome, email=email, celular=celular, idade=idade, cep=cep, cpf=cpf, informacoes=informacoes, senha=senha, aceite_termos=aceite)
    if "Erro" in resultado:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail=resultado['Erro'])
    if foto_pronta is not None:
        salvar_foto('cliente', resultado['id'], foto_pronta)
    setar_cookie_acesso(response, criar_token_acesso(sub=resultado['id'], role='cliente'))
    return {'message': f'Sucesso ao cadastrar o cliente: {nome}', 'id': resultado['id'], 'role': 'cliente'}

@router.post('/cadastrar_prestador', tags=["POST"], status_code=status.HTTP_201_CREATED, summary='Cadastro de prestador')
async def cadastro_prestador(
    response: Response,
    nome: str = Form(..., min_length=1),
    email: str = Form(..., min_length=3),
    celular: str = Form(..., min_length=1),
    idade: int = Form(...),
    cep: str = Form(..., min_length=8),
    cpf: str = Form(..., min_length=11),
    informacoes: str = Form(''),
    valor: float = Form(..., ge=0),
    senha: str = Form(..., min_length=6),
    servicos: list[str] = Form(...),
    idiomas: list[str] = Form([]),
    certificacoes: list[str] = Form([]),
    aceite_termos: bool = Form(False),
    foto: UploadFile | None = File(None),
):
    validar_idade(idade)
    aceite = registrar_aceite_termos(aceite_termos)
    email = email.strip()
    if not servicos:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Selecione o serviço oferecido.")
    foto_pronta = await preparar_foto(foto)
    check_user = await prestador_col.find_one({'email': email})
    if check_user is not None:
        raise HTTPException(
        status_code=status.HTTP_409_CONFLICT, detail="Prestador com esse email já cadastrado!"
        )
    resultado = await adicionar_prestador(
        nome=nome,
        email=email,
        celular=celular,
        idade=idade,
        cep=cep,
        cpf=cpf,
        informacoes=informacoes,
        valor=valor,
        senha=senha,
        servicos=servicos,
        idiomas=idiomas,
        certificacoes=certificacoes or None,
        aceite_termos=aceite
    )
    if "Erro" in resultado:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail=resultado['Erro'])
    if foto_pronta is not None:
        salvar_foto('prestador', resultado['id'], foto_pronta)
    setar_cookie_acesso(response, criar_token_acesso(sub=resultado['id'], role='prestador'))
    return {'message': f'Sucesso ao cadastrar o prestador: {nome}', 'id': resultado['id'], 'role': 'prestador'}

@router.post('/foto', tags=["POST"], status_code=status.HTTP_201_CREATED, summary='Enviar ou trocar a foto do usuário logado')
async def enviar_foto(foto: UploadFile = File(...), usuario: dict = Depends(exigir_usuario('cliente','prestador'))):
    foto_pronta = await preparar_foto(foto)
    if foto_pronta is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Envie uma imagem válida (JPG, PNG ou WEBP).")
    salvar_foto(usuario['role'], usuario['id'], foto_pronta)
    return {'message': 'Foto atualizada com sucesso.'}

@router.post("/avaliar_hands", tags=["POST"], summary="Avaliar o hands", status_code=status.HTTP_201_CREATED)
async def avaliar_hands_endpoint(avaliar: Avaliacao, usuario: dict = Depends(exigir_usuario('cliente','prestador'))):
    res = await avaliar_hands(usuario['email'],avaliar.facilidade, avaliar.qualidade, avaliar.confiabilidade ,avaliar.notaGeral, avaliar.mensagem)
    return {'id_resultado': str(res)}

@router.post("/avaliar_prestador", tags=["POST"], summary="Avaliar prestadores", status_code=status.HTTP_201_CREATED)
async def avaliar_prestador(avaliar: AvaliacaoPessoas, usuario: dict = Depends(exigir_usuario('cliente'))):
    if await prestador_col.find_one({'email': avaliar.para.strip()}, {'_id': 1}) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Prestador não encontrado.")
    res = await avaliar_pessoas("feedback_prestador", usuario['email'], avaliar.para.strip(),  avaliar.nota, avaliar.mensagem.strip())
    return {'id_resultado': str(res)}

@router.post("/avaliar_clientes", tags=["POST"], summary="Avaliar clientes", status_code=status.HTTP_201_CREATED)
async def avaliar_clientes(avaliar: AvaliacaoPessoas, usuario: dict = Depends(exigir_usuario('prestador'))):
    if await cliente_col.find_one({'email': avaliar.para.strip()}, {'_id': 1}) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cliente não encontrado.")
    res = await avaliar_pessoas("feedback_cliente", usuario['email'], avaliar.para.strip(),  avaliar.nota, avaliar.mensagem.strip())
    return {'id_resultado': str(res)}

@router.post('/favoritos', tags=["POST"], status_code=status.HTTP_201_CREATED, summary='Favoritar prestador pelo e-mail')
async def adicionar_favorito(favorito: Favorito, usuario: dict = Depends(exigir_usuario('cliente'))):
    await favoritar(usuario['email'], favorito.email)
    return {'favorito': True}

# Rotas PATCH
@router.patch('/atualizar_cliente', tags=["PATCH"], status_code=status.HTTP_202_ACCEPTED, summary="Atualizando dados do cliente")
async def atualizar_cliente(cliente: AtualizarCliente, usuario: dict = Depends(exigir_usuario('cliente','admin'))):
    if usuario['role'] != 'admin' and cliente.id != usuario['id']:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Você não tem permissão para acessar este recurso.")
    cliente_busca = await busca_especifica_cliente(cliente.id)
    collection_name = "cliente"
    if cliente_busca is None:
        raise HTTPException(detail="Cliente não encontrado", status_code=status.HTTP_404_NOT_FOUND)
    validar_idade(cliente.idade)
    await validar_alteracoes_sensiveis(collection_name, cliente.id, cliente.email, cliente.senha, cliente.senha_atual, usuario, cliente_busca['email'])
    if cliente.cpf is not None:
        resultado_cpf = await atualizar_cpf(collection_name,cliente.id, cliente.cpf)
        if isinstance(resultado_cpf, dict) and "Erro" in resultado_cpf:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=resultado_cpf["Erro"])
    if cliente.cep is not None:
        resultado_cep = await atualizar_cep(collection_name,cliente.id, cliente.cep)
        if isinstance(resultado_cep, dict) and "Erro" in resultado_cep:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=resultado_cep["Erro"])
    if cliente.nome is not None:
        await atualizar(collection_name,cliente.id, "nome", cliente.nome)
    if cliente.celular is not None:
        await atualizar(collection_name,cliente.id, "celular", cliente.celular)
    if cliente.idade is not None:
        await atualizar(collection_name,cliente.id, "idade", cliente.idade)
    if cliente.informacoes is not None:
        await atualizar(collection_name,cliente.id, "informacoes", cliente.informacoes)
    if cliente.senha is not None:
        await atualizar_senha(collection_name,cliente.id, cliente.senha)
    cliente_atualizado = await busca_especifica_cliente(cliente.id)
    return cliente_atualizado

@router.patch('/atualizar_prestador', tags=["PATCH"], status_code=status.HTTP_202_ACCEPTED, summary="Atualizando dados do prestador")
async def atualizar_prestador(prestador: AtualizarPrestador, usuario: dict = Depends(exigir_usuario('prestador','admin'))):
    if usuario['role'] != 'admin' and prestador.id != usuario['id']:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Você não tem permissão para acessar este recurso.")
    prestador_busca = await busca_especifica_prestador(prestador.id)
    collection_name = "prestador"
    if prestador_busca is None:
        raise HTTPException(detail="Prestador não encontrado", status_code=status.HTTP_404_NOT_FOUND)
    validar_idade(prestador.idade)
    await validar_alteracoes_sensiveis(collection_name, prestador.id, prestador.email, prestador.senha, prestador.senha_atual, usuario, prestador_busca['email'])
    if prestador.servicos is not None and not [servico for servico in prestador.servicos if servico.strip()]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Selecione ao menos um serviço oferecido.")
    if prestador.valor is not None and prestador.valor < 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="O valor do serviço não pode ser negativo.")
    if prestador.cpf is not None:
        resultado_cpf = await atualizar_cpf(collection_name,prestador.id, prestador.cpf)
        if isinstance(resultado_cpf, dict) and "Erro" in resultado_cpf:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=resultado_cpf["Erro"])
    if prestador.cep is not None:
        resultado_cep = await atualizar_cep(collection_name,prestador.id, prestador.cep)
        if isinstance(resultado_cep, dict) and "Erro" in resultado_cep:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=resultado_cep["Erro"])
    if prestador.nome is not None:
        await atualizar(collection_name,prestador.id, "nome", prestador.nome)
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
    if prestador.servicos is not None:
        await atualizar(collection_name,prestador.id, "servicos", [servico.strip() for servico in prestador.servicos if servico.strip()])
    if prestador.idiomas is not None:
        await atualizar(collection_name,prestador.id, "idiomas", [idioma.strip() for idioma in prestador.idiomas if idioma.strip()])
    if prestador.certificacoes is not None:
        await atualizar(collection_name,prestador.id, "certificados", [c.strip() for c in prestador.certificacoes if c.strip()])
    prestador_atualizado = await busca_especifica_prestador(prestador.id)
    return prestador_atualizado

# Rotas DELETE
@router.delete('/favoritos/{email_prestador}', tags=["DELETE"], status_code=status.HTTP_200_OK, summary='Remover prestador dos favoritos')
async def remover_favorito(email_prestador: str, usuario: dict = Depends(exigir_usuario('cliente'))):
    await desfavoritar(usuario['email'], email_prestador)
    return {'favorito': False}

@router.delete('/deletar_prestador/{email}', tags=["DELETE"], status_code=status.HTTP_204_NO_CONTENT, summary="Deletando prestador por email")
async def deletar_prestador(email: str, usuario: dict = Depends(exigir_usuario('prestador','admin'))):
    garantir_dono_ou_admin(usuario, email)
    try:
        alvo = await prestador_col.find_one({'email': email.strip()}, {'_id': 1})
        resultado = await deletar_por_email('prestador', email)
        if alvo is not None:
            remover_foto('prestador', str(alvo['_id']))
        await favorito_col.delete_many({'prestador': email.strip()})
        return resultado
    except HTTPException:
        raise 
    except Exception as error:
        logger.exception('Falha ao excluir conta')
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Não foi possível excluir a conta agora. Tente novamente em instantes."
        )

@router.delete('/deletar_cliente/{email}', tags=["DELETE"], status_code=status.HTTP_204_NO_CONTENT, summary="Deletando cliente por email")
async def deletar_cliente(email: str, usuario: dict = Depends(exigir_usuario('cliente','admin'))):
    garantir_dono_ou_admin(usuario, email)
    try:
        alvo = await cliente_col.find_one({'email': email.strip()}, {'_id': 1})
        resultado = await deletar_por_email('cliente', email)
        if alvo is not None:
            remover_foto('cliente', str(alvo['_id']))
        await favorito_col.delete_many({'cliente': email.strip()})
    except HTTPException:
        raise
    except Exception as error:
        logger.exception('Falha ao excluir conta')
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Não foi possível excluir a conta agora. Tente novamente em instantes."
        )
