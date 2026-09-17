import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import {installVendorAuthBridge} from './lib/vendorAuthBridge';

installVendorAuthBridge();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Seller Studio deep-link bridge:
// Pi Browser opens the registered app URL, while the canonical Seller Studio
// is an internal App section. Reuse the existing Seller Studio navigation
// action instead of duplicating or rebuilding the Seller Studio UI.
if (typeof window !== 'undefined') {
  const url = new URL(window.location.href);
  const isSellerStudioLink =
    url.pathname === '/seller-studio' ||
    ['module', 'section', 'view', 'tab'].some(
      (key) => url.searchParams.get(key)?.toLowerCase() === 'seller_studio',
    );

  if (isSellerStudioLink) {
    const openSellerStudio = () => {
      const button = document.getElementById('open-seller-studio-btn');
      if (button instanceof HTMLButtonElement) {
        button.click();
        return true;
      }
      return false;
    };

    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      if (openSellerStudio() || attempts >= 50) {
        window.clearInterval(timer);
      }
    }, 100);
  }
}
