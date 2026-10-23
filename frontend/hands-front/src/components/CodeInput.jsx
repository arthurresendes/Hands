import { useRef } from 'react'

export default function CodeInput({ length = 6, value = '', onChange, disabled = false }) {
  const inputsRef = useRef([])
  const digitos = Array.from({ length }, (_, i) => value[i] ?? '')

  const focar = (indice) => inputsRef.current[Math.max(0, Math.min(indice, length - 1))]?.focus()

  const atualizar = (indice, bruto) => {
    const novos = bruto.replace(/\D/g, '')
    if (!novos) {
      onChange(digitos.map((d, i) => (i === indice ? '' : d)).join(''))
      return
    }
    const proximo = [...digitos]
    novos.slice(0, length - indice).split('').forEach((digito, i) => {
      proximo[indice + i] = digito
    })
    onChange(proximo.join(''))
    focar(indice + novos.length)
  }

  const aoTeclar = (indice, e) => {
    if (e.key === 'Backspace' && !digitos[indice]) focar(indice - 1)
    if (e.key === 'ArrowLeft') focar(indice - 1)
    if (e.key === 'ArrowRight') focar(indice + 1)
  }

  const aoColar = (e) => {
    const colado = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (!colado) return
    e.preventDefault()
    onChange(colado)
    focar(colado.length)
  }

  return (
    <div className="flex items-center justify-center gap-3" onPaste={aoColar}>
      {digitos.map((digito, i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          value={digito}
          onChange={(e) => atualizar(i, e.target.value)}
          onKeyDown={(e) => aoTeclar(i, e)}
          onFocus={(e) => e.target.select()}
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          aria-label={`Dígito ${i + 1} do código`}
          disabled={disabled}
          autoFocus={i === 0}
          className="w-12 h-14 text-center text-xl font-bold text-[#1F2937] border border-gray-200 rounded-xl outline-none focus:border-[#5B2EFF] transition-colors disabled:opacity-60"
          style={{ fontFamily: 'Outfit, sans-serif' }}
        />
      ))}
    </div>
  )
}
