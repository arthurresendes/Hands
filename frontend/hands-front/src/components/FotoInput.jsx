import { useEffect, useRef, useState } from 'react'
import { UserIcon } from './icons'

export default function FotoInput({ foto, onChange }) {
  const entrada = useRef(null)
  const [previa, setPrevia] = useState(null)

  useEffect(() => {
    if (!foto) {
      setPrevia(null)
      return undefined
    }
    const url = URL.createObjectURL(foto)
    setPrevia(url)
    return () => URL.revokeObjectURL(url)
  }, [foto])

  return (
    <div>
      <label className="block text-sm font-semibold text-[#1F2937] mb-2">Foto de perfil (opcional)</label>
      <div className="flex items-center gap-4">
        <span className="w-16 h-16 rounded-full bg-[#F3F4F6] flex items-center justify-center text-gray-400 overflow-hidden flex-shrink-0">
          {previa ? <img src={previa} alt="" className="w-full h-full object-cover" /> : <UserIcon />}
        </span>
        <div className="text-sm">
          <button
            type="button"
            onClick={() => entrada.current.click()}
            className="font-semibold text-[#5B2EFF] border border-[#5B2EFF]/30 px-4 py-2 rounded-xl hover:bg-[#5B2EFF] hover:text-white transition-colors"
          >
            {foto ? 'Trocar foto' : 'Escolher foto'}
          </button>
          <p className="text-xs text-gray-400 mt-1">JPG, PNG ou WEBP, até 2 MB</p>
        </div>
        <input
          ref={entrada}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => onChange(e.target.files[0] ?? null)}
        />
      </div>
    </div>
  )
}
