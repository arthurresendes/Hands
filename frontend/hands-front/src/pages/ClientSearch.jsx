import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ClientLayout from '../components/ClientLayout'
import PrestadorCard from '../components/PrestadorCard'
import Aviso from '../components/Aviso'
import { SearchIcon, PinIcon, FilterIcon } from '../components/icons'
import { buscarPrestadores } from '../api/get/listagem/buscarPrestadores'
import { favoritarPrestador } from '../api/post/cadastro/cadastroFavorito'
import { desfavoritarPrestador } from '../api/delete/deletarFavorito'
import useEstadoPainel from '../hooks/useEstadoPainel'
import usePerfil from '../hooks/usePerfil'
import { SERVICOS } from '../utils/servicos'


const FILTROS_INICIAIS = {
  q: '',
  servico: '',
  cep: '',
  nota_minima: '',
  valor_min: '',
  valor_max: '',
  idioma: '',
  cidade: '',
  raio_km: '',
  ordenar: '',
  somente_favoritos: false,
}

const classeCampo = 'w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#5B2EFF] placeholder-gray-400 bg-white'

export default function ClientSearch() {
  const navigate = useNavigate()
  const { perfil } = usePerfil()
  const [form, setForm] = useEstadoPainel('cliente.busca.form', FILTROS_INICIAIS)
  const [aplicado, setAplicado] = useEstadoPainel('cliente.busca.aplicado', FILTROS_INICIAIS)
  const [pagina, setPagina] = useEstadoPainel('cliente.busca.pagina', 1)
  const [painelAberto, setPainelAberto] = useEstadoPainel('cliente.busca.painel', false)
  const [resultado, setResultado] = useEstadoPainel('cliente.busca.resultado', null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    if (perfil?.cep) setForm((atual) => (atual.cep ? atual : { ...atual, cep: perfil.cep }))
  }, [perfil, setForm])

  useEffect(() => {
    let ativo = true
    setCarregando(true)
    setErro('')
    buscarPrestadores({ ...aplicado, pagina })
      .then((dados) => ativo && setResultado(dados))
      .catch((error) => ativo && setErro(error.message))
      .finally(() => ativo && setCarregando(false))
    return () => {
      ativo = false
    }
  }, [aplicado, pagina, setResultado])

  const alterar = (e) => {
    const { name, type, checked, value } = e.target
    setForm((atual) => ({ ...atual, [name]: type === 'checkbox' ? checked : value }))
  }

  const buscar = (e) => {
    e.preventDefault()
    setPagina(1)
    setAplicado(form)
  }

  const limpar = () => {
    setForm(FILTROS_INICIAIS)
    setPagina(1)
    setAplicado(FILTROS_INICIAIS)
  }

  const alternarFavorito = async (prestador) => {
    const novo = !prestador.favorito
    const marcar = (valor) =>
      setResultado((atual) => ({
        ...atual,
        prestadores: atual.prestadores.map((p) => (p._id === prestador._id ? { ...p, favorito: valor } : p)),
      }))
    marcar(novo)
    try {
      await (novo ? favoritarPrestador(prestador.email) : desfavoritarPrestador(prestador.email))
    } catch (error) {
      marcar(!novo)
      setErro(error.message)
    }
  }

  const prestadores = resultado?.prestadores ?? []
  const total = resultado?.total ?? 0
  const referencia = resultado?.referencia_cep

  return (
    <ClientLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#1F2937]" style={{ fontFamily: 'Outfit, sans-serif' }}>
          Buscar Profissionais
        </h1>
        <p className="text-gray-500 mt-1">Encontre o profissional ideal perto de você</p>
      </div>

      <form onSubmit={buscar} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-8">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1 relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <SearchIcon width={18} height={18} />
            </span>
            <input name="q" value={form.q} onChange={alterar} placeholder="Nome, e-mail ou tipo de serviço" className={`${classeCampo} pl-11`} />
          </div>
          <select name="servico" value={form.servico} onChange={alterar} className={`${classeCampo} lg:w-56`}>
            <option value="">Todos os serviços</option>
            {SERVICOS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <div className="relative w-full lg:w-52">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <PinIcon width={18} height={18} />
            </span>
            <input name="cep" value={form.cep} onChange={alterar} placeholder="Digite seu CEP" className={`${classeCampo} pl-11`} />
          </div>
          <button type="submit" className="bg-[#5B2EFF] hover:bg-[#4A25CC] text-white font-bold px-8 py-3 rounded-xl text-sm whitespace-nowrap" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Buscar
          </button>
        </div>

        {painelAberto && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4 pt-4 border-t border-gray-100">
            <select name="nota_minima" value={form.nota_minima} onChange={alterar} className={classeCampo}>
              <option value="">Qualquer avaliação</option>
              <option value="3">3 estrelas ou mais</option>
              <option value="4">4 estrelas ou mais</option>
              <option value="4.5">4,5 estrelas ou mais</option>
            </select>
            <input name="valor_min" type="number" min="0" value={form.valor_min} onChange={alterar} placeholder="Valor mínimo (R$)" className={classeCampo} />
            <input name="valor_max" type="number" min="0" value={form.valor_max} onChange={alterar} placeholder="Valor máximo (R$)" className={classeCampo} />
            <input name="idioma" value={form.idioma} onChange={alterar} placeholder="Idioma" className={classeCampo} />
            <input name="cidade" value={form.cidade} onChange={alterar} placeholder="Cidade" className={classeCampo} />
            <select name="raio_km" value={form.raio_km} onChange={alterar} disabled={!form.cep} className={`${classeCampo} disabled:text-gray-300`}>
              <option value="">Qualquer distância</option>
              <option value="5">Até 5 km</option>
              <option value="10">Até 10 km</option>
              <option value="25">Até 25 km</option>
              <option value="50">Até 50 km</option>
            </select>
            <select name="ordenar" value={form.ordenar} onChange={alterar} className={classeCampo}>
              <option value="">Ordenar: mais relevantes</option>
              <option value="nota">Melhor avaliação</option>
              <option value="avaliacoes">Mais avaliados</option>
              <option value="preco">Menor valor</option>
              <option value="nome">Nome (A-Z)</option>
              <option value="distancia" disabled={!form.cep}>Mais próximos</option>
            </select>
            <label className="flex items-center gap-2 text-sm text-gray-600 px-2">
              <input type="checkbox" name="somente_favoritos" checked={form.somente_favoritos} onChange={alterar} className="rounded border-gray-300" />
              Somente favoritos
            </label>
          </div>
        )}
      </form>

      <div className="flex items-center justify-between mb-5 gap-4">
        <p className="text-sm text-gray-500">
          <span className="font-bold text-[#1F2937]">{total} {total === 1 ? 'profissional' : 'profissionais'}</span>
          {' '}{total === 1 ? 'encontrado' : 'encontrados'}
          {referencia?.cidade && ` perto de ${referencia.cidade}`}
        </p>
        <div className="flex items-center gap-2">
          <button type="button" onClick={limpar} className="text-sm font-semibold text-gray-400 hover:text-[#5B2EFF] px-3 py-2">
            Limpar
          </button>
          <button
            type="button"
            onClick={() => setPainelAberto(!painelAberto)}
            className="flex items-center gap-2 text-sm font-semibold text-gray-500 border border-gray-200 px-4 py-2 rounded-xl hover:border-[#5B2EFF]/30 hover:text-[#5B2EFF] transition-colors"
          >
            <FilterIcon />
            Filtrar
          </button>
        </div>
      </div>

      {erro && <div className="mb-5"><Aviso>{erro}</Aviso></div>}

      {carregando && !resultado && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl h-80 animate-pulse" />
          ))}
        </div>
      )}

      {!carregando && !erro && prestadores.length === 0 && (
        <p className="text-center text-gray-400 text-sm py-16">Nenhum profissional encontrado com esses filtros.</p>
      )}

      {prestadores.length > 0 && (
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${carregando ? 'opacity-60' : ''}`}>
          {prestadores.map((p) => (
            <PrestadorCard
              key={p._id}
              prestador={p}
              onFavoritar={alternarFavorito}
              onVerPerfil={(prestador) => navigate(`/cliente/profissional/${prestador._id}`)}
            />
          ))}
        </div>
      )}

      {resultado && resultado.total_paginas > 1 && (
        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            onClick={() => setPagina(pagina - 1)}
            disabled={pagina <= 1}
            className="text-sm font-semibold border border-gray-200 px-5 py-2.5 rounded-xl text-gray-600 disabled:opacity-40 hover:border-[#5B2EFF]/30"
          >
            Anterior
          </button>
          <span className="text-sm text-gray-500">Página {resultado.pagina} de {resultado.total_paginas}</span>
          <button
            onClick={() => setPagina(pagina + 1)}
            disabled={pagina >= resultado.total_paginas}
            className="text-sm font-semibold border border-gray-200 px-5 py-2.5 rounded-xl text-gray-600 disabled:opacity-40 hover:border-[#5B2EFF]/30"
          >
            Próxima
          </button>
        </div>
      )}
    </ClientLayout>
  )
}
