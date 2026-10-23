import { apiPostForm } from '../../../services/api'

export const enviarFoto = (arquivo) => {
  const formData = new FormData()
  formData.append('foto', arquivo)
  return apiPostForm('/foto', formData)
}
