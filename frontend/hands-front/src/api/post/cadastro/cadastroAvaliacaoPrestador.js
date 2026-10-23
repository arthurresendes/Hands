import { apiPost } from '../../../services/api'

export const cadastroAvaliacaoPrestador = (payload) => apiPost('/avaliar_prestador', payload)
