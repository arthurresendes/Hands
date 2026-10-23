import { apiGet } from '../../../services/api'

export const totalClientes = async () => {
  const data = await apiGet('/total_clientes')
  return data.totalClientes
}
