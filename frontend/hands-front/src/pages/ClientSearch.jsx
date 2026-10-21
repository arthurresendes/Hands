import { useNavigate } from 'react-router-dom'
import ClientLayout from '../components/ClientLayout'
import { SearchIcon, PinIcon, FilterIcon } from '../components/icons'
import { useEffect, useState } from 'react'
import { listarPrestadores } from '../api/get/listagem/listagemPrestadores'

const servicos = ['Eletricista', 'Encanador', 'Pintor', 'Diarista', 'Pedreiro', 'Jardineiro', 'Técnico de TI', 'Montador']

const profissionais = [
  { name: 'Marcos Silva', role: 'Eletricista Residencial', rating: 4.9, reviews: 142, city: 'São Paulo, SP', price: 'A partir de R$ 80' },
  { name: 'Ana Paula Costa', role: 'Diarista & Organizadora', rating: 5.0, reviews: 98, city: 'São Paulo, SP', price: 'A partir de R$ 150' },
  { name: 'Ricardo Souza', role: 'Encanador Hidráulico', rating: 4.8, reviews: 210, city: 'Guarulhos, SP', price: 'A partir de R$ 90' },
  { name: 'Juliana Prado', role: 'Pintora Residencial', rating: 4.7, reviews: 76, city: 'Osasco, SP', price: 'A partir de R$ 120' },
  { name: 'Carlos Henrique', role: 'Pedreiro', rating: 4.6, reviews: 54, city: 'São Paulo, SP', price: 'A partir de R$ 100' },
  { name: 'Patrícia Lima', role: 'Jardinagem e Paisagismo', rating: 4.9, reviews: 61, city: 'São Bernardo, SP', price: 'A partir de R$ 110' },
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

export default function ClientSearch() {
  const navigate = useNavigate()
  const [prestadores, setPrestadores] = useState([])

  useEffect(() => {
    const buscarDados = async () => {
      const dados = await listarPrestadores()
      setPrestadores(dados.prestadores)
    }

    buscarDados()
  }, [])

  return (
    <ClientLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#1F2937]" style={{ fontFamily: 'Outfit, sans-serif' }}>
          Buscar Profissionais
        </h1>
        <p className="text-gray-500 mt-1">Encontre o profissional ideal perto de você</p>
      </div>

      <div className="bg-white rounded-2xl p-4 flex flex-col lg:flex-row gap-3 shadow-sm border border-gray-100 mb-8">
        <div className="flex-1 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <SearchIcon width={18} height={18} />
          </span>
          <select disabled className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-400 appearance-none outline-none">
            <option>Qual serviço você precisa?</option>
            {servicos.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="relative w-full lg:w-52">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <PinIcon width={18} height={18} />
          </span>
          <input readOnly placeholder="Digite seu CEP" className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm outline-none placeholder-gray-400" />
        </div>
        <button className="bg-[#5B2EFF] hover:bg-[#4A25CC] text-white font-bold px-8 py-3 rounded-xl text-sm whitespace-nowrap" style={{ fontFamily: 'Outfit, sans-serif' }}>
          Buscar
        </button>
      </div>

      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-gray-500">
          <span className="font-bold text-[#1F2937]">{profissionais.length} profissionais</span> encontrados na sua região
        </p>
        <button className="flex items-center gap-2 text-sm font-semibold text-gray-500 border border-gray-200 px-4 py-2 rounded-xl hover:border-[#5B2EFF]/30 hover:text-[#5B2EFF] transition-colors">
          <FilterIcon />
          Filtrar
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {profissionais.map((p) => (
          <div
            key={p.name}
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-200 hover:-translate-y-1 transition-all"
          >
            <div className="h-40 bg-[#F3F4F6] flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-gray-300" />
            </div>
            <div className="p-5">
              <h3 className="font-bold text-[#1F2937]" style={{ fontFamily: 'Outfit, sans-serif' }}>{p.name}</h3>
              <p className="text-sm text-gray-500 mt-0.5 mb-2">{p.role}</p>
              <div className="flex items-center gap-2 mb-2">
                <Stars rating={p.rating} />
                <span className="text-sm font-bold text-[#1F2937]">{p.rating}</span>
                <span className="text-xs text-gray-400">({p.reviews})</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
                <PinIcon width={12} height={12} />
                {p.city}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#5B2EFF]">{p.price}</span>
                <button
                  onClick={() => navigate('/cliente/profissional')}
                  className="text-sm font-semibold bg-[#5B2EFF]/10 text-[#5B2EFF] px-4 py-2 rounded-xl hover:bg-[#5B2EFF] hover:text-white transition-colors"
                >
                  Ver Perfil
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ClientLayout>
  )
}
