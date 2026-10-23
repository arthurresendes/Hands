import { apiPost } from '../../../services/api'

export const solicitarCodigoRecuperacao = (papel, email) => apiPost('/recuperar-senha/solicitar', { papel, email })
