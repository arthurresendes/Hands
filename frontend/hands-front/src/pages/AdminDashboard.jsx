import AdminLayout from '../components/AdminLayout'
import { UsersIcon, BriefcaseIcon, StarOutlineIcon, DownloadIcon, UserPlusIcon, AlertTriangleIcon } from '../components/icons'

const statCards = [
  { label: 'Total de clientes cadastrados', value: '1.847', Icon: UsersIcon, accent: '#5B2EFF' },
  { label: 'Total de prestadores cadastrados', value: '5.203', Icon: BriefcaseIcon, accent: '#FFC857' },
  { label: 'Avaliações do site realizadas', value: '2.418', Icon: StarOutlineIcon, accent: '#5B2EFF' },
  { label: 'Total de exportações realizadas', value: '347', Icon: DownloadIcon, accent: '#FFC857' },
]

const clientsChart = [
  { month: 'Mar', value: 280 },
  { month: 'Abr', value: 310 },
  { month: 'Mai', value: 295 },
  { month: 'Jun', value: 340 },
  { month: 'Jul', value: 380 },
  { month: 'Ago', value: 234 },
]

const providersChart = [
  { month: 'Mar', value: 380 },
  { month: 'Abr', value: 510 },
  { month: 'Mai', value: 470 },
  { month: 'Jun', value: 640 },
  { month: 'Jul', value: 720 },
  { month: 'Ago', value: 890 },
]

function BarChart({ data, color }) {
  const max = Math.max(...data.map((d) => d.value))
  return (
    <div className="flex items-end justify-between gap-3 h-32">
      {data.map((d) => (
        <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
          <span className="text-xs font-bold text-[#1F2937]">{d.value}</span>
          <div className="w-full rounded-t-md" style={{ height: `${(d.value / max) * 72}px`, backgroundColor: color + '20' }}>
            <div className="w-full h-full rounded-t-md" style={{ backgroundColor: color, opacity: 0.85 }} />
          </div>
          <span className="text-xs text-gray-400">{d.month}</span>
        </div>
      ))}
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <AdminLayout title="Dashboard" subtitle="Visão geral da plataforma Hands">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
        {statCards.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="h-1" style={{ backgroundColor: s.accent }} />
            <div className="p-5">
              <span className="inline-flex w-9 h-9 rounded-lg items-center justify-center mb-4" style={{ backgroundColor: s.accent + '15', color: s.accent }}>
                <s.Icon width={18} height={18} />
              </span>
              <p className="text-2xl font-black text-[#1F2937]" style={{ fontFamily: 'Outfit, sans-serif' }}>{s.value}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
          <span className="w-11 h-11 rounded-xl bg-[#5B2EFF]/10 flex items-center justify-center text-[#5B2EFF] flex-shrink-0">
            <UserPlusIcon width={18} height={18} />
          </span>
          <div>
            <p className="text-sm text-gray-500">Novos cadastros no período (últimos 30 dias)</p>
            <p className="text-2xl font-black text-[#1F2937]" style={{ fontFamily: 'Outfit, sans-serif' }}>234</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
          <span className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center text-red-400 flex-shrink-0">
            <AlertTriangleIcon width={18} height={18} />
          </span>
          <div className="flex items-center gap-3">
            <div>
              <p className="text-sm text-gray-500">Moderação pendente</p>
              <p className="text-2xl font-black text-[#1F2937]" style={{ fontFamily: 'Outfit, sans-serif' }}>12</p>
            </div>
            <span className="text-xs font-bold bg-red-100 text-red-500 px-2.5 py-1 rounded-full">Atenção</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-[#1F2937] mb-6" style={{ fontFamily: 'Outfit, sans-serif' }}>Novos clientes — últimos 6 meses</h2>
          <BarChart data={clientsChart} color="#5B2EFF" />
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-[#1F2937] mb-6" style={{ fontFamily: 'Outfit, sans-serif' }}>Novos prestadores — últimos 6 meses</h2>
          <BarChart data={providersChart} color="#FFC857" />
        </div>
      </div>
    </AdminLayout>
  )
}
