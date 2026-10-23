import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Logo from './Logo'
import Avatar from './Avatar'
import useAuth from '../hooks/useAuth'
import { rotaAtiva } from '../utils/navegacao'
import { SearchIcon, UserIcon, StarOutlineIcon, ChatIcon, HeartIcon, MenuIcon, CloseIcon, LogoutIcon, ChevronDownIcon } from './icons'

const navLinks = [
  { label: 'Buscar Profissionais', path: '/cliente/buscar', tambem: ['/cliente/profissional'], Icon: SearchIcon },
  { label: 'Favoritos', path: '/cliente/favoritos', Icon: HeartIcon },
  { label: 'Avaliações Feitas', path: '/cliente/avaliacoes-feitas', Icon: ChatIcon },
  { label: 'Avaliar o Hands', path: '/cliente/avaliar', Icon: StarOutlineIcon },
  { label: 'Minha Conta', path: '/cliente/perfil', Icon: UserIcon },
]

export default function ClientLayout({ children }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { usuario, logout } = useAuth()
  const sair = async () => {
    await logout()
    navigate('/')
  }
  const [mobileOpen, setMobileOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
          <button onClick={() => navigate('/cliente/buscar')} className="flex-shrink-0 -my-1">
            <Logo height={48} />
          </button>

          <nav className="hidden lg:flex items-center gap-2 flex-1 justify-center">
            {navLinks.map((l) => (
              <button
                key={l.path}
                onClick={() => navigate(l.path)}
                aria-current={rotaAtiva(pathname, l) ? 'page' : undefined}
                className={`flex items-center gap-2 text-sm px-4 py-2 rounded-xl transition-colors ${rotaAtiva(pathname, l) ? 'text-[#5B2EFF] bg-[#5B2EFF]/10 font-semibold' : 'text-gray-500 hover:text-[#5B2EFF] hover:bg-[#5B2EFF]/5 font-medium'}`}
              >
                <l.Icon width={16} height={16} />
                {l.label}
              </button>
            ))}
          </nav>

          <div className="hidden lg:block relative flex-shrink-0">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              onBlur={() => setTimeout(() => setMenuOpen(false), 150)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-gray-200 hover:border-[#5B2EFF]/30 transition-colors"
            >
              <Avatar papel="cliente" id={usuario?.id} className="w-8 h-8 rounded-full">
                <span className="w-8 h-8 rounded-full bg-[#5B2EFF]/10 flex items-center justify-center text-[#5B2EFF]">
                  <UserIcon width={16} height={16} />
                </span>
              </Avatar>
              <span className="text-sm font-semibold text-[#1F2937]">{usuario?.nome}</span>
              <ChevronDownIcon className={`text-gray-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                <div className="p-1">
                  <button
                    onMouseDown={() => navigate('/cliente/perfil')}
                    className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl hover:bg-[#F8F6FF] transition-colors text-left text-sm font-medium text-[#1F2937]"
                  >
                    <UserIcon width={14} height={14} />
                    Minha Conta
                  </button>
                  <button
                    onMouseDown={sair}
                    className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl hover:bg-red-50 transition-colors text-left text-sm font-medium text-red-500"
                  >
                    <LogoutIcon width={14} height={14} />
                    Sair
                  </button>
                </div>
              </div>
            )}
          </div>

          <button className="lg:hidden p-2 rounded-lg text-gray-500" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white px-6 py-5 flex flex-col gap-1">
            {navLinks.map((l) => (
              <button
                key={l.path}
                onClick={() => { navigate(l.path); setMobileOpen(false) }}
                aria-current={rotaAtiva(pathname, l) ? 'page' : undefined}
                className={`flex items-center gap-2.5 text-sm text-left py-2.5 rounded-xl ${rotaAtiva(pathname, l) ? 'text-[#5B2EFF] bg-[#5B2EFF]/10 font-semibold px-3' : 'text-gray-600 font-medium'}`}
              >
                <l.Icon width={16} height={16} />
                {l.label}
              </button>
            ))}
            <div className="border-t border-gray-100 mt-2 pt-3">
              <button
                onClick={sair}
                className="flex items-center gap-2.5 text-sm font-semibold text-red-500 text-left py-2.5"
              >
                <LogoutIcon width={16} height={16} />
                Sair
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">{children}</main>
    </div>
  )
}