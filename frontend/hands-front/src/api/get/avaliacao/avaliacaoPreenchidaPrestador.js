import { apiGet } from '../../../services/api'

export const avaliacaoPreenchidaPrestador = async (email) => {
  const data = await apiGet(`/ver_avaliacoes_preenchidas_prestador/${encodeURIComponent(email)}`)
  return {
    avaliacoes_recebidas: data.avaliacoes_recebidas,
    total: data.total,
  }
}
