from html import escape

ASSUNTO_CODIGO = 'Seu código de recuperação de senha - Hands'
ASSUNTO_BOAS_VINDAS = 'Bem-vindo(a) ao Hands!'
ASSUNTO_SENHA_ALTERADA = 'Sua senha foi alterada - Hands'
ASSUNTO_CONTA_EXCLUIDA = 'Sua conta no Hands foi excluída'

def _saudacao(nome: str | None) -> str:
    return f'Olá, {nome}!' if nome else 'Olá!'

def _html(saudacao: str, paragrafos: list[str], destaque: str | None = None, cor: str = '#5B2EFF') -> str:
    blocos = [f'<p style="margin:0 0 16px;font-size:14px;line-height:1.5;color:#4B5563;">{escape(p)}</p>' for p in paragrafos]
    if destaque:
        blocos.insert(1, f'<p style="margin:0 0 24px;text-align:center;font-size:34px;font-weight:bold;letter-spacing:10px;color:{cor};background:#F8F6FF;border-radius:12px;padding:16px;">{escape(destaque)}</p>')
    corpo = ''.join(blocos)
    return f"""<!DOCTYPE html>
<html lang="pt-BR">
<body style="margin:0;padding:0;background:#F3F4F6;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;">
        <tr><td style="background:{cor};padding:24px;text-align:center;color:#ffffff;font-size:24px;font-weight:bold;">Hands</td></tr>
        <tr><td style="padding:32px 28px;color:#1F2937;">
          <p style="margin:0 0 12px;font-size:16px;">{escape(saudacao)}</p>
          {corpo}
        </td></tr>
        <tr><td style="padding:16px 28px;background:#F9FAFB;text-align:center;font-size:12px;color:#9CA3AF;">Equipe Hands · Mensagem automática, não responda este e-mail.</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>"""

def _montar(assunto: str, nome: str | None, paragrafos: list[str], destaque: str | None = None, cor: str = '#5B2EFF') -> tuple[str, str, str]:
    saudacao = _saudacao(nome)
    partes = list(paragrafos)
    if destaque:
        partes.insert(1, destaque)
    texto = '\n\n'.join([saudacao, *partes, 'Equipe Hands'])
    return assunto, texto, _html(saudacao, paragrafos, destaque, cor)

def email_codigo_recuperacao(nome: str | None, codigo: str, validade_minutos: int) -> tuple[str, str, str]:
    return _montar(
        ASSUNTO_CODIGO, nome,
        [
            'Recebemos um pedido para redefinir a senha da sua conta no Hands. Use o código abaixo para continuar:',
            f'Ele é válido por {validade_minutos} minutos e só pode ser usado uma vez.',
            'Se você não fez esse pedido, ignore este e-mail: sua senha continua a mesma. Nunca compartilhe este código com ninguém.',
        ],
        codigo,
    )

def email_boas_vindas(nome: str | None, papel: str) -> tuple[str, str, str]:
    if papel == 'prestador':
        proximos = 'Mantenha seu perfil completo e atualizado para ser encontrado por mais clientes e receber avaliações.'
    else:
        proximos = 'Já pode buscar profissionais verificados da sua região, favoritar os seus preferidos e avaliá-los depois do serviço.'
    return _montar(
        ASSUNTO_BOAS_VINDAS, nome,
        [
            'Sua conta no Hands foi criada com sucesso. Que bom ter você com a gente!',
            proximos,
            'Se você não criou esta conta, responda ao nosso suporte para que possamos ajudar.',
        ],
    )

def email_senha_alterada(nome: str | None) -> tuple[str, str, str]:
    return _montar(
        ASSUNTO_SENHA_ALTERADA, nome,
        [
            'A senha da sua conta no Hands acabou de ser alterada.',
            'Se foi você, não precisa fazer nada. Se não reconhece essa alteração, use a opção "Esqueci minha senha" na tela de login para criar uma nova senha e confira se mais ninguém tem acesso ao seu e-mail.',
        ],
    )

def email_conta_excluida(nome: str | None) -> tuple[str, str, str]:
    return _montar(
        ASSUNTO_CONTA_EXCLUIDA, nome,
        [
            'Sua conta no Hands foi excluída e seus dados de perfil foram removidos da plataforma.',
            'Sentiremos sua falta. Se um dia quiser voltar, é só criar uma nova conta.',
            'Se você não pediu essa exclusão, entre em contato com o nosso suporte.',
        ],
        cor='#1F2937',
    )
