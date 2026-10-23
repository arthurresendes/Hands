import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Avatar from './Avatar'
import Aviso from './Aviso'
import Estrelas from './Estrelas'
import Paginacao from './Paginacao'
import { UserIcon, BriefcaseIcon } from './icons'
import useEstadoPainel from '../hooks/useEstadoPainel'
import { listarMinhasAvaliacoesFeitas } from '../api/get/avaliacao/minhasAvaliacoesFeitas'
import { tempoDesde } from '../utils/formatadores'

const CONFIG = {
  cliente: {
    titulo: 'Avaliações que você fez',
    subtitulo: 'Os prestadores que você avaliou. Toque em um para ver o perfil.',
    vazio: 'Você ainda não avaliou nenhum prestador. Depois de contratar um serviço, conte como foi.',
    rota: (id) => `/cliente/profissional/${id}`,
    Icone: BriefcaseIcon,
  },
  prestador: {
    titulo: 'Avaliações que você fez',
    subtitulo: 'Os clientes que você avaliou. Toque em um para ver o perfil.',
    vazio: 'Você ainda não avaliou nenhum cliente. Depois de concluir um serviço, deixe sua avaliação.',
    rota: (id) => `/prestador/cliente/${id}`,
    Icone: UserIcon,
  },
}

const ROTULO = { singular: 'avaliação', plural: 'avaliações' }

export default function AvaliacoesFeitasConteudo({ papel }) {
  const config = CONFIG[papel]
  const navigate = useNavigate()
  const [pagina, setPagina] = useEstadoPainel(`${papel}.avaliacoesFeitas.pagina`, 1)
  const [dados, setDados] = useEstadoPainel(`${papel}.avaliacoesFeitas.dados`, null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    let ativo = true
    setCarregando(true)
    setErro('')
    listarMinhasAvaliacoesFeitas({ pagina })
      .then((resposta) => ativo && setDados(resposta))
      .catch((error) => ativo && setErro(error.message))
      .finally(() => ativo && setCarregando(false))
    return () => {
      ativo = false
    }
  }, [pagina, setDados])

  const avaliacoes = dados?.avaliacoes ?? []

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-[#1F2937]" style={{ fontFamily: 'Outfit, sans-serif' }}>
          {config.titulo}
        </h1>
        <p className="text-gray-500 mt-1 text-sm sm:text-base">{config.subtitulo}</p>
      </div>

      {erro && <div className="mb-6"><Aviso>{erro}</Aviso></div>}
      {carregando && !dados && <div className="bg-white rounded-2xl h-48 animate-pulse" />}

      {dados && avaliacoes.length === 0 && (
        <p className="text-center text-gray-400 text-sm py-16">{config.vazio}</p>
      )}

      <div className={`space-y-4 ${carregando ? 'opacity-60' : ''}`}>
        {avaliacoes.map((a) => {
          const clicavel = Boolean(a.alvo_id)
          const Icone = config.Icone
          return (
            <button
              key={a._id}
              type="button"
              disabled={!clicavel}
              onClick={() => navigate(config.rota(a.alvo_id))}
              className={`w-full text-left bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 transition-colors ${clicavel ? 'hover:border-[#5B2EFF]/30 cursor-pointer' : 'cursor-default'}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar papel={a.alvo_papel} id={a.alvo_id} className="w-11 h-11 rounded-full flex-shrink-0">
                    <div className="w-11 h-11 rounded-full bg-[#5B2EFF]/10 flex-shrink-0 flex items-center justify-center text-[#5B2EFF]">
                      <Icone width={18} height={18} />
                    </div>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="font-bold text-[#1F2937] text-sm truncate">{a.alvo}</p>
                    <p className="text-xs text-gray-400 truncate">{[a.cidade, tempoDesde(a.data)].filter(Boolean).join(' • ')}</p>
                  </div>
                </div>
                <Estrelas nota={a.nota} tamanho={14} />
              </div>
              {a.mensagem && <p className="text-sm text-gray-600 leading-relaxed break-words">{a.mensagem}</p>}
            </button>
          )
        })}
      </div>

      {dados && dados.total > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 mt-4">
          <Paginacao resultado={dados} rotulo={ROTULO} onMudar={setPagina} />
        </div>
      )}
    </>
  )
}
