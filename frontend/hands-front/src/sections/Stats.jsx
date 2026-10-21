import useFetch from '../hooks/useFetch'
import { getEstatisticas } from '../services/landing'

export default function Stats() {
  const { data: estatisticas } = useFetch(getEstatisticas)
  const temAvaliacoes = estatisticas?.total_avaliacoes > 0

  const stats = [
    { value: estatisticas?.total_prestadores.toLocaleString('pt-BR') ?? '—', label: 'Profissionais ativos' },
    { value: estatisticas?.total_clientes.toLocaleString('pt-BR') ?? '—', label: 'Clientes cadastrados' },
    { value: temAvaliacoes ? estatisticas.nota_media.toFixed(1) : '—', label: 'Avaliação média' },
    { value: temAvaliacoes ? `${estatisticas.taxa_recomendacao}%` : '—', label: 'Taxa de recomendação' },
  ]

  return (
    <section className="py-16" style={{ background: 'linear-gradient(135deg, #4A25CC 0%, #5B2EFF 45%, #7C5CFC 100%)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-4xl lg:text-5xl font-black text-white mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>{s.value}</p>
              <p className="text-white/70 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
