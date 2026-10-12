import { UsersIcon, StarSolidIcon, ShieldIcon } from '../components/icons'

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #4A25CC 0%, #5B2EFF 45%, #7C5CFC 100%)' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 10% 80%, rgba(255,200,87,0.15) 0%, transparent 50%), radial-gradient(circle at 90% 10%, rgba(255,255,255,0.08) 0%, transparent 40%)',
        }}
      />
      <div className="absolute right-0 top-0 w-[500px] h-[500px] rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3 blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-6 py-24 text-center text-white">
        <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-4 py-1.5 rounded-full text-sm font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-[#FFC857]" />
          +5.000 profissionais verificados disponíveis
        </div>

        <h1 className="text-5xl lg:text-6xl font-black mb-6 leading-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
          O profissional ideal para o seu projeto,{' '}
          <span className="text-[#FFC857]">a um clique.</span>
        </h1>

        <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
          Conectamos você aos melhores prestadores de serviços manuais e profissionais locais de
          forma rápida, segura e sem custo.
        </p>

        <div className="bg-white rounded-2xl p-2 flex flex-col sm:flex-row gap-2 shadow-2xl shadow-black/30 max-w-2xl mx-auto">
          <input
            placeholder="Qual serviço você precisa?"
            readOnly
            className="flex-1 px-4 py-3.5 text-gray-800 rounded-xl outline-none text-sm placeholder-gray-400"
          />
          <div className="hidden sm:block w-px bg-gray-200 my-2" />
          <input
            placeholder="Digite seu CEP"
            readOnly
            className="w-full sm:w-44 px-4 py-3.5 text-gray-800 rounded-xl outline-none text-sm placeholder-gray-400"
          />
          <button className="bg-[#5B2EFF] text-white font-bold px-8 py-3.5 rounded-xl text-sm whitespace-nowrap" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Buscar
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 mt-10 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <UsersIcon stroke="white" />
            </span>
            <span className="text-white/90 font-medium">+5.000 profissionais</span>
          </div>
          <div className="hidden sm:block w-px h-5 bg-white/20" />
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <StarSolidIcon />
            </span>
            <span className="text-white/90 font-medium">Avaliações verificadas</span>
          </div>
          <div className="hidden sm:block w-px h-5 bg-white/20" />
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <ShieldIcon stroke="white" />
            </span>
            <span className="text-white/90 font-medium">100% grátis para clientes</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-12 bg-white" style={{ clipPath: 'ellipse(60% 100% at 50% 100%)' }} />
    </section>
  )
}
