import { useEffect } from 'react'

export default function ModalConfirmacao({ aberto, titulo, texto, confirmar = 'Confirmar', carregando, erro, onConfirmar, onCancelar }) {
  useEffect(() => {
    if (!aberto) return undefined
    const aoPressionar = (e) => e.key === 'Escape' && !carregando && onCancelar()
    window.addEventListener('keydown', aoPressionar)
    return () => window.removeEventListener('keydown', aoPressionar)
  }, [aberto, carregando, onCancelar])

  if (!aberto) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={() => !carregando && onCancelar()}>
      <div role="dialog" aria-modal="true" aria-labelledby="titulo-modal" className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h2 id="titulo-modal" className="font-bold text-lg text-[#1F2937] mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>{titulo}</h2>
        <p className="text-sm text-gray-500 leading-relaxed">{texto}</p>
        {erro && <p className="text-sm text-red-500 mt-3">{erro}</p>}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancelar}
            disabled={carregando}
            className="text-sm font-semibold text-gray-500 border border-gray-200 px-5 py-2.5 rounded-xl hover:border-gray-300 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirmar}
            disabled={carregando}
            className="text-sm font-bold text-white bg-red-500 hover:bg-red-600 disabled:opacity-60 px-5 py-2.5 rounded-xl transition-colors"
          >
            {carregando ? 'Excluindo...' : confirmar}
          </button>
        </div>
      </div>
    </div>
  )
}
