import { apiGet } from './api'

// Hero e Stats usam as mesmas estatísticas: guarda a promise para fazer uma única requisição
let estatisticasPromise = null

export function getEstatisticas() {
  if (!estatisticasPromise) {
    estatisticasPromise = apiGet('/landing/estatisticas').catch((error) => {
      estatisticasPromise = null
      throw error
    })
  }
  return estatisticasPromise
}

export async function getCategorias() {
  const data = await apiGet('/landing/categorias')
  return data.categorias
}

export async function getPrestadoresDestaque() {
  const data = await apiGet('/landing/prestadores_destaque')
  return data.prestadores
}

export function getAvaliacoesHands() {
  return apiGet('/landing/avaliacoes_hands')
}
