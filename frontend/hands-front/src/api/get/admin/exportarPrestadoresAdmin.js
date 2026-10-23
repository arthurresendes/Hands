import { apiDownload, montarQuery } from '../../../services/api'

export const exportarPrestadoresAdmin = (filtros) => apiDownload(`/admin/prestadores/exportar${montarQuery(filtros)}`, 'prestadores.csv')
