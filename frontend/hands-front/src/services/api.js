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
