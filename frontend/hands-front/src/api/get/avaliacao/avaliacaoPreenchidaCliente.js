import { apiGet } from '../../../services/api'

export const avaliacaoPreenchidaCliente = async (email) => {
  const data = await apiGet(`/ver_avaliacoes_preenchidas_cliente/${encodeURIComponent(email)}`)
  return {
    avaliacoes_recebidas: data.avaliacoes_recebidas,
    total: data.total,
  }
}
