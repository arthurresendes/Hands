import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import Aviso from '../components/Aviso'
import BotaoPrimario from '../components/BotaoPrimario'
import FormField from '../components/FormField'
import { LockIcon } from '../components/icons'
import useRecuperacaoSenha from '../hooks/useRecuperacaoSenha'
import { redefinirSenhaRecuperacao } from '../api/post/recuperacao/redefinirSenhaRecuperacao'
import { SENHA_MINIMA } from '../utils/recuperacaoSenha'

export default function ForgotPasswordReset() {
  const navigate = useNavigate()
  const { config, verificado } = useRecuperacaoSenha()
  const [senha, setSenha] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  if (!verificado) return <Navigate to={config.emailPath} replace />

  const redefinir = async (e) => {
    e.preventDefault()
    setErro('')
    if (senha !== confirmar) {
      setErro('As senhas não conferem.')
      return
    }
    setEnviando(true)
    try {
      await redefinirSenhaRecuperacao(senha)
      navigate(config.loginPath, { state: { senhaRedefinida: true }, replace: true })
    } catch (error) {
      setErro(error.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <AuthLayout
      badge="Recuperar senha"
      title="Quase lá!"
      subtitle={`Defina uma nova senha para voltar a acessar sua conta de ${config.rotulo}.`}
      highlights={['Use uma senha forte e única', 'A nova senha deve ser diferente da anterior']}
    >
      <h1 className="text-2xl font-black text-[#1F2937] mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
        Criar nova senha
      </h1>
      <p className="text-sm text-gray-500 mb-8">Escolha uma nova senha para a sua conta.</p>

      <form className="space-y-5" onSubmit={redefinir}>
        <FormField
          required
          label="Nova senha"
          type="password"
          placeholder={`Mínimo de ${SENHA_MINIMA} caracteres`}
          Icon={LockIcon}
          name="senha"
          autoComplete="new-password"
          minLength={SENHA_MINIMA}
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <FormField
          required
          label="Confirmar nova senha"
          type="password"
          placeholder="Repita a nova senha"
          Icon={LockIcon}
          name="confirmar"
          autoComplete="new-password"
          value={confirmar}
          onChange={(e) => setConfirmar(e.target.value)}
        />

        <Aviso>{erro}</Aviso>
        {erro.includes('expirou') && (
          <button type="button" onClick={() => navigate(config.emailPath)} className="text-sm text-[#5B2EFF] font-semibold">
            Solicitar um novo código
          </button>
        )}

        <BotaoPrimario carregando={enviando} textoCarregando="Salvando...">Redefinir senha</BotaoPrimario>
      </form>
    </AuthLayout>
  )
}
