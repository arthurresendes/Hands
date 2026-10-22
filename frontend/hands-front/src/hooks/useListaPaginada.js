import { useCallback, useEffect, useState } from 'react'

export default function useListaPaginada(carregar, filtros, pagina) {
  const [estado, setEstado] = useState({ dados: null, carregando: true, erro: '' })
  const [versao, setVersao] = useState(0)

  useEffect(() => {
    let ativo = true
    setEstado((atual) => ({ ...atual, carregando: true, erro: '' }))
    carregar({ ...filtros, pagina })
      .then((dados) => ativo && setEstado({ dados, carregando: false, erro: '' }))
      .catch((error) => ativo && setEstado((atual) => ({ ...atual, carregando: false, erro: error.message })))
    return () => {
      ativo = false
    }
  }, [carregar, filtros, pagina, versao])

  const recarregar = useCallback(() => setVersao((v) => v + 1), [])

  return { ...estado, recarregar }
}
