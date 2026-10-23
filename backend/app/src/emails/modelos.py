from html import escape

ASSUNTO_CODIGO = 'Seu código de recuperação de senha - Hands'

def email_codigo_recuperacao(nome: str | None, codigo: str, validade_minutos: int) -> tuple[str, str, str]:
    saudacao = f'Olá, {nome}!' if nome else 'Olá!'
    texto = (
        f'{saudacao}\n\n'
        'Recebemos um pedido para redefinir a senha da sua conta no Hands.\n\n'
        f'Seu código de verificação é: {codigo}\n\n'
        f'Ele é válido por {validade_minutos} minutos e só pode ser usado uma vez.\n\n'
        'Se você não fez esse pedido, ignore este e-mail: sua senha continua a mesma.\n'
        'Por segurança, nunca compartilhe este código com ninguém.\n\n'
        'Equipe Hands'
    )
    html = f"""<!DOCTYPE html>
<html lang="pt-BR">
<body style="margin:0;padding:0;background:#F3F4F6;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border-radius:16px;overflow:hidden;">
        <tr><td style="background:#5B2EFF;padding:24px;text-align:center;color:#ffffff;font-size:24px;font-weight:bold;">Hands</td></tr>
        <tr><td style="padding:32px 28px;color:#1F2937;">
          <p style="margin:0 0 12px;font-size:16px;">{escape(saudacao)}</p>
          <p style="margin:0 0 24px;font-size:14px;line-height:1.5;color:#4B5563;">
            Recebemos um pedido para redefinir a senha da sua conta. Use o código abaixo para continuar:
          </p>
          <p style="margin:0 0 24px;text-align:center;font-size:34px;font-weight:bold;letter-spacing:10px;color:#5B2EFF;background:#F8F6FF;border-radius:12px;padding:16px;">{escape(codigo)}</p>
          <p style="margin:0 0 8px;font-size:13px;color:#4B5563;">Válido por <b>{validade_minutos} minutos</b> e utilizável uma única vez.</p>
          <p style="margin:0;font-size:13px;color:#4B5563;">Se você não fez esse pedido, ignore este e-mail: sua senha continua a mesma. Nunca compartilhe este código com ninguém.</p>
        </td></tr>
        <tr><td style="padding:16px 28px;background:#F9FAFB;text-align:center;font-size:12px;color:#9CA3AF;">Equipe Hands · Mensagem automática, não responda este e-mail.</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>"""
    return ASSUNTO_CODIGO, texto, html
