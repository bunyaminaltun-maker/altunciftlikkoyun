import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register PWA Service Worker for full offline capabilities in barn and field
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('PWA güncellendi');
  },
  onOfflineReady() {
    console.log('Altun Çiftlik uygulaması internetsiz çevrimdışı çalışmaya hazır!');
  },
});

createRoot(document.getElementById('root')!).render(<App />);
