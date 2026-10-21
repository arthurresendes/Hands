const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1'

export async function apiGet(path) {
  const response = await fetch(`${API_URL}${path}`, { credentials: 'include' })
  if (!response.ok) {
    throw new Error(`Erro ${response.status} ao acessar ${path}`)
  }
  return response.json()
}
