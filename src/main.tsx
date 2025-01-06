// main.tsx
import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './index.css'
import App from './App.tsx'
import RegisterPage from './RegisterPage.tsx'
import CertifiedRegisterPage from './CertifiedRegisterPage.tsx' 
// Ha még nincs CertifiedRegisterPage.tsx fájlod, akkor hozd létre!

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Főoldal ("/" útvonal) */}
        <Route path="/" element={<App />} />

        {/* Regisztrációs oldal ("/register" útvonal) */}
        <Route path="/register" element={<RegisterPage />} />

        {/* Hitelesített szervezői regisztrációs oldal ("/certified" útvonal) */}
        <Route path="/certified" element={<CertifiedRegisterPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
