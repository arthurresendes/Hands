import { apiGet, montarQuery } from '../../../services/api'

export const buscarPrestadores = (filtros) => apiGet(`/prestadores${montarQuery(filtros)}`)
