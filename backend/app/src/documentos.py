from io import BytesIO
from reportlab.lib.enums import TA_JUSTIFY
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import ListFlowable, ListItem, Paragraph, SimpleDocTemplate, Spacer

TITULO = 'Termos de Uso e Política de Privacidade'
TERMOS_VERSAO = '2026-10-22'

PARAGRAFOS = [
    (
        'O que é o Hands',
        'O Hands é uma plataforma de contatos que aproxima clientes e prestadores de serviços. '
        'Nosso papel se limita a divulgar perfis e facilitar o primeiro contato entre as partes. '
        'O Hands não é empregador, contratante, agenciador nem intermediário financeiro de nenhum '
        'serviço, e não participa da negociação, da execução, do pagamento ou da entrega do que for combinado.',
    ),
    (
        'Ausência de responsabilidade sobre os negócios',
        'Toda contratação é realizada diretamente entre cliente e prestador, por conta e risco deles. '
        'Por isso, o Hands não se responsabiliza por serviços mal executados, atrasos, cancelamentos, '
        'valores cobrados, descumprimento de acordos, danos materiais ou pessoais, nem por qualquer '
        'prejuízo decorrente de negócios feitos a partir da plataforma. Eventuais conflitos devem ser '
        'resolvidos entre as partes ou pelos meios legais cabíveis, como o Procon e o Poder Judiciário.',
    ),
    (
        'Informações e avaliações dos usuários',
        'Os dados dos perfis, os valores informados, os certificados e as avaliações são fornecidos pelos '
        'próprios usuários. O Hands não verifica nem garante a veracidade, a qualificação profissional ou '
        'a idoneidade de quem se cadastra, e as avaliações refletem a opinião de quem as escreveu, não a '
        'do Hands. Cada pessoa é responsável por conferir as informações antes de fechar qualquer serviço.',
    ),
]

RECOMENDACOES = [
    'Combine escopo, prazo e valor por escrito (por exemplo, pelo WhatsApp) antes de iniciar o serviço.',
    'Desconfie de pedidos de pagamento antecipado integral ou de transferências para terceiros.',
    'Prefira pagar somente após a conferência do serviço e peça recibo ou nota quando possível.',
    'Ao receber um profissional em casa, avise outra pessoa e confira a identidade dele.',
    'Nunca compartilhe senhas, códigos de verificação ou dados de cartão com ninguém pelo Hands.',
    'Para encontros e visitas, prefira horários comerciais e locais conhecidos.',
]

PRIVACIDADE = (
    'Coletamos apenas os dados necessários para o funcionamento da plataforma (nome, e-mail, telefone, '
    'CPF, CEP, foto e informações de perfil). Seu telefone é exibido para quem consulta o seu perfil, para '
    'permitir o contato. Seu CPF não é exibido a outros usuários. Você pode atualizar seus dados ou excluir '
    'a conta a qualquer momento. Tratamos os dados conforme a Lei Geral de Proteção de Dados (Lei 13.709/2018).'
)

CONDUTA = (
    'É proibido usar o Hands para fraudes, golpes, assédio, discriminação, informações falsas ou qualquer '
    'atividade ilegal. Contas que violarem estas regras podem ser removidas sem aviso prévio. Ao se cadastrar, '
    'você declara ser maior de 18 anos e concorda com estes termos.'
)

def gerar_pdf_termos() -> bytes:
    buffer = BytesIO()
    documento = SimpleDocTemplate(
        buffer, pagesize=A4, title=TITULO, author='Hands',
        leftMargin=2.5 * cm, rightMargin=2.5 * cm, topMargin=2.5 * cm, bottomMargin=2.5 * cm,
    )
    estilos = getSampleStyleSheet()
    titulo = ParagraphStyle('titulo', parent=estilos['Title'], fontSize=20, textColor='#5B2EFF', spaceAfter=6)
    subtitulo = ParagraphStyle('subtitulo', parent=estilos['Normal'], fontSize=10, textColor='#6B7280', alignment=1, spaceAfter=18)
    cabecalho = ParagraphStyle('cabecalho', parent=estilos['Heading2'], fontSize=13, textColor='#1F2937', spaceBefore=14, spaceAfter=6)
    corpo = ParagraphStyle('corpo', parent=estilos['Normal'], fontSize=11, leading=16, alignment=TA_JUSTIFY)

    elementos = [
        Paragraph(TITULO, titulo),
        Paragraph('Hands — plataforma de contatos para serviços', subtitulo),
    ]
    for indice, (nome, texto) in enumerate(PARAGRAFOS, start=1):
        elementos.append(Paragraph(f'{indice}. {nome}', cabecalho))
        elementos.append(Paragraph(texto, corpo))

    elementos.append(Paragraph('4. Recomendações de segurança', cabecalho))
    elementos.append(ListFlowable(
        [ListItem(Paragraph(item, corpo), leftIndent=14) for item in RECOMENDACOES],
        bulletType='bullet', start='•', leftIndent=14,
    ))
    elementos.append(Paragraph('5. Privacidade e proteção de dados', cabecalho))
    elementos.append(Paragraph(PRIVACIDADE, corpo))
    elementos.append(Paragraph('6. Conduta e uso da plataforma', cabecalho))
    elementos.append(Paragraph(CONDUTA, corpo))
    elementos.append(Spacer(1, 18))
    elementos.append(Paragraph('Ao marcar "Li e aceito" no cadastro, você confirma que leu e concorda com este documento.', subtitulo))

    documento.build(elementos)
    return buffer.getvalue()
