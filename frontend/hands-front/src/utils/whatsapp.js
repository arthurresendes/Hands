export function linkWhatsApp(celular, nomePrestador) {
  const digitos = (celular ?? '').replace(/\D/g, '')
  if (digitos.length < 10) return null
  const numero = digitos.startsWith('55') && digitos.length >= 12 ? digitos : `55${digitos}`
  const mensagem = `Olá${nomePrestador ? `, ${nomePrestador}` : ''}! Encontrei seu perfil no Hands e gostaria de pedir um orçamento.`
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`
}
