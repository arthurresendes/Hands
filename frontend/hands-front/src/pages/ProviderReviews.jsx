import ProviderLayout from '../components/ProviderLayout'

const ratingBars = [
  { label: 'Pontualidade', pct: 95 },
  { label: 'Qualidade do serviço', pct: 92 },
  { label: 'Educação e atendimento', pct: 97 },
]

const reviews = [
  { author: 'Beatriz Carvalho', rating: 5, city: 'São Paulo, SP', text: 'Excelente profissional, super pontual e capricho no serviço. Recomendo muito!' },
  { author: 'Roberto Nascimento', rating: 5, city: 'Guarulhos, SP', text: 'Resolveu o problema rapidinho e o preço foi justo. Vou chamar de novo com certeza.' },
  { author: 'Fernanda Lopes', rating: 4, city: 'Campinas, SP', text: 'Bom atendimento, chegou no horário combinado. Só achei o valor um pouco acima da média.' },
  { author: 'Alexandre Mota', rating: 5, city: 'Santos, SP', text: 'Muito atencioso e explicou tudo que fez. Com certeza vou chamar de novo.' },
]

function Stars({ rating, size = 14 }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width={size} height={size} viewBox="0 0 14 14" fill={s <= rating ? '#FFC857' : '#E5E7EB'}>
          <path d="M7 1l1.545 3.13 3.455.502-2.5 2.437.59 3.437L7 8.885 3.91 10.506l.59-3.437L2 4.632l3.455-.502L7 1z" />
        </svg>
      ))}
    </div>
  )
}

export default function ProviderReviews() {
  return (
    <ProviderLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#1F2937]" style={{ fontFamily: 'Outfit, sans-serif' }}>
          Avaliações
        </h1>
        <p className="text-gray-500 mt-1">O que os clientes estão dizendo sobre o seu trabalho</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mb-10">
        <div className="flex-shrink-0 bg-[#5B2EFF] rounded-2xl p-8 text-center text-white min-w-[200px] flex flex-col items-center justify-center">
          <p className="text-6xl font-black mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>4.9</p>
          <Stars rating={5} size={18} />
          <p className="text-white/70 text-sm mt-2">de 5.0</p>
          <p className="text-white/50 text-xs mt-1">142 avaliações</p>
        </div>
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 p-6">
          <div className="space-y-3">
            {ratingBars.map((item) => (
              <div key={item.label} className="flex items-center gap-4">
                <span className="text-sm text-gray-600 w-48 flex-shrink-0">{item.label}</span>
                <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-2.5 bg-[#5B2EFF] rounded-full" style={{ width: `${item.pct}%` }} />
                </div>
                <span className="text-sm font-bold text-[#5B2EFF] w-10 text-right">{item.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {reviews.map((r) => (
          <div key={r.author} className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-300" />
                <div>
                  <p className="text-sm font-semibold text-[#1F2937]">{r.author}</p>
                  <p className="text-xs text-gray-400">{r.city}</p>
                </div>
              </div>
              <Stars rating={r.rating} />
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">&ldquo;{r.text}&rdquo;</p>
          </div>
        ))}
      </div>
    </ProviderLayout>
  )
}
