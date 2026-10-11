import ProviderLayout from '../components/ProviderLayout'
import FormField from '../components/FormField'
import { UserIcon, MailIcon, IdCardIcon, LockIcon, PinIcon, BriefcaseIcon, CoinIcon, EditIcon } from '../components/icons'

const servicos = ['Eletricista', 'Encanador', 'Pintor', 'Diarista', 'Pedreiro', 'Jardineiro', 'Técnico de TI', 'Montador de Móveis']

export default function ProviderProfile() {
  return (
    <ProviderLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#1F2937]" style={{ fontFamily: 'Outfit, sans-serif' }}>
          Minha Conta
        </h1>
        <p className="text-gray-500 mt-1">Gerencie seu perfil profissional e seus dados</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 h-fit">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-[#FFC857]/15 flex items-center justify-center" style={{ color: '#B8860B' }}>
                <UserIcon width={32} height={32} />
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#5B2EFF] text-white flex items-center justify-center border-2 border-white">
                <EditIcon width={13} height={13} />
              </button>
            </div>
            <h2 className="font-bold text-[#1F2937] mt-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Marcos Silva</h2>
            <p className="text-sm text-gray-400">Eletricista Residencial</p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Serviços realizados</span>
              <span className="font-semibold text-[#1F2937]">142</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Avaliação média</span>
              <span className="font-semibold text-[#1F2937]">4.9</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-[#1F2937] mb-5" style={{ fontFamily: 'Outfit, sans-serif' }}>Dados pessoais</h2>
            <div className="space-y-5">
              <FormField label="Nome completo" placeholder="Marcos Silva" Icon={UserIcon} />
              <FormField label="E-mail" type="email" placeholder="marcos.silva@exemplo.com" Icon={MailIcon} />
              <div className="grid grid-cols-2 gap-4">
                <FormField label="CPF" placeholder="000.000.000-00" Icon={IdCardIcon} />
                <FormField label="Idade" type="number" placeholder="34" />
              </div>
              <FormField label="CEP" placeholder="00000-000" Icon={PinIcon} />
              <button className="bg-[#5B2EFF] hover:bg-[#4A25CC] text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Salvar alterações
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-[#1F2937] mb-5" style={{ fontFamily: 'Outfit, sans-serif' }}>Dados profissionais</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-[#1F2937] mb-2">Serviço oferecido</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <BriefcaseIcon />
                  </span>
                  <select disabled className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl outline-none text-sm text-gray-400 appearance-none">
                    <option>Eletricista</option>
                    {servicos.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <FormField label="Valor médio do serviço" placeholder="R$ 80,00" Icon={CoinIcon} />
              <button className="bg-[#5B2EFF] hover:bg-[#4A25CC] text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Salvar alterações
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-[#1F2937] mb-5" style={{ fontFamily: 'Outfit, sans-serif' }}>Alterar senha</h2>
            <div className="space-y-5">
              <FormField label="Senha atual" type="password" placeholder="Digite sua senha atual" Icon={LockIcon} />
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Nova senha" type="password" placeholder="Nova senha" Icon={LockIcon} />
                <FormField label="Confirmar nova senha" type="password" placeholder="Repita a nova senha" Icon={LockIcon} />
              </div>
              <button className="bg-[#1F2937] hover:bg-black text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Atualizar senha
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-red-100 p-6">
            <h2 className="font-bold text-red-500 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>Excluir conta</h2>
            <p className="text-sm text-gray-500 mb-4">Essa ação é permanente e removerá todos os seus dados da plataforma.</p>
            <button className="border border-red-200 text-red-500 font-semibold px-6 py-3 rounded-xl text-sm hover:bg-red-50 transition-colors">
              Excluir minha conta
            </button>
          </div>
        </div>
      </div>
    </ProviderLayout>
  )
}
