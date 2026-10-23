import { useMemo } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { configRecuperacao } from '../utils/recuperacaoSenha'

export default function useRecuperacaoSenha() {
  const { role } = useParams()
  const { state } = useLocation()
  const config = useMemo(() => configRecuperacao(role), [role])
  return { config, email: state?.email ?? '', verificado: Boolean(state?.verificado) }
}
