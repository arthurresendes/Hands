import { apiGet } from '../services/api'

export const listarPrestadores = () => apiGet('/ver_todos_prestadores')
