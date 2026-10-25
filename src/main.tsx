import { Component, StrictMode, type ErrorInfo, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { installVendorAuthBridge } from './lib/vendorAuthBridge';

type BoundaryState = { error: string | null };

class AppErrorBoundary extends Component<{ children: ReactNode }, BoundaryState> {
  state: BoundaryState = { error: null };

  static getDerivedStateFromError(error: unknown): BoundaryState {
    return {
      error: error instanceof Error ? error.message : String(error),
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[PiNova render diagnostic] React failed to render:', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <main style={{ minHeight: '100vh', padding: '24px', background: '#0b1220', color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 700 }}>PiNova Global Hub could not load</h1>
          <p style={{ marginTop: '12px', lineHeight: 1.6 }}>An app rendering error was detected. This diagnostic screen is enabled on the Preview branch only.</p>
          <pre style={{ marginTop: '16px', padding: '12px', whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', background: '#172033', borderRadius: '8px', color: '#fecaca' }}>{this.state.error}</pre>
          <button onClick={() => window.location.reload()} style={{ marginTop: '16px', padding: '10px 14px', borderRadius: '8px', background: '#e2e8f0', color: '#0f172a', fontWeight: 600 }}>Reload app</button>
        </main>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  document.body.textContent = 'PiNova diagnostic: the root element is missing.';
} else {
  // Keep a visible diagnostic instead of a completely blank screen if a startup error
  // occurs outside React's render boundary. This file is on the Preview branch only.
  window.addEventListener('error', (event) => {
    console.error('[PiNova startup diagnostic]', event.message, event.filename, event.lineno);
    if (rootElement.childElementCount === 0) {
      rootElement.textContent = 'PiNova startup error: ' + (event.message || 'A script failed to load. Please capture this screen for diagnosis.');
      rootElement.style.cssText = 'padding:24px;background:#0b1220;color:#f8fafc;min-height:100vh;font:16px system-ui,sans-serif;overflow-wrap:anywhere';
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error('[PiNova startup diagnostic] Unhandled promise rejection:', event.reason);
    if (rootElement.childElementCount === 0) {
      const reason = event.reason instanceof Error ? event.reason.message : String(event.reason ?? 'Unknown promise rejection');
      rootElement.textContent = 'PiNova startup promise error: ' + reason;
      rootElement.style.cssText = 'padding:24px;background:#0b1220;color:#f8fafc;min-height:100vh;font:16px system-ui,sans-serif;overflow-wrap:anywhere';
    }
  });

  installVendorAuthBridge();

  createRoot(rootElement).render(
    <StrictMode>
      <AppErrorBoundary>
        <App />
      </AppErrorBoundary>
    </StrictMode>,
  );
}
