import { useCallback, useEffect, useState } from 'react'

export default function useContagemRegressiva(segundosIniciais = 0) {
  const [restante, setRestante] = useState(segundosIniciais)

  useEffect(() => {
    if (restante <= 0) return undefined
    const timer = setTimeout(() => setRestante((atual) => atual - 1), 1000)
    return () => clearTimeout(timer)
  }, [restante])

  const reiniciar = useCallback((segundos) => setRestante(segundos), [])

  return [restante, reiniciar]
}
