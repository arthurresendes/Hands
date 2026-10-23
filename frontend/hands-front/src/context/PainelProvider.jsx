import { useCallback, useEffect, useMemo, useState } from 'react'
import { PainelContext } from './painelContext'
import { buscarPerfilCliente } from '../api/get/detalhe/perfilCliente'
import { buscarPerfilPrestador } from '../api/get/detalhe/perfilPrestador'

const CARREGADORES_PERFIL = {
  cliente: buscarPerfilCliente,
  prestador: buscarPerfilPrestador,
}

export default function PainelProvider({ papel, children }) {
  const [estado, setEstado] = useState({})
  const [perfil, setPerfil] = useState(null)
  const [carregandoPerfil, setCarregandoPerfil] = useState(Boolean(CARREGADORES_PERFIL[papel]))
  const [erroPerfil, setErroPerfil] = useState('')

  const definir = useCallback((chave, atualizar) => {
    setEstado((atual) => ({ ...atual, [chave]: atualizar(atual[chave]) }))
  }, [])

  const recarregarPerfil = useCallback(async () => {
    const carregador = CARREGADORES_PERFIL[papel]
    if (!carregador) return null
    const dados = await carregador()
    setPerfil(dados)
    setErroPerfil('')
    return dados
  }, [papel])

  useEffect(() => {
    if (!CARREGADORES_PERFIL[papel]) return
    recarregarPerfil()
      .catch((error) => setErroPerfil(error.message))
      .finally(() => setCarregandoPerfil(false))
  }, [papel, recarregarPerfil])

  const valor = useMemo(
    () => ({ estado, definir, perfil, carregandoPerfil, erroPerfil, recarregarPerfil }),
    [estado, definir, perfil, carregandoPerfil, erroPerfil, recarregarPerfil],
  )

  return <PainelContext.Provider value={valor}>{children}</PainelContext.Provider>
}
