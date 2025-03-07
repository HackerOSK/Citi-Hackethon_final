import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import GSTVerificationPage from './pages/GSTVerificationPage.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import CreditAiChatBot from './pages/CreditAiChatBot.jsx'
import BenfordAnalysis from './pages/BenfordAnalysis.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/gst-verification" element={<GSTVerificationPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/credit-ai-chatbot" element={<CreditAiChatBot />} />
        <Route path="/benford-analysis" element={<BenfordAnalysis />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
