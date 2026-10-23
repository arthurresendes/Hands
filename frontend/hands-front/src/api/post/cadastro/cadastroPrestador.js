import { apiPostForm, montarFormData } from '../../../services/api'

export const cadastroPrestador = (campos, foto) => apiPostForm('/cadastrar_prestador', montarFormData(campos, foto))
