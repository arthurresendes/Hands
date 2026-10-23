export const IDADE_MINIMA = 18
export const IDADE_MAXIMA = 100

export function mensagemIdade(valor) {
  const idade = Number(valor)
  if (valor === '' || valor === null || valor === undefined || Number.isNaN(idade)) return null
  if (idade < IDADE_MINIMA) return `É necessário ter ${IDADE_MINIMA} anos ou mais para usar o Hands.`
  if (idade > IDADE_MAXIMA) return 'Informe uma idade válida.'
  return null
}

export const propsCampoIdade = {
  min: IDADE_MINIMA,
  max: IDADE_MAXIMA,
  onInvalid: (e) => e.target.setCustomValidity(mensagemIdade(e.target.value) ?? ''),
  onInput: (e) => e.target.setCustomValidity(''),
}
