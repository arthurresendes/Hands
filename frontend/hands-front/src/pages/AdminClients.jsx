import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import Avatar from '../components/Avatar'
import Aviso from '../components/Aviso'
import ModalConfirmacao from '../components/ModalConfirmacao'
import Paginacao from '../components/Paginacao'
import { SearchIcon, FilterIcon, DownloadIcon, EyeIcon, TrashIcon, UserIcon } from '../components/icons'
import useListaPaginada from '../hooks/useListaPaginada'
import { listarClientesAdmin } from '../api/get/admin/listagemClientesAdmin'
import { exportarClientesAdmin } from '../api/get/admin/exportarClientesAdmin'
import { deletarCliente } from '../api/delete/deletarCliente'
import { formatarData } from '../utils/formatadores'

const FILTROS_INICIAIS = {
  q: '',
  cidade: '',
  estado: '',
  cadastro_de: '',
  cadastro_ate: '',
  ordenar: '',
}

const classeCampo = 'w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#5B2EFF] placeholder-gray-400 bg-white'
const ROTULO = { singular: 'cliente', plural: 'clientes' }

export default function AdminClients() {
  const navigate = useNavigate()
  const [form, setForm] = useState(FILTROS_INICIAIS)
  const [aplicado, setAplicado] = useState(FILTROS_INICIAIS)
  const [pagina, setPagina] = useState(1)
  const [painelAberto, setPainelAberto] = useState(false)
  const [exportando, setExportando] = useState(false)
  const [erroAcao, setErroAcao] = useState('')
  const [alvo, setAlvo] = useState(null)
  const [excluindo, setExcluindo] = useState(false)
  const [erroExclusao, setErroExclusao] = useState('')
  const carregar = useCallback((filtros) => listarClientesAdmin(filtros), [])
  const { dados, carregando, erro, recarregar } = useListaPaginada(carregar, aplicado, pagina)

  const alterar = (e) => setForm((atual) => ({ ...atual, [e.target.name]: e.target.value }))

  const buscar = (e) => {
    e.preventDefault()
    setPagina(1)
    setAplicado(form)
  }

  const limpar = () => {
    setForm(FILTROS_INICIAIS)
    setPagina(1)
    setAplicado(FILTROS_INICIAIS)
  }

  const exportar = async () => {
    setErroAcao('')
    setExportando(true)
    try {
      await exportarClientesAdmin(aplicado)
    } catch (error) {
      setErroAcao(error.message)
    } finally {
      setExportando(false)
    }
  }

  const fecharModal = () => {
    setAlvo(null)
    setErroExclusao('')
  }

  const excluir = async () => {
    setExcluindo(true)
    setErroExclusao('')
    try {
      await deletarCliente(alvo.email)
      fecharModal()
      recarregar()
    } catch (error) {
      setErroExclusao(error.message)
    } finally {
      setExcluindo(false)
    }
  }

  const itens = dados?.clientes ?? []

  return (
    <AdminLayout title="Clientes" subtitle="Todos os clientes cadastrados na plataforma">
      <form onSubmit={buscar} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <SearchIcon width={18} height={18} />
            </span>
            <input name="q" value={form.q} onChange={alterar} placeholder="Buscar por nome, e-mail ou telefone" className={`${classeCampo} pl-11`} />
          </div>
          <button type="submit" className="bg-[#5B2EFF] hover:bg-[#4A25CC] text-white font-bold px-6 py-3 rounded-xl text-sm" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Buscar
          </button>
          <button
            type="button"
            onClick={() => setPainelAberto(!painelAberto)}
            className="flex items-center gap-2 text-sm font-semibold text-gray-500 border border-gray-200 px-5 py-3 rounded-xl hover:border-[#5B2EFF]/30 hover:text-[#5B2EFF] transition-colors"
          >
            <FilterIcon />
            Filtrar
          </button>
          <button
            type="button"
            onClick={exportar}
            disabled={exportando}
            className="flex items-center gap-2 bg-[#1F2937] hover:bg-black disabled:opacity-60 text-white font-bold px-5 py-3 rounded-xl text-sm transition-colors"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            <DownloadIcon />
            {exportando ? 'Exportando...' : 'Exportar CSV'}
          </button>
        </div>

        {painelAberto && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4 pt-4 border-t border-gray-100">
            <input name="cidade" value={form.cidade} onChange={alterar} placeholder="Cidade" className={classeCampo} />
            <input name="estado" value={form.estado} onChange={alterar} maxLength={2} placeholder="UF" className={classeCampo} />
            <label className="text-xs text-gray-400">
              Cadastro a partir de
              <input type="date" name="cadastro_de" value={form.cadastro_de} onChange={alterar} className={`${classeCampo} mt-1`} />
            </label>
            <label className="text-xs text-gray-400">
              Cadastro até
              <input type="date" name="cadastro_ate" value={form.cadastro_ate} onChange={alterar} className={`${classeCampo} mt-1`} />
            </label>
            <select name="ordenar" value={form.ordenar} onChange={alterar} className={classeCampo}>
              <option value="">Ordenar: mais recentes</option>
              <option value="antigos">Mais antigos</option>
              <option value="nome">Nome (A-Z)</option>
            </select>
            <button type="button" onClick={limpar} className="text-sm font-semibold text-gray-400 hover:text-[#5B2EFF] px-3 py-2 text-left">
              Limpar filtros
            </button>
          </div>
        )}
      </form>

      {(erro || erroAcao) && <div className="mb-5"><Aviso>{erro || erroAcao}</Aviso></div>}

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className={`overflow-x-auto ${carregando ? 'opacity-60' : ''}`}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs text-gray-400 uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Cliente</th>
                <th className="px-6 py-4 font-semibold">CEP</th>
                <th className="px-6 py-4 font-semibold">Avaliações feitas</th>
                <th className="px-6 py-4 font-semibold">Telefone</th>
                <th className="px-6 py-4 font-semibold">Cadastro</th>
                <th className="px-6 py-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {itens.map((item) => (
                <tr
                  key={item._id}
                  onClick={() => navigate(`/admin/clientes/${item._id}`)}
                  className="border-b border-gray-50 last:border-0 hover:bg-[#F8F6FF]/50 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar papel="cliente" id={item._id} className="w-9 h-9 rounded-full flex-shrink-0">
                        <div className="w-9 h-9 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-gray-400">
                          <UserIcon width={16} height={16} />
                        </div>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-[#1F2937]">{item.nome}</p>
                        <p className="text-xs text-gray-400">{item.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{item.cep ?? '—'}</td>
                  <td className="px-6 py-4 text-gray-500">{item.avaliacoes_feitas}</td>
                  <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{item.celular || '—'}</td>
                  <td className="px-6 py-4 text-gray-500">{formatarData(item.cadastrado_em)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/admin/clientes/${item._id}`)
                        }}
                        aria-label="Ver detalhes"
                        className="text-gray-400 hover:text-[#5B2EFF] p-2 rounded-lg"
                      >
                        <EyeIcon width={16} height={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setAlvo(item)
                        }}
                        aria-label="Excluir cliente"
                        className="text-gray-400 hover:text-red-500 p-2 rounded-lg"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Paginacao resultado={dados} rotulo={ROTULO} onMudar={setPagina} />
      </div>

      <ModalConfirmacao
        aberto={Boolean(alvo)}
        titulo="Excluir cliente?"
        texto={alvo ? `A conta de ${alvo.nome} (${alvo.email}) será excluída permanentemente. Essa ação não pode ser desfeita.` : ''}
        confirmar="Excluir cliente"
        carregando={excluindo}
        erro={erroExclusao}
        onConfirmar={excluir}
        onCancelar={fecharModal}
      />
    </AdminLayout>
  )
}
