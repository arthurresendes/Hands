import { useRef } from 'react'
import Avatar from './Avatar'
import useAuth from '../hooks/useAuth'
import { EditIcon } from './icons'
import { enviarFoto } from '../api/post/cadastro/enviarFoto'

export default function FotoPerfilEditavel({ papel, id, children, onErro }) {
  const entrada = useRef(null)
  const { atualizarFoto } = useAuth()

  const trocar = async (e) => {
    const arquivo = e.target.files[0]
    e.target.value = ''
    if (!arquivo) return
    try {
      await enviarFoto(arquivo)
      atualizarFoto()
    } catch (error) {
      onErro(error.message)
    }
  }

  return (
    <div className="relative">
      <Avatar papel={papel} id={id} className="w-24 h-24 rounded-full">
        {children}
      </Avatar>
      <button
        type="button"
        onClick={() => entrada.current.click()}
        aria-label="Trocar foto"
        className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#5B2EFF] text-white flex items-center justify-center border-2 border-white"
      >
        <EditIcon width={13} height={13} />
      </button>
      <input ref={entrada} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={trocar} />
    </div>
  )
}
