import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import Aviso from '../components/Aviso'
import BotaoPrimario from '../components/BotaoPrimario'
import CodeInput from '../components/CodeInput'
import useContagemRegressiva from '../hooks/useContagemRegressiva'
import useRecuperacaoSenha from '../hooks/useRecuperacaoSenha'
import { solicitarCodigoRecuperacao } from '../api/post/recuperacao/solicitarCodigoRecuperacao'
import { validarCodigoRecuperacao } from '../api/post/recuperacao/validarCodigoRecuperacao'
import { SEGUNDOS_REENVIO, TAMANHO_CODIGO, caminhoNovaSenha } from '../utils/recuperacaoSenha'

export default function ForgotPasswordCode() {
  const navigate = useNavigate()
  const { config, email } = useRecuperacaoSenha()
  const [codigo, setCodigo] = useState('')
  const [aviso, setAviso] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [reenviando, setReenviando] = useState(false)
  const [restante, reiniciarContagem] = useContagemRegressiva(SEGUNDOS_REENVIO)

  if (!email) return <Navigate to={config.emailPath} replace />

  const verificar = async (e) => {
    e.preventDefault()
    setAviso(null)
    if (codigo.length < TAMANHO_CODIGO) {
      setAviso({ tipo: 'erro', texto: `Digite os ${TAMANHO_CODIGO} dígitos do código.` })
      return
    }
    setEnviando(true)
    try {
      await validarCodigoRecuperacao(config.papel, email, codigo)
      navigate(caminhoNovaSenha(config), { state: { verificado: true }, replace: true })
    } catch (error) {
      setAviso({ tipo: 'erro', texto: error.message })
      setCodigo('')
    } finally {
      setEnviando(false)
    }
  }

  const reenviar = async () => {
    setAviso(null)
    setReenviando(true)
    try {
      await solicitarCodigoRecuperacao(config.papel, email)
      setCodigo('')
      reiniciarContagem(SEGUNDOS_REENVIO)
      setAviso({ tipo: 'sucesso', texto: 'Enviamos um novo código para o seu e-mail.' })
    } catch (error) {
      setAviso({ tipo: 'erro', texto: error.message })
    } finally {
      setReenviando(false)
    }
  }

  return (
    <AuthLayout
      badge="Recuperar senha"
      title="Confira seu e-mail"
      subtitle={`Enviamos um código de ${TAMANHO_CODIGO} dígitos para o e-mail da sua conta de ${config.rotulo}.`}
      highlights={['Verifique também a caixa de spam', 'O código expira em 10 minutos']}
    >
      <h1 className="text-2xl font-black text-[#1F2937] mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
        Digite o código
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        Insira o código de {TAMANHO_CODIGO} dígitos enviado para <span className="font-semibold text-[#1F2937]">{email}</span>.
      </p>

      <form className="space-y-6" onSubmit={verificar}>
        <CodeInput length={TAMANHO_CODIGO} value={codigo} onChange={setCodigo} disabled={enviando} />

        {aviso && <Aviso tipo={aviso.tipo}>{aviso.texto}</Aviso>}

        <BotaoPrimario carregando={enviando} textoCarregando="Verificando...">Verificar código</BotaoPrimario>
      </form>

      <p className="text-center text-sm text-gray-500 mt-8">
        Não recebeu o código?{' '}
        <button
          type="button"
          onClick={reenviar}
          disabled={restante > 0 || reenviando}
          className="text-[#5B2EFF] font-semibold disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          {restante > 0 ? `Reenviar em ${restante}s` : reenviando ? 'Reenviando...' : 'Reenviar'}
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
