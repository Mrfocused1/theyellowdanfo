import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import MarketPage from './MarketPage.jsx'

// Simple Router Component
const Router = () => {
  const [currentPage, setCurrentPage] = useState('home');

  if (currentPage === 'market') {
    return <MarketPage onNavigate={setCurrentPage} />;
  }

  return <App onNavigate={setCurrentPage} />;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router />
  </StrictMode>,
)
