import { apiGet } from '../../../services/api'

export const avaliacaoClienteEspecifico = async (email) => {
  const data = await apiGet(`/ver_minhas_avaliacoes_cliente/${encodeURIComponent(email)}`)
  return {
    avaliacoes_recebidas: data.avaliacoes_recebidas,
    total: data.total,
  }
}
