import { apiPost } from '../../../services/api'

export const cadastroAvaliacaoCliente = (payload) => apiPost('/avaliar_clientes', payload)
