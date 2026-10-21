import { useState } from 'react'
import { FOTO_BASE_URL } from '../services/api'

export default function Avatar({ papel, id, className = '', children }) {
  const [falhou, setFalhou] = useState(false)

  if (!id || falhou) {
    return children
  }
  return (
    <img
      src={`${FOTO_BASE_URL}/${papel}/${id}`}
      alt=""
      onError={() => setFalhou(true)}
      className={`object-cover ${className}`}
    />
  )
}
