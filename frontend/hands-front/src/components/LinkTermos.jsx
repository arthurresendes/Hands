import { useState } from 'react'
import { baixarTermos } from '../api/get/documento/baixarTermos'

export default function LinkTermos({ children }) {
  const [erro, setErro] = useState(false)

  const baixar = async () => {
    setErro(false)
    try {
      await baixarTermos()
    } catch {
      setErro(true)
    }
  }

  return (
    <>
      <button type="button" onClick={baixar} className="font-semibold text-[#5B2EFF] hover:underline">
        {children}
      </button>
      {erro && <span className="text-red-500"> (não foi possível baixar o PDF agora)</span>}
    </>
  )
}
