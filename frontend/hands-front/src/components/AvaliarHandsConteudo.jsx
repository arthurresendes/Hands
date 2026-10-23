import { useCallback, useEffect, useState } from 'react'
import Aviso from './Aviso'
import Estrelas from './Estrelas'
import SeletorEstrelas from './SeletorEstrelas'
import { SendIcon } from './icons'
import { minhaAvaliacaoHands } from '../api/get/avaliacao/minhaAvaliacaoHands'
import { cadastroAvaliacaoHands } from '../api/post/cadastro/cadastroAvaliacaoHands'
import useEstadoPainel from '../hooks/useEstadoPainel'
import usePerfil from '../hooks/usePerfil'
import { getAvaliacoesHands } from '../services/landing'
import { tempoDesde, textoAvaliacoes } from '../utils/formatadores'

const criterios = [
  { chave: 'facilidade', label: 'Facilidade de uso' },
  { chave: 'qualidade', label: 'Qualidade do site' },
  { chave: 'confiabilidade', label: 'Confiabilidade da plataforma' },
]

const NOTAS_INICIAIS = { notaGeral: 0, facilidade: 0, qualidade: 0, confiabilidade: 0 }

const TEXTOS = {
  cliente: {
    placeholder: 'Conte como foi sua experiência usando o Hands...',
    rotuloFeitas: 'Suas avaliações a profissionais',
  },
  prestador: {
    placeholder: 'Conte como foi sua experiência oferecendo serviços no Hands...',
    rotuloFeitas: 'Suas avaliações a clientes',
  },
}

export default function AvaliarHandsConteudo({ papel }) {
  const textos = TEXTOS[papel]
  const [notas, setNotas] = useState(NOTAS_INICIAIS)
  const [mensagem, setMensagem] = useState('')
  const [minha, setMinha] = useState(null)
  const [resumo, setResumo] = useEstadoPainel('avaliarHands.resumo', null)
  const { perfil } = usePerfil()
  const [enviando, setEnviando] = useState(false)
  const [aviso, setAviso] = useState(null)

  const carregarMinha = useCallback(async () => {
    const avaliacao = await minhaAvaliacaoHands()
    setMinha(avaliacao)
    if (avaliacao) {
      setNotas({
        notaGeral: Math.round(avaliacao.notaGeral ?? 0),
        facilidade: Math.round(avaliacao.facilidade ?? 0),
        qualidade: Math.round(avaliacao.qualidade ?? 0),
        confiabilidade: Math.round(avaliacao.confiabilidade ?? 0),
      })
      setMensagem(avaliacao.mensagem)
    }
  }, [])

  useEffect(() => {
    carregarMinha().catch((error) => setAviso({ tipo: 'erro', texto: error.message }))
    getAvaliacoesHands().then((dados) => setResumo(dados.resumo)).catch(() => {})
  }, [carregarMinha, setResumo])

  const definirNota = (chave) => (valor) => setNotas((atual) => ({ ...atual, [chave]: valor }))

  const enviar = async () => {
    setAviso(null)
    if (Object.values(notas).some((valor) => !valor)) {
      setAviso({ tipo: 'erro', texto: 'Dê uma nota geral e avalie os três critérios.' })
      return
    }
    setEnviando(true)
    try {
      await cadastroAvaliacaoHands({ ...notas, mensagem: mensagem.trim() })
      await carregarMinha()
      getAvaliacoesHands().then((dados) => setResumo(dados.resumo)).catch(() => {})
      setAviso({ tipo: 'sucesso', texto: 'Obrigado! Sua avaliação foi registrada.' })
    } catch (error) {
      setAviso({ tipo: 'erro', texto: error.message })
    } finally {
      setEnviando(false)
    }
  }

  const temResumo = resumo?.total > 0

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#1F2937]" style={{ fontFamily: 'Outfit, sans-serif' }}>
          Avaliar o Hands
        </h1>
        <p className="text-gray-500 mt-1">Sua opinião ajuda a melhorar a plataforma para todo mundo</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-[#1F2937] mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>
            {minha ? 'Atualize sua avaliação' : 'Como foi sua experiência?'}
          </h2>
          <p className="text-sm text-gray-400 mb-6">Dê uma nota geral para a plataforma</p>

          <div className="flex flex-col items-center py-6 mb-6 bg-[#F8F6FF] rounded-2xl">
            <SeletorEstrelas valor={notas.notaGeral} onChange={definirNota('notaGeral')} />
            <p className="text-sm text-gray-400 mt-3">Toque nas estrelas para avaliar</p>
          </div>

          <div className="space-y-5 mb-6">
            {criterios.map((c) => (
              <div key={c.chave} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{c.label}</span>
                <SeletorEstrelas valor={notas[c.chave]} onChange={definirNota(c.chave)} />
              </div>
            ))}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#1F2937] mb-2">Deixe um comentário</label>
            <textarea
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              maxLength={1000}
              rows={4}
              placeholder={textos.placeholder}
              className="w-full px-4 py-3.5 border border-gray-200 rounded-xl outline-none text-sm placeholder-gray-400 resize-none focus:border-[#5B2EFF] transition-colors"
            />
          </div>

          {aviso && <div className="mb-4"><Aviso tipo={aviso.tipo}>{aviso.texto}</Aviso></div>}

          <button
            onClick={enviar}
            disabled={enviando}
            className="flex items-center gap-2 bg-[#5B2EFF] hover:bg-[#4A25CC] disabled:opacity-60 text-white font-bold px-7 py-3.5 rounded-xl text-sm transition-colors"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            <SendIcon width={16} height={16} />
            {enviando ? 'Enviando...' : minha ? 'Atualizar avaliação' : 'Enviar avaliação'}
          </button>
        </div>

        <div className="bg-[#1F2937] rounded-2xl p-6 text-white h-fit">
          <p className="text-5xl font-black mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>
            {temResumo ? resumo.media.toFixed(1) : '—'}
          </p>
          <div className="mb-2">
            <Estrelas nota={temResumo ? resumo.media : 0} tamanho={16} />
          </div>
          <p className="text-white/50 text-sm mb-6">
            {temResumo ? `com base em ${textoAvaliacoes(resumo.total)}` : 'Ainda sem avaliações'}
          </p>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-white/60">{textos.rotuloFeitas}</span>
              <span className="font-bold">{perfil ? perfil.total_avaliacoes_feitas : '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Sua avaliação do Hands</span>
              <span className="font-bold">{minha ? (tempoDesde(minha.data_avaliacao) ?? 'enviada') : 'ainda não enviada'}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
