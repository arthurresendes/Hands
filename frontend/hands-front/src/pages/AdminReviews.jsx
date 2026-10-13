import { useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import { SearchIcon, DownloadIcon, UserIcon, BriefcaseIcon } from '../components/icons'

const papeis = ['Todos', 'Cliente', 'Prestador']

const avaliacoes = [
  { autor: 'Beatriz Carvalho', papel: 'Cliente', rating: 5, data: '28/09/2026', texto: 'A plataforma é muito intuitiva. Em menos de 5 minutos achei um pintor disponível na minha rua. Nunca foi tão fácil!' },
  { autor: 'Eduardo Fonseca', papel: 'Prestador', rating: 5, data: '25/09/2026', texto: 'Meu negócio de eletricidade cresceu muito depois que entrei no Hands. Recebo contatos todos os dias sem pagar nada.' },
  { autor: 'Roberto Nascimento', papel: 'Cliente', rating: 5, data: '22/09/2026', texto: 'Finalmente um app que respeita tanto o cliente quanto o profissional. Sem taxas abusivas e contato direto. Perfeito!' },
  { autor: 'Fernanda Lopes', papel: 'Cliente', rating: 4, data: '19/09/2026', texto: 'O processo de verificação dos profissionais me dá muita segurança. Já contratei 4 vezes e sempre fui bem atendida.' },
  { autor: 'Conceição Alves', papel: 'Prestador', rating: 5, data: '14/09/2026', texto: 'Como diarista, o Hands mudou minha vida. Tenho agenda cheia e não perco dinheiro com taxas. Obrigada pelo espaço!' },
  { autor: 'Alexandre Mota', papel: 'Cliente', rating: 5, data: '10/09/2026', texto: 'Super recomendo! Interface limpa, profissionais bem avaliados e tudo transparente. Muito melhor que outros apps.' },
  { autor: 'Marcos Silva', papel: 'Prestador', rating: 3, data: '05/09/2026', texto: 'A plataforma é boa, mas senti falta de mais filtros de busca para o cliente encontrar meu perfil com mais facilidade.' },
]

function Stars({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width="14" height="14" viewBox="0 0 14 14" fill={s <= rating ? '#FFC857' : '#E5E7EB'}>
          <path d="M7 1l1.545 3.13 3.455.502-2.5 2.437.59 3.437L7 8.885 3.91 10.506l.59-3.437L2 4.632l3.455-.502L7 1z" />
        </svg>
      ))}
    </div>
  )
}

export default function AdminReviews() {
  const [filtro, setFiltro] = useState('Todos')

  const filtradas = filtro === 'Todos' ? avaliacoes : avaliacoes.filter((a) => a.papel === filtro)
  const media = (avaliacoes.reduce((acc, a) => acc + a.rating, 0) / avaliacoes.length).toFixed(1)

  return (
    <AdminLayout title="Avaliações do Hands" subtitle="O que clientes e prestadores estão dizendo sobre a plataforma">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-sm text-gray-500 mb-1">Nota média geral</p>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-black text-[#1F2937]" style={{ fontFamily: 'Outfit, sans-serif' }}>{media}</p>
            <Stars rating={Math.round(media)} />
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-sm text-gray-500 mb-1">Total de avaliações</p>
          <p className="text-2xl font-black text-[#1F2937]" style={{ fontFamily: 'Outfit, sans-serif' }}>2.418</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-sm text-gray-500 mb-1">Novas esta semana</p>
          <p className="text-2xl font-black text-[#1F2937]" style={{ fontFamily: 'Outfit, sans-serif' }}>36</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 flex flex-col sm:flex-row gap-3 shadow-sm border border-gray-100 mb-6">
        <div className="flex-1 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <SearchIcon width={18} height={18} />
          </span>
          <input readOnly placeholder="Buscar por autor ou palavra-chave" className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm outline-none placeholder-gray-400" />
        </div>
        <div className="flex gap-2">
          {papeis.map((p) => (
            <button
              key={p}
              onClick={() => setFiltro(p)}
              className={`text-sm font-semibold px-4 py-3 rounded-xl whitespace-nowrap transition-colors ${filtro === p ? 'bg-[#5B2EFF] text-white' : 'border border-gray-200 text-gray-500 hover:border-[#5B2EFF]/30 hover:text-[#5B2EFF]'}`}
            >
              {p}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-2 bg-[#1F2937] hover:bg-black text-white font-bold px-5 py-3 rounded-xl text-sm transition-colors" style={{ fontFamily: 'Outfit, sans-serif' }}>
          <DownloadIcon />
          Exportar
        </button>
      </div>

      <div className="space-y-4">
        {filtradas.map((a, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-[#1F2937]">{a.autor}</p>
                    <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-[#5B2EFF]/10 text-[#5B2EFF]">
                      {a.papel === 'Cliente' ? <UserIcon width={10} height={10} /> : <BriefcaseIcon width={10} height={10} />}
                      {a.papel}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{a.data}</p>
                </div>
              </div>
              <Stars rating={a.rating} />
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">&ldquo;{a.texto}&rdquo;</p>
          </div>
        ))}
      </div>
    </AdminLayout>
  )
}
