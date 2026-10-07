import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import LoginClient from './pages/LoginClient'
import LoginProvider from './pages/LoginProvider'
import LoginAdmin from './pages/LoginAdmin'
import RegisterClient from './pages/RegisterClient'
import RegisterProvider from './pages/RegisterProvider'

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
      </Routes>
    </BrowserRouter>
  )
}
