import { apiDownload, montarQuery } from '../../../services/api'

export const exportarAvaliacoesHandsAdmin = (filtros) => apiDownload(`/admin/avaliacoes-hands/exportar${montarQuery(filtros)}`, 'avaliacoes-hands.csv')
