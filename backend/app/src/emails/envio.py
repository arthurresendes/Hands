import asyncio
import logging
import smtplib
import ssl
from email.message import EmailMessage
from email.utils import formataddr
from core.configs import settings

logger = logging.getLogger(__name__)

NOME_REMETENTE = 'Hands'

def email_configurado() -> bool:
    return bool(settings.EMAIL_REMETENTE and settings.EMAIL_SENHA)

def _montar_mensagem(destinatario: str, assunto: str, texto: str, html: str) -> EmailMessage:
    mensagem = EmailMessage()
    mensagem['From'] = formataddr((NOME_REMETENTE, settings.EMAIL_REMETENTE))
    mensagem['To'] = destinatario
    mensagem['Subject'] = assunto
    mensagem.set_content(texto)
    mensagem.add_alternative(html, subtype='html')
    return mensagem

def _enviar_sincrono(mensagem: EmailMessage):
    contexto = ssl.create_default_context()
    if settings.SMTP_PORT == 465:
        servidor = smtplib.SMTP_SSL(settings.SMTP_HOST, settings.SMTP_PORT, timeout=15, context=contexto)
    else:
        servidor = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=15)
    with servidor:
        if settings.SMTP_PORT != 465:
            servidor.starttls(context=contexto)
        servidor.login(settings.EMAIL_REMETENTE, settings.EMAIL_SENHA)
        servidor.send_message(mensagem)

async def enviar_email(destinatario: str, assunto: str, texto: str, html: str) -> bool:
    if not email_configurado():
        logger.warning('Envio de e-mail ignorado: EMAIL_REMETENTE/EMAIL_SENHA não configurados.')
        return False
    try:
        await asyncio.to_thread(_enviar_sincrono, _montar_mensagem(destinatario, assunto, texto, html))
    except Exception:
        logger.exception('Falha ao enviar e-mail para %s', destinatario)
        return False
    return True
