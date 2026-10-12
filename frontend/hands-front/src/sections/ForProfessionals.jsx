import { useNavigate } from 'react-router-dom'
import { CheckIcon } from '../components/icons'

const benefits = [
  'Cadastro rápido e gratuito',
  'Sem intermediários',
  'Negociação direta pelo WhatsApp',
  'Maior visibilidade nas buscas regionais',
]

export default function ForProfessionals() {
  const navigate = useNavigate()

  return (
    <section className="py-24 bg-[#1F2937]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div>
            <span className="text-xs font-bold tracking-widest uppercase text-[#FFC857] mb-3 block">Trabalhe Conosco</span>
            <h2 className="text-4xl font-black text-white mb-5 leading-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Multiplique seus clientes
            </h2>
            <p className="text-white/60 mb-8 leading-relaxed">
              Junte-se a milhares de profissionais que já encontram novos clientes todos os dias
              através do Hands, sem pagar comissão sobre seus serviços.
            </p>
            <div className="space-y-4 mb-10">
              {benefits.map((b) => (
                <div key={b} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#FFC857]/15 flex items-center justify-center text-[#FFC857] flex-shrink-0">
                    <CheckIcon />
                  </span>
                  <span className="text-white/85 text-sm">{b}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate('/cadastro/prestador')}
              className="bg-[#FFC857] hover:bg-[#F0B840] text-[#1F2937] font-bold px-8 py-4 rounded-xl text-sm"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Cadastre-se como Profissional
            </button>
          </div>

          <div className="relative">
            <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-[#5B2EFF] to-[#4A25CC] aspect-[4/3] flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-white/10" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl px-6 py-4 flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-[#5B2EFF]/10 flex items-center justify-center text-[#5B2EFF] font-black" style={{ fontFamily: 'Outfit, sans-serif' }}>
                +120
              </span>
              <div>
                <p className="text-sm font-bold text-[#1F2937]">novos clientes</p>
                <p className="text-xs text-gray-400">nos últimos 30 dias</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
