import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import MarketPage from './MarketPage.jsx'

// Simple Router Component
const Router = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [initialOverlay, setInitialOverlay] = useState(null);

  const handleNavigate = (destination) => {
    // Check if destination includes an overlay (e.g., 'home:contact')
    if (destination.includes(':')) {
      const [page, overlay] = destination.split(':');
      setInitialOverlay(overlay);
      setCurrentPage(page);
    } else {
      setInitialOverlay(null);
      setCurrentPage(destination);
    }
  };

  if (currentPage === 'market') {
    return <MarketPage onNavigate={handleNavigate} />;
  }

  return <App onNavigate={handleNavigate} initialOverlay={initialOverlay} onOverlayOpened={() => setInitialOverlay(null)} />;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router />
  </StrictMode>,
)
