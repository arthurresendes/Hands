import { apiGet, apiPost } from '../services/api'

const ROTAS_LOGIN = {
  cliente: '/login/cliente',
  prestador: '/login/prestador',
  admin: '/login/admin',
}

export const entrar = (papel, email, senha, lembrar = false) => apiPost(ROTAS_LOGIN[papel], { email, senha, lembrar })

export const sair = () => apiPost('/logout', {})

export const buscarUsuarioAtual = () => apiGet('/me')
