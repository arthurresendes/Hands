import { useRef, useState } from 'react'

export default function CodeInput({ length = 6 }) {
  const [values, setValues] = useState(Array(length).fill(''))
  const inputsRef = useRef([])

  const handleChange = (index, raw) => {
    const digit = raw.replace(/\D/g, '').slice(-1)
    const next = [...values]
    next[index] = digit
    setValues(next)
    if (digit && index < length - 1) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !values[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  return (
    <div className="flex items-center justify-center gap-3">
      {values.map((v, i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          value={v}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          inputMode="numeric"
          maxLength={1}
          className="w-12 h-14 text-center text-xl font-bold text-[#1F2937] border border-gray-200 rounded-xl outline-none focus:border-[#5B2EFF] transition-colors"
          style={{ fontFamily: 'Outfit, sans-serif' }}
        />
      ))}
    </div>
  )
}
