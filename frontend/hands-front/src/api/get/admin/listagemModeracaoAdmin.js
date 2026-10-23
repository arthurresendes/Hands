import { apiGet, montarQuery } from '../../../services/api'

export const listarModeracaoAdmin = (filtros) => apiGet(`/admin/moderacao${montarQuery(filtros)}`)
