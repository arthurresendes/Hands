import AdminLayout from '../components/AdminLayout'
import { SearchIcon, FilterIcon, DownloadIcon, MoreIcon } from '../components/icons'

const clientes = [
  { name: 'Beatriz Carvalho', email: 'beatriz.carvalho@email.com', cep: '01310-100', services: 12, status: 'Ativo', date: '14/03/2025' },
  { name: 'Roberto Nascimento', email: 'roberto.nascimento@email.com', cep: '07011-040', services: 8, status: 'Ativo', date: '02/04/2025' },
  { name: 'Fernanda Lopes', email: 'fernanda.lopes@email.com', cep: '13015-430', services: 15, status: 'Ativo', date: '19/05/2025' },
  { name: 'Alexandre Mota', email: 'alexandre.mota@email.com', cep: '11045-001', services: 6, status: 'Inativo', date: '27/05/2025' },
  { name: 'Conceição Alves', email: 'conceicao.alves@email.com', cep: '04038-001', services: 20, status: 'Ativo', date: '03/06/2025' },
  { name: 'Eduardo Fonseca', email: 'eduardo.fonseca@email.com', cep: '06030-010', services: 9, status: 'Ativo', date: '21/06/2025' },
  { name: 'Juliana Prado', email: 'juliana.prado@email.com', cep: '06090-010', services: 3, status: 'Suspenso', date: '08/07/2025' },
]

function StatusBadge({ status }) {
  const styles = {
    Ativo: 'bg-green-50 text-green-600',
    Inativo: 'bg-gray-100 text-gray-500',
    Suspenso: 'bg-red-50 text-red-500',
  }
  return <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${styles[status]}`}>{status}</span>
}

export default function AdminClients() {
  return (
    <AdminLayout title="Clientes" subtitle="Todos os clientes cadastrados na plataforma">
      <div className="bg-white rounded-2xl p-4 flex flex-col sm:flex-row gap-3 shadow-sm border border-gray-100 mb-6">
        <div className="flex-1 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <SearchIcon width={18} height={18} />
          </span>
          <input readOnly placeholder="Buscar por nome ou e-mail" className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm outline-none placeholder-gray-400" />
        </div>
        <button className="flex items-center gap-2 text-sm font-semibold text-gray-500 border border-gray-200 px-5 py-3 rounded-xl hover:border-[#5B2EFF]/30 hover:text-[#5B2EFF] transition-colors">
          <FilterIcon />
          Filtrar
        </button>
        <button className="flex items-center gap-2 bg-[#5B2EFF] hover:bg-[#4A25CC] text-white font-bold px-5 py-3 rounded-xl text-sm transition-colors" style={{ fontFamily: 'Outfit, sans-serif' }}>
          <DownloadIcon />
          Exportar
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs text-gray-400 uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Cliente</th>
                <th className="px-6 py-4 font-semibold">CEP</th>
                <th className="px-6 py-4 font-semibold">Serviços contratados</th>
                <th className="px-6 py-4 font-semibold">Cadastro</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((c) => (
                <tr key={c.email} className="border-b border-gray-50 last:border-0 hover:bg-[#F8F6FF]/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gray-200 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-[#1F2937]">{c.name}</p>
                        <p className="text-xs text-gray-400">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{c.cep}</td>
                  <td className="px-6 py-4 text-gray-500">{c.services}</td>
                  <td className="px-6 py-4 text-gray-500">{c.date}</td>
                  <td className="px-6 py-4"><StatusBadge status={c.status} /></td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-[#5B2EFF] p-1.5">
                      <MoreIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">Mostrando 7 de 1.847 clientes</p>
          <div className="flex gap-2">
            <button className="text-xs font-semibold text-gray-400 border border-gray-200 px-3 py-1.5 rounded-lg">Anterior</button>
            <button className="text-xs font-semibold text-white bg-[#5B2EFF] px-3 py-1.5 rounded-lg">Próxima</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
