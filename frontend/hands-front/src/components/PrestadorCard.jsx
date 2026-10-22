import Avatar from './Avatar'
import Estrelas from './Estrelas'
import { PinIcon, HeartIcon } from './icons'
import { formatarServicos, formatarValor, textoAvaliacoes } from '../utils/formatadores'

export default function PrestadorCard({ prestador: p, onFavoritar, onVerPerfil }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-200 hover:-translate-y-1 transition-all">
      <div className="relative h-40 bg-[#F3F4F6] flex items-center justify-center">
        <Avatar papel="prestador" id={p._id} className="w-20 h-20 rounded-full">
          <div className="w-16 h-16 rounded-full bg-gray-300" />
        </Avatar>
        <button
          onClick={() => onFavoritar(p)}
          aria-label={p.favorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          className={`absolute top-3 right-3 w-10 h-10 rounded-xl border flex items-center justify-center bg-white transition-colors ${p.favorito ? 'border-red-200 text-red-500' : 'border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200'}`}
        >
          <HeartIcon width={18} height={18} fill={p.favorito ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-[#1F2937]" style={{ fontFamily: 'Outfit, sans-serif' }}>{p.nome}</h3>
        <p className="text-sm text-gray-500 mt-0.5 mb-2">{formatarServicos(p.servicos)}</p>
        <div className="flex items-center gap-2 mb-2">
          {p.nota_media === null ? (
            <span className="text-xs text-gray-400">Ainda sem avaliações</span>
          ) : (
            <>
              <Estrelas nota={p.nota_media} tamanho={13} />
              <span className="text-sm font-bold text-[#1F2937]">{p.nota_media.toFixed(1)}</span>
              <span className="text-xs text-gray-400">({textoAvaliacoes(p.total_avaliacoes)})</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
          <PinIcon width={12} height={12} />
          {p.cidade ?? 'Localização não informada'}
          {p.distancia_km !== null && p.distancia_km !== undefined && ` • ${p.distancia_km.toLocaleString('pt-BR')} km`}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-[#5B2EFF]">{formatarValor(p.valor)}</span>
          <button
            onClick={() => onVerPerfil(p)}
            className="text-sm font-semibold bg-[#5B2EFF]/10 text-[#5B2EFF] px-4 py-2 rounded-xl hover:bg-[#5B2EFF] hover:text-white transition-colors"
          >
            Ver Perfil
          </button>
        </div>
      </div>
    </div>
  )
}
