import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AuthProvider from './context/AuthProvider'
import RotaProtegida from './components/RotaProtegida'
import Landing from './pages/Landing'
import LoginClient from './pages/LoginClient'
import LoginProvider from './pages/LoginProvider'
import LoginAdmin from './pages/LoginAdmin'
import RegisterClient from './pages/RegisterClient'
import RegisterProvider from './pages/RegisterProvider'
import ClientSearch from './pages/ClientSearch'
import ProfessionalProfile from './pages/ProfessionalProfile'
import ClientProfile from './pages/ClientProfile'
import PlatformFeedback from './pages/PlatformFeedback'
import ClientFavorites from './pages/ClientFavorites'
import ProviderClients from './pages/ProviderClients'
import ProviderReviews from './pages/ProviderReviews'
import ProviderProfile from './pages/ProviderProfile'
import ProviderFeedback from './pages/ProviderFeedback'
import ClientProfileView from './pages/ClientProfileView'
import AdminDashboard from './pages/AdminDashboard'
import AdminClients from './pages/AdminClients'
import AdminProviders from './pages/AdminProviders'
import AdminReviews from './pages/AdminReviews'
import AdminClientDetail from './pages/AdminClientDetail'
import AdminProviderDetail from './pages/AdminProviderDetail'
import ForgotPasswordEmail from './pages/ForgotPasswordEmail'
import ForgotPasswordCode from './pages/ForgotPasswordCode'
import ForgotPasswordReset from './pages/ForgotPasswordReset'
import NotFound from './pages/NotFound'
import RolarParaTopo from './components/RolarParaTopo'


export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
      <RolarParaTopo />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<LoginClient />} />
        <Route path="/login/prestador" element={<LoginProvider />} />
        <Route path="/login/admin" element={<LoginAdmin />} />
        <Route path="/cadastro/cliente" element={<RegisterClient />} />
        <Route path="/cadastro/prestador" element={<RegisterProvider />} />
        <Route element={<RotaProtegida papel="cliente" />}>
          <Route path="/cliente/buscar" element={<ClientSearch />} />
          <Route path="/cliente/profissional/:id" element={<ProfessionalProfile />} />
          <Route path="/cliente/perfil" element={<ClientProfile />} />
          <Route path="/cliente/avaliar" element={<PlatformFeedback />} />
          <Route path='/cliente/favoritos' element={<ClientFavorites />} />
        </Route>
        <Route element={<RotaProtegida papel="prestador" />}>
          <Route path="/prestador/clientes" element={<ProviderClients />} />
          <Route path="/prestador/avaliacoes" element={<ProviderReviews />} />
          <Route path="/prestador/perfil" element={<ProviderProfile />} />
          <Route path="/prestador/cliente/:id" element={<ClientProfileView />} />
          <Route path="/prestador/avaliar" element={<ProviderFeedback />} />
        </Route>
        <Route element={<RotaProtegida papel="admin" />}>
          <Route path="/admin/painel" element={<AdminDashboard />} />
          <Route path="/admin/clientes" element={<AdminClients />} />
          <Route path="/admin/prestadores" element={<AdminProviders />} />
          <Route path="/admin/clientes/:id" element={<AdminClientDetail />} />
          <Route path="/admin/prestadores/:id" element={<AdminProviderDetail />} />
          <Route path="/admin/avaliacoes" element={<AdminReviews />} />
        </Route>
        <Route path="/recuperar-senha/:role" element={<ForgotPasswordEmail />} />
        <Route path="/recuperar-senha/:role/codigo" element={<ForgotPasswordCode />} />
        <Route path="/recuperar-senha/:role/nova-senha" element={<ForgotPasswordReset />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
