import { apiGet } from '../../../services/api'

export const buscarPerfilPrestador = () => apiGet('/prestador/perfil')
