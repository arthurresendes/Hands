const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const FOTO_BASE_URL = `${BASE_URL}/api/v1/foto`

function mensagemDeErro(data, status) {
  const detalhe = data?.detail
  if (typeof detalhe === 'string') return detalhe
  if (Array.isArray(detalhe) && detalhe.length > 0) {
    return detalhe.map((item) => item.msg).join('. ')
  }
  return `Erro ${status} ao acessar o servidor`
}

async function requisitar(path, opcoes = {}) {
  const response = await fetch(`${BASE_URL}/api/v1${path}`, { credentials: 'include', ...opcoes })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const erro = new Error(mensagemDeErro(data, response.status))
    erro.status = response.status
    throw erro
  }
  return data
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
  const response = await fetch(`${BASE_URL}/api/v1${path}`, { credentials: 'include' })
  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    const erro = new Error(mensagemDeErro(data, response.status))
    erro.status = response.status
    throw erro
  }
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
