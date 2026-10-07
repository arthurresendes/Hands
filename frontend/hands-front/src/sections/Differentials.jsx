import { PinIcon, StarOutlineIcon, ChatIcon, CardIcon } from '../components/icons'

const differentials = [
  { title: 'Localização Facilitada', desc: 'Encontre profissionais próximos buscando diretamente pelo CEP.', Icon: PinIcon, color: '#5B2EFF' },
  { title: 'Avaliações Reais', desc: 'Somente clientes que contrataram podem avaliar o serviço.', Icon: StarOutlineIcon, color: '#FFC857' },
  { title: 'Contato via WhatsApp', desc: 'Converse diretamente com o profissional sem intermediários.', Icon: ChatIcon, color: '#25D366' },
  { title: 'Perfis Completos', desc: 'Veja fotos, preços base, formas de pagamento e certificados.', Icon: CardIcon, color: '#5B2EFF' },
]

export default function Differentials() {
  return (
    <section id="diferenciais" className="py-24" style={{ background: 'linear-gradient(135deg, #F8F6FF 0%, #EEE9FF 100%)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-bold tracking-widest uppercase text-[#5B2EFF] mb-3 block">Por que o Hands?</span>
          <h2 className="text-4xl font-black text-[#1F2937] mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>Nossos Diferenciais</h2>
          <p className="text-gray-500">A escolha mais segura e conveniente</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {differentials.map((d) => (
            <div key={d.title} className="bg-white rounded-2xl p-7 hover:shadow-lg hover:-translate-y-1 transition-all border border-white">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ backgroundColor: d.color + '15' }}>
                <div style={{ color: d.color }}>
                  <d.Icon />
                </div>
              </div>
              <h3 className="font-bold text-[#1F2937] mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>{d.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{d.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
