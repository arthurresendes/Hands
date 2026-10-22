import { apiDelete } from '../../services/api'

export const desfavoritarPrestador = (email) => apiDelete(`/favoritos/${encodeURIComponent(email)}`)
