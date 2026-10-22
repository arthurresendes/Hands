import { apiPost } from '../../../services/api'

export const cadastroAvaliacaoHands = (payload) => apiPost('/avaliar_hands', payload)
