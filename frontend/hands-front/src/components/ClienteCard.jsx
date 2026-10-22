import Avatar from './Avatar'
import Estrelas from './Estrelas'
import { PinIcon, UserIcon } from './icons'
import { textoAvaliacoes } from '../utils/formatadores'

export default function ClienteCard({ cliente: c, onVerPerfil }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-xl hover:shadow-gray-200 hover:-translate-y-1 transition-all">
      <div className="flex items-center gap-4 mb-4">
        <Avatar papel="cliente" id={c._id} className="w-14 h-14 rounded-full">
          <div className="w-14 h-14 rounded-full bg-[#5B2EFF]/10 flex items-center justify-center text-[#5B2EFF]">
            <UserIcon width={22} height={22} />
          </div>
        </Avatar>
        <div className="min-w-0">
          <h3 className="font-bold text-[#1F2937] truncate" style={{ fontFamily: 'Outfit, sans-serif' }}>{c.nome}</h3>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <PinIcon width={12} height={12} />
            {c.cidade ?? 'Localização não informada'}
            {c.distancia_km !== null && c.distancia_km !== undefined && ` • ${c.distancia_km.toLocaleString('pt-BR')} km`}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 mb-4">
        {c.nota_media === null ? (
          <span className="text-xs text-gray-400">Ainda sem avaliações</span>
        ) : (
          <>
            <Estrelas nota={c.nota_media} tamanho={13} />
            <span className="text-sm font-bold text-[#1F2937]">{c.nota_media.toFixed(1)}</span>
            <span className="text-xs text-gray-400">({textoAvaliacoes(c.total_avaliacoes)})</span>
          </>
        )}
      </div>
      <div className="flex items-center justify-between">
        {c.avaliado_por_mim ? (
          <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg">Avaliado por você</span>
        ) : (
          <span />
        )}
        <button
          onClick={() => onVerPerfil(c)}
          className="text-sm font-semibold bg-[#5B2EFF]/10 text-[#5B2EFF] px-4 py-2 rounded-xl hover:bg-[#5B2EFF] hover:text-white transition-colors"
        >
          Ver Perfil
        </button>
      </div>
    </div>
  )
}
