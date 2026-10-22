import { apiGet, montarQuery } from '../../../services/api'

export const listarPrestadoresAdmin = (filtros) => apiGet(`/admin/prestadores${montarQuery(filtros)}`)
