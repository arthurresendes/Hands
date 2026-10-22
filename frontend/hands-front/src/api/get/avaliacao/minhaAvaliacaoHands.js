import { apiGet } from '../../../services/api'

export const minhaAvaliacaoHands = async () => {
  const data = await apiGet('/avaliar_hands/minha')
  return data.avaliacao
}
