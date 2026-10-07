import { useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import FormField from '../components/FormField'
import { UserIcon, MailIcon, IdCardIcon, LockIcon, PinIcon } from '../components/icons'

export default function RegisterClient() {
  const navigate = useNavigate()

  return (
    <AuthLayout
      badge="Cadastro de Cliente"
      title="Encontre profissionais de confiança perto de você"
      subtitle="Crie sua conta gratuita e comece a buscar os melhores prestadores de serviço da sua região."
      highlights={['Cadastro 100% gratuito', 'Busca por CEP, sem complicação', 'Avaliações de clientes reais']}
    >
      <h1 className="text-2xl font-black text-[#1F2937] mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
        Criar conta de cliente
      </h1>
      <p className="text-sm text-gray-500 mb-8">Preencha seus dados para começar a buscar profissionais</p>

      <form className="space-y-5">
        <FormField label="Nome completo" placeholder="Digite seu nome completo" Icon={UserIcon} />
        <FormField label="E-mail" type="email" placeholder="seuemail@exemplo.com" Icon={MailIcon} />

        <div className="grid grid-cols-2 gap-4">
          <FormField label="CPF" placeholder="000.000.000-00" Icon={IdCardIcon} />
          <FormField label="Idade" type="number" placeholder="Ex: 28" />
        </div>

        <FormField label="CEP" placeholder="00000-000" Icon={PinIcon} />

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Senha" type="password" placeholder="Crie uma senha" Icon={LockIcon} />
          <FormField label="Confirmar senha" type="password" placeholder="Repita a senha" Icon={LockIcon} />
        </div>

        <label className="flex items-start gap-2 text-xs text-gray-500">
          <input type="checkbox" readOnly className="rounded border-gray-300 mt-0.5" />
          Li e aceito os Termos de Uso e a Política de Privacidade do Hands
        </label>

        <button
          type="submit"
          className="w-full bg-[#5B2EFF] hover:bg-[#4A25CC] text-white font-bold py-3.5 rounded-xl text-sm transition-colors"
          style={{ fontFamily: 'Outfit, sans-serif' }}
        >
          Criar conta
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-8">
        Já tem uma conta?{' '}
        <button onClick={() => navigate('/login')} className="text-[#5B2EFF] font-semibold">
          Entrar
        </button>
      </p>

      <div className="flex items-center gap-3 my-8">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-xs text-gray-400">ou</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      <button
        onClick={() => navigate('/cadastro/prestador')}
        className="w-full border border-gray-200 text-gray-600 font-semibold py-3.5 rounded-xl text-sm hover:border-[#5B2EFF]/30 hover:text-[#5B2EFF] transition-colors"
      >
        Quero oferecer serviços
      </button>
    </AuthLayout>
  )
}
