import { useState } from 'react'
import { FOTO_BASE_URL } from '../services/api'
import useAuth from '../hooks/useAuth'

export default function Avatar({ papel, id, className = '', children }) {
  const { fotoVersao } = useAuth()
  const [falhouEm, setFalhouEm] = useState(null)

  if (!id || falhouEm === fotoVersao) {
    return children
  }
  return (
    <img
      src={`${FOTO_BASE_URL}/${papel}/${id}?v=${fotoVersao}`}
      alt=""
      onError={() => setFalhouEm(fotoVersao)}
      className={`object-cover ${className}`}
    />
  )
}
