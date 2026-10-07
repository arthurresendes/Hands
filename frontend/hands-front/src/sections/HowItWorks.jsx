import { SearchIcon, CompareIcon, WhatsAppIcon } from '../components/icons'

const steps = [
  {
    n: '01',
    title: 'Busque o serviço',
    desc: 'Informe o tipo de serviço que você precisa e sua localização para encontrarmos os melhores profissionais próximos.',
    Icon: SearchIcon,
  },
  {
    n: '02',
    title: 'Compare perfis',
    desc: 'Veja avaliações, fotos de trabalhos anteriores, preços médios e reputação do profissional antes de decidir.',
    Icon: CompareIcon,
  },
  {
    n: '03',
    title: 'Contrate direto',
    desc: 'Negocie condições e agende a execução diretamente pelo WhatsApp, sem intermediários ou taxas.',
    Icon: WhatsAppIcon,
  },
]

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-bold tracking-widest uppercase text-[#5B2EFF] mb-3 block">Passo a passo</span>
          <h2 className="text-4xl font-black text-[#1F2937]" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Três passos para resolver o seu problema
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-px bg-gradient-to-r from-[#5B2EFF]/20 via-[#5B2EFF] to-[#5B2EFF]/20" />
          {steps.map((step) => (
            <div
              key={step.n}
              className="relative bg-white rounded-2xl border border-gray-100 p-8 hover:border-[#5B2EFF]/30 hover:shadow-lg hover:shadow-[#5B2EFF]/5 transition-all group"
            >
              <div className="flex items-center gap-4 mb-5">
                <span className="text-5xl font-black text-[#5B2EFF]/10 group-hover:text-[#5B2EFF]/20 transition-colors leading-none" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  {step.n}
                </span>
                <div className="w-12 h-12 rounded-xl bg-[#5B2EFF]/8 flex items-center justify-center text-[#5B2EFF]">
                  <step.Icon />
                </div>
              </div>
              <h3 className="text-xl font-bold text-[#1F2937] mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>{step.title}</h3>
              <p className="text-gray-500 leading-relaxed text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
