export function formatarValor(valor) {
  if (valor === null || valor === undefined) return 'Valor a combinar'
  return `A partir de ${valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`
}

export function formatarServicos(servicos) {
  return servicos?.length ? servicos.slice(0, 2).join(' • ') : 'Prestador de serviços'
}

export function textoAvaliacoes(total) {
  return `${total} ${total === 1 ? 'avaliação' : 'avaliações'}`
}

export function tempoDesde(dataIso) {
  if (!dataIso) return null
  const dias = Math.floor((Date.now() - new Date(dataIso).getTime()) / 86400000)
  if (dias <= 0) return 'hoje'
  return `há ${dias} ${dias === 1 ? 'dia' : 'dias'}`
}

export function anoDe(dataIso) {
  return dataIso ? new Date(dataIso).getFullYear() : null
}
