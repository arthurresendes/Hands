import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ClientLayout from '../components/ClientLayout'
import PrestadorCard from '../components/PrestadorCard'
import Aviso from '../components/Aviso'
import { HeartIcon, SearchIcon } from '../components/icons'
import useEstadoPainel from '../hooks/useEstadoPainel'
import { listarFavoritos } from '../api/get/listagem/listagemFavoritos'
import { desfavoritarPrestador } from '../api/delete/deletarFavorito'

export default function ClientFavorites() {
  const navigate = useNavigate()
  const [favoritos, setFavoritos] = useEstadoPainel('cliente.favoritos.lista', null)
  const [erro, setErro] = useState('')

  useEffect(() => {
    let ativo = true
    listarFavoritos()
      .then((lista) => ativo && setFavoritos(lista))
      .catch((error) => ativo && setErro(error.message))
    return () => {
      ativo = false
    }
  }, [setFavoritos])

  const lista = favoritos ?? []
  const carregando = favoritos === null && !erro

  const remover = async (prestador) => {
    setFavoritos((atual) => (atual ?? []).filter((p) => p._id !== prestador._id))
    try {
      await desfavoritarPrestador(prestador.email)
    } catch (error) {
      setFavoritos((atual) => [...(atual ?? []), prestador])
      setErro(error.message)
    }
  }

  return (
    <ClientLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#1F2937]" style={{ fontFamily: 'Outfit, sans-serif' }}>
          Profissionais Favoritos
        </h1>
        <p className="text-gray-500 mt-1">Acesse rapidamente os profissionais que você salvou</p>
      </div>

      {erro && <div className="mb-5"><Aviso>{erro}</Aviso></div>}

      {carregando && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl h-80 animate-pulse" />
          ))}
        </div>
      )}

      {!carregando && lista.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lista.map((p) => (
            <PrestadorCard
              key={p._id}
              prestador={p}
              onFavoritar={remover}
              onVerPerfil={(prestador) => navigate(`/cliente/profissional/${prestador._id}`)}
            />
          ))}
        </div>
      )}

      {!carregando && lista.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 py-20 px-6 flex flex-col items-center text-center">
          <span className="w-20 h-20 rounded-full bg-[#F8F6FF] flex items-center justify-center text-[#5B2EFF] mb-6">
            <HeartIcon width={32} height={32} />
          </span>
          <h2 className="text-xl font-bold text-[#1F2937] mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Você ainda não tem favoritos
          </h2>
          <p className="text-sm text-gray-500 max-w-sm mb-8">
            Quando encontrar um profissional que gostou, toque no coração no perfil dele para
            salvá-lo aqui e acessar com mais facilidade depois.
          </p>
          <button
            onClick={() => navigate('/cliente/buscar')}
            className="flex items-center gap-2 bg-[#5B2EFF] hover:bg-[#4A25CC] text-white font-bold px-7 py-3.5 rounded-xl text-sm transition-colors"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            <SearchIcon width={16} height={16} />
            Buscar profissionais
          </button>
        </div>
      )}
    </ClientLayout>
  )
}
