import { apiGet } from '../../../services/api'

export const listarClientes = async () => {
  const data = await apiGet('/ver_todos_clientes')
  return data.clientes
}
