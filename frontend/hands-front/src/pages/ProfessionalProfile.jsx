import { useState } from 'react'
import ClientLayout from '../components/ClientLayout'
import { PinIcon, WhatsAppIcon, CheckIcon, CoinIcon, AwardIcon, HeartIcon, SendIcon } from '../components/icons'

const reviews = [
  { author: 'Beatriz Carvalho', rating: 5, text: 'Excelente profissional, super pontual e capricho no serviço. Recomendo muito!' },
  { author: 'Eduardo Fonseca', rating: 5, text: 'Resolveu o problema rapidinho e o preço foi justo. Vou chamar de novo com certeza.' },
  { author: 'Fernanda Lopes', rating: 4, text: 'Bom atendimento, chegou no horário combinado. Só achei o valor um pouco acima da média.' },
]

function Stars({ rating, size = 14 }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width={size} height={size} viewBox="0 0 14 14" fill={s <= rating ? '#FFC857' : '#E5E7EB'}>
          <path d="M7 1l1.545 3.13 3.455.502-2.5 2.437.59 3.437L7 8.885 3.91 10.506l.59-3.437L2 4.632l3.455-.502L7 1z" />
        </svg>
      ))}
    </div>
  )
}

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

export default function ProfessionalProfile() {
  const [favorited, setFavorited] = useState(false)

  return (
    <ClientLayout>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
        <div className="h-40 bg-gradient-to-r from-[#5B2EFF] to-[#7C5CFC]" />
        <div className="px-8 pb-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12">
            <div className="flex items-end gap-5">
              <div className="w-28 h-28 rounded-2xl bg-gray-300 border-4 border-white flex-shrink-0" />
              <div className="pb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-[#1F2937]" style={{ fontFamily: 'Outfit, sans-serif' }}>Marcos Silva</h1>
                  <span className="inline-flex items-center gap-1 bg-[#5B2EFF]/10 text-[#5B2EFF] text-xs font-bold px-2.5 py-1 rounded-full">
                    <CheckIcon />
                    Verificado
                  </span>
                </div>
                <p className="text-gray-500 text-sm mt-1">Eletricista Residencial</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFavorited(!favorited)}
                aria-label="Favoritar profissional"
                className={`flex items-center justify-center w-12 h-12 rounded-xl border transition-colors ${favorited ? 'bg-red-50 border-red-200 text-red-500' : 'border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200'}`}
              >
                <HeartIcon width={20} height={20} fill={favorited ? 'currentColor' : 'none'} />
              </button>
              <button className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1fb855] text-white font-bold px-6 py-3 rounded-xl text-sm" style={{ fontFamily: 'Outfit, sans-serif' }}>
                <WhatsAppIcon width={18} height={18} />
                Chamar no WhatsApp
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <Stars rating={5} size={16} />
              <span className="font-bold text-[#1F2937]">4.9</span>
              <span className="text-sm text-gray-400">(142 avaliações)</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <PinIcon width={16} height={16} />
              São Paulo, SP
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <CoinIcon width={16} height={16} />
              A partir de R$ 80
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <AwardIcon width={16} height={16} />
              Prestador desde 2024
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-[#1F2937] mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>Sobre</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Eletricista com mais de 10 anos de experiência em instalações residenciais, manutenção
              preventiva e corretiva, troca de quadros de energia e certificação de instalações. Atendo
              toda a região de São Paulo com agilidade e garantia de serviço.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-[#1F2937] mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>Avaliar este profissional</h2>
            <p className="text-sm text-gray-400 mb-5">Já contratou? Conte como foi sua experiência</p>

            <div className="flex flex-col items-center py-6 mb-5 bg-[#F8F6FF] rounded-2xl">
              <StarPicker />
              <p className="text-sm text-gray-400 mt-3">Toque nas estrelas para avaliar</p>
            </div>

            <textarea
              readOnly
              rows={3}
              placeholder="Como foi o atendimento desse profissional?"
              className="w-full px-4 py-3.5 border border-gray-200 rounded-xl outline-none text-sm placeholder-gray-400 resize-none focus:border-[#5B2EFF] transition-colors mb-4"
            />

            <button className="flex items-center gap-2 bg-[#5B2EFF] hover:bg-[#4A25CC] text-white font-bold px-7 py-3.5 rounded-xl text-sm transition-colors" style={{ fontFamily: 'Outfit, sans-serif' }}>
              <SendIcon width={16} height={16} />
              Enviar avaliação
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-[#1F2937] mb-5" style={{ fontFamily: 'Outfit, sans-serif' }}>Avaliações de clientes</h2>
            <div className="space-y-5">
              {reviews.map((r) => (
                <div key={r.author} className="pb-5 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-[#1F2937]">{r.author}</p>
                    <Stars rating={r.rating} />
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-[#1F2937] mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Formas de pagamento</h2>
            <div className="flex flex-wrap gap-2">
              {['Pix', 'Dinheiro', 'Cartão de Débito', 'Cartão de Crédito'].map((f) => (
                <span key={f} className="text-xs font-semibold bg-[#F8F6FF] text-[#5B2EFF] px-3 py-1.5 rounded-full">{f}</span>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-[#1F2937] mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Certificados</h2>
            <div className="space-y-2">
              {['NR-10 Segurança em Eletricidade', 'Curso Técnico em Eletrotécnica'].map((c) => (
                <div key={c} className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="w-5 h-5 rounded-full bg-[#5B2EFF]/10 flex items-center justify-center text-[#5B2EFF] flex-shrink-0">
                    <CheckIcon width={10} height={10} />
                  </span>
                  {c}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  )
}