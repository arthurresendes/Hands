import { useState } from 'react'
import FormField from './FormField'
import Aviso from './Aviso'
import { LockIcon } from './icons'

const INICIAL = { senha_atual: '', senha: '', confirmar: '' }

export default function AlterarSenha({ onAlterar }) {
  const [senhas, setSenhas] = useState(INICIAL)
  const [aviso, setAviso] = useState(null)
  const [enviando, setEnviando] = useState(false)

  const alterar = (e) => setSenhas((atual) => ({ ...atual, [e.target.name]: e.target.value }))

  const enviar = async (e) => {
    e.preventDefault()
    setAviso(null)
    if (senhas.senha !== senhas.confirmar) {
      setAviso({ tipo: 'erro', texto: 'A confirmação não confere com a nova senha.' })
      return
    }
    setEnviando(true)
    try {
      await onAlterar(senhas.senha_atual, senhas.senha)
      setSenhas(INICIAL)
      setAviso({ tipo: 'sucesso', texto: 'Senha atualizada com sucesso.' })
    } catch (error) {
      setAviso({ tipo: 'erro', texto: error.message })
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={enviar} className="bg-white rounded-2xl border border-gray-100 p-6">
      <h2 className="font-bold text-[#1F2937] mb-5" style={{ fontFamily: 'Outfit, sans-serif' }}>Alterar senha</h2>
      <div className="space-y-5">
        <FormField label="Senha atual" type="password" placeholder="Digite sua senha atual" Icon={LockIcon} name="senha_atual" autoComplete="current-password" value={senhas.senha_atual} onChange={alterar} />
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Nova senha" type="password" placeholder="Mínimo de 6 caracteres" Icon={LockIcon} name="senha" autoComplete="new-password" minLength={6} value={senhas.senha} onChange={alterar} />
          <FormField label="Confirmar nova senha" type="password" placeholder="Repita a nova senha" Icon={LockIcon} name="confirmar" autoComplete="new-password" value={senhas.confirmar} onChange={alterar} />
        </div>
        {aviso && <Aviso tipo={aviso.tipo}>{aviso.texto}</Aviso>}
        <button
          type="submit"
          disabled={enviando}
          className="bg-[#1F2937] hover:bg-black disabled:opacity-60 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors"
          style={{ fontFamily: 'Outfit, sans-serif' }}
        >
          {enviando ? 'Atualizando...' : 'Atualizar senha'}
        </button>
      </div>
    </form>
  )
}
