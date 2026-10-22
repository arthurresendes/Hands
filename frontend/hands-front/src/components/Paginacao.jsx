export default function Paginacao({ resultado, rotulo, onMudar }) {
  if (!resultado) return null
  const { pagina, limite, total, total_paginas: totalPaginas } = resultado
  const inicio = total === 0 ? 0 : (pagina - 1) * limite + 1
  const fim = Math.min(pagina * limite, total)

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
      <p className="text-xs text-gray-400">
        {total === 0 ? `Nenhum ${rotulo.singular} encontrado` : `Mostrando ${inicio}–${fim} de ${total.toLocaleString('pt-BR')} ${total === 1 ? rotulo.singular : rotulo.plural}`}
      </p>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400 mr-1">Página {pagina} de {totalPaginas}</span>
        <button
          onClick={() => onMudar(pagina - 1)}
          disabled={pagina <= 1}
          className="text-xs font-semibold text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg disabled:opacity-40 hover:border-[#5B2EFF]/30"
        >
          Anterior
        </button>
        <button
          onClick={() => onMudar(pagina + 1)}
          disabled={pagina >= totalPaginas}
          className="text-xs font-semibold text-white bg-[#5B2EFF] px-3 py-1.5 rounded-lg disabled:opacity-40"
        >
          Próxima
        </button>
      </div>
    </div>
  )
}
