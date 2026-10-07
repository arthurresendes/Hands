import { useNavigate } from 'react-router-dom'

export default function BottomCTA() {
  const navigate = useNavigate()

  return (
    <section className="py-20" style={{ background: 'linear-gradient(135deg, #4A25CC 0%, #5B2EFF 45%, #7C5CFC 100%)' }}>
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-black text-white mb-5 leading-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
          Pronto para resolver o seu problema?
        </h2>
        <p className="text-white/80 mb-10">
          Encontre o profissional ideal em minutos, sem custo e sem complicação.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate('/cadastro/cliente')}
            className="bg-white text-[#5B2EFF] font-bold px-8 py-4 rounded-xl text-sm w-full sm:w-auto"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Buscar um Profissional
          </button>
          <button
            onClick={() => navigate('/cadastro/prestador')}
            className="bg-transparent border-2 border-white/40 text-white font-bold px-8 py-4 rounded-xl text-sm w-full sm:w-auto hover:bg-white/10 transition-colors"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Oferecer meus Serviços
          </button>
        </div>
      </div>
    </section>
  )
}
