import { useNavigate } from 'react-router-dom'
import Logo from './Logo'

export default function AuthLayout({ badge, title, subtitle, highlights, children }) {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex">
      <div
        className="hidden lg:flex lg:w-[42%] relative overflow-hidden flex-col justify-between p-12"
        style={{ background: 'linear-gradient(135deg, #4A25CC 0%, #5B2EFF 45%, #7C5CFC 100%)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 10% 80%, rgba(255,200,87,0.15) 0%, transparent 50%), radial-gradient(circle at 90% 10%, rgba(255,255,255,0.08) 0%, transparent 40%)',
          }}
        />
        <button onClick={() => navigate('/')} className="relative self-start">
          <Logo height={56} light />
        </button>

        <div className="relative text-white">
          <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-[#FFC857]" />
            {badge}
          </span>
          <h2 className="text-3xl font-black mb-4 leading-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
            {title}
          </h2>
          <p className="text-white/75 leading-relaxed mb-8">{subtitle}</p>
          <div className="space-y-4">
            {highlights.map((h) => (
              <div key={h} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M10 3L5 8.5 2 5.5" stroke="#FFC857" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="text-white/85 text-sm">{h}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-white/40 text-xs">&copy; 2026 Hands. Todos os direitos reservados.</p>
      </div>

      <div className="flex-1 flex items-center justify-center bg-white px-6 py-16">
        <div className="w-full max-w-md">
          <button onClick={() => navigate('/')} className="lg:hidden mb-10 block mx-auto">
            <Logo height={48} />
          </button>
          {children}
        </div>
      </div>
    </div>
  )
}
