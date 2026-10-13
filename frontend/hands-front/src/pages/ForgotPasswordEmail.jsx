import { useNavigate, useParams } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import FormField from '../components/FormField'
import { MailIcon } from '../components/icons'

const roleConfig = {
  cliente: {
    badge: 'Recuperar senha',
    title: 'Vamos recuperar seu acesso',
    subtitle: 'Informe o e-mail da sua conta de cliente para receber um código de verificação.',
    highlights: ['Processo rápido e seguro', 'Código válido por alguns minutos', 'Você volta a acessar em segundos'],
    loginPath: '/login',
    placeholder: 'seuemail@exemplo.com',
  },
  prestador: {
    badge: 'Recuperar senha',
    title: 'Vamos recuperar seu acesso',
    subtitle: 'Informe o e-mail da sua conta de profissional para receber um código de verificação.',
    highlights: ['Processo rápido e seguro', 'Código válido por alguns minutos', 'Você volta a acessar em segundos'],
    loginPath: '/login/prestador',
    placeholder: 'seuemail@exemplo.com',
  },
}

export default function ForgotPasswordEmail() {
  const navigate = useNavigate()
  const { role } = useParams()
  const config = roleConfig[role] || roleConfig.cliente

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate(`/recuperar-senha/${role}/codigo`)
  }

  return (
    <AuthLayout
      badge={config.badge}
      title={config.title}
      subtitle={config.subtitle}
      highlights={config.highlights}
    >
      <h1 className="text-2xl font-black text-[#1F2937] mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
        Esqueceu sua senha?
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        Digite o e-mail cadastrado e enviaremos um código de verificação para recuperar o acesso.
      </p>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <FormField required label="E-mail" type="email" placeholder={config.placeholder} Icon={MailIcon} />

        <button
          type="submit"
          className="w-full bg-[#5B2EFF] hover:bg-[#4A25CC] text-white font-bold py-3.5 rounded-xl text-sm transition-colors"
          style={{ fontFamily: 'Outfit, sans-serif' }}
        >
          Enviar código
        </button>
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
