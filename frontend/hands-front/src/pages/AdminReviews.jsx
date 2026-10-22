import { useCallback, useMemo, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import Avatar from '../components/Avatar'
import Aviso from '../components/Aviso'
import Estrelas from '../components/Estrelas'
import Paginacao from '../components/Paginacao'
import { SearchIcon, DownloadIcon, UserIcon, BriefcaseIcon } from '../components/icons'
import useListaPaginada from '../hooks/useListaPaginada'
import { listarAvaliacoesHandsAdmin } from '../api/get/admin/listagemAvaliacoesHandsAdmin'
import { exportarAvaliacoesHandsAdmin } from '../api/get/admin/exportarAvaliacoesHandsAdmin'
import { formatarData } from '../utils/formatadores'

const ABAS = [
  { rotulo: 'Todos', papel: '' },
  { rotulo: 'Cliente', papel: 'cliente' },
  { rotulo: 'Prestador', papel: 'prestador' },
]

const NOTAS = ['5', '4.5', '4', '3.5', '3', '2.5', '2', '1.5', '1']

const ROTULO = { singular: 'avaliação', plural: 'avaliações' }
const ROTULO_PAPEL = { cliente: 'Cliente', prestador: 'Prestador' }
const classeCampo = 'w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#5B2EFF] placeholder-gray-400 bg-white'

const formatarNota = (valor) => Number(valor).toFixed(1)

export default function AdminReviews() {
  const [papel, setPapel] = useState('')
  const [form, setForm] = useState({ q: '', nota: '' })
  const [aplicado, setAplicado] = useState({ q: '', nota: '' })
  const [pagina, setPagina] = useState(1)
  const [exportando, setExportando] = useState(false)
  const [erroAcao, setErroAcao] = useState('')

  const filtros = useMemo(() => ({ ...aplicado, papel }), [aplicado, papel])
  const carregar = useCallback((parametros) => listarAvaliacoesHandsAdmin(parametros), [])
  const { dados, carregando, erro } = useListaPaginada(carregar, filtros, pagina)

  const trocarAba = (novoPapel) => {
    setPapel(novoPapel)
    setPagina(1)
  }

  const buscar = (e) => {
    e.preventDefault()
    setPagina(1)
    setAplicado(form)
  }

  const exportar = async () => {
    setErroAcao('')
    setExportando(true)
    try {
      await exportarAvaliacoesHandsAdmin(filtros)
    } catch (error) {
      setErroAcao(error.message)
    } finally {
      setExportando(false)
    }
  }

  const resumo = dados?.resumo
  const avaliacoes = dados?.avaliacoes ?? []
  const rotuloAba = ABAS.find((a) => a.papel === papel).rotulo

  return (
    <AdminLayout title="Avaliações do Hands" subtitle="O que clientes e prestadores estão dizendo sobre a plataforma">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-sm text-gray-500 mb-1">Nota média geral</p>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-black text-[#1F2937]" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {resumo ? (resumo.media === null ? '—' : formatarNota(resumo.media)) : '…'}
            </p>
            {resumo?.media !== null && resumo && <Estrelas nota={resumo.media} />}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-sm text-gray-500 mb-1">Total de avaliações</p>
          <p className="text-2xl font-black text-[#1F2937]" style={{ fontFamily: 'Outfit, sans-serif' }}>
            {resumo ? resumo.total.toLocaleString('pt-BR') : '…'}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-sm text-gray-500 mb-1">Novas esta semana</p>
          <p className="text-2xl font-black text-[#1F2937]" style={{ fontFamily: 'Outfit, sans-serif' }}>
            {resumo ? resumo.novas_semana.toLocaleString('pt-BR') : '…'}
          </p>
        </div>
      </div>

      <form onSubmit={buscar} className="bg-white rounded-2xl p-4 flex flex-col lg:flex-row gap-3 shadow-sm border border-gray-100 mb-6">
        <div className="flex-1 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <SearchIcon width={18} height={18} />
          </span>
          <input
            value={form.q}
            onChange={(e) => setForm((atual) => ({ ...atual, q: e.target.value }))}
            placeholder="Buscar por autor ou palavra-chave"
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
        <div className="flex gap-2">
          {ABAS.map((a) => (
            <button
              key={a.rotulo}
              type="button"
              onClick={() => trocarAba(a.papel)}
              className={`text-sm font-semibold px-4 py-3 rounded-xl whitespace-nowrap transition-colors ${papel === a.papel ? 'bg-[#5B2EFF] text-white' : 'border border-gray-200 text-gray-500 hover:border-[#5B2EFF]/30 hover:text-[#5B2EFF]'}`}
            >
              {a.rotulo}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={exportar}
          disabled={exportando}
          title={`Exporta todas as avaliações: ${rotuloAba.toLowerCase()}`}
          className="flex items-center gap-2 bg-[#1F2937] hover:bg-black disabled:opacity-60 text-white font-bold px-5 py-3 rounded-xl text-sm transition-colors"
          style={{ fontFamily: 'Outfit, sans-serif' }}
        >
          <DownloadIcon />
          {exportando ? 'Exportando...' : 'Exportar CSV'}
        </button>
      </form>

      {(erro || erroAcao) && <div className="mb-5"><Aviso>{erro || erroAcao}</Aviso></div>}

      {!carregando && !erro && avaliacoes.length === 0 && (
        <p className="text-center text-gray-400 text-sm py-16">Nenhuma avaliação encontrada com esses filtros.</p>
      )}

      <div className={`space-y-4 ${carregando ? 'opacity-60' : ''}`}>
        {avaliacoes.map((a) => (
          <div key={a._id} className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <Avatar papel={a.papel} id={a.papel ? a.autor_id : null} className="w-10 h-10 rounded-full flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-gray-400">
                    <UserIcon width={16} height={16} />
                  </div>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-[#1F2937]">{a.autor}</p>
                    {a.papel && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-[#5B2EFF]/10 text-[#5B2EFF]">
                        {a.papel === 'cliente' ? <UserIcon width={10} height={10} /> : <BriefcaseIcon width={10} height={10} />}
                        {ROTULO_PAPEL[a.papel]}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{[a.autor_email, formatarData(a.data)].filter(Boolean).join(' • ')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#1F2937]">{formatarNota(a.nota)}</span>
                <Estrelas nota={a.nota} />
              </div>
            </div>
            {a.mensagem && <p className="text-sm text-gray-500 leading-relaxed">&ldquo;{a.mensagem}&rdquo;</p>}
            {a.criterios && (
              <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3 text-xs text-gray-400">
                <span>Facilidade: <b className="text-gray-600">{a.criterios.facilidade}</b></span>
                <span>Qualidade: <b className="text-gray-600">{a.criterios.qualidade}</b></span>
                <span>Confiabilidade: <b className="text-gray-600">{a.criterios.confiabilidade}</b></span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 mt-4">
        <Paginacao resultado={dados} rotulo={ROTULO} onMudar={setPagina} />
      </div>
    </AdminLayout>
  )
}
