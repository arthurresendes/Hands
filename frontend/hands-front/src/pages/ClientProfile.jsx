import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ClientLayout from '../components/ClientLayout'
import FormField from '../components/FormField'
import Avatar from '../components/Avatar'
import Aviso from '../components/Aviso'
import useAuth from '../hooks/useAuth'
import { UserIcon, MailIcon, IdCardIcon, LockIcon, PinIcon, EditIcon, ChatIcon } from '../components/icons'
import { buscarPerfilCliente } from '../api/get/detalhe/perfilCliente'
import { atualizarDadosClientes } from '../api/patch/atualizar/atualizarDadosCliente'
import { deletarCliente } from '../api/delete/deletarCliente'
import { enviarFoto } from '../api/post/cadastro/enviarFoto'
import { anoDe } from '../utils/formatadores'

const SENHAS_INICIAIS = { senha_atual: '', senha: '', confirmar: '' }

const soDigitos = (texto) => (texto ?? '').replace(/\D/g, '')

export default function ClientProfile() {
  const navigate = useNavigate()
  const { usuario, recarregar, logout, atualizarFoto } = useAuth()
  const entradaFoto = useRef(null)
  const [perfil, setPerfil] = useState(null)
  const [form, setForm] = useState({ nome: '', celular: '', idade: '', cep: '', informacoes: '' })
  const [senhas, setSenhas] = useState(SENHAS_INICIAIS)
  const [carregando, setCarregando] = useState(true)
  const [avisoDados, setAvisoDados] = useState(null)
  const [avisoSenha, setAvisoSenha] = useState(null)
  const [avisoGeral, setAvisoGeral] = useState(null)
  const [salvando, setSalvando] = useState(false)
  const [trocandoSenha, setTrocandoSenha] = useState(false)

  const carregar = useCallback(async () => {
    const dados = await buscarPerfilCliente()
    setPerfil(dados)
    setForm({
      nome: dados.nome ?? '',
      celular: dados.celular ?? '',
      idade: dados.idade ?? '',
      cep: dados.cep ?? '',
      informacoes: dados.informacoes ?? '',
    })
  }, [])

  useEffect(() => {
    carregar()
      .catch((error) => setAvisoGeral({ tipo: 'erro', texto: error.message }))
      .finally(() => setCarregando(false))
  }, [carregar])

  const alterar = (e) => setForm((atual) => ({ ...atual, [e.target.name]: e.target.value }))
  const alterarSenha = (e) => setSenhas((atual) => ({ ...atual, [e.target.name]: e.target.value }))

  const salvarDados = async (e) => {
    e.preventDefault()
    setAvisoDados(null)
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
      await Promise.all([carregar(), recarregar()])
      setAvisoDados({ tipo: 'sucesso', texto: 'Dados atualizados com sucesso.' })
    } catch (error) {
      setAvisoDados({ tipo: 'erro', texto: error.message })
    } finally {
      setSalvando(false)
    }
  }

  const trocarSenha = async (e) => {
    e.preventDefault()
    setAvisoSenha(null)
    if (senhas.senha !== senhas.confirmar) {
      setAvisoSenha({ tipo: 'erro', texto: 'A confirmação não confere com a nova senha.' })
      return
    }
    setTrocandoSenha(true)
    try {
      await atualizarDadosClientes({ id: usuario.id, senha: senhas.senha, senha_atual: senhas.senha_atual })
      setSenhas(SENHAS_INICIAIS)
      setAvisoSenha({ tipo: 'sucesso', texto: 'Senha atualizada com sucesso.' })
    } catch (error) {
      setAvisoSenha({ tipo: 'erro', texto: error.message })
    } finally {
      setTrocandoSenha(false)
    }
  }

  const trocarFoto = async (e) => {
    const arquivo = e.target.files[0]
    e.target.value = ''
    if (!arquivo) return
    setAvisoGeral(null)
    try {
      await enviarFoto(arquivo)
      atualizarFoto()
    } catch (error) {
      setAvisoGeral({ tipo: 'erro', texto: error.message })
    }
  }

  const excluirConta = async () => {
    if (!window.confirm('Tem certeza? Sua conta e seus dados serão excluídos permanentemente.')) return
    try {
      await deletarCliente(perfil.email)
      await logout()
      navigate('/')
    } catch (error) {
      setAvisoGeral({ tipo: 'erro', texto: error.message })
    }
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

      {avisoGeral && <div className="mb-6"><Aviso tipo={avisoGeral.tipo}>{avisoGeral.texto}</Aviso></div>}

      {carregando && <div className="bg-white rounded-2xl h-96 animate-pulse" />}

      {!carregando && perfil && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 h-fit">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <Avatar papel="cliente" id={perfil.id} className="w-24 h-24 rounded-full">
                  <div className="w-24 h-24 rounded-full bg-[#5B2EFF]/10 flex items-center justify-center text-[#5B2EFF]">
                    <UserIcon width={32} height={32} />
                  </div>
                </Avatar>
                <button
                  type="button"
                  onClick={() => entradaFoto.current.click()}
                  aria-label="Trocar foto"
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#5B2EFF] text-white flex items-center justify-center border-2 border-white"
                >
                  <EditIcon width={13} height={13} />
                </button>
                <input ref={entradaFoto} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={trocarFoto} />
              </div>
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
                  <FormField label="Idade" type="number" min="0" max="130" name="idade" value={form.idade} onChange={alterar} />
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

            <form onSubmit={trocarSenha} className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-bold text-[#1F2937] mb-5" style={{ fontFamily: 'Outfit, sans-serif' }}>Alterar senha</h2>
              <div className="space-y-5">
                <FormField label="Senha atual" type="password" placeholder="Digite sua senha atual" Icon={LockIcon} name="senha_atual" autoComplete="current-password" value={senhas.senha_atual} onChange={alterarSenha} />
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Nova senha" type="password" placeholder="Mínimo de 6 caracteres" Icon={LockIcon} name="senha" autoComplete="new-password" minLength={6} value={senhas.senha} onChange={alterarSenha} />
                  <FormField label="Confirmar nova senha" type="password" placeholder="Repita a nova senha" Icon={LockIcon} name="confirmar" autoComplete="new-password" value={senhas.confirmar} onChange={alterarSenha} />
                </div>
                {avisoSenha && <Aviso tipo={avisoSenha.tipo}>{avisoSenha.texto}</Aviso>}
                <button
                  type="submit"
                  disabled={trocandoSenha}
                  className="bg-[#1F2937] hover:bg-black disabled:opacity-60 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  {trocandoSenha ? 'Atualizando...' : 'Atualizar senha'}
                </button>
              </div>
            </form>

            <div className="bg-white rounded-2xl border border-red-100 p-6">
              <h2 className="font-bold text-red-500 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>Excluir conta</h2>
              <p className="text-sm text-gray-500 mb-4">Essa ação é permanente e removerá todos os seus dados da plataforma.</p>
              <button
                type="button"
                onClick={excluirConta}
                className="border border-red-200 text-red-500 font-semibold px-6 py-3 rounded-xl text-sm hover:bg-red-50 transition-colors"
              >
                Excluir minha conta
              </button>
            </div>
          </div>
        </div>
      )}
    </ClientLayout>
  )
}
