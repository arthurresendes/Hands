import { useCallback, useEffect, useMemo, useState } from 'react'
import { AuthContext } from './authContext'
import { registrarAoExpirarSessao } from '../services/api'
import { buscarUsuarioAtual, entrar, sair } from '../api/autenticacao'

export default function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [fotoVersao, setFotoVersao] = useState(0)
  const [sessaoExpirada, setSessaoExpirada] = useState(false)

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
    registrarAoExpirarSessao(() => {
      setUsuario((atual) => {
        if (atual) setSessaoExpirada(true)
        return null
      })
    })
    return () => registrarAoExpirarSessao(null)
  }, [])

  useEffect(() => {
    recarregar().finally(() => setCarregando(false))
  }, [recarregar])

  const login = useCallback(
    async (papel, email, senha, lembrar = false) => {
      await entrar(papel, email, senha, lembrar)
      setSessaoExpirada(false)
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
      setSessaoExpirada(false)
    }
  }, [])

  const atualizarFoto = useCallback(() => setFotoVersao((versao) => versao + 1), [])

  const valor = useMemo(
    () => ({ usuario, carregando, fotoVersao, sessaoExpirada, login, logout, recarregar, atualizarFoto }),
    [usuario, carregando, fotoVersao, sessaoExpirada, login, logout, recarregar, atualizarFoto],
  )

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}
