import FormField from '../components/FormField'
import { ShieldLockIcon, MailIcon, LockIcon } from '../components/icons'

export default function LoginAdmin() {
  return (
    <div className="min-h-screen bg-[#1F2937] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-10 text-white">
          <span className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-[#FFC857] mb-5">
            <ShieldLockIcon />
          </span>
          <h1 className="text-2xl font-black" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Acesso Administrativo
          </h1>
          <p className="text-white/50 text-sm mt-2 text-center">Área restrita à equipe Hands</p>
        </div>

        <form className="space-y-5 bg-white rounded-2xl p-8 shadow-2xl">
          <FormField label="E-mail administrativo" type="email" placeholder="admin@hands.com" Icon={MailIcon} />
          <FormField label="Senha" type="password" placeholder="Digite sua senha" Icon={LockIcon} />

          <button
            type="submit"
            className="w-full bg-[#1F2937] hover:bg-black text-white font-bold py-3.5 rounded-xl text-sm transition-colors"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Acessar painel
          </button>
        </form>

        <p className="text-center text-white/30 text-xs mt-8">
          Este acesso é monitorado e restrito a administradores autorizados.
        </p>
      </div>
    </div>
  )
}
