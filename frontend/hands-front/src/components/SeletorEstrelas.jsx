const STAR_PATH = 'M7 1l1.545 3.13 3.455.502-2.5 2.437.59 3.437L7 8.885 3.91 10.506l.59-3.437L2 4.632l3.455-.502L7 1z'

export default function SeletorEstrelas({ valor, onChange, tamanho = 26 }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button key={s} type="button" onClick={() => onChange(s)} className="p-0.5" aria-label={`${s} ${s === 1 ? 'estrela' : 'estrelas'}`}>
          <svg width={tamanho} height={tamanho} viewBox="0 0 14 14" fill={s <= valor ? '#FFC857' : '#E5E7EB'}>
            <path d={STAR_PATH} />
          </svg>
        </button>
      ))}
    </div>
  )
}
