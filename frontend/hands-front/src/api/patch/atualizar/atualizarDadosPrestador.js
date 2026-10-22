import { apiPatch } from '../../../services/api'

export const atualizarDadosPrestador = (dados) => apiPatch('/atualizar_prestador', dados)
