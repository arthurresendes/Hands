import { useCallback, useContext, useRef } from 'react'
import { PainelContext } from '../context/painelContext'

export default function useEstadoPainel(chave, inicial) {
  const { estado, definir } = useContext(PainelContext)
  const inicialRef = useRef(inicial)
  const valor = Object.hasOwn(estado, chave) ? estado[chave] : inicial

  const setValor = useCallback(
    (novo) =>
      definir(chave, (atual) => {
        const base = atual === undefined ? inicialRef.current : atual
        return typeof novo === 'function' ? novo(base) : novo
      }),
    [chave, definir],
  )

  return [valor, setValor]
}
