import { Navigate, Outlet } from 'react-router-dom'
import PainelProvider from '../context/PainelProvider'
import useAuth from '../hooks/useAuth'
import { inicioPorPapel, loginPorPapel } from '../utils/rotasPorPapel'

export default function RotaProtegida({ papel }) {
  const { usuario, carregando, sessaoExpirada } = useAuth()

  if (carregando) {
    return <div className="min-h-screen bg-[#F3F4F6]" />
  }
  if (!usuario) {
    return <Navigate to={loginPorPapel[papel]} replace state={sessaoExpirada ? { sessaoExpirada: true } : undefined} />
  }
  if (usuario.role !== papel) {
    return <Navigate to={inicioPorPapel[usuario.role] ?? '/'} replace />
  }
  return (
    <PainelProvider key={papel} papel={papel}>
      <Outlet />
    </PainelProvider>
  )
}
