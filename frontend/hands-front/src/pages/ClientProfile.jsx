import ClientLayout from '../components/ClientLayout'
import FormField from '../components/FormField'
import { UserIcon, MailIcon, IdCardIcon, LockIcon, PinIcon, EditIcon } from '../components/icons'

export default function ClientProfile() {
  return (
    <ClientLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#1F2937]" style={{ fontFamily: 'Outfit, sans-serif' }}>
          Minha Conta
        </h1>
        <p className="text-gray-500 mt-1">Gerencie seus dados pessoais e preferências</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 h-fit">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-[#5B2EFF]/10 flex items-center justify-center text-[#5B2EFF]">
                <UserIcon width={32} height={32} />
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#5B2EFF] text-white flex items-center justify-center border-2 border-white">
                <EditIcon width={13} height={13} />
              </button>
            </div>
            <h2 className="font-bold text-[#1F2937] mt-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Ana Beatriz Ramos</h2>
            <p className="text-sm text-gray-400">Cliente desde 2025</p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Serviços contratados</span>
              <span className="font-semibold text-[#1F2937]">12</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Avaliações feitas</span>
              <span className="font-semibold text-[#1F2937]">9</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-[#1F2937] mb-5" style={{ fontFamily: 'Outfit, sans-serif' }}>Dados pessoais</h2>
            <div className="space-y-5">
              <FormField label="Nome completo" placeholder="Ana Beatriz Ramos" Icon={UserIcon} />
              <FormField label="E-mail" type="email" placeholder="ana.ramos@exemplo.com" Icon={MailIcon} />
              <div className="grid grid-cols-2 gap-4">
                <FormField label="CPF" placeholder="000.000.000-00" Icon={IdCardIcon} />
                <FormField label="Idade" type="number" placeholder="29" />
              </div>
              <FormField label="CEP" placeholder="00000-000" Icon={PinIcon} />
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
    </ClientLayout>
  )
}
