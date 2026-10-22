import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ProviderLayout from '../components/ProviderLayout'
import Avatar from '../components/Avatar'
import Aviso from '../components/Aviso'
import Estrelas from '../components/Estrelas'
import SeletorEstrelas from '../components/SeletorEstrelas'
import { PinIcon, WhatsAppIcon, AwardIcon, SendIcon, UserIcon } from '../components/icons'
import { buscarCliente } from '../api/get/detalhe/detalheCliente'
import { cadastroAvaliacaoCliente } from '../api/post/cadastro/cadastroAvaliacaoCliente'
import { anoDe, tempoDesde, textoAvaliacoes } from '../utils/formatadores'
import { linkWhatsApp } from '../utils/whatsapp'

const MENSAGEM_WHATSAPP = 'Sou prestador no Hands e gostaria de conversar sobre o seu pedido.'

export default function ClientProfileView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [cliente, setCliente] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [nota, setNota] = useState(0)
  const [mensagem, setMensagem] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [aviso, setAviso] = useState(null)

  const carregar = useCallback(async () => {
    const dados = await buscarCliente(id)
    setCliente(dados)
    if (dados.minha_avaliacao) {
      setNota(Math.round(dados.minha_avaliacao.nota))
      setMensagem(dados.minha_avaliacao.mensagem)
    }
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

  const enviarAvaliacao = async () => {
    setAviso(null)
    if (!nota) {
      setAviso({ tipo: 'erro', texto: 'Selecione uma nota de 1 a 5 estrelas.' })
      return
    }
    setEnviando(true)
    try {
      await cadastroAvaliacaoCliente({ para: cliente.email, nota, mensagem: mensagem.trim() })
      await carregar()
      setAviso({ tipo: 'sucesso', texto: 'Avaliação enviada com sucesso!' })
    } catch (error) {
      setAviso({ tipo: 'erro', texto: error.message })
    } finally {
      setEnviando(false)
    }
  }

  if (carregando) {
    return (
      <ProviderLayout>
        <div className="bg-white rounded-2xl h-72 animate-pulse mb-6" />
        <div className="bg-white rounded-2xl h-64 animate-pulse" />
      </ProviderLayout>
    )
  }

  if (erro || !cliente) {
    return (
      <ProviderLayout>
        <div className="max-w-xl mx-auto text-center py-16">
          <Aviso>{erro || 'Cliente não encontrado.'}</Aviso>
          <button
            onClick={() => navigate('/prestador/clientes')}
            className="mt-6 bg-[#5B2EFF] hover:bg-[#4A25CC] text-white font-bold px-7 py-3.5 rounded-xl text-sm transition-colors"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Voltar para a busca
          </button>
        </div>
      </ProviderLayout>
    )
  }

  const whatsapp = linkWhatsApp(cliente.celular, cliente.nome, MENSAGEM_WHATSAPP)
  const desde = anoDe(cliente.cadastrado_em)
  const temNota = cliente.nota_media !== null
  const jaAvaliou = Boolean(cliente.minha_avaliacao)

  return (
    <ProviderLayout>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
        <div className="h-40 bg-gradient-to-r from-[#5B2EFF] to-[#7C5CFC]" />
        <div className="px-8 pb-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12">
            <div className="flex items-end gap-5">
              <Avatar papel="cliente" id={cliente._id} className="w-28 h-28 rounded-2xl border-4 border-white flex-shrink-0">
                <div className="w-28 h-28 rounded-2xl bg-gray-200 border-4 border-white flex-shrink-0 flex items-center justify-center text-gray-400">
                  <UserIcon width={36} height={36} />
                </div>
              </Avatar>
              <div className="pb-1">
                <h1 className="text-2xl font-black text-[#1F2937]" style={{ fontFamily: 'Outfit, sans-serif' }}>{cliente.nome}</h1>
                <p className="text-gray-500 text-sm mt-1">Cliente Hands</p>
              </div>
            </div>
            {whatsapp ? (
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1fb855] text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                <WhatsAppIcon width={18} height={18} />
                Chamar no WhatsApp
              </a>
            ) : (
              <span
                aria-disabled="true"
                title="Este cliente não informou um celular válido"
                className="flex items-center gap-2 bg-[#25D366] text-white font-bold px-6 py-3 rounded-xl text-sm opacity-50 cursor-not-allowed"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                <WhatsAppIcon width={18} height={18} />
                WhatsApp indisponível
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-2">
              {temNota ? (
                <>
                  <Estrelas nota={cliente.nota_media} tamanho={16} />
                  <span className="font-bold text-[#1F2937]">{cliente.nota_media.toFixed(1)}</span>
                  <span className="text-sm text-gray-400">({textoAvaliacoes(cliente.total_avaliacoes)})</span>
                </>
              ) : (
                <span className="text-sm text-gray-400">Ainda sem avaliações</span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <PinIcon width={16} height={16} />
              {cliente.cidade ?? 'Localização não informada'}
            </div>
            {desde && (
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <AwardIcon width={16} height={16} />
                Cliente desde {desde}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-[#1F2937] mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>Sobre</h2>
            <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">
              {cliente.informacoes || 'Este cliente ainda não adicionou uma descrição.'}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-[#1F2937] mb-5" style={{ fontFamily: 'Outfit, sans-serif' }}>Avaliações de prestadores</h2>
            {cliente.avaliacoes.length === 0 && (
              <p className="text-sm text-gray-400">Este cliente ainda não recebeu avaliações.</p>
            )}
            <div className="space-y-5">
              {cliente.avaliacoes.map((r) => (
                <div key={r._id} className="pb-5 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-[#1F2937]">
                      {r.autor}
                      {r.minha && <span className="ml-2 text-xs font-bold text-[#5B2EFF] bg-[#5B2EFF]/10 px-2 py-0.5 rounded-full">Você</span>}
                    </p>
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
            <h2 className="font-bold text-[#1F2937] mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {jaAvaliou ? 'Sua avaliação' : 'Avaliar este cliente'}
            </h2>
            <p className="text-sm text-gray-400 mb-5">
              {jaAvaliou
                ? `Enviada ${tempoDesde(cliente.minha_avaliacao.data) ?? ''}. Você pode atualizar quando quiser.`
                : 'Conte como foi atender este cliente'}
            </p>

            <div className="flex flex-col items-center py-5 mb-5 bg-[#F8F6FF] rounded-2xl">
              <SeletorEstrelas valor={nota} onChange={setNota} />
              <p className="text-sm text-gray-400 mt-3">Toque nas estrelas para avaliar</p>
            </div>

            <textarea
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              maxLength={1000}
              rows={4}
              placeholder="Como foi a experiência com este cliente?"
              className="w-full px-4 py-3.5 border border-gray-200 rounded-xl outline-none text-sm placeholder-gray-400 resize-none focus:border-[#5B2EFF] transition-colors mb-4"
            />

            {aviso && <div className="mb-4"><Aviso tipo={aviso.tipo}>{aviso.texto}</Aviso></div>}

            <button
              onClick={enviarAvaliacao}
              disabled={enviando}
              className="w-full flex items-center justify-center gap-2 bg-[#5B2EFF] hover:bg-[#4A25CC] disabled:opacity-60 text-white font-bold px-7 py-3.5 rounded-xl text-sm transition-colors"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              <SendIcon width={16} height={16} />
              {enviando ? 'Enviando...' : jaAvaliou ? 'Atualizar avaliação' : 'Enviar avaliação'}
            </button>
          </div>
        </div>
      </div>
    </ProviderLayout>
  )
}
