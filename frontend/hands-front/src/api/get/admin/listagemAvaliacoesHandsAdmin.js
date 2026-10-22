import { apiGet, montarQuery } from '../../../services/api'

export const listarAvaliacoesHandsAdmin = (filtros) => apiGet(`/admin/avaliacoes-hands${montarQuery(filtros)}`)
