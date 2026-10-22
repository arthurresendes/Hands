import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import FormField from '../components/FormField'
import FotoInput from '../components/FotoInput'
import { UserIcon, MailIcon, IdCardIcon, LockIcon, PinIcon, ChatIcon } from '../components/icons'
import useAuth from '../hooks/useAuth'
import { cadastroCliente } from '../api/post/cadastro/cadastroCliente'
import { inicioPorPapel } from '../utils/rotasPorPapel'

export default function RegisterClient() {
  const navigate = useNavigate()
  const { recarregar } = useAuth()
  const [form, setForm] = useState({ nome: '', email: '', cpf: '', idade: '', cep: '', celular: '', informacoes: '', senha: '', confirmar: '' })
  const [foto, setFoto] = useState(null)
  const [aceito, setAceito] = useState(false)
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  const alterar = (e) => setForm((atual) => ({ ...atual, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro('')
    if (form.senha !== form.confirmar) {
      setErro('As senhas não conferem.')
      return
    }
    setEnviando(true)
    try {
      await cadastroCliente(
        {
          nome: form.nome.trim(),
          email: form.email.trim(),
          celular: form.celular.trim(),
          idade: form.idade,
          cep: form.cep.trim(),
          cpf: form.cpf.trim(),
          informacoes: form.informacoes.trim(),
          senha: form.senha,
        },
        foto,
      )
      const usuario = await recarregar()
      navigate(usuario ? inicioPorPapel[usuario.role] : '/login')
    } catch (error) {
      setErro(error.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <AuthLayout
      badge="Cadastro de Cliente"
      title="Encontre profissionais de confiança perto de você"
      subtitle="Crie sua conta gratuita e comece a buscar os melhores prestadores de serviço da sua região."
      highlights={['Cadastro 100% gratuito', 'Busca por CEP, sem complicação', 'Avaliações de clientes reais']}
    >
      <h1 className="text-2xl font-black text-[#1F2937] mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
        Criar conta de cliente
      </h1>
      <p className="text-sm text-gray-500 mb-8">Preencha seus dados para começar a buscar profissionais</p>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <FotoInput foto={foto} onChange={setFoto} />
        <FormField label="Nome completo" placeholder="Digite seu nome completo" Icon={UserIcon} name="nome" value={form.nome} onChange={alterar} />
        <FormField label="E-mail" type="email" placeholder="seuemail@exemplo.com" Icon={MailIcon} name="email" autoComplete="email" value={form.email} onChange={alterar} />

        <div className="grid grid-cols-2 gap-4">
          <FormField label="CPF" placeholder="000.000.000-00" Icon={IdCardIcon} name="cpf" value={form.cpf} onChange={alterar} />
          <FormField label="Idade" type="number" min="0" max="130" placeholder="Ex: 28" name="idade" value={form.idade} onChange={alterar} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="CEP" placeholder="00000-000" Icon={PinIcon} name="cep" value={form.cep} onChange={alterar} />
          <FormField label="Celular" type="tel" placeholder="(11) 90000-0000" Icon={ChatIcon} name="celular" autoComplete="tel" value={form.celular} onChange={alterar} />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#1F2937] mb-2">Sobre você (opcional)</label>
          <textarea
            name="informacoes"
            value={form.informacoes}
            onChange={alterar}
            rows={3}
            placeholder="Conte um pouco sobre você"
            className="w-full px-4 py-3.5 border border-gray-200 rounded-xl outline-none text-sm placeholder-gray-400 focus:border-[#5B2EFF] transition-colors resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Senha" type="password" placeholder="Mínimo de 6 caracteres" Icon={LockIcon} name="senha" autoComplete="new-password" minLength={6} value={form.senha} onChange={alterar} />
          <FormField label="Confirmar senha" type="password" placeholder="Repita a senha" Icon={LockIcon} name="confirmar" autoComplete="new-password" value={form.confirmar} onChange={alterar} />
        </div>

        <label className="flex items-start gap-2 text-xs text-gray-500">
          <input type="checkbox" required checked={aceito} onChange={(e) => setAceito(e.target.checked)} className="rounded border-gray-300 mt-0.5" />
          Li e aceito os Termos de Uso e a Política de Privacidade do Hands
        </label>

        {erro && <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">{erro}</p>}

        <button
          type="submit"
          disabled={enviando}
          className="w-full bg-[#5B2EFF] hover:bg-[#4A25CC] disabled:opacity-60 text-white font-bold py-3.5 rounded-xl text-sm transition-colors"
          style={{ fontFamily: 'Outfit, sans-serif' }}
        >
          {enviando ? 'Criando conta...' : 'Criar conta'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-8">
        Já tem uma conta?{' '}
        <button onClick={() => navigate('/login')} className="text-[#5B2EFF] font-semibold">
          Entrar
        </button>
      </p>

      <div className="flex items-center gap-3 my-8">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-xs text-gray-400">ou</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      <button
        onClick={() => navigate('/cadastro/prestador')}
        className="w-full border border-gray-200 text-gray-600 font-semibold py-3.5 rounded-xl text-sm hover:border-[#5B2EFF]/30 hover:text-[#5B2EFF] transition-colors"
      >
        Quero oferecer serviços
      </button>
    </AuthLayout>
  )
}
