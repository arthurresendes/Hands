import { apiGet } from '../../../services/api'

export const buscarPerfilCliente = () => apiGet('/cliente/perfil')
