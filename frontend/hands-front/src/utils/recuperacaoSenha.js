const PAPEIS = {
  cliente: { papel: 'cliente', rotulo: 'cliente', loginPath: '/login' },
  prestador: { papel: 'prestador', rotulo: 'profissional', loginPath: '/login/prestador' },
}

export const SEGUNDOS_REENVIO = 60
export const TAMANHO_CODIGO = 6
export const SENHA_MINIMA = 6

export function configRecuperacao(role) {
  const base = PAPEIS[role] ?? PAPEIS.cliente
  return { ...base, emailPath: `/recuperar-senha/${base.papel}` }
}

export const caminhoCodigo = (config) => `${config.emailPath}/codigo`
export const caminhoNovaSenha = (config) => `${config.emailPath}/nova-senha`
