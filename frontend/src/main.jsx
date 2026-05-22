import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/style.scss'
import { AuthProvider } from './components/context/Auth.jsx';

// Intercept fetch to bypass ngrok browser warning globally
const originalFetch = window.fetch;
window.fetch = async function (input, init = {}) {
  if (!init.headers) {
    init.headers = {};
  }
  if (init.headers instanceof Headers) {
    init.headers.append('ngrok-skip-browser-warning', 'true');
  } else if (Array.isArray(init.headers)) {
    init.headers.push(['ngrok-skip-browser-warning', 'true']);
  } else {
    init.headers['ngrok-skip-browser-warning'] = 'true';
  }
  return originalFetch(input, init);
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
    <App />
    </AuthProvider>
  </StrictMode>,
)
