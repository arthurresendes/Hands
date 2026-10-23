import { apiGet } from '../../../services/api'

export const buscarPrestador = (id) => apiGet(`/prestadores/${encodeURIComponent(id)}`)
