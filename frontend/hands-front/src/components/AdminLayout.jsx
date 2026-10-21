import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from './Logo'
import useAuth from '../hooks/useAuth'
import { GridIcon, UsersIcon, BriefcaseIcon, StarOutlineIcon, MenuIcon, CloseIcon, LogoutIcon, ShieldLockIcon } from './icons'

const navLinks = [
  { label: 'Dashboard', path: '/admin/painel', Icon: GridIcon },
  { label: 'Clientes', path: '/admin/clientes', Icon: UsersIcon },
  { label: 'Prestadores', path: '/admin/prestadores', Icon: BriefcaseIcon },
  { label: 'Avaliações do Hands', path: '/admin/avaliacoes', Icon: StarOutlineIcon },
]

export default function AdminLayout({ title, subtitle, children }) {
  const navigate = useNavigate()
  const { usuario, logout } = useAuth()
  const sair = async () => {
    await logout()
    navigate('/')
  }
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen flex bg-[#F3F4F6]">
      <aside className="hidden lg:flex lg:flex-col w-64 bg-[#1F2937] flex-shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <Logo height={40} light />
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1">
          {navLinks.map((l) => (
            <button
              key={l.path}
              onClick={() => navigate(l.path)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors"
            >
              <l.Icon width={16} height={16} />
              {l.label}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-3">
            <span className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-[#FFC857]">
              <ShieldLockIcon width={16} height={16} />
            </span>
            <div>
              <p className="text-sm font-semibold text-white">{usuario?.nome ?? 'Administrador'}</p>
              <p className="text-xs text-white/40">Acesso restrito</p>
            </div>
          </div>
          <button
            onClick={sair}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogoutIcon width={16} height={16} />
            Sair
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="lg:hidden sticky top-0 z-50 bg-[#1F2937] h-16 flex items-center justify-between px-6">
          <Logo height={36} light />
          <button className="text-white p-2" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </header>

        {mobileOpen && (
          <div className="lg:hidden bg-[#1F2937] px-4 pb-4 flex flex-col gap-1">
            {navLinks.map((l) => (
              <button
                key={l.path}
                onClick={() => { navigate(l.path); setMobileOpen(false) }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/70 text-left"
              >
                <l.Icon width={16} height={16} />
                {l.label}
              </button>
            ))}
            <button
              onClick={sair}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 text-left"
            >
              <LogoutIcon width={16} height={16} />
              Sair
            </button>
          </div>
        )}

        <main className="max-w-7xl mx-auto px-6 py-10">
          {(title || subtitle) && (
            <div className="mb-8">
              {title && (
                <h1 className="text-3xl font-black text-[#1F2937]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  {title}
                </h1>
              )}
              {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  )
}