import { apiPostForm } from '../services/api'

function montarFormData(campos, foto) {
  const formData = new FormData()
  Object.entries(campos).forEach(([nome, valor]) => {
    if (Array.isArray(valor)) {
      valor.forEach((item) => formData.append(nome, item))
    } else {
      formData.append(nome, valor)
    }
  })
  if (foto) formData.append('foto', foto)
  return formData
}

export const cadastrarCliente = (campos, foto) =>
  apiPostForm('/cadastrar_cliente', montarFormData(campos, foto))

export const cadastrarPrestador = (campos, foto) =>
  apiPostForm('/cadastrar_prestador', montarFormData(campos, foto))
