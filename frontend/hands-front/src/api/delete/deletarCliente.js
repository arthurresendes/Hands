import { apiDelete } from '../../services/api'

export const deletarCliente = (email) => apiDelete(`/deletar_cliente/${encodeURIComponent(email)}`)
