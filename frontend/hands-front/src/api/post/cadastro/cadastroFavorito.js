import { apiPost } from '../../../services/api'

export const favoritarPrestador = (email) => apiPost('/favoritos', { email })
