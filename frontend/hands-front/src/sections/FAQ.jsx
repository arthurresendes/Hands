import { useState } from 'react'
import { ChevronDownIcon } from '../components/icons'

const faqs = [
  {
    q: 'O Hands cobra alguma taxa para usar a plataforma?',
    a: 'Não. O cadastro e a busca por profissionais são totalmente gratuitos para clientes. Profissionais também se cadastram sem custo e sem comissão sobre os serviços prestados.',
  },
  {
    q: 'Como funciona a busca por profissionais próximos?',
    a: 'Basta informar o serviço que você precisa e o seu CEP. O Hands localiza automaticamente os profissionais mais próximos da sua região, sem necessidade de preencher endereço completo.',
  },
  {
    q: 'As avaliações dos profissionais são confiáveis?',
    a: 'Sim. Apenas clientes que efetivamente contrataram um profissional pela plataforma podem avaliá-lo, o que garante avaliações reais e verificadas.',
  },
  {
    q: 'Como entro em contato com um profissional?',
    a: 'Após encontrar o profissional ideal, o contato é feito diretamente pelo WhatsApp, sem intermediários, permitindo negociar valores e prazos livremente.',
  },
  {
    q: 'Posso me cadastrar como cliente e como profissional ao mesmo tempo?',
    a: 'Os cadastros de cliente e de profissional são independentes. Você pode criar uma conta em cada categoria utilizando o mesmo e-mail, de acordo com a necessidade.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState(0)

  return (
    <section id="faq" className="py-24 bg-[#F3F4F6]">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="text-xs font-bold tracking-widest uppercase text-[#5B2EFF] mb-3 block">Dúvidas Frequentes</span>
          <h2 className="text-4xl font-black text-[#1F2937]" style={{ fontFamily: 'Outfit, sans-serif' }}>Perguntas Frequentes</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((item, i) => (
            <div key={item.q} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="font-semibold text-[#1F2937] text-sm">{item.q}</span>
                <ChevronDownIcon className={`flex-shrink-0 text-[#5B2EFF] transition-transform ${open === i ? 'rotate-180' : ''}`} />
              </button>
              {open === i && (
                <div className="px-6 pb-5">
                  <p className="text-sm text-gray-500 leading-relaxed">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
