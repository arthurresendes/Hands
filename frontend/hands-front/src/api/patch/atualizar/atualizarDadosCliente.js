import { apiPatch } from '../../../services/api'

export const atualizarDadosClientes = (dados) => apiPatch('/atualizar_cliente', dados)
