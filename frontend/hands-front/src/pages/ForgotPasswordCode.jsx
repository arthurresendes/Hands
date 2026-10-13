import { useNavigate, useParams } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import CodeInput from '../components/CodeInput'

const roleConfig = {
  cliente: {
    badge: 'Recuperar senha',
    title: 'Confira seu e-mail',
    subtitle: 'Enviamos um código de 6 dígitos para o e-mail da sua conta de cliente.',
    highlights: ['Verifique também a caixa de spam', 'O código expira em alguns minutos'],
    emailPath: '/recuperar-senha/cliente',
  },
  prestador: {
    badge: 'Recuperar senha',
    title: 'Confira seu e-mail',
    subtitle: 'Enviamos um código de 6 dígitos para o e-mail da sua conta de profissional.',
    highlights: ['Verifique também a caixa de spam', 'O código expira em alguns minutos'],
    emailPath: '/recuperar-senha/prestador',
  },
}

export default function ForgotPasswordCode() {
  const navigate = useNavigate()
  const { role } = useParams()
  const config = roleConfig[role] || roleConfig.cliente

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate(`/recuperar-senha/${role}/nova-senha`)
  }

  return (
    <AuthLayout
      badge={config.badge}
      title={config.title}
      subtitle={config.subtitle}
      highlights={config.highlights}
    >
      <h1 className="text-2xl font-black text-[#1F2937] mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
        Digite o código
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        Insira o código de 6 dígitos que enviamos para o seu e-mail.
      </p>

      <form className="space-y-8" onSubmit={handleSubmit}>
        <CodeInput length={6} />

        <button
          type="submit"
          className="w-full bg-[#5B2EFF] hover:bg-[#4A25CC] text-white font-bold py-3.5 rounded-xl text-sm transition-colors"
          style={{ fontFamily: 'Outfit, sans-serif' }}
        >
          Verificar código
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-8">
        Não recebeu o código?{' '}
        <button type="button" className="text-[#5B2EFF] font-semibold">
          Reenviar
        </button>
      </p>

      <p className="text-center text-sm text-gray-500 mt-2">
        <button onClick={() => navigate(config.emailPath)} className="text-gray-400 font-medium">
          Usar outro e-mail
        </button>
      </p>
    </AuthLayout>
  )
}
