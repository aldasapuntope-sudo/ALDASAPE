import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  Outlet,
} from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/iniciosession/Login';
import Register from './pages/iniciosession/Register';
import RecoverPassword from './pages/iniciosession/RecoverPassword';
import TerminosCondiciones from './pages/enlaces/TerminosCondiciones';
import PoliticasPrivacidad from './pages/enlaces/PoliticasPrivacidad';
import Preloader from './components/Preloader';
import useInactividad from './hooks/useInactividad';
import { UserProvider, useUsuario } from './context/UserContext';
//import Dashboard from './pages/dashboard';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider } from './context/ThemeContext';
import MiPerfil from './pages/dashboard/mi-perfil';
import CerrarSesionModal from './components/modales/CerrarSesionModal';
import DashboardLayout from './pages/dashboard';
import Inicio from './pages/dashboard/Inicio';
import NuevoAnuncio from './pages/dashboard/mis-anuncios/nuevo-anuncio';
import initializeAxios from './interceptor';
initializeAxios();

// 🔹 Componente de ruta protegida inteligente
function RutaProtegida({ element: Elemento, requiereCompletarPerfil = false }) {
  const { usuario, setUsuario } = useUsuario();
  const navigate = useNavigate();

  // 🧠 Este useEffect debe ir arriba, sin importar las condiciones
  useEffect(() => {
    const handleStorageChange = () => {
      const usuarioActualizado = localStorage.getItem('usuario');
      if (usuarioActualizado) {
        setUsuario(JSON.parse(usuarioActualizado));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [setUsuario]);

  // 🚫 Si no hay usuario → redirige a login
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  const datos = usuario?.usuarioaldasa;
  const incompleto = !datos?.numero_documento || datos?.numero_documento === '';

  // ⚙️ Si el perfil no está completo → manda a /mi-perfil
  if (incompleto && !requiereCompletarPerfil) {
    return <Navigate to="/mi-perfil" replace />;
  }

  // ✅ Si el perfil está completo y trata de entrar a /mi-perfil → redirige a dashboard
  /*if (!incompleto && requiereCompletarPerfil) {
    return <Navigate to="/dashboard" replace />;
  }
*/
  return <Elemento />;
}





function AppRoutes() {
  const { usuario, logout, setUsuario } = useUsuario();
  const [showAlert, setShowAlert] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const navigate = useNavigate();



  const abrirModalCerrarSesion = () => setMostrarModal(true);

  const confirmarCerrarSesion = () => {
    localStorage.removeItem("usuario");
    setUsuario(null);
    window.location.href = "/";
  };

  // 👇 Control de inactividad
  useInactividad(() => {
    if (usuario) {
      setShowAlert(true); 
      logout();
    }
  }, 1800000);

  return (
    <>
      <Preloader />

      <Routes>
        {/* 🌐 Páginas públicas con Header y Footer */}
        <Route
          element={
            <>
              <Header abrirModal={abrirModalCerrarSesion} />
              <Outlet />
              <Footer />
            </>
          }
        >
          <Route
            path="/"
            element={usuario ? <Navigate to="/dashboard" /> : <Home />}
          />
          <Route path="/terminos-condiciones" element={<TerminosCondiciones />} />
          <Route path="/politicas-de-privacidad" element={<PoliticasPrivacidad />} />

          {!usuario && (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Register />} />
              <Route path="/recover-password" element={<RecoverPassword />} />
            </>
          )}
        </Route>

        {/* 🔒 Sección del Dashboard sin Header ni Footer */}
        {usuario && (
          <Route element={<DashboardLayout />}>
            <Route
              path="/dashboard"
              element={<RutaProtegida element={Inicio} />}
            />
            
            <Route
              path="/mi-perfil"
              element={<RutaProtegida element={MiPerfil} requiereCompletarPerfil />}
            />

            <Route
              path="/nuevo-anuncio"
              element={<RutaProtegida element={NuevoAnuncio} />}
            />
            
          </Route>
        )}

        {/* ❌ Ruta no encontrada */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {/* ⚠️ Modal de cierre de sesión */}
      <CerrarSesionModal
        show={mostrarModal}
        onConfirm={confirmarCerrarSesion}
        onCancel={() => setMostrarModal(false)}
      />

      {/* ⚠️ Modal de alerta por inactividad */}
      {showAlert && (
        <div
          className="modal fade show"
          tabIndex="-1"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          aria-modal="true"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">Sesión finalizada</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAlert(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Tu sesión se ha cerrado por inactividad.</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAlert(false)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}



// 🔹 App principal
export default function App() {
  return (
    <GoogleOAuthProvider clientId="248224400413-p8995p9d7ges2up8m8fi629chuhfql8i.apps.googleusercontent.com">
      <ThemeProvider>
        <UserProvider>
          <Router basename="/">
            <AppRoutes />
          </Router>
        </UserProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}
