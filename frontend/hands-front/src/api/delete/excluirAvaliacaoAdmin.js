import { apiDelete } from '../../services/api'

export const excluirAvaliacaoAdmin = (origem, id) => apiDelete(`/admin/moderacao/${origem}/${encodeURIComponent(id)}`)
