import { useCallback, useEffect, useMemo, useState } from 'react'
import { AuthContext } from './authContext'
import { buscarUsuarioAtual, entrar, sair } from '../api/autenticacao'

export default function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [carregando, setCarregando] = useState(true)

  const recarregar = useCallback(async () => {
    try {
      const atual = await buscarUsuarioAtual()
      setUsuario(atual)
      return atual
    } catch {
      setUsuario(null)
      return null
    }
  }, [])

  useEffect(() => {
    recarregar().finally(() => setCarregando(false))
  }, [recarregar])

  const login = useCallback(
    async (papel, email, senha) => {
      await entrar(papel, email, senha)
      const atual = await recarregar()
      if (!atual) {
        throw new Error('Não foi possível iniciar a sessão. Verifique se os cookies estão habilitados.')
      }
      return atual
    },
    [recarregar],
  )

  const logout = useCallback(async () => {
    try {
      await sair()
    } finally {
      setUsuario(null)
    }
  }, [])

  const valor = useMemo(
    () => ({ usuario, carregando, login, logout, recarregar }),
    [usuario, carregando, login, logout, recarregar],
  )

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}
