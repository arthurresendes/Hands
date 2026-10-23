import { useEffect, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import Aviso from '../components/Aviso'
import useEstadoPainel from '../hooks/useEstadoPainel'
import { UsersIcon, BriefcaseIcon, StarOutlineIcon, DownloadIcon, UserPlusIcon } from '../components/icons'
import { buscarDashboardAdmin } from '../api/get/admin/dashboardAdmin'

function BarChart({ data, color }) {
  const max = Math.max(1, ...data.map((d) => d.total))
  return (
    <div className="flex items-end justify-between gap-3 h-32">
      {data.map((d) => (
        <div key={d.mes} className="flex-1 flex flex-col items-center gap-2">
          <span className="text-xs font-bold text-[#1F2937]">{d.total}</span>
          <div className="w-full rounded-t-md" style={{ height: `${Math.max(2, (d.total / max) * 72)}px`, backgroundColor: color, opacity: 0.85 }} />
          <span className="text-xs text-gray-400">{d.rotulo}</span>
        </div>
      ))}
    </div>
  )
}

const formatar = (valor) => valor.toLocaleString('pt-BR')

export default function AdminDashboard() {
  const [data, setData] = useEstadoPainel('admin.dashboard', null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let ativo = true
    buscarDashboardAdmin()
      .then((dados) => ativo && setData(dados))
      .catch((erro) => ativo && setError(erro))
    return () => {
      ativo = false
    }
  }, [setData])

  const loading = !data && !error

  const cards = data && [
    { label: 'Total de clientes cadastrados', value: data.total_clientes, Icon: UsersIcon, accent: '#5B2EFF' },
    { label: 'Total de prestadores cadastrados', value: data.total_prestadores, Icon: BriefcaseIcon, accent: '#FFC857' },
    { label: 'Avaliações do site realizadas', value: data.total_avaliacoes_hands, Icon: StarOutlineIcon, accent: '#5B2EFF' },
    { label: 'Total de exportações realizadas', value: data.total_exportacoes, Icon: DownloadIcon, accent: '#FFC857' },
  ]

  return (
    <AdminLayout title="Dashboard" subtitle="Visão geral da plataforma Hands">
      {error && <div className="mb-6"><Aviso>{error.message}</Aviso></div>}

      {loading && <div className="bg-white rounded-2xl h-96 animate-pulse" />}

      {data && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
            {cards.map((s) => (
              <div key={s.label} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="h-1" style={{ backgroundColor: s.accent }} />
                <div className="p-5">
                  <span className="inline-flex w-9 h-9 rounded-lg items-center justify-center mb-4" style={{ backgroundColor: s.accent + '15', color: s.accent }}>
                    <s.Icon width={18} height={18} />
                  </span>
                  <p className="text-2xl font-black text-[#1F2937]" style={{ fontFamily: 'Outfit, sans-serif' }}>{formatar(s.value)}</p>
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
                <p className="text-sm text-gray-500">Novos clientes (últimos 30 dias)</p>
                <p className="text-2xl font-black text-[#1F2937]" style={{ fontFamily: 'Outfit, sans-serif' }}>{formatar(data.novos_clientes_30_dias)}</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
              <span className="w-11 h-11 rounded-xl bg-[#FFC857]/20 flex items-center justify-center flex-shrink-0" style={{ color: '#B8860B' }}>
                <UserPlusIcon width={18} height={18} />
              </span>
              <div>
                <p className="text-sm text-gray-500">Novos prestadores (últimos 30 dias)</p>
                <p className="text-2xl font-black text-[#1F2937]" style={{ fontFamily: 'Outfit, sans-serif' }}>{formatar(data.novos_prestadores_30_dias)}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-bold text-[#1F2937] mb-6" style={{ fontFamily: 'Outfit, sans-serif' }}>Novos clientes — últimos 6 meses</h2>
              <BarChart data={data.clientes_por_mes} color="#5B2EFF" />
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-bold text-[#1F2937] mb-6" style={{ fontFamily: 'Outfit, sans-serif' }}>Novos prestadores — últimos 6 meses</h2>
              <BarChart data={data.prestadores_por_mes} color="#FFC857" />
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  )
}
