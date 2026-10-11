import { useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import { SearchIcon, AlertTriangleIcon, UserIcon, StarOutlineIcon, ChatIcon, IdCardIcon, CheckIcon, CloseIcon } from '../components/icons'

const tipos = ['Todos', 'Cadastro', 'Avaliação', 'Mensagem']

const itens = [
  {
    tipo: 'Cadastro',
    Icon: IdCardIcon,
    autor: 'usuario_anonimo92',
    quando: 'há 2 horas',
    motivo: 'Dado sensível suspeito',
    conteudo: 'Campo "sobre mim" preenchido com número de CPF e telefone pessoal fora dos campos indicados.',
    severidade: 'Alta',
  },
  {
    tipo: 'Avaliação',
    Icon: StarOutlineIcon,
    autor: 'cliente_7284',
    quando: 'há 5 horas',
    motivo: 'Linguagem ofensiva',
    conteudo: 'Comentário na avaliação de um prestador contém xingamentos e ameaças diretas.',
    severidade: 'Alta',
  },
  {
    tipo: 'Mensagem',
    Icon: ChatIcon,
    autor: 'prestador_marcos.s',
    quando: 'há 8 horas',
    motivo: 'Tentativa de contato fora da plataforma',
    conteudo: 'Mensagem no chat pedindo para continuar negociação por fora, compartilhando link externo de pagamento.',
    severidade: 'Média',
  },
  {
    tipo: 'Cadastro',
    Icon: IdCardIcon,
    autor: 'novo_usuario_551',
    quando: 'há 12 horas',
    motivo: 'Possível cadastro duplicado',
    conteudo: 'E-mail e CPF já associados a uma conta suspensa anteriormente por fraude.',
    severidade: 'Média',
  },
  {
    tipo: 'Avaliação',
    Icon: StarOutlineIcon,
    autor: 'cliente_3391',
    quando: 'há 1 dia',
    motivo: 'Possível avaliação falsa',
    conteudo: 'Avaliação de 5 estrelas publicada sem nenhum serviço contratado associado ao perfil.',
    severidade: 'Baixa',
  },
  {
    tipo: 'Mensagem',
    Icon: ChatIcon,
    autor: 'cliente_ana.p',
    quando: 'há 1 dia',
    motivo: 'Compartilhamento de dado sensível',
    conteudo: 'Mensagem contém número de cartão de crédito enviado por engano no chat com o prestador.',
    severidade: 'Alta',
  },
]

const severidadeStyle = {
  Alta: 'bg-red-50 text-red-500',
  Média: 'bg-yellow-50 text-yellow-600',
  Baixa: 'bg-gray-100 text-gray-500',
}

export default function AdminContent() {
  const [filtro, setFiltro] = useState('Todos')

  const filtrados = filtro === 'Todos' ? itens : itens.filter((i) => i.tipo === filtro)

  return (
    <AdminLayout title="Conteúdo" subtitle="Mensagens e cadastros sinalizados para moderação">
      <div className="bg-white rounded-2xl p-4 flex flex-col sm:flex-row gap-3 shadow-sm border border-gray-100 mb-6">
        <div className="flex-1 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <SearchIcon width={18} height={18} />
          </span>
          <input readOnly placeholder="Buscar por usuário ou palavra-chave" className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm outline-none placeholder-gray-400" />
        </div>
        <div className="flex gap-2">
          {tipos.map((t) => (
            <button
              key={t}
              onClick={() => setFiltro(t)}
              className={`text-sm font-semibold px-4 py-3 rounded-xl whitespace-nowrap transition-colors ${filtro === t ? 'bg-[#5B2EFF] text-white' : 'border border-gray-200 text-gray-500 hover:border-[#5B2EFF]/30 hover:text-[#5B2EFF]'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-center gap-3 mb-6">
        <span className="text-amber-500 flex-shrink-0">
          <AlertTriangleIcon width={20} height={20} />
        </span>
        <p className="text-sm text-amber-700">
          <span className="font-bold">{filtrados.length} itens</span> aguardando revisão da moderação
        </p>
      </div>

      <div className="space-y-4">
        {filtrados.map((item, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-[#5B2EFF]/10 flex items-center justify-center text-[#5B2EFF] flex-shrink-0">
                  <item.Icon width={18} height={18} />
                </span>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">{item.tipo}</span>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${severidadeStyle[item.severidade]}`}>{item.severidade}</span>
                  </div>
                  <p className="text-sm font-semibold text-[#1F2937] mt-0.5">{item.motivo}</p>
                </div>
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap">{item.quando}</span>
            </div>

            <p className="text-sm text-gray-500 leading-relaxed bg-[#F8F6FF] rounded-xl p-4 mb-4">{item.conteudo}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <UserIcon width={13} height={13} />
                {item.autor}
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-1.5 text-sm font-semibold text-green-600 border border-green-200 px-4 py-2 rounded-xl hover:bg-green-50 transition-colors">
                  <CheckIcon width={12} height={12} />
                  Aprovar
                </button>
                <button className="flex items-center gap-1.5 text-sm font-semibold text-red-500 border border-red-200 px-4 py-2 rounded-xl hover:bg-red-50 transition-colors">
                  <CloseIcon width={14} height={14} />
                  Remover
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  )
}
