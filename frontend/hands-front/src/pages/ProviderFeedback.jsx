import { useState } from 'react'
import ProviderLayout from '../components/ProviderLayout'
import { SendIcon } from '../components/icons'

const criterios = [
  'Facilidade de uso',
  'Qualidade dos clientes recebidos',
  'Suporte da plataforma',
  'Clareza das informações',
]

function StarPicker() {
  const [value, setValue] = useState(0)
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button key={s} type="button" onClick={() => setValue(s)} className="p-0.5">
          <svg width="26" height="26" viewBox="0 0 14 14" fill={s <= value ? '#FFC857' : '#E5E7EB'}>
            <path d="M7 1l1.545 3.13 3.455.502-2.5 2.437.59 3.437L7 8.885 3.91 10.506l.59-3.437L2 4.632l3.455-.502L7 1z" />
          </svg>
        </button>
      ))}
    </div>
  )
}

export default function ProviderFeedback() {
  return (
    <ProviderLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#1F2937]" style={{ fontFamily: 'Outfit, sans-serif' }}>
          Avaliar o Hands
        </h1>
        <p className="text-gray-500 mt-1">Sua opinião ajuda a melhorar a plataforma para todo mundo</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-[#1F2937] mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>Como foi sua experiência?</h2>
          <p className="text-sm text-gray-400 mb-6">Dê uma nota geral para a plataforma</p>

          <div className="flex flex-col items-center py-6 mb-6 bg-[#F8F6FF] rounded-2xl">
            <StarPicker />
            <p className="text-sm text-gray-400 mt-3">Toque nas estrelas para avaliar</p>
          </div>

          <div className="space-y-5 mb-6">
            {criterios.map((c) => (
              <div key={c} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{c}</span>
                <StarPicker />
              </div>
            ))}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#1F2937] mb-2">Deixe um comentário</label>
            <textarea
              readOnly
              rows={4}
              placeholder="Conte como foi sua experiência oferecendo serviços no Hands..."
              className="w-full px-4 py-3.5 border border-gray-200 rounded-xl outline-none text-sm placeholder-gray-400 resize-none focus:border-[#5B2EFF] transition-colors"
            />
          </div>

          <button className="flex items-center gap-2 bg-[#5B2EFF] hover:bg-[#4A25CC] text-white font-bold px-7 py-3.5 rounded-xl text-sm transition-colors" style={{ fontFamily: 'Outfit, sans-serif' }}>
            <SendIcon width={16} height={16} />
            Enviar avaliação
          </button>
        </div>

        <div className="bg-[#1F2937] rounded-2xl p-6 text-white h-fit">
          <p className="text-5xl font-black mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>4.9</p>
          <div className="flex gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <svg key={s} width="16" height="16" viewBox="0 0 14 14" fill="#FFC857">
                <path d="M7 1l1.545 3.13 3.455.502-2.5 2.437.59 3.437L7 8.885 3.91 10.506l.59-3.437L2 4.632l3.455-.502L7 1z" />
              </svg>
            ))}
          </div>
          <p className="text-white/50 text-sm mb-6">com base em +2.400 avaliações</p>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-white/60">Suas avaliações feitas</span>
              <span className="font-bold">3</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Última avaliação</span>
              <span className="font-bold">há 2 meses</span>
            </div>
          </div>
        </div>
      </div>
    </ProviderLayout>
  )
}
