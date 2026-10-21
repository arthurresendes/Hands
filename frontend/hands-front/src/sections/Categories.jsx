import { useNavigate } from 'react-router-dom'
import { BoltIcon, DropIcon, BrushIcon, BroomIcon, HammerIcon, LeafIcon, MonitorIcon, WrenchIcon } from '../components/icons'
import useFetch from '../hooks/useFetch'
import { getCategorias } from '../services/landing'

// Os serviços vêm livres do cadastro do prestador: o ícone é escolhido por palavra-chave
const iconesPorPalavraChave = [
  { palavras: ['eletric'], icon: BoltIcon },
  { palavras: ['encanad', 'hidraul'], icon: DropIcon },
  { palavras: ['pintor', 'pintura'], icon: BrushIcon },
  { palavras: ['diarista', 'limpeza', 'faxina'], icon: BroomIcon },
  { palavras: ['pedreiro', 'obra', 'reforma'], icon: HammerIcon },
  { palavras: ['jardin'], icon: LeafIcon },
  { palavras: ['ti', 'informatica', 'computador', 'tecnico'], icon: MonitorIcon },
]

function iconePara(nome) {
  const normalizado = nome.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  const palavras = normalizado.split(/[^a-z]+/)
  const encontrado = iconesPorPalavraChave.find(({ palavras: chaves }) =>
    chaves.some((chave) => (chave.length <= 2 ? palavras.includes(chave) : normalizado.includes(chave))),
  )
  return encontrado ? encontrado.icon : WrenchIcon
}

export default function Categories() {
  const navigate = useNavigate()
  const { data: categories, loading } = useFetch(getCategorias)

  return (
    <section id="categorias" className="py-24 bg-[#F3F4F6]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-bold tracking-widest uppercase text-[#5B2EFF] mb-3 block">Explore</span>
          <h2 className="text-4xl font-black text-[#1F2937] mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>Explore por áreas</h2>
          <p className="text-gray-500">As categorias mais buscadas do Hands</p>
        </div>

        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 h-36 animate-pulse" />
            ))}
          </div>
        )}

        {!loading && (!categories || categories.length === 0) && (
          <p className="text-center text-gray-400 text-sm">Nenhuma categoria disponível no momento.</p>
        )}

        {categories && categories.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map((cat) => {
              const Icon = iconePara(cat.nome)
              return (
                <button
                  key={cat.nome}
                  onClick={() => navigate('/login')}
                  className="bg-white rounded-2xl p-6 flex flex-col items-center gap-3 hover:border-[#5B2EFF] hover:shadow-lg hover:shadow-[#5B2EFF]/10 hover:-translate-y-1 border border-transparent transition-all text-center group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#5B2EFF]/8 flex items-center justify-center text-[#5B2EFF] group-hover:bg-[#5B2EFF] group-hover:text-white transition-colors">
                    <Icon />
                  </div>
                  <div>
                    <p className="font-bold text-[#1F2937] text-sm" style={{ fontFamily: 'Outfit, sans-serif' }}>{cat.nome}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {cat.total.toLocaleString('pt-BR')} {cat.total === 1 ? 'profissional' : 'profissionais'}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
