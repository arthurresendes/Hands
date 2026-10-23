import { apiPostForm, montarFormData } from '../../../services/api'

export const cadastroCliente = (campos, foto) => apiPostForm('/cadastrar_cliente', montarFormData(campos, foto))
