import { apiDelete } from '../../services/api'

export const deletarPrestador = (email) => apiDelete(`/deletar_prestador/${encodeURIComponent(email)}`)
