import { apiGet } from '../../../services/api'

export const listarFavoritos = async () => {
  const data = await apiGet('/favoritos')
  return data.prestadores
}
