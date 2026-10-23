import { useCallback, useMemo, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import Avatar from '../components/Avatar'
import Aviso from '../components/Aviso'
import Estrelas from '../components/Estrelas'
import ModalConfirmacao from '../components/ModalConfirmacao'
import Paginacao from '../components/Paginacao'
import { SearchIcon, TrashIcon, UserIcon, BriefcaseIcon } from '../components/icons'
import useEstadoPainel from '../hooks/useEstadoPainel'
import useListaPaginada from '../hooks/useListaPaginada'
import { listarModeracaoAdmin } from '../api/get/admin/listagemModeracaoAdmin'
import { excluirAvaliacaoAdmin } from '../api/delete/excluirAvaliacaoAdmin'
import { formatarData } from '../utils/formatadores'

const ABAS = [
  { rotulo: 'Todas', origem: '' },
  { rotulo: 'Clientes → Prestadores', origem: 'cliente_para_prestador' },
  { rotulo: 'Prestadores → Clientes', origem: 'prestador_para_cliente' },
]

const FILTROS_INICIAIS = { q: '', nota: '' }
const NOTAS = ['5', '4.5', '4', '3.5', '3', '2.5', '2', '1.5', '1']
const ROTULO = { singular: 'avaliação', plural: 'avaliações' }
const ROTULO_PAPEL = { cliente: 'Cliente', prestador: 'Prestador' }
const classeCampo = 'w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#5B2EFF] placeholder-gray-400 bg-white'

function Pessoa({ rotulo, nome, email, id, papel }) {
  const Icone = papel === 'cliente' ? UserIcon : BriefcaseIcon
  return (
    <div className="flex items-center gap-3 min-w-0">
      <Avatar papel={papel} id={id} className="w-10 h-10 rounded-full flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-gray-400">
          <Icone width={16} height={16} />
        </div>
      </Avatar>
      <div className="min-w-0">
        <p className="text-xs text-gray-400">{rotulo} · {ROTULO_PAPEL[papel]}</p>
        <p className="text-sm font-semibold text-[#1F2937] truncate">{nome}</p>
        <p className="text-xs text-gray-400 truncate">{email}</p>
      </div>
    </div>
  )
}

export default function AdminModeration() {
  const [origem, setOrigem] = useEstadoPainel('admin.moderacao.origem', '')
  const [form, setForm] = useEstadoPainel('admin.moderacao.form', FILTROS_INICIAIS)
  const [aplicado, setAplicado] = useEstadoPainel('admin.moderacao.aplicado', FILTROS_INICIAIS)
  const [pagina, setPagina] = useEstadoPainel('admin.moderacao.pagina', 1)
  const [alvoExclusao, setAlvoExclusao] = useState(null)
  const [excluindo, setExcluindo] = useState(false)
  const [erroExclusao, setErroExclusao] = useState('')

  const filtros = useMemo(() => ({ ...aplicado, origem }), [aplicado, origem])
  const carregar = useCallback((parametros) => listarModeracaoAdmin(parametros), [])
  const { dados, carregando, erro, recarregar } = useListaPaginada(carregar, filtros, pagina, 'admin.moderacao')

  const trocarAba = (novaOrigem) => {
    setOrigem(novaOrigem)
    setPagina(1)
  }

  const buscar = (e) => {
    e.preventDefault()
    setPagina(1)
    setAplicado(form)
  }

  const fecharModal = () => {
    setAlvoExclusao(null)
    setErroExclusao('')
  }

  const confirmarExclusao = async () => {
    setExcluindo(true)
    setErroExclusao('')
    try {
      await excluirAvaliacaoAdmin(alvoExclusao.origem, alvoExclusao._id)
      fecharModal()
      if (dados.avaliacoes.length === 1 && pagina > 1) setPagina(pagina - 1)
      else recarregar()
    } catch (error) {
      setErroExclusao(error.message)
    } finally {
      setExcluindo(false)
    }
  }

  const avaliacoes = dados?.avaliacoes ?? []

  return (
    <AdminLayout title="Moderação de avaliações" subtitle="Avaliações entre clientes e prestadores. Exclua as que tiverem conteúdo impróprio.">
      <form onSubmit={buscar} className="bg-white rounded-2xl p-4 flex flex-col lg:flex-row gap-3 shadow-sm border border-gray-100 mb-4">
        <div className="flex-1 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <SearchIcon width={18} height={18} />
          </span>
          <input
            value={form.q}
            onChange={(e) => setForm((atual) => ({ ...atual, q: e.target.value }))}
            placeholder="Buscar por nome, e-mail ou palavra da mensagem"
            className={`${classeCampo} pl-11`}
          />
        </div>
        <select
          value={form.nota}
          onChange={(e) => setForm((atual) => ({ ...atual, nota: e.target.value }))}
          aria-label="Filtrar por nota"
          className={`${classeCampo} lg:w-44`}
        >
          <option value="">Qualquer nota</option>
          {NOTAS.map((n) => (
            <option key={n} value={n}>Nota {Number(n).toFixed(1)}</option>
          ))}
        </select>
        <button type="submit" className="bg-[#5B2EFF] hover:bg-[#4A25CC] text-white font-bold px-6 py-3 rounded-xl text-sm" style={{ fontFamily: 'Outfit, sans-serif' }}>
          Buscar
        </button>
      </form>

      <div className="flex flex-wrap gap-2 mb-6">
        {ABAS.map((a) => (
          <button
            key={a.rotulo}
            type="button"
            onClick={() => trocarAba(a.origem)}
            className={`text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors ${origem === a.origem ? 'bg-[#5B2EFF] text-white' : 'bg-white border border-gray-200 text-gray-500 hover:border-[#5B2EFF]/30 hover:text-[#5B2EFF]'}`}
          >
            {a.rotulo}
          </button>
        ))}
      </div>

      {erro && <div className="mb-5"><Aviso>{erro}</Aviso></div>}

      {!carregando && !erro && avaliacoes.length === 0 && (
        <p className="text-center text-gray-400 text-sm py-16">Nenhuma avaliação encontrada com esses filtros.</p>
      )}

      <div className={`space-y-4 ${carregando ? 'opacity-60' : ''}`}>
        {avaliacoes.map((a) => (
          <div key={`${a.origem}-${a._id}`} className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 min-w-0">
                <Pessoa rotulo="Autor" nome={a.autor} email={a.autor_email} id={a.autor_id} papel={a.autor_papel} />
                <Pessoa rotulo="Avaliado" nome={a.alvo} email={a.alvo_email} id={a.alvo_id} papel={a.alvo_papel} />
              </div>
              <div className="flex items-center justify-between md:justify-end gap-3 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#1F2937]">{a.nota.toFixed(1)}</span>
                  <Estrelas nota={a.nota} />
                </div>
                <button
                  type="button"
                  onClick={() => setAlvoExclusao(a)}
                  aria-label="Excluir avaliação"
                  className="flex items-center gap-1.5 text-xs font-semibold text-red-500 border border-red-100 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
                >
                  <TrashIcon width={14} height={14} />
                  Excluir
                </button>
              </div>
            </div>
            {a.mensagem
              ? <p className="text-sm text-gray-500 leading-relaxed break-words">&ldquo;{a.mensagem}&rdquo;</p>
              : <p className="text-sm text-gray-300 italic">Sem mensagem</p>}
            <p className="text-xs text-gray-400 mt-2">{formatarData(a.data)}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 mt-4">
        <Paginacao resultado={dados} rotulo={ROTULO} onMudar={setPagina} />
      </div>

      <ModalConfirmacao
        aberto={Boolean(alvoExclusao)}
        titulo="Excluir esta avaliação?"
        texto={alvoExclusao ? `A avaliação de ${alvoExclusao.autor} sobre ${alvoExclusao.alvo} será removida de forma definitiva e a nota deixará de contar na média.` : ''}
        confirmar="Excluir avaliação"
        carregando={excluindo}
        erro={erroExclusao}
        onConfirmar={confirmarExclusao}
        onCancelar={fecharModal}
      />
    </AdminLayout>
  )
}
