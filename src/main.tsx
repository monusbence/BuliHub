import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App'
import RegisterPage from './RegisterPage'
import EventsPage from './components/EventsPage.tsx' 

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
  <Routes>
    <Route path="/" element={<App />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/events" element={<EventsPage />} />
  </Routes>
</BrowserRouter>
  </StrictMode>,
)
