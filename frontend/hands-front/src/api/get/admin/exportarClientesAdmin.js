import { apiDownload, montarQuery } from '../../../services/api'

export const exportarClientesAdmin = (filtros) => apiDownload(`/admin/clientes/exportar${montarQuery(filtros)}`, 'clientes.csv')
