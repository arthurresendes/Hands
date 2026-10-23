const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const FOTO_BASE_URL = `${BASE_URL}/api/v1/foto`

const MENSAGEM_REDE = 'Não foi possível conectar ao servidor. Verifique sua internet e tente novamente.'
const MENSAGEM_SERVIDOR = 'Estamos com uma instabilidade no momento. Tente novamente em instantes.'
const MENSAGEM_SESSAO = 'Sua sessão expirou. Entre novamente para continuar.'

const MENSAGENS_STATUS = {
  400: 'Não foi possível concluir a solicitação. Confira os dados e tente novamente.',
  401: MENSAGEM_SESSAO,
  403: 'Você não tem permissão para realizar esta ação.',
  404: 'Não encontramos o que você procurava.',
  409: 'Esses dados já estão em uso.',
  413: 'O arquivo enviado é grande demais.',
  422: 'Alguns dados estão inválidos. Confira os campos e tente novamente.',
  429: 'Muitas tentativas em pouco tempo. Aguarde um instante e tente novamente.',
}

const ROTAS_SEM_EXPIRACAO = ['/login', '/me', '/logout', '/recuperar-senha']

let aoExpirarSessao = null

export function registrarAoExpirarSessao(funcao) {
  aoExpirarSessao = funcao
}

function mensagemDeErro(data, status) {
  if (status >= 500) return MENSAGEM_SERVIDOR
  const detalhe = data?.detail
  if (typeof detalhe === 'string' && detalhe) return detalhe
  if (Array.isArray(detalhe) && detalhe.length > 0) {
    const mensagens = detalhe.map((item) => item.msg).filter(Boolean)
    if (mensagens.length > 0) return mensagens.join('. ')
  }
  return MENSAGENS_STATUS[status] ?? MENSAGEM_SERVIDOR
}

async function buscar(path, opcoes) {
  try {
    return await fetch(`${BASE_URL}/api/v1${path}`, { credentials: 'include', ...opcoes })
  } catch {
    throw new Error(MENSAGEM_REDE)
  }
}

async function erroDaResposta(path, response) {
  const data = await response.json().catch(() => ({}))
  const erro = new Error(response.status === 401 && !path.startsWith('/login') ? MENSAGEM_SESSAO : mensagemDeErro(data, response.status))
  erro.status = response.status
  if (response.status === 401 && !ROTAS_SEM_EXPIRACAO.some((rota) => path.startsWith(rota))) {
    aoExpirarSessao?.()
  }
  return erro
}

async function requisitar(path, opcoes = {}) {
  const response = await buscar(path, opcoes)
  if (!response.ok) throw await erroDaResposta(path, response)
  return response.json().catch(() => ({}))
}

export function montarQuery(filtros = {}) {
  const parametros = new URLSearchParams()
  Object.entries(filtros).forEach(([chave, valor]) => {
    if (valor !== undefined && valor !== null && valor !== '' && valor !== false) {
      parametros.append(chave, valor)
    }
  })
  const texto = parametros.toString()
  return texto ? `?${texto}` : ''
}

export function montarFormData(campos, foto) {
  const formData = new FormData()
  Object.entries(campos).forEach(([nome, valor]) => {
    if (Array.isArray(valor)) {
      valor.forEach((item) => formData.append(nome, item))
    } else {
      formData.append(nome, valor)
    }
  })
  if (foto) formData.append('foto', foto)
  return formData
}

export function apiGet(path) {
  return requisitar(path)
}

export function apiPost(path, corpo) {
  return requisitar(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(corpo),
  })
}

export function apiPostForm(path, formData) {
  return requisitar(path, { method: 'POST', body: formData })
}

export function apiPatch(path, corpo) {
  return requisitar(path, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(corpo),
  })
}

export function apiDelete(path) {
  return requisitar(path, { method: 'DELETE' })
}

export async function apiDownload(path, nomePadrao = 'exportacao.csv') {
  const response = await buscar(path)
  if (!response.ok) throw await erroDaResposta(path, response)
  const arquivo = response.headers.get('Content-Disposition')?.match(/filename="([^"]+)"/)?.[1] ?? nomePadrao
  const url = URL.createObjectURL(await response.blob())
  const link = document.createElement('a')
  link.href = url
  link.download = arquivo
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
