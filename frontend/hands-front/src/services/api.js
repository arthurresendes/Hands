const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export async function apiGet(path) {
  const response = await fetch(`${BASE_URL}/api/v1${path}`, { credentials: 'include' })
  if (!response.ok) {
    throw new Error(`Erro ${response.status} ao acessar ${path}`)
  }
  return response.json()
}
