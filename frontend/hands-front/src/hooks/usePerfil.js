import { useContext } from 'react'
import { PainelContext } from '../context/painelContext'

export default function usePerfil() {
  const { perfil, carregandoPerfil, erroPerfil, recarregarPerfil } = useContext(PainelContext)
  return { perfil, carregando: carregandoPerfil, erro: erroPerfil, recarregar: recarregarPerfil }
}
