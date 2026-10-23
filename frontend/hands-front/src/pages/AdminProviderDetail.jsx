import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import Avatar from '../components/Avatar'
import Aviso from '../components/Aviso'
import Estrelas from '../components/Estrelas'
import ModalConfirmacao from '../components/ModalConfirmacao'
import { MailIcon, PinIcon, ChatIcon, AwardIcon, TrashIcon, UserIcon, CoinIcon } from '../components/icons'
import { buscarPrestador } from '../api/get/detalhe/detalhePrestador'
import { deletarPrestador } from '../api/delete/deletarPrestador'
import { anoDe, formatarData, textoAvaliacoes, formatarServicos, formatarValor } from '../utils/formatadores'

export default function AdminProviderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [registro, setRegistro] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [confirmando, setConfirmando] = useState(false)
  const [excluindo, setExcluindo] = useState(false)
  const [erroExclusao, setErroExclusao] = useState('')

  const carregar = useCallback(async () => {
    setRegistro(await buscarPrestador(id))
  }, [id])

  useEffect(() => {
    let ativo = true
    setCarregando(true)
    setErro('')
    carregar()
      .catch((error) => ativo && setErro(error.message))
      .finally(() => ativo && setCarregando(false))
    return () => {
      ativo = false
    }
  }, [carregar])

  const voltar = () => navigate('/admin/prestadores')

  const excluir = async () => {
    setExcluindo(true)
    setErroExclusao('')
    try {
      await deletarPrestador(registro.email)
      voltar()
    } catch (error) {
      setErroExclusao(error.message)
      setExcluindo(false)
    }
  }

  if (carregando) {
    return (
      <AdminLayout title="Prestador">
        <div className="bg-white rounded-2xl h-72 animate-pulse" />
      </AdminLayout>
    )
  }

  if (erro || !registro) {
    return (
      <AdminLayout title="Prestador">
        <div className="max-w-xl mx-auto text-center py-16">
          <Aviso>{erro || 'Prestador não encontrado.'}</Aviso>
          <button onClick={voltar} className="mt-6 bg-[#5B2EFF] hover:bg-[#4A25CC] text-white font-bold px-7 py-3.5 rounded-xl text-sm" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Voltar para a listagem
          </button>
        </div>
      </AdminLayout>
    )
  }

  const desde = anoDe(registro.cadastrado_em)
  const temNota = registro.nota_media !== null

  return (
    <AdminLayout title="Prestador" subtitle="Detalhes da conta">
      <button onClick={voltar} className="text-sm font-semibold text-gray-500 hover:text-[#5B2EFF] mb-4">
        ← Voltar para prestadores
      </button>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <Avatar papel="prestador" id={registro._id} className="w-24 h-24 rounded-2xl flex-shrink-0">
              <div className="w-24 h-24 rounded-2xl bg-gray-200 flex-shrink-0 flex items-center justify-center text-gray-400">
                <UserIcon width={32} height={32} />
              </div>
            </Avatar>
            <div>
              <h2 className="text-2xl font-black text-[#1F2937]" style={{ fontFamily: 'Outfit, sans-serif' }}>{registro.nome}</h2>
              <p className="text-gray-500 text-sm mt-1">{formatarServicos(registro.servicos)}</p>
            </div>
          </div>
          <button
            onClick={() => setConfirmando(true)}
            className="flex items-center gap-2 border border-red-200 text-red-500 font-semibold px-5 py-3 rounded-xl text-sm hover:bg-red-50 transition-colors"
          >
            <TrashIcon />
            Excluir prestador
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-6 pt-6 border-t border-gray-100">
          <div className="flex items-center gap-2">
            {temNota ? (
              <>
                <Estrelas nota={registro.nota_media} tamanho={16} />
                <span className="font-bold text-[#1F2937]">{registro.nota_media.toFixed(1)}</span>
                <span className="text-sm text-gray-400">({textoAvaliacoes(registro.total_avaliacoes)})</span>
              </>
            ) : (
              <span className="text-sm text-gray-400">Ainda sem avaliações</span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <MailIcon width={16} height={16} />
            {registro.email}
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <ChatIcon width={16} height={16} />
            {registro.celular || 'Telefone não informado'}
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <PinIcon width={16} height={16} />
            {registro.cidade ?? 'Localização não informada'}
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <CoinIcon width={16} height={16} />
            {formatarValor(registro.valor)}
          </div>
          {desde && (
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <AwardIcon width={16} height={16} />
              Cadastrado em {formatarData(registro.cadastrado_em)}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-[#1F2937] mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>Sobre</h2>
            <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">
              {registro.informacoes || 'Nenhuma descrição informada.'}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-[#1F2937] mb-5" style={{ fontFamily: 'Outfit, sans-serif' }}>Avaliações recebidas</h2>
            {registro.avaliacoes.length === 0 && <p className="text-sm text-gray-400">Ainda não recebeu avaliações.</p>}
            <div className="space-y-5">
              {registro.avaliacoes.map((r) => (
                <div key={r._id} className="pb-5 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-[#1F2937]">{r.autor}</p>
                    <Estrelas nota={r.nota} />
                  </div>
                  {r.mensagem && <p className="text-sm text-gray-500 leading-relaxed">{r.mensagem}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-[#1F2937] mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Serviços oferecidos</h2>
            <div className="flex flex-wrap gap-2">
              {registro.servicos.length === 0 && <p className="text-sm text-gray-400">Nenhum serviço informado.</p>}
              {registro.servicos.map((servico) => (
                <span key={servico} className="text-xs font-semibold bg-[#F8F6FF] text-[#5B2EFF] px-3 py-1.5 rounded-full">{servico}</span>
              ))}
            </div>
          </div>
          {registro.idiomas.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-bold text-[#1F2937] mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Idiomas</h2>
              <div className="flex flex-wrap gap-2">
                {registro.idiomas.map((idioma) => (
                  <span key={idioma} className="text-xs font-semibold bg-[#F8F6FF] text-[#5B2EFF] px-3 py-1.5 rounded-full">{idioma}</span>
                ))}
              </div>
            </div>
          )}
          {registro.certificados.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-bold text-[#1F2937] mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Certificados</h2>
              <ul className="space-y-2 text-sm text-gray-500">
                {registro.certificados.map((c) => <li key={c}>{c}</li>)}
              </ul>
            </div>
          )}
        </div>
      </div>

      <ModalConfirmacao
        aberto={confirmando}
        titulo="Excluir prestador?"
        texto={`A conta de ${registro.nome} (${registro.email}) será excluída permanentemente. Essa ação não pode ser desfeita.`}
        confirmar="Excluir prestador"
        carregando={excluindo}
        erro={erroExclusao}
        onConfirmar={excluir}
        onCancelar={() => {
          setConfirmando(false)
          setErroExclusao('')
        }}
      />
    </AdminLayout>
  )
}
