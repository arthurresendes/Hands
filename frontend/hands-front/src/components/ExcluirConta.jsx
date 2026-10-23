import { useState } from 'react'
import ModalConfirmacao from './ModalConfirmacao'

export default function ExcluirConta({ onExcluir }) {
  const [aberto, setAberto] = useState(false)
  const [excluindo, setExcluindo] = useState(false)
  const [erro, setErro] = useState('')

  const fechar = () => {
    setAberto(false)
    setErro('')
  }

  const excluir = async () => {
    setErro('')
    setExcluindo(true)
    try {
      await onExcluir()
    } catch (error) {
      setErro(error.message)
      setExcluindo(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-red-100 p-6">
      <h2 className="font-bold text-red-500 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>Excluir conta</h2>
      <p className="text-sm text-gray-500 mb-4">Essa ação é permanente e removerá todos os seus dados da plataforma.</p>
      <button
        type="button"
        onClick={() => setAberto(true)}
        className="border border-red-200 text-red-500 font-semibold px-6 py-3 rounded-xl text-sm hover:bg-red-50 transition-colors"
      >
        Excluir minha conta
      </button>

      <ModalConfirmacao
        aberto={aberto}
        titulo="Excluir sua conta?"
        texto="Sua conta e todos os seus dados serão excluídos permanentemente. Essa ação não pode ser desfeita."
        confirmar="Excluir minha conta"
        carregando={excluindo}
        erro={erro}
        onConfirmar={excluir}
        onCancelar={fechar}
      />
    </div>
  )
}
