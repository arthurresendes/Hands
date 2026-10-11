import { useNavigate } from 'react-router-dom'
import ProviderLayout from '../components/ProviderLayout'
import { SearchIcon, PinIcon, FilterIcon } from '../components/icons'

const clientes = [
  { name: 'Beatriz Carvalho', service: 'Instalação elétrica', rating: 4.9, reviews: 12, city: 'São Paulo, SP', date: 'Atendido em 12/09/2026' },
  { name: 'Roberto Nascimento', service: 'Troca de quadro de energia', rating: 5.0, reviews: 8, city: 'Guarulhos, SP', date: 'Atendido em 03/09/2026' },
  { name: 'Fernanda Lopes', service: 'Manutenção residencial', rating: 4.8, reviews: 15, city: 'Campinas, SP', date: 'Atendido em 28/08/2026' },
  { name: 'Alexandre Mota', service: 'Instalação de chuveiro', rating: 4.7, reviews: 6, city: 'Santos, SP', date: 'Atendido em 15/08/2026' },
  { name: 'Conceição Alves', service: 'Revisão elétrica geral', rating: 4.9, reviews: 20, city: 'São Paulo, SP', date: 'Atendido em 02/08/2026' },
  { name: 'Eduardo Fonseca', service: 'Instalação de luminárias', rating: 4.6, reviews: 9, city: 'Osasco, SP', date: 'Atendido em 25/07/2026' },
]

function Stars({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width="13" height="13" viewBox="0 0 14 14" fill={s <= Math.round(rating) ? '#FFC857' : '#E5E7EB'}>
          <path d="M7 1l1.545 3.13 3.455.502-2.5 2.437.59 3.437L7 8.885 3.91 10.506l.59-3.437L2 4.632l3.455-.502L7 1z" />
        </svg>
      ))}
    </div>
  )
}

export default function ProviderClients() {
  const navigate = useNavigate()

  return (
    <ProviderLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#1F2937]" style={{ fontFamily: 'Outfit, sans-serif' }}>
          Buscar Clientes
        </h1>
        <p className="text-gray-500 mt-1">Veja os clientes que você já atendeu na plataforma</p>
      </div>

      <div className="bg-white rounded-2xl p-4 flex flex-col lg:flex-row gap-3 shadow-sm border border-gray-100 mb-8">
        <div className="flex-1 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <SearchIcon width={18} height={18} />
          </span>
          <input readOnly placeholder="Buscar por nome do cliente" className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm outline-none placeholder-gray-400" />
        </div>
        <div className="relative w-full lg:w-52">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <PinIcon width={18} height={18} />
          </span>
          <input readOnly placeholder="Filtrar por região" className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm outline-none placeholder-gray-400" />
        </div>
        <button className="bg-[#5B2EFF] hover:bg-[#4A25CC] text-white font-bold px-8 py-3 rounded-xl text-sm whitespace-nowrap" style={{ fontFamily: 'Outfit, sans-serif' }}>
          Buscar
        </button>
      </div>

      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-gray-500">
          <span className="font-bold text-[#1F2937]">{clientes.length} clientes</span> já atendidos por você
        </p>
        <button className="flex items-center gap-2 text-sm font-semibold text-gray-500 border border-gray-200 px-4 py-2 rounded-xl hover:border-[#5B2EFF]/30 hover:text-[#5B2EFF] transition-colors">
          <FilterIcon />
          Filtrar
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {clientes.map((c) => (
          <div
            key={c.name}
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-200 hover:-translate-y-1 transition-all"
          >
            <div className="h-40 bg-[#F3F4F6] flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-gray-300" />
            </div>
            <div className="p-5">
              <h3 className="font-bold text-[#1F2937]" style={{ fontFamily: 'Outfit, sans-serif' }}>{c.name}</h3>
              <p className="text-sm text-gray-500 mt-0.5 mb-2">{c.service}</p>
              <div className="flex items-center gap-2 mb-2">
                <Stars rating={c.rating} />
                <span className="text-sm font-bold text-[#1F2937]">{c.rating}</span>
                <span className="text-xs text-gray-400">({c.reviews})</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
                <PinIcon width={12} height={12} />
                {c.city}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{c.date}</span>
                <button
                  onClick={() => navigate('/prestador/cliente')}
                  className="text-sm font-semibold bg-[#5B2EFF]/10 text-[#5B2EFF] px-4 py-2 rounded-xl hover:bg-[#5B2EFF] hover:text-white transition-colors"
                >
                  Ver Perfil
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ProviderLayout>
  )
}