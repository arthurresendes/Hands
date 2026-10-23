export default function Aviso({ tipo = 'erro', children }) {
  if (!children) return null
  const estilos = {
    sucesso: 'text-green-700 bg-green-50',
    atencao: 'text-amber-700 bg-amber-50',
    erro: 'text-red-500 bg-red-50',
  }
  const estilo = estilos[tipo] ?? estilos.erro
  return <p className={`text-sm rounded-xl px-4 py-3 ${estilo}`}>{children}</p>
}
