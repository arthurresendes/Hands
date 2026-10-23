import { mensagemIdade, propsCampoIdade } from '../utils/validacoes'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ClientLayout from '../components/ClientLayout'
import FormField from '../components/FormField'
import FotoPerfilEditavel from '../components/FotoPerfilEditavel'
import AlterarSenha from '../components/AlterarSenha'
import ExcluirConta from '../components/ExcluirConta'
import Aviso from '../components/Aviso'
import useAuth from '../hooks/useAuth'
import usePerfil from '../hooks/usePerfil'
import { UserIcon, MailIcon, IdCardIcon, PinIcon, ChatIcon } from '../components/icons'
import { atualizarDadosClientes } from '../api/patch/atualizar/atualizarDadosCliente'
import { deletarCliente } from '../api/delete/deletarCliente'
import { anoDe } from '../utils/formatadores'

const soDigitos = (texto) => (texto ?? '').replace(/\D/g, '')

export default function ClientProfile() {
  const navigate = useNavigate()
  const { usuario, recarregar, logout } = useAuth()
  const { perfil, carregando, erro: erroPerfil, recarregar: recarregarPerfil } = usePerfil()
  const [form, setForm] = useState({ nome: '', celular: '', idade: '', cep: '', informacoes: '' })
  const [avisoDados, setAvisoDados] = useState(null)
  const [avisoGeral, setAvisoGeral] = useState(null)
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    if (!perfil) return
    setForm({
      nome: perfil.nome ?? '',
      celular: perfil.celular ?? '',
      idade: perfil.idade ?? '',
      cep: perfil.cep ?? '',
      informacoes: perfil.informacoes ?? '',
    })
  }, [perfil])

  const alterar = (e) => setForm((atual) => ({ ...atual, [e.target.name]: e.target.value }))

  const salvarDados = async (e) => {
    e.preventDefault()
    setAvisoDados(null)
    const erroIdade = mensagemIdade(form.idade)
    if (erroIdade) {
      setAvisoDados({ tipo: 'erro', texto: erroIdade })
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
      }
      if (soDigitos(form.cep) !== soDigitos(perfil.cep)) alteracoes.cep = form.cep.trim()
      await atualizarDadosClientes(alteracoes)
      await Promise.all([recarregarPerfil(), recarregar()])
      setAvisoDados({ tipo: 'sucesso', texto: 'Dados atualizados com sucesso.' })
    } catch (error) {
      setAvisoDados({ tipo: 'erro', texto: error.message })
    } finally {
      setSalvando(false)
    }
  }

  const trocarSenha = (senhaAtual, novaSenha) =>
    atualizarDadosClientes({ id: usuario.id, senha: novaSenha, senha_atual: senhaAtual })

  const excluirConta = async () => {
    await deletarCliente(perfil.email)
    await logout()
    navigate('/')
  }

  const desde = anoDe(perfil?.cadastrado_em)

  return (
    <ClientLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#1F2937]" style={{ fontFamily: 'Outfit, sans-serif' }}>
          Minha Conta
        </h1>
        <p className="text-gray-500 mt-1">Gerencie seus dados pessoais e preferências</p>
      </div>

      {(avisoGeral || erroPerfil) && <div className="mb-6"><Aviso tipo={avisoGeral?.tipo}>{avisoGeral?.texto ?? erroPerfil}</Aviso></div>}

      {carregando && !perfil && <div className="bg-white rounded-2xl h-96 animate-pulse" />}

      {perfil && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 h-fit">
            <div className="flex flex-col items-center text-center">
              <FotoPerfilEditavel papel="cliente" id={perfil.id} onErro={(texto) => setAvisoGeral({ tipo: 'erro', texto })}>
                <div className="w-24 h-24 rounded-full bg-[#5B2EFF]/10 flex items-center justify-center text-[#5B2EFF]">
                  <UserIcon width={32} height={32} />
                </div>
              </FotoPerfilEditavel>
              <h2 className="font-bold text-[#1F2937] mt-4" style={{ fontFamily: 'Outfit, sans-serif' }}>{perfil.nome}</h2>
              <p className="text-sm text-gray-400">{desde ? `Cliente desde ${desde}` : 'Cliente Hands'}</p>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Avaliações feitas</span>
                <span className="font-semibold text-[#1F2937]">{perfil.total_avaliacoes_feitas}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Favoritos</span>
                <span className="font-semibold text-[#1F2937]">{perfil.total_favoritos}</span>
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
            <form onSubmit={salvarDados} className="bg-white rounded-2xl border border-gray-100 p-6">
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
                <div>
                  <label className="block text-sm font-semibold text-[#1F2937] mb-2">Sobre você</label>
                  <textarea
                    name="informacoes"
                    value={form.informacoes}
                    onChange={alterar}
                    rows={3}
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
            </form>

            <AlterarSenha onAlterar={trocarSenha} />

            <ExcluirConta onExcluir={excluirConta} />
          </div>
        </div>
      )}
    </ClientLayout>
  )
}
