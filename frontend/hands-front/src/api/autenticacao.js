import { apiGet, apiPost } from '../services/api'

const ROTAS_LOGIN = {
  cliente: '/login/cliente',
  prestador: '/login/prestador',
  admin: '/login/admin',
}

export const entrar = (papel, email, senha) => apiPost(ROTAS_LOGIN[papel], { email, senha })

export const sair = () => apiPost('/logout', {})

export const buscarUsuarioAtual = () => apiGet('/me')
