import { useState } from 'react'
import Aviso from './Aviso'

export default function ExcluirConta({ onExcluir }) {
  const [erro, setErro] = useState('')

  const excluir = async () => {
    if (!window.confirm('Tem certeza? Sua conta e seus dados serão excluídos permanentemente.')) return
    setErro('')
    try {
      await onExcluir()
    } catch (error) {
      setErro(error.message)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-red-100 p-6">
      <h2 className="font-bold text-red-500 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>Excluir conta</h2>
      <p className="text-sm text-gray-500 mb-4">Essa ação é permanente e removerá todos os seus dados da plataforma.</p>
      {erro && <div className="mb-4"><Aviso>{erro}</Aviso></div>}
      <button
        type="button"
        onClick={excluir}
        className="border border-red-200 text-red-500 font-semibold px-6 py-3 rounded-xl text-sm hover:bg-red-50 transition-colors"
      >
        Excluir minha conta
      </button>
    </div>
  )
}
