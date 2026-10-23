export default function BotaoPrimario({ carregando, textoCarregando, children, ...props }) {
  return (
    <button
      type="submit"
      disabled={carregando}
      className="w-full bg-[#5B2EFF] hover:bg-[#4A25CC] disabled:opacity-60 text-white font-bold py-3.5 rounded-xl text-sm transition-colors"
      style={{ fontFamily: 'Outfit, sans-serif' }}
      {...props}
    >
      {carregando ? textoCarregando : children}
    </button>
  )
}
