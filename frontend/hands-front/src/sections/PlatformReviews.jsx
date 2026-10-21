import useFetch from '../hooks/useFetch'
import { getAvaliacoesHands, getEstatisticas } from '../services/landing'

const STAR_PATH = 'M7 1l1.545 3.13 3.455.502-2.5 2.437.59 3.437L7 8.885 3.91 10.506l.59-3.437L2 4.632l3.455-.502L7 1z'

function StarRow({ nota, size = 14, className = 'gap-0.5 mb-4' }) {
  return (
    <div className={`flex ${className}`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width={size} height={size} viewBox="0 0 14 14" fill={s <= Math.round(nota) ? '#FFC857' : '#E5E7EB'}>
          <path d={STAR_PATH} />
        </svg>
      ))}
    </div>
  )
}

const criterios = [
  { chave: 'facilidade', label: 'Facilidade de uso' },
  { chave: 'qualidade', label: 'Qualidade do site' },
  { chave: 'confiabilidade', label: 'Confiabilidade da plataforma' },
]

function satisfacaoGeral(media) {
  if (media >= 4.5) return 'Ótimo'
  if (media >= 4) return 'Muito bom'
  if (media >= 3) return 'Bom'
  return 'Regular'
}

export default function PlatformReviews() {
  const { data, loading } = useFetch(getAvaliacoesHands)
  const { data: estatisticas } = useFetch(getEstatisticas)

  const resumo = data?.resumo
  const reviews = data?.avaliacoes ?? []
  const temAvaliacoes = resumo?.total > 0
  const usuarios = estatisticas ? estatisticas.total_clientes + estatisticas.total_prestadores : null

  const indicators = [
    { label: 'Recomendariam', value: temAvaliacoes ? `${resumo.taxa_recomendacao}%` : '—', icon: '👍' },
    { label: 'Usuários ativos', value: usuarios !== null ? usuarios.toLocaleString('pt-BR') : '—', icon: '👥' },
    { label: 'Satisfação geral', value: temAvaliacoes ? satisfacaoGeral(resumo.media) : '—', icon: '🏆' },
  ]

  return (
    <section id="avaliacoes-hands" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-bold tracking-widest uppercase text-[#5B2EFF] mb-3 block">O que dizem sobre o Hands</span>
          <h2 className="text-4xl font-black text-[#1F2937] mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>Avaliações da Plataforma</h2>
          <p className="text-gray-500">Veja a opinião de quem usa o Hands no dia a dia</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 mb-14">
          <div className="flex-shrink-0 bg-[#5B2EFF] rounded-3xl p-8 text-center text-white min-w-[200px] flex flex-col items-center justify-center">
            <p className="text-7xl font-black mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {temAvaliacoes ? resumo.media.toFixed(1) : '—'}
            </p>
            <StarRow nota={temAvaliacoes ? resumo.media : 0} size={18} className="justify-center mb-2 gap-1" />
            <p className="text-white/70 text-sm">de 5.0</p>
            <p className="text-white/50 text-xs mt-1">
              {temAvaliacoes
                ? `${resumo.total.toLocaleString('pt-BR')} ${resumo.total === 1 ? 'avaliação' : 'avaliações'}`
                : loading ? 'Carregando...' : 'Sem avaliações ainda'}
            </p>
          </div>
          <div className="flex-1">
            <div className="space-y-3">
              {criterios.map((c) => {
                const media = resumo?.criterios?.[c.chave]
                const percentual = media ? Math.round((media / 5) * 100) : 0
                return (
                  <div key={c.chave} className="flex items-center gap-4">
                    <span className="text-sm text-gray-600 w-52 flex-shrink-0">{c.label}</span>
                    <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-2.5 bg-[#5B2EFF] rounded-full" style={{ width: `${percentual}%` }} />
                    </div>
                    <span className="text-sm font-bold text-[#5B2EFF] w-10 text-right">{media ? `${percentual}%` : '—'}</span>
                  </div>
                )
              })}
            </div>
            <div className="flex gap-4 mt-6">
              {indicators.map((s) => (
                <div key={s.label} className="flex-1 bg-[#F8F6FF] rounded-xl p-3 text-center border border-[#5B2EFF]/8">
                  <p className="text-lg mb-0.5">{s.icon}</p>
                  <p className="text-base font-black text-[#5B2EFF]" style={{ fontFamily: 'Outfit, sans-serif' }}>{s.value}</p>
                  <p className="text-xs text-gray-400">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-[#F8F6FF] h-48 animate-pulse" />
            ))}
          </div>
        )}

        {!loading && reviews.length === 0 && (
          <p className="text-center text-gray-400 text-sm">Ainda não há comentários sobre o Hands.</p>
        )}

        {reviews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((r) => (
              <div key={r._id} className="bg-[#F8F6FF] rounded-2xl p-6 border border-[#5B2EFF]/8 hover:border-[#5B2EFF]/20 hover:shadow-lg transition-all flex flex-col justify-between">
                <div>
                  <StarRow nota={r.nota} />
                  <p className="text-gray-700 text-sm leading-relaxed italic mb-5">&ldquo;{r.texto}&rdquo;</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-[#1F2937]">{r.autor}</p>
                    {r.cidade && <p className="text-xs text-gray-400">{r.cidade}</p>}
                  </div>
                  {r.tipo && (
                    <span className="ml-auto text-xs bg-[#5B2EFF]/10 text-[#5B2EFF] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">
                      {r.tipo}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
