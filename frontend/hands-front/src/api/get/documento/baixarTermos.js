import { apiDownload } from '../../../services/api'

export const baixarTermos = () => apiDownload('/termos-de-uso', 'termos-de-uso-hands.pdf')
