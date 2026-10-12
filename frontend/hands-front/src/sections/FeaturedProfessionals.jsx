import { useNavigate } from 'react-router-dom'
import { CheckIcon, PinIcon } from '../components/icons'

const professionals = [
  { name: 'Marcos Silva', role: 'Eletricista Residencial', rating: 4.9, reviews: 142, city: 'São Paulo, SP', tag: 'Verificado' },
  { name: 'Ana Paula Costa', role: 'Diarista & Organizadora', rating: 5.0, reviews: 98, city: 'São Paulo, SP', tag: 'Top Avaliada' },
  { name: 'Ricardo Souza', role: 'Encanador Hidráulico', rating: 4.8, reviews: 210, city: 'Guarulhos, SP', tag: 'Verificado' },
]

function Stars({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width="14" height="14" viewBox="0 0 14 14" fill={s <= Math.round(rating) ? '#FFC857' : '#E5E7EB'}>
          <path d="M7 1l1.545 3.13 3.455.502-2.5 2.437.59 3.437L7 8.885 3.91 10.506l.59-3.437L2 4.632l3.455-.502L7 1z" />
        </svg>
      ))}
    </div>
  )
}

export default function FeaturedProfessionals() {
  const navigate = useNavigate()

  return (
    <section id="profissionais" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
          <div>
            <span className="text-xs font-bold tracking-widest uppercase text-[#5B2EFF] mb-3 block">Qualidade Garantida</span>
            <h2 className="text-4xl font-black text-[#1F2937]" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Profissionais em destaque
              <br />
              <span className="text-gray-400 font-semibold text-2xl">na sua região</span>
            </h2>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="text-sm font-semibold text-[#5B2EFF] border border-[#5B2EFF]/30 px-5 py-2.5 rounded-xl hover:bg-[#5B2EFF] hover:text-white transition-colors whitespace-nowrap"
          >
            Ver todos
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {professionals.map((p) => (
            <div
              key={p.name}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-200 hover:-translate-y-1 transition-all group"
            >
              <div className="relative h-48 bg-[#F3F4F6] flex items-center justify-center overflow-hidden">
                <div className="w-16 h-16 rounded-full bg-gray-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center gap-1 bg-[#5B2EFF] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    <CheckIcon stroke="white" />
                    {p.tag}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-[#1F2937]" style={{ fontFamily: 'Outfit, sans-serif' }}>{p.name}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{p.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Stars rating={p.rating} />
                  <span className="text-sm font-bold text-[#1F2937]">{p.rating}</span>
                  <span className="text-xs text-gray-400">({p.reviews} avaliações)</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
                  <PinIcon width={12} height={12} />
                  {p.city}
                </div>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full bg-[#5B2EFF] hover:bg-[#4A25CC] text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
                >
                  Ver Perfil
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
