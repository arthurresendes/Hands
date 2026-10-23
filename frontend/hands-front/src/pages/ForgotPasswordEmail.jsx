import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import Aviso from '../components/Aviso'
import BotaoPrimario from '../components/BotaoPrimario'
import FormField from '../components/FormField'
import { MailIcon } from '../components/icons'
import useRecuperacaoSenha from '../hooks/useRecuperacaoSenha'
import { solicitarCodigoRecuperacao } from '../api/post/recuperacao/solicitarCodigoRecuperacao'
import { caminhoCodigo } from '../utils/recuperacaoSenha'

export default function ForgotPasswordEmail() {
  const navigate = useNavigate()
  const { config } = useRecuperacaoSenha()
  const [email, setEmail] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  const enviar = async (e) => {
    e.preventDefault()
    setErro('')
    setEnviando(true)
    try {
      await solicitarCodigoRecuperacao(config.papel, email.trim())
      navigate(caminhoCodigo(config), { state: { email: email.trim() } })
    } catch (error) {
      setErro(error.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <AuthLayout
      badge="Recuperar senha"
      title="Vamos recuperar seu acesso"
      subtitle={`Informe o e-mail da sua conta de ${config.rotulo} para receber um código de verificação.`}
      highlights={['Processo rápido e seguro', 'Código válido por 10 minutos', 'Você volta a acessar em segundos']}
    >
      <h1 className="text-2xl font-black text-[#1F2937] mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
        Esqueceu sua senha?
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        Digite o e-mail cadastrado e enviaremos um código de verificação para recuperar o acesso.
      </p>

      <form className="space-y-5" onSubmit={enviar}>
        <FormField
          required
          label="E-mail"
          type="email"
          placeholder="seuemail@exemplo.com"
          Icon={MailIcon}
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Aviso>{erro}</Aviso>

        <BotaoPrimario carregando={enviando} textoCarregando="Enviando...">Enviar código</BotaoPrimario>
      </form>

      <p className="text-center text-sm text-gray-500 mt-8">
        Lembrou a senha?{' '}
        <button onClick={() => navigate(config.loginPath)} className="text-[#5B2EFF] font-semibold">
          Voltar para o login
        </button>
      </p>
    </AuthLayout>
  )
}
