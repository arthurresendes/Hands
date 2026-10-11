import { BrowserRouter, Routes, Route } from 'react-router-dom'
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<LoginClient />} />
        <Route path="/login/prestador" element={<LoginProvider />} />
        <Route path="/login/admin" element={<LoginAdmin />} />
        <Route path="/cadastro/cliente" element={<RegisterClient />} />
        <Route path="/cadastro/prestador" element={<RegisterProvider />} />
        <Route path="/cliente/buscar" element={<ClientSearch />} />
        <Route path="/cliente/profissional" element={<ProfessionalProfile />} />
        <Route path="/cliente/perfil" element={<ClientProfile />} />
        <Route path="/cliente/avaliar" element={<PlatformFeedback />} />
      </Routes>
    </BrowserRouter>
  )
}
