import { useNavigate } from 'react-router-dom'
import ClientLayout from '../components/ClientLayout'
import { HeartIcon, SearchIcon } from '../components/icons'

export default function ClientFavorites() {
  const navigate = useNavigate()

  return (
    <ClientLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#1F2937]" style={{ fontFamily: 'Outfit, sans-serif' }}>
          Profissionais Favoritos
        </h1>
        <p className="text-gray-500 mt-1">Acesse rapidamente os profissionais que você salvou</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 py-20 px-6 flex flex-col items-center text-center">
        <span className="w-20 h-20 rounded-full bg-[#F8F6FF] flex items-center justify-center text-[#5B2EFF] mb-6">
          <HeartIcon width={32} height={32} />
        </span>
        <h2 className="text-xl font-bold text-[#1F2937] mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
          Você ainda não tem favoritos
        </h2>
        <p className="text-sm text-gray-500 max-w-sm mb-8">
          Quando encontrar um profissional que gostou, toque no coração no perfil dele para
          salvá-lo aqui e acessar com mais facilidade depois.
        </p>
        <button
          onClick={() => navigate('/cliente/buscar')}
          className="flex items-center gap-2 bg-[#5B2EFF] hover:bg-[#4A25CC] text-white font-bold px-7 py-3.5 rounded-xl text-sm transition-colors"
          style={{ fontFamily: 'Outfit, sans-serif' }}
        >
          <SearchIcon width={16} height={16} />
          Buscar profissionais
        </button>
      </div>
    </ClientLayout>
  )
}
