import { apiGet } from '../../../services/api'

export const avaliacoesHands = async () => {
  const data = await apiGet('/ver_avaliacoes_hands')
  return data.avaliacoes
}
