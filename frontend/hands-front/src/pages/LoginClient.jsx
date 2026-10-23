import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import Aviso from '../components/Aviso'
import BotaoPrimario from '../components/BotaoPrimario'
import FormField from '../components/FormField'
import { MailIcon, LockIcon } from '../components/icons'
import useAuth from '../hooks/useAuth'
import { inicioPorPapel } from '../utils/rotasPorPapel'

export default function LoginClient() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [lembrar, setLembrar] = useState(false)
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setErro('')
    setEnviando(true)
    try {
      const usuario = await login('cliente', email, senha, lembrar)
      navigate(inicioPorPapel[usuario.role])
    } catch (error) {
      setErro(error.message)
    } finally {
      setEnviando(false)
    }
  }

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

      {state?.senhaRedefinida && (
        <div className="mb-5"><Aviso tipo="sucesso">Senha redefinida com sucesso. Entre com a nova senha.</Aviso></div>
      )}

      <form className="space-y-5" onSubmit={handleLogin}>
        <FormField label="E-mail" type="email" placeholder="seuemail@exemplo.com" Icon={MailIcon} name="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <FormField label="Senha" type="password" placeholder="Digite sua senha" Icon={LockIcon} name="senha" autoComplete="current-password" value={senha} onChange={(e) => setSenha(e.target.value)} />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-gray-500">
            <input type="checkbox" checked={lembrar} onChange={(e) => setLembrar(e.target.checked)} className="rounded border-gray-300" />
            Lembrar de mim
          </label>
          <button type="button" onClick={() => navigate('/recuperar-senha/cliente')} className="text-[#5B2EFF] font-semibold">Esqueci minha senha</button>
        </div>

        {erro && <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">{erro}</p>}

        <BotaoPrimario carregando={enviando} textoCarregando="Entrando...">Entrar</BotaoPrimario>
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
