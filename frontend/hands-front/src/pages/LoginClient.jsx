import { useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import FormField from '../components/FormField'
import { MailIcon, LockIcon } from '../components/icons'

export default function LoginClient() {
  const navigate = useNavigate()

  return (
    <AuthLayout
      badge="Área do Cliente"
      title="Encontre o profissional ideal para o seu projeto"
      subtitle="Acesse sua conta e continue de onde parou, com acesso a todos os profissionais verificados da sua região."
      highlights={['100% gratuito para clientes', 'Avaliações verificadas', 'Contato direto pelo WhatsApp']}
    >
      <h1 className="text-2xl font-black text-[#1F2937] mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
        Entrar como cliente
      </h1>
      <p className="text-sm text-gray-500 mb-8">Acesse sua conta para buscar profissionais</p>

      <form className="space-y-5">
        <FormField label="E-mail" type="email" placeholder="seuemail@exemplo.com" Icon={MailIcon} />
        <FormField label="Senha" type="password" placeholder="Digite sua senha" Icon={LockIcon} />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-gray-500">
            <input type="checkbox" readOnly className="rounded border-gray-300" />
            Lembrar de mim
          </label>
          <button type="button" className="text-[#5B2EFF] font-semibold">Esqueci minha senha</button>
        </div>

        <button
          type="submit"
          className="w-full bg-[#5B2EFF] hover:bg-[#4A25CC] text-white font-bold py-3.5 rounded-xl text-sm transition-colors"
          style={{ fontFamily: 'Outfit, sans-serif' }}
        >
          Entrar
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-8">
        Ainda não tem uma conta?{' '}
        <button onClick={() => navigate('/cadastro/cliente')} className="text-[#5B2EFF] font-semibold">
          Cadastre-se
        </button>
      </p>

      <div className="flex items-center gap-3 my-8">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-xs text-gray-400">ou</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      <button
        onClick={() => navigate('/login/prestador')}
        className="w-full border border-gray-200 text-gray-600 font-semibold py-3.5 rounded-xl text-sm hover:border-[#5B2EFF]/30 hover:text-[#5B2EFF] transition-colors"
      >
        Entrar como profissional
      </button>
    </AuthLayout>
  )
}
