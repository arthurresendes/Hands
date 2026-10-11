import AdminLayout from '../components/AdminLayout'
import { SearchIcon, FilterIcon, DownloadIcon, MoreIcon } from '../components/icons'

const prestadores = [
  { name: 'Marcos Silva', email: 'marcos.silva@email.com', service: 'Eletricista', rating: 4.9, status: 'Verificado', date: '10/02/2025' },
  { name: 'Ana Paula Costa', email: 'ana.costa@email.com', service: 'Diarista', rating: 5.0, status: 'Verificado', date: '22/02/2025' },
  { name: 'Ricardo Souza', email: 'ricardo.souza@email.com', service: 'Encanador', rating: 4.8, status: 'Verificado', date: '15/03/2025' },
  { name: 'Juliana Prado', email: 'juliana.prado2@email.com', service: 'Pintora', rating: 4.7, status: 'Pendente', date: '02/04/2025' },
  { name: 'Carlos Henrique', email: 'carlos.henrique@email.com', service: 'Pedreiro', rating: 4.6, status: 'Verificado', date: '19/04/2025' },
  { name: 'Patrícia Lima', email: 'patricia.lima@email.com', service: 'Jardinagem', rating: 4.9, status: 'Verificado', date: '30/04/2025' },
  { name: 'Eduardo Fonseca', email: 'eduardo.fonseca2@email.com', service: 'Técnico de TI', rating: 4.5, status: 'Suspenso', date: '11/05/2025' },
]

function StatusBadge({ status }) {
  const styles = {
    Verificado: 'bg-green-50 text-green-600',
    Pendente: 'bg-yellow-50 text-yellow-600',
    Suspenso: 'bg-red-50 text-red-500',
  }
  return <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${styles[status]}`}>{status}</span>
}

export default function AdminProviders() {
  return (
    <AdminLayout title="Prestadores" subtitle="Todos os profissionais cadastrados na plataforma">
      <div className="bg-white rounded-2xl p-4 flex flex-col sm:flex-row gap-3 shadow-sm border border-gray-100 mb-6">
        <div className="flex-1 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <SearchIcon width={18} height={18} />
          </span>
          <input readOnly placeholder="Buscar por nome, e-mail ou serviço" className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm outline-none placeholder-gray-400" />
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
                <th className="px-6 py-4 font-semibold">Prestador</th>
                <th className="px-6 py-4 font-semibold">Serviço</th>
                <th className="px-6 py-4 font-semibold">Avaliação</th>
                <th className="px-6 py-4 font-semibold">Cadastro</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {prestadores.map((p) => (
                <tr key={p.email} className="border-b border-gray-50 last:border-0 hover:bg-[#F8F6FF]/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gray-200 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-[#1F2937]">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{p.service}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 font-semibold text-[#1F2937]">
                      <svg width="13" height="13" viewBox="0 0 14 14" fill="#FFC857">
                        <path d="M7 1l1.545 3.13 3.455.502-2.5 2.437.59 3.437L7 8.885 3.91 10.506l.59-3.437L2 4.632l3.455-.502L7 1z" />
                      </svg>
                      {p.rating}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{p.date}</td>
                  <td className="px-6 py-4"><StatusBadge status={p.status} /></td>
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
          <p className="text-xs text-gray-400">Mostrando 7 de 5.203 prestadores</p>
          <div className="flex gap-2">
            <button className="text-xs font-semibold text-gray-400 border border-gray-200 px-3 py-1.5 rounded-lg">Anterior</button>
            <button className="text-xs font-semibold text-white bg-[#5B2EFF] px-3 py-1.5 rounded-lg">Próxima</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
