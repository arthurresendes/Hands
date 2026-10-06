import { useNavigate } from 'react-router-dom'
import { BoltIcon, DropIcon, BrushIcon, BroomIcon, HammerIcon, LeafIcon, MonitorIcon, WrenchIcon } from '../components/icons'

const categories = [
  { name: 'Eletricista', count: '1.240', icon: BoltIcon },
  { name: 'Encanador', count: '890', icon: DropIcon },
  { name: 'Pintor', count: '1.150', icon: BrushIcon },
  { name: 'Diarista', count: '2.100', icon: BroomIcon },
  { name: 'Pedreiro', count: '940', icon: HammerIcon },
  { name: 'Jardineiro', count: '670', icon: LeafIcon },
  { name: 'Técnico de TI', count: '530', icon: MonitorIcon },
  { name: 'Montador', count: '880', icon: WrenchIcon },
]

export default function Categories() {
  const navigate = useNavigate()

  return (
    <section id="categorias" className="py-24 bg-[#F3F4F6]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-bold tracking-widest uppercase text-[#5B2EFF] mb-3 block">Explore</span>
          <h2 className="text-4xl font-black text-[#1F2937] mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>Explore por áreas</h2>
          <p className="text-gray-500">As categorias mais buscadas do Hands</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => navigate('/login')}
              className="bg-white rounded-2xl p-6 flex flex-col items-center gap-3 hover:border-[#5B2EFF] hover:shadow-lg hover:shadow-[#5B2EFF]/10 hover:-translate-y-1 border border-transparent transition-all text-center group"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#5B2EFF]/8 flex items-center justify-center text-[#5B2EFF] group-hover:bg-[#5B2EFF] group-hover:text-white transition-colors">
                <cat.icon />
              </div>
              <div>
                <p className="font-bold text-[#1F2937] text-sm" style={{ fontFamily: 'Outfit, sans-serif' }}>{cat.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{cat.count} profissionais</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
