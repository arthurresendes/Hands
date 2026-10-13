import { useNavigate, useParams } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import FormField from '../components/FormField'
import { LockIcon } from '../components/icons'

const roleConfig = {
  cliente: {
    badge: 'Recuperar senha',
    title: 'Quase lá!',
    subtitle: 'Defina uma nova senha para voltar a acessar sua conta de cliente.',
    highlights: ['Use uma senha forte e única', 'Você poderá entrar em seguida'],
    loginPath: '/login',
  },
  prestador: {
    badge: 'Recuperar senha',
    title: 'Quase lá!',
    subtitle: 'Defina uma nova senha para voltar a acessar sua conta de profissional.',
    highlights: ['Use uma senha forte e única', 'Você poderá entrar em seguida'],
    loginPath: '/login/prestador',
  },
}

export default function ForgotPasswordReset() {
  const navigate = useNavigate()
  const { role } = useParams()
  const config = roleConfig[role] || roleConfig.cliente

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate(config.loginPath)
  }

  return (
    <AuthLayout
      badge={config.badge}
      title={config.title}
      subtitle={config.subtitle}
      highlights={config.highlights}
    >
      <h1 className="text-2xl font-black text-[#1F2937] mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
        Criar nova senha
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        Escolha uma nova senha para a sua conta.
      </p>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <FormField required label="Nova senha" type="password" placeholder="Digite a nova senha" Icon={LockIcon} />
        <FormField required label="Confirmar nova senha" type="password" placeholder="Repita a nova senha" Icon={LockIcon} />

        <button
          type="submit"
          className="w-full bg-[#5B2EFF] hover:bg-[#4A25CC] text-white font-bold py-3.5 rounded-xl text-sm transition-colors"
          style={{ fontFamily: 'Outfit, sans-serif' }}
        >
          Redefinir senha
        </button>
      </form>
    </AuthLayout>
  )
}
