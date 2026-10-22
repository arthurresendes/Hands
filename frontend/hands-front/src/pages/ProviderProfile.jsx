import { mensagemIdade, propsCampoIdade } from '../utils/validacoes'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProviderLayout from '../components/ProviderLayout'
import FormField from '../components/FormField'
import FotoPerfilEditavel from '../components/FotoPerfilEditavel'
import AlterarSenha from '../components/AlterarSenha'
import ExcluirConta from '../components/ExcluirConta'
import Aviso from '../components/Aviso'
import useAuth from '../hooks/useAuth'
import { UserIcon, MailIcon, IdCardIcon, PinIcon, ChatIcon, CoinIcon } from '../components/icons'
import { buscarPerfilPrestador } from '../api/get/detalhe/perfilPrestador'
import { atualizarDadosPrestador } from '../api/patch/atualizar/atualizarDadosPrestador'
import { deletarPrestador } from '../api/delete/deletarPrestador'
import { SERVICOS } from '../utils/servicos'
import { anoDe, converterValor, formatarMoeda } from '../utils/formatadores'

const soDigitos = (texto) => (texto ?? '').replace(/\D/g, '')
const separar = (texto, divisor) => texto.split(divisor).map((item) => item.trim()).filter(Boolean)

const FORM_INICIAL = {
  nome: '',
  celular: '',
  idade: '',
  cep: '',
  informacoes: '',
  servicos: [],
  valor: '',
  idiomas: '',
  certificacoes: '',
}

export default function ProviderProfile() {
  const navigate = useNavigate()
  const { usuario, recarregar, logout } = useAuth()
  const [perfil, setPerfil] = useState(null)
  const [form, setForm] = useState(FORM_INICIAL)
  const [carregando, setCarregando] = useState(true)
  const [avisoDados, setAvisoDados] = useState(null)
  const [avisoGeral, setAvisoGeral] = useState(null)
  const [salvando, setSalvando] = useState(false)

  const carregar = useCallback(async () => {
    const dados = await buscarPerfilPrestador()
    setPerfil(dados)
    setForm({
      nome: dados.nome ?? '',
      celular: dados.celular ?? '',
      idade: dados.idade ?? '',
      cep: dados.cep ?? '',
      informacoes: dados.informacoes ?? '',
      servicos: dados.servicos ?? [],
      valor: formatarMoeda(dados.valor),
      idiomas: (dados.idiomas ?? []).join(', '),
      certificacoes: (dados.certificados ?? []).join('\n'),
    })
  }, [])

  useEffect(() => {
    carregar()
      .catch((error) => setAvisoGeral({ tipo: 'erro', texto: error.message }))
      .finally(() => setCarregando(false))
  }, [carregar])

  const alterar = (e) => setForm((atual) => ({ ...atual, [e.target.name]: e.target.value }))

  const alternarServico = (servico) =>
    setForm((atual) => ({
      ...atual,
      servicos: atual.servicos.includes(servico)
        ? atual.servicos.filter((s) => s !== servico)
        : [...atual.servicos, servico],
    }))

  const salvarDados = async (e) => {
    e.preventDefault()
    setAvisoDados(null)
    const erroIdade = mensagemIdade(form.idade)
    if (erroIdade) {
      setAvisoDados({ tipo: 'erro', texto: erroIdade })
      return
    }
    if (form.servicos.length === 0) {
      setAvisoDados({ tipo: 'erro', texto: 'Selecione ao menos um serviço.' })
      return
    }
    const valor = converterValor(form.valor)
    if (Number.isNaN(valor) || valor < 0) {
      setAvisoDados({ tipo: 'erro', texto: 'Informe um valor válido.' })
      return
    }
    setSalvando(true)
    try {
      const alteracoes = {
        id: usuario.id,
        nome: form.nome.trim(),
        celular: form.celular.trim(),
        idade: Number(form.idade),
        informacoes: form.informacoes.trim(),
        servicos: form.servicos,
        valor,
        idiomas: separar(form.idiomas, ','),
        certificacoes: separar(form.certificacoes, '\n'),
      }
      if (soDigitos(form.cep) !== soDigitos(perfil.cep)) alteracoes.cep = form.cep.trim()
      await atualizarDadosPrestador(alteracoes)
      await Promise.all([carregar(), recarregar()])
      setAvisoDados({ tipo: 'sucesso', texto: 'Dados atualizados com sucesso.' })
    } catch (error) {
      setAvisoDados({ tipo: 'erro', texto: error.message })
    } finally {
      setSalvando(false)
    }
  }

  const trocarSenha = (senhaAtual, novaSenha) =>
    atualizarDadosPrestador({ id: usuario.id, senha: novaSenha, senha_atual: senhaAtual })

  const excluirConta = async () => {
    await deletarPrestador(perfil.email)
    await logout()
    navigate('/')
  }

  const desde = anoDe(perfil?.cadastrado_em)

  return (
    <ProviderLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#1F2937]" style={{ fontFamily: 'Outfit, sans-serif' }}>
          Minha Conta
        </h1>
        <p className="text-gray-500 mt-1">Gerencie seu perfil profissional e seus dados</p>
      </div>

      {avisoGeral && <div className="mb-6"><Aviso tipo={avisoGeral.tipo}>{avisoGeral.texto}</Aviso></div>}

      {carregando && <div className="bg-white rounded-2xl h-96 animate-pulse" />}

      {!carregando && perfil && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 h-fit">
            <div className="flex flex-col items-center text-center">
              <FotoPerfilEditavel papel="prestador" id={perfil.id} onErro={(texto) => setAvisoGeral({ tipo: 'erro', texto })}>
                <div className="w-24 h-24 rounded-full bg-[#FFC857]/15 flex items-center justify-center" style={{ color: '#B8860B' }}>
                  <UserIcon width={32} height={32} />
                </div>
              </FotoPerfilEditavel>
              <h2 className="font-bold text-[#1F2937] mt-4" style={{ fontFamily: 'Outfit, sans-serif' }}>{perfil.nome}</h2>
              <p className="text-sm text-gray-400">{desde ? `Prestador desde ${desde}` : 'Prestador Hands'}</p>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Avaliação média</span>
                <span className="font-semibold text-[#1F2937]">{perfil.nota_media !== null ? perfil.nota_media.toFixed(1) : '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Avaliações recebidas</span>
                <span className="font-semibold text-[#1F2937]">{perfil.total_avaliacoes}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Favoritado por</span>
                <span className="font-semibold text-[#1F2937]">{perfil.total_favoritos}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Avaliações feitas</span>
                <span className="font-semibold text-[#1F2937]">{perfil.total_avaliacoes_feitas}</span>
              </div>
              {perfil.cidade && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Cidade</span>
                  <span className="font-semibold text-[#1F2937]">{perfil.cidade}</span>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={salvarDados} className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-bold text-[#1F2937] mb-5" style={{ fontFamily: 'Outfit, sans-serif' }}>Dados pessoais</h2>
                <div className="space-y-5">
                  <FormField label="Nome completo" Icon={UserIcon} name="nome" value={form.nome} onChange={alterar} />
                  <FormField label="E-mail" type="email" Icon={MailIcon} value={perfil.email ?? ''} disabled required={false} readOnly />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="CPF" Icon={IdCardIcon} value={perfil.cpf_mascarado ?? ''} disabled required={false} readOnly />
                    <FormField label="Idade" type="number" {...propsCampoIdade} name="idade" value={form.idade} onChange={alterar} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="CEP" placeholder="00000-000" Icon={PinIcon} name="cep" value={form.cep} onChange={alterar} />
                    <FormField label="Celular" type="tel" placeholder="(11) 90000-0000" Icon={ChatIcon} name="celular" value={form.celular} onChange={alterar} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-bold text-[#1F2937] mb-5" style={{ fontFamily: 'Outfit, sans-serif' }}>Dados profissionais</h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-[#1F2937] mb-2">Serviços oferecidos</label>
                    <div className="flex flex-wrap gap-2">
                      {SERVICOS.map((servico) => {
                        const ativo = form.servicos.includes(servico)
                        return (
                          <button
                            key={servico}
                            type="button"
                            onClick={() => alternarServico(servico)}
                            aria-pressed={ativo}
                            className={`text-sm font-semibold px-4 py-2 rounded-full border transition-colors ${ativo ? 'bg-[#5B2EFF] border-[#5B2EFF] text-white' : 'border-gray-200 text-gray-500 hover:border-[#5B2EFF]/40'}`}
                          >
                            {servico}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  <FormField label="Valor médio do serviço" placeholder="R$ 80,00" Icon={CoinIcon} name="valor" value={form.valor} onChange={alterar} />
                  <FormField label="Idiomas (separados por vírgula)" placeholder="Português, Inglês" name="idiomas" value={form.idiomas} onChange={alterar} required={false} />
                  <div>
                    <label className="block text-sm font-semibold text-[#1F2937] mb-2">Certificações (uma por linha)</label>
                    <textarea
                      name="certificacoes"
                      value={form.certificacoes}
                      onChange={alterar}
                      rows={3}
                      className="w-full px-4 py-3.5 border border-gray-200 rounded-xl outline-none text-sm placeholder-gray-400 focus:border-[#5B2EFF] transition-colors resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1F2937] mb-2">Sobre você</label>
                    <textarea
                      name="informacoes"
                      value={form.informacoes}
                      onChange={alterar}
                      rows={4}
                      className="w-full px-4 py-3.5 border border-gray-200 rounded-xl outline-none text-sm placeholder-gray-400 focus:border-[#5B2EFF] transition-colors resize-none"
                    />
                  </div>
                  {avisoDados && <Aviso tipo={avisoDados.tipo}>{avisoDados.texto}</Aviso>}
                  <button
                    type="submit"
                    disabled={salvando}
                    className="bg-[#5B2EFF] hover:bg-[#4A25CC] disabled:opacity-60 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors"
                    style={{ fontFamily: 'Outfit, sans-serif' }}
                  >
                    {salvando ? 'Salvando...' : 'Salvar alterações'}
                  </button>
                </div>
              </div>
            </form>

            <AlterarSenha onAlterar={trocarSenha} />

            <ExcluirConta onExcluir={excluirConta} />
          </div>
        </div>
      )}
    </ProviderLayout>
  )
}
