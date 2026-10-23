import { apiGet, montarQuery } from '../../../services/api'

export const listarAvaliacoesRecebidas = (parametros) => apiGet(`/prestador/avaliacoes${montarQuery(parametros)}`)
