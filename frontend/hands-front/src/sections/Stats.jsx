const stats = [
  { value: '+5.000', label: 'Profissionais ativos' },
  { value: '+12.000', label: 'Clientes atendidos' },
  { value: '4.9', label: 'Avaliação média' },
  { value: '97%', label: 'Taxa de recomendação' },
]

export default function Stats() {
  return (
    <section className="py-16" style={{ background: 'linear-gradient(135deg, #4A25CC 0%, #5B2EFF 45%, #7C5CFC 100%)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-4xl lg:text-5xl font-black text-white mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>{s.value}</p>
              <p className="text-white/70 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
