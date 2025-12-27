// Coollabora Clinical - Main App
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LeadMagnet from './pages/LeadMagnet'
import AdminPage from './pages/AdminPage'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-100">
        <Routes>
          <Route path="/" element={<LeadMagnet />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/*" element={<AdminPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
