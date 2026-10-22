import { apiGet, montarQuery } from '../../../services/api'

export const listarClientesAdmin = (filtros) => apiGet(`/admin/clientes${montarQuery(filtros)}`)
