const STAR_PATH = 'M7 1l1.545 3.13 3.455.502-2.5 2.437.59 3.437L7 8.885 3.91 10.506l.59-3.437L2 4.632l3.455-.502L7 1z'

export default function Estrelas({ nota, tamanho = 14 }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width={tamanho} height={tamanho} viewBox="0 0 14 14" fill={s <= Math.round(nota ?? 0) ? '#FFC857' : '#E5E7EB'}>
          <path d={STAR_PATH} />
        </svg>
      ))}
    </div>
  )
}
