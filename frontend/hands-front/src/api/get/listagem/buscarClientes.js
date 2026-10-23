import { apiGet, montarQuery } from '../../../services/api'

export const buscarClientes = (filtros) => apiGet(`/clientes${montarQuery(filtros)}`)
