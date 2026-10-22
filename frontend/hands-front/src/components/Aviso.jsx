export default function Aviso({ tipo = 'erro', children }) {
  if (!children) return null
  const estilo = tipo === 'sucesso' ? 'text-green-700 bg-green-50' : 'text-red-500 bg-red-50'
  return <p className={`text-sm rounded-xl px-4 py-3 ${estilo}`}>{children}</p>
}
