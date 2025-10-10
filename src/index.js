import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import { UserProvider } from './context/UserContext'; // ✅ nombre correcto
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserProvider> {/* ✅ envuelve App correctamente */}
      <App />
    </UserProvider>
  </React.StrictMode>
);

reportWebVitals();