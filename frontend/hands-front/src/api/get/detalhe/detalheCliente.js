import { apiGet } from '../../../services/api'

export const buscarCliente = (id) => apiGet(`/clientes/${encodeURIComponent(id)}`)
