import { apiGet } from '../../../services/api'

export const avaliacaoPrestadorEspecifico = async (email) => {
  const data = await apiGet(`/ver_minhas_avaliacoes_prestador/${encodeURIComponent(email)}`)
  return {
    avaliacoes_recebidas: data.avaliacoes_recebidas,
    total: data.total,
  }
}
