import { useCallback, useEffect, useState } from 'react'
import useEstadoPainel from './useEstadoPainel'

export default function useListaPaginada(carregar, filtros, pagina, chave) {
  const [dados, setDados] = useEstadoPainel(`${chave}.dados`, null)
  const [estado, setEstado] = useState({ carregando: true, erro: '' })
  const [versao, setVersao] = useState(0)

  useEffect(() => {
    let ativo = true
    setEstado({ carregando: true, erro: '' })
    carregar({ ...filtros, pagina })
      .then((resposta) => {
        if (!ativo) return
        setDados(resposta)
        setEstado({ carregando: false, erro: '' })
      })
      .catch((error) => ativo && setEstado({ carregando: false, erro: error.message }))
    return () => {
      ativo = false
    }
  }, [carregar, filtros, pagina, versao, setDados])

  const recarregar = useCallback(() => setVersao((v) => v + 1), [])

  return { dados, ...estado, recarregar }
}
