import Aviso from '../components/Aviso'
import FormField from '../components/FormField'
import { ShieldLockIcon, MailIcon, LockIcon } from '../components/icons'
import useAuth from '../hooks/useAuth'
import { inicioPorPapel } from '../utils/rotasPorPapel'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function LoginAdmin() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setErro('')
    setEnviando(true)
    try {
      const usuario = await login('admin', email, senha)
      navigate(inicioPorPapel[usuario.role])
    } catch (error) {
      setErro(error.message)
    } finally {
      setEnviando(false)
    }
  }
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

        <form className="space-y-5 bg-white rounded-2xl p-8 shadow-2xl" onSubmit={handleLogin}>
          <FormField label="E-mail administrativo" type="email" placeholder="admin@hands.com" Icon={MailIcon} name="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <FormField label="Senha" type="password" placeholder="Digite sua senha" Icon={LockIcon} name="senha" autoComplete="current-password" value={senha} onChange={(e) => setSenha(e.target.value)} />

          {state?.sessaoExpirada && <Aviso tipo="atencao">Sua sessão expirou. Entre novamente para continuar.</Aviso>}

          {erro && <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">{erro}</p>}

          <button
            type="submit"
            disabled={enviando}
            className="w-full bg-[#1F2937] hover:bg-black disabled:opacity-60 text-white font-bold py-3.5 rounded-xl text-sm transition-colors"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            {enviando ? 'Entrando...' : 'Acessar painel'}
          </button>
        </form>

        <p className="text-center text-white/30 text-xs mt-8">
          Este acesso é monitorado e restrito a administradores autorizados.
        </p>
      </div>
    </div>
  )
}
