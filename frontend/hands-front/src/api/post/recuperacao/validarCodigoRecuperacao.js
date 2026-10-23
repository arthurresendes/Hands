import { apiPost } from '../../../services/api'

export const validarCodigoRecuperacao = (papel, email, codigo) => apiPost('/recuperar-senha/validar', { papel, email, codigo })
