import { useNavigate } from 'react-router-dom'
import Logo from './Logo'

const socialLinks = ['instagram', 'facebook', 'twitter', 'linkedin']
const plataformaLinks = ['Como funciona', 'Categorias', 'Profissionais', 'Diferenciais']
const suporteLinks = ['Central de Ajuda', 'FAQ', 'Termos de Uso', 'Privacidade']
const profissionalLinks = ['Cadastre-se', 'Como funciona', 'Plano gratuito', 'Dicas de perfil']

export default function Footer() {
  const navigate = useNavigate()

  return (
    <footer className="bg-[#1F2937] text-white">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="lg:col-span-1">
            <Logo height={64} light />
            <p className="mt-4 text-sm text-gray-400 leading-relaxed">
              A maior rede de confiança para serviços locais e prestadores manuais do Brasil.
              Facilitando conexões humanas e valorizando o trabalho local.
            </p>
            <div className="flex gap-3 mt-6">
              {socialLinks.map((s) => (
                <a
                  key={s}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-[#5B2EFF] flex items-center justify-center transition-colors"
                  aria-label={s}
                >
                  <SocialIcon name={s} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-5 uppercase tracking-wider">Plataforma</h4>
            <ul className="space-y-3">
              {plataformaLinks.map((i) => (
                <li key={i}>
                  <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">{i}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-5 uppercase tracking-wider">Suporte</h4>
            <ul className="space-y-3">
              {suporteLinks.map((i) => (
                <li key={i}>
                  <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">{i}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-5 uppercase tracking-wider">Para Profissionais</h4>
            <ul className="space-y-3">
              {profissionalLinks.map((i) => (
                <li key={i}>
                  <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">{i}</a>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-col gap-2">
              <button
                onClick={() => navigate('/cadastro/cliente')}
                className="text-sm font-semibold bg-[#FFC857] text-[#1F2937] px-5 py-2.5 rounded-xl hover:bg-[#f0bb4e] transition-colors"
              >
                Criar conta de cliente
              </button>
              <button
                onClick={() => navigate('/cadastro/prestador')}
                className="text-sm font-semibold border border-white/20 text-white px-5 py-2.5 rounded-xl hover:bg-white/10 transition-colors"
              >
                Cadastrar como profissional
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">&copy; 2026 Hands. Todos os direitos reservados.</p>
          <p className="text-sm text-gray-500">Feito com ❤️ no Brasil</p>
        </div>
      </div>
    </footer>
  )
}

function SocialIcon({ name }) {
  if (name === 'instagram') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    )
  }
  if (name === 'facebook') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    )
  }
  if (name === 'twitter') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
      </svg>
    )
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}
