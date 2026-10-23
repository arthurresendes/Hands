import { apiGet } from '../../../services/api'

export const totalPrestadores = async () => {
  const data = await apiGet('/total_prestadores')
  return data.totalPrestadores
}
