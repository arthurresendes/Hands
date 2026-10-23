import { apiGet } from '../../../services/api'

export const listarPrestadores = async () => {
  const data = await apiGet('/ver_todos_prestadores')
  return data.prestadores
}
