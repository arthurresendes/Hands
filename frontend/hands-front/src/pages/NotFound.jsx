import { useLocation, useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import useAuth from '../hooks/useAuth'
import { SearchIcon } from '../components/icons'
import { inicioPorPapel } from '../utils/rotasPorPapel'

export default function NotFound() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { usuario } = useAuth()
  const painel = usuario ? inicioPorPapel[usuario.role] : null

  return (
    <div className="min-h-screen bg-[#F8F6FF] flex flex-col">
      <header className="px-6 h-20 flex items-center">
        <button onClick={() => navigate('/')} aria-label="Ir para o início">
          <Logo height={48} />
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 pb-16">
        <div className="max-w-lg w-full text-center">
          <div className="relative inline-block mb-6">
            <p className="text-[9rem] sm:text-[11rem] leading-none font-black text-[#5B2EFF]/10 select-none" style={{ fontFamily: 'Outfit, sans-serif' }}>
              404
            </p>
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="w-20 h-20 rounded-3xl bg-[#FFC857] text-[#1F2937] flex items-center justify-center shadow-lg shadow-[#FFC857]/40 rotate-6">
                <SearchIcon width={34} height={34} />
              </span>
            </span>
          </div>

          <h1 className="text-3xl font-black text-[#1F2937] mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Página não encontrada
          </h1>
          <p className="text-gray-500 mb-2">
            Não encontramos nada em <span className="font-mono text-sm text-[#5B2EFF] break-all">{pathname}</span>.
          </p>
          <p className="text-gray-500 mb-8">O endereço pode estar errado ou a página pode ter sido movida.</p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/')}
              className="bg-[#5B2EFF] hover:bg-[#4A25CC] text-white font-bold px-7 py-3.5 rounded-xl text-sm transition-colors"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Voltar para o início
            </button>
            {painel ? (
              <button
                onClick={() => navigate(painel)}
                className="border border-gray-200 bg-white text-gray-600 font-semibold px-7 py-3.5 rounded-xl text-sm hover:border-[#5B2EFF]/30 hover:text-[#5B2EFF] transition-colors"
              >
                Ir para o meu painel
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="border border-gray-200 bg-white text-gray-600 font-semibold px-7 py-3.5 rounded-xl text-sm hover:border-[#5B2EFF]/30 hover:text-[#5B2EFF] transition-colors"
              >
                Entrar na minha conta
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
