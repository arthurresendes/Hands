import { useEffect, useState } from 'react'
import ProviderLayout from '../components/ProviderLayout'
import Avatar from '../components/Avatar'
import Estrelas from '../components/Estrelas'
import Aviso from '../components/Aviso'
import { UserIcon } from '../components/icons'
import { listarAvaliacoesRecebidas } from '../api/get/avaliacao/avaliacoesRecebidasPrestador'
import { tempoDesde, textoAvaliacoes } from '../utils/formatadores'

export default function ProviderReviews() {
  const [pagina, setPagina] = useState(1)
  const [dados, setDados] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    let ativo = true
    setCarregando(true)
    listarAvaliacoesRecebidas({ pagina })
      .then((resposta) => ativo && setDados(resposta))
      .catch((error) => ativo && setErro(error.message))
      .finally(() => ativo && setCarregando(false))
    return () => {
      ativo = false
    }
  }, [pagina])

  const resumo = dados?.resumo
  const temAvaliacoes = resumo?.total > 0

  return (
    <ProviderLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#1F2937]" style={{ fontFamily: 'Outfit, sans-serif' }}>
          Minhas Avaliações
        </h1>
        <p className="text-gray-500 mt-1">O que os clientes dizem sobre o seu trabalho</p>
      </div>

      {erro && <div className="mb-6"><Aviso>{erro}</Aviso></div>}

      {carregando && !dados && <div className="bg-white rounded-2xl h-96 animate-pulse" />}

      {dados && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 h-fit">
            <p className="text-5xl font-black text-[#1F2937]" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {temAvaliacoes ? resumo.media.toFixed(1) : '—'}
            </p>
            <div className="my-2">
              <Estrelas nota={temAvaliacoes ? resumo.media : 0} tamanho={18} />
            </div>
            <p className="text-sm text-gray-400 mb-6">
              {temAvaliacoes ? `com base em ${textoAvaliacoes(resumo.total)}` : 'Você ainda não recebeu avaliações'}
            </p>
            <div className="space-y-3">
              {resumo.distribuicao.map((d) => (
                <div key={d.estrelas} className="flex items-center gap-3 text-sm">
                  <span className="w-6 text-gray-500">{d.estrelas}★</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#FFC857] rounded-full" style={{ width: `${d.percentual}%` }} />
                  </div>
                  <span className="w-6 text-right text-gray-400">{d.total}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            {dados.avaliacoes.length === 0 && (
              <p className="text-center text-gray-400 text-sm py-16">Quando um cliente avaliar você, a avaliação aparece aqui.</p>
            )}

            {dados.avaliacoes.map((a) => (
              <div key={a._id} className={`bg-white rounded-2xl border border-gray-100 p-6 ${carregando ? 'opacity-60' : ''}`}>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar papel="cliente" id={a.autor_id} className="w-11 h-11 rounded-full">
                      <div className="w-11 h-11 rounded-full bg-[#5B2EFF]/10 flex items-center justify-center text-[#5B2EFF]">
                        <UserIcon width={18} height={18} />
                      </div>
                    </Avatar>
                    <div>
                      <p className="font-bold text-[#1F2937] text-sm">{a.autor}</p>
                      <p className="text-xs text-gray-400">
                        {[a.cidade, tempoDesde(a.data)].filter(Boolean).join(' • ')}
                      </p>
                    </div>
                  </div>
                  <Estrelas nota={a.nota} tamanho={14} />
                </div>
                {a.mensagem && <p className="text-sm text-gray-600 leading-relaxed">{a.mensagem}</p>}
              </div>
            ))}

            {dados.total_paginas > 1 && (
              <div className="flex items-center justify-center gap-4 pt-4">
                <button
                  onClick={() => setPagina(pagina - 1)}
                  disabled={pagina <= 1}
                  className="text-sm font-semibold border border-gray-200 px-5 py-2.5 rounded-xl text-gray-600 disabled:opacity-40 hover:border-[#5B2EFF]/30"
                >
                  Anterior
                </button>
                <span className="text-sm text-gray-500">Página {dados.pagina} de {dados.total_paginas}</span>
                <button
                  onClick={() => setPagina(pagina + 1)}
                  disabled={pagina >= dados.total_paginas}
                  className="text-sm font-semibold border border-gray-200 px-5 py-2.5 rounded-xl text-gray-600 disabled:opacity-40 hover:border-[#5B2EFF]/30"
                >
                  Próxima
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </ProviderLayout>
  )
}
