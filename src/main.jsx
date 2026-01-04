import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import MarketPage from './MarketPage.jsx'
import AboutPage from './AboutPage.jsx'

// Simple Router Component
const Router = () => {
  const [currentPage, setCurrentPage] = useState('home');

  if (currentPage === 'market') {
    return <MarketPage onNavigate={setCurrentPage} />;
  }

  if (currentPage === 'about') {
    return <AboutPage onNavigate={setCurrentPage} />;
  }

  if (currentPage === 'mission') {
    return <AboutPage onNavigate={setCurrentPage} autoOpenMission={true} />;
  }

  return <App onNavigate={setCurrentPage} />;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router />
  </StrictMode>,
)
