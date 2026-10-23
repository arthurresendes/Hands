import { apiPost } from '../../../services/api'

export const redefinirSenhaRecuperacao = (senha) => apiPost('/recuperar-senha/redefinir', { senha })
