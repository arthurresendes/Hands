const ratingBars = [
  { label: 'Facilidade de uso', pct: 96 },
  { label: 'Qualidade dos profissionais', pct: 93 },
  { label: 'Rapidez no atendimento', pct: 91 },
  { label: 'Confiabilidade da plataforma', pct: 95 },
  { label: 'Custo-benefício', pct: 94 },
]

const indicators = [
  { label: 'Recomendariam', value: '97%', icon: '👍' },
  { label: 'Usuários ativos', value: '+12k', icon: '👥' },
  { label: 'Satisfação geral', value: 'Ótimo', icon: '🏆' },
]

const reviews = [
  { text: 'A plataforma é muito intuitiva. Em menos de 5 minutos achei um pintor disponível na minha rua. Nunca foi tão fácil!', author: 'Beatriz Carvalho', city: 'São Paulo, SP', badge: 'Cliente verificado' },
  { text: 'Finalmente um app que respeita tanto o cliente quanto o profissional. Sem taxas abusivas e contato direto. Perfeito!', author: 'Roberto Nascimento', city: 'Guarulhos, SP', badge: 'Usuário desde 2025' },
  { text: 'Meu negócio de eletricidade cresceu muito depois que entrei no Hands. Recebo contatos todos os dias sem pagar nada.', author: 'Eduardo Fonseca', city: 'ABC Paulista, SP', badge: 'Prestador verificado' },
  { text: 'O processo de verificação dos profissionais me dá muita segurança. Já contratei 4 vezes e sempre fui bem atendida.', author: 'Fernanda Lopes', city: 'Campinas, SP', badge: 'Cliente verificado' },
  { text: 'Super recomendo! Interface limpa, profissionais bem avaliados e tudo transparente. Muito melhor que outros apps.', author: 'Alexandre Mota', city: 'Santos, SP', badge: 'Usuário desde 2025' },
  { text: 'Como diarista, o Hands mudou minha vida. Tenho agenda cheia e não perco dinheiro com taxas. Obrigada pelo espaço!', author: 'Conceição Alves', city: 'São Paulo, SP', badge: 'Prestadora verificada' },
]

function StarRow() {
  return (
    <div className="flex gap-0.5 mb-4">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width="14" height="14" viewBox="0 0 14 14" fill="#FFC857">
          <path d="M7 1l1.545 3.13 3.455.502-2.5 2.437.59 3.437L7 8.885 3.91 10.506l.59-3.437L2 4.632l3.455-.502L7 1z" />
        </svg>
      ))}
    </div>
  )
}

export default function PlatformReviews() {
  return (
    <section id="avaliacoes-hands" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-bold tracking-widest uppercase text-[#5B2EFF] mb-3 block">O que dizem sobre o Hands</span>
          <h2 className="text-4xl font-black text-[#1F2937] mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>Avaliações da Plataforma</h2>
          <p className="text-gray-500">Veja a opinião de quem usa o Hands no dia a dia</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 mb-14">
          <div className="flex-shrink-0 bg-[#5B2EFF] rounded-3xl p-8 text-center text-white min-w-[200px] flex flex-col items-center justify-center">
            <p className="text-7xl font-black mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>4.9</p>
            <div className="flex gap-1 justify-center mb-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <svg key={i} width="18" height="18" viewBox="0 0 14 14" fill="#FFC857">
                  <path d="M7 1l1.545 3.13 3.455.502-2.5 2.437.59 3.437L7 8.885 3.91 10.506l.59-3.437L2 4.632l3.455-.502L7 1z" />
                </svg>
              ))}
            </div>
            <p className="text-white/70 text-sm">de 5.0</p>
            <p className="text-white/50 text-xs mt-1">+2.400 avaliações</p>
          </div>
          <div className="flex-1">
            <div className="space-y-3">
              {ratingBars.map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <span className="text-sm text-gray-600 w-52 flex-shrink-0">{item.label}</span>
                  <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-2.5 bg-[#5B2EFF] rounded-full" style={{ width: `${item.pct}%` }} />
                  </div>
                  <span className="text-sm font-bold text-[#5B2EFF] w-10 text-right">{item.pct}%</span>
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-6">
              {indicators.map((s) => (
                <div key={s.label} className="flex-1 bg-[#F8F6FF] rounded-xl p-3 text-center border border-[#5B2EFF]/8">
                  <p className="text-lg mb-0.5">{s.icon}</p>
                  <p className="text-base font-black text-[#5B2EFF]" style={{ fontFamily: 'Outfit, sans-serif' }}>{s.value}</p>
                  <p className="text-xs text-gray-400">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div key={i} className="bg-[#F8F6FF] rounded-2xl p-6 border border-[#5B2EFF]/8 hover:border-[#5B2EFF]/20 hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <StarRow />
                <p className="text-gray-700 text-sm leading-relaxed italic mb-5">&ldquo;{r.text}&rdquo;</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-[#1F2937]">{r.author}</p>
                  <p className="text-xs text-gray-400">{r.city}</p>
                </div>
                <span className="ml-auto text-xs bg-[#5B2EFF]/10 text-[#5B2EFF] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">
                  {r.badge}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
