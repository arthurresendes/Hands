import { apiGet, montarQuery } from '../../../services/api'

export const listarMinhasAvaliacoesFeitas = (parametros) => apiGet(`/minhas-avaliacoes-feitas${montarQuery(parametros)}`)
