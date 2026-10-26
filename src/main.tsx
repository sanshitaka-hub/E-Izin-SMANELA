import { createRoot } from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

function mountApplication() {
  const container = document.getElementById('root');
  if (!container) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', mountApplication, { once: true });
    }
    return;
  }

  try {
    const root = createRoot(container);
    root.render(
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    );
  } catch (err: unknown) {
    console.error('Fatal initialization error:', err);
    const errorMsg = err instanceof Error ? err.message : String(err);
    container.innerHTML = `
      <div style="min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #020617; color: white; font-family: system-ui, sans-serif; text-align: center; padding: 20px;">
        <h2 style="color: #ef4444; font-size: 20px; font-weight: bold;">Gagal Memulai Sistem E-Izin</h2>
        <p style="color: #94a3b8; font-size: 13px; margin-top: 8px; max-width: 400px;">Terjadi kendala saat memuat aplikasi di browser: <br/><code style="color: #f87171; font-size: 11px;">${errorMsg}</code></p>
        <div style="margin-top: 16px; display: flex; gap: 8px;">
          <button id="fatal-reload-btn" style="padding: 10px 20px; background: #2563eb; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">
            Muat Ulang
          </button>
          <button id="fatal-reset-btn" style="padding: 10px 20px; background: #dc2626; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">
            Bersihkan Cache & Reset
          </button>
        </div>
      </div>
    `;

    const rBtn = document.getElementById('fatal-reload-btn');
    if (rBtn) {
      rBtn.onclick = () => window.location.reload();
    }
    const cBtn = document.getElementById('fatal-reset-btn');
    if (cBtn) {
      cBtn.onclick = () => {
        try { localStorage.clear(); } catch(e) {}
        try { sessionStorage.clear(); } catch(e) {}
        window.location.reload();
      };
    }
  }
}

// Immediate mount attempt if container is already available
if (document.getElementById('root')) {
  mountApplication();
} else if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApplication, { once: true });
} else {
  mountApplication();
}
