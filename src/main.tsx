import { createRoot } from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

const container = document.getElementById('root');

if (container) {
  try {
    const root = createRoot(container);
    root.render(
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    );
  } catch (err) {
    console.error('Fatal initialization error:', err);
    container.innerHTML = `
      <div style="min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #020617; color: white; font-family: sans-serif; text-align: center; padding: 20px;">
        <h2 style="color: #ef4444; font-size: 20px; font-weight: bold;">Gagal Memulai Sistem E-Izin</h2>
        <p style="color: #94a3b8; font-size: 13px; margin-top: 8px;">Terjadi kendala saat memuat data di browser Anda.</p>
        <button onclick="localStorage.clear(); window.location.reload();" style="margin-top: 16px; padding: 10px 20px; background: #2563eb; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">
          Bersihkan Cache & Buka Ulang
        </button>
      </div>
    `;
  }
}
