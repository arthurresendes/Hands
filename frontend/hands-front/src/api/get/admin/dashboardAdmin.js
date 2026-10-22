import { apiGet } from '../../../services/api'

export const buscarDashboardAdmin = () => apiGet('/admin/dashboard')
