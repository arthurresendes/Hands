import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from './Logo'
import { ChevronDownIcon, MenuIcon, CloseIcon, UserIcon, BriefcaseIcon } from './icons'

const navLinks = [
  { label: 'Como Funciona', anchor: 'como-funciona' },
  { label: 'Categorias', anchor: 'categorias' },
  { label: 'Profissionais', anchor: 'profissionais' },
  { label: 'Diferenciais', anchor: 'diferenciais' },
  { label: 'FAQ', anchor: 'faq' },
]

export default function Header() {
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [registerOpen, setRegisterOpen] = useState(false)

  const scrollTo = (anchor) => {
    document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' })
    setMobileOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        <button onClick={() => navigate('/')} className="flex-shrink-0 -my-1">
          <Logo height={52} />
        </button>

        <nav className="hidden lg:flex items-center gap-7 flex-1">
          {navLinks.map((l) => (
            <button
              key={l.anchor}
              onClick={() => scrollTo(l.anchor)}
              className="text-sm font-medium text-gray-500 hover:text-[#5B2EFF] transition-colors whitespace-nowrap"
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
          <div className="relative">
            <button
              onClick={() => { setLoginOpen(!loginOpen); setRegisterOpen(false) }}
              onBlur={() => setTimeout(() => setLoginOpen(false), 150)}
              className={`flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg border transition-colors ${loginOpen ? 'bg-[#5B2EFF]/6 border-[#5B2EFF]/25 text-[#5B2EFF]' : 'border-gray-200 text-gray-600 hover:text-[#5B2EFF] hover:border-[#5B2EFF]/25 hover:bg-[#5B2EFF]/6'}`}
            >
              Entrar
              <ChevronDownIcon className={`transition-transform ${loginOpen ? 'rotate-180' : ''}`} />
            </button>
            {loginOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                <div className="p-1">
                  <button
                    onMouseDown={() => navigate('/login')}
                    className="w-full flex items-start gap-3 px-4 py-3 rounded-xl hover:bg-[#F8F6FF] transition-colors text-left"
                  >
                    <span className="w-8 h-8 rounded-lg bg-[#5B2EFF]/10 flex items-center justify-center text-[#5B2EFF] flex-shrink-0 mt-0.5">
                      <UserIcon width={14} height={14} />
                    </span>
                    <span>
                      <p className="text-sm font-semibold text-[#1F2937]">Sou cliente</p>
                      <p className="text-xs text-gray-400">Acessar minha conta</p>
                    </span>
                  </button>
                  <button
                    onMouseDown={() => navigate('/login/prestador')}
                    className="w-full flex items-start gap-3 px-4 py-3 rounded-xl hover:bg-[#F8F6FF] transition-colors text-left"
                  >
                    <span className="w-8 h-8 rounded-lg bg-[#FFC857]/15 flex items-center justify-center flex-shrink-0 mt-0.5" style={{ color: '#B8860B' }}>
                      <BriefcaseIcon width={14} height={14} />
                    </span>
                    <span>
                      <p className="text-sm font-semibold text-[#1F2937]">Sou profissional</p>
                      <p className="text-xs text-gray-400">Acessar painel</p>
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => { setRegisterOpen(!registerOpen); setLoginOpen(false) }}
              onBlur={() => setTimeout(() => setRegisterOpen(false), 150)}
              className={`flex items-center gap-1.5 text-sm font-semibold px-4 py-2.5 rounded-xl border transition-colors ${registerOpen ? 'bg-[#4A25CC] text-white border-[#4A25CC]' : 'bg-[#5B2EFF] text-white border-[#5B2EFF] hover:bg-[#4A25CC]'} shadow-sm shadow-[#5B2EFF]/25`}
            >
              Cadastrar
              <ChevronDownIcon className={`transition-transform ${registerOpen ? 'rotate-180' : ''}`} />
            </button>
            {registerOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                <div className="p-1">
                  <button
                    onMouseDown={() => navigate('/cadastro/cliente')}
                    className="w-full flex items-start gap-3 px-4 py-3 rounded-xl hover:bg-[#F8F6FF] transition-colors text-left"
                  >
                    <span className="w-8 h-8 rounded-lg bg-[#5B2EFF]/10 flex items-center justify-center text-[#5B2EFF] flex-shrink-0 mt-0.5">
                      <UserIcon width={14} height={14} />
                    </span>
                    <span>
                      <p className="text-sm font-semibold text-[#1F2937]">Sou cliente</p>
                      <p className="text-xs text-gray-400">Buscar profissionais</p>
                    </span>
                  </button>
                  <button
                    onMouseDown={() => navigate('/cadastro/prestador')}
                    className="w-full flex items-start gap-3 px-4 py-3 rounded-xl hover:bg-[#F8F6FF] transition-colors text-left"
                  >
                    <span className="w-8 h-8 rounded-lg bg-[#FFC857]/15 flex items-center justify-center flex-shrink-0 mt-0.5" style={{ color: '#B8860B' }}>
                      <BriefcaseIcon width={14} height={14} />
                    </span>
                    <span>
                      <p className="text-sm font-semibold text-[#1F2937]">Sou profissional</p>
                      <p className="text-xs text-gray-400">Oferecer serviços</p>
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <button className="lg:hidden p-2 rounded-lg text-gray-500" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
          {mobileOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-6 py-5 flex flex-col gap-4">
          {navLinks.map((l) => (
            <button key={l.anchor} onClick={() => scrollTo(l.anchor)} className="text-sm font-medium text-gray-600 text-left py-1">
              {l.label}
            </button>
          ))}
          <div className="border-t border-gray-100 pt-4 flex flex-col gap-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Entrar como</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { navigate('/login'); setMobileOpen(false) }}
                className="text-sm font-semibold text-[#5B2EFF] py-2.5 border border-[#5B2EFF]/30 rounded-xl hover:bg-[#5B2EFF]/5 transition-colors"
              >
                Cliente
              </button>
              <button
                onClick={() => { navigate('/login/prestador'); setMobileOpen(false) }}
                className="text-sm font-semibold text-[#5B2EFF] py-2.5 border border-[#5B2EFF]/30 rounded-xl hover:bg-[#5B2EFF]/5 transition-colors"
              >
                Profissional
              </button>
            </div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-2 mb-1">Cadastrar como</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { navigate('/cadastro/cliente'); setMobileOpen(false) }}
                className="text-sm font-bold bg-[#5B2EFF] text-white py-2.5 rounded-xl hover:bg-[#4A25CC] transition-colors"
              >
                Cliente
              </button>
              <button
                onClick={() => { navigate('/cadastro/prestador'); setMobileOpen(false) }}
                className="text-sm font-bold bg-[#5B2EFF] text-white py-2.5 rounded-xl hover:bg-[#4A25CC] transition-colors"
              >
                Profissional
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
