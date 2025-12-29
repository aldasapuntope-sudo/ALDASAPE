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
import AnunciosActivos from './pages/dashboard/mis-anuncios/AnunciosActivos';
import AnunciosRevision from './pages/dashboard/mis-anuncios/AnunciosRevision';
import config from './config';
import axios from 'axios';
import Swal from 'sweetalert2';
import useVerificarPlan from './hooks/useVerificarPlan';
import { RutaProtegidaPlan } from './pages/dashboard/logica/configuracioninterna';
import Planes from './pages/dashboard/planes';
import PropertyDetail from './components/propiedad_detalle/PropertyDetail';
import PlanesList from './pages/dashboard/administracion/planes';
import TiposDocumentoList from './pages/dashboard/administracion/TiposDocumentoList';
import AmenityList from './pages/dashboard/administracion/AmenityList';
import CaracteristicaList from './pages/dashboard/administracion/CaracteristicaList';
import OperacionesList from './pages/dashboard/administracion/OperacionesList';
import TiposPropiedadList from './pages/dashboard/administracion/TiposPropiedadList';
import BuscarPage from './components/buscar_detalle/BuscarPage';
import PaginasList from './pages/dashboard/administracion/PaginasList';
import Nosotros from './pages/enlaces/Nosotros';
import ConfiguracionesList from './pages/dashboard/administracion/ConfiguracionesList';
import MensajesPage from './pages/dashboard/administracion/MensajesPage';
import BitacoraList from './pages/dashboard/administracion/BitacoraList';
import UsuariosPlanesList from './pages/dashboard/administracion/UsuariosPlanesList';
import ResetPassword from './pages/iniciosession/ResetPassword';
import UbicacionesList from './pages/dashboard/administracion/UbicacionesList';
import MisFavoritos from './pages/dashboard/mis-anuncios/mis-favoritos';
import Publicatuanuncio from './pages/enlaces/Publicatuanuncio';
import AnunciosVendidos from './pages/dashboard/mis-anuncios/AnunciosVendidos';
import SliderList from './pages/dashboard/administracion/SliderList';
import PopupList from './pages/dashboard/administracion/PopupList';
import UsuariosList from './pages/dashboard/administracion/UsuariosList';
import GTMScripts from './pages/dashboard/componentes/GTMScripts';
import ConfigScriptsList from './pages/dashboard/administracion/ConfigScriptsList';
import AppConfigLoader from './pages/dashboard/componentes/AppConfigLoader';
import ConfigPopupList from './pages/dashboard/administracion/ConfigPopupList';
import Club from './pages/enlaces/club';
import Inversiones from './pages/enlaces/Inversiones';
import ProyectosUsuario from './pages/dashboard/administracion/inversiones/ProyectosUsuario';
import ProyectoDetalle from './components/proyecto_detalle/ProyectoDetalle';
import PropertyClub from './components/propiedad_club/PropertyClub';
import PlanesListclub from './pages/dashboard/administracion/PlanesListclub';
import UsuariosPlanesListclub from './pages/dashboard/administracion/UsuariosPlanesListclub';
import CaracteristicaListclub from './pages/dashboard/administracion/CaracteristicaListclub';
import ServicioListclub from './pages/dashboard/administracion/AmenityListclub';
import SeleccionPerfil from './components/SeleccionPerfil';
import ParticularPage from './components/ParticularPage/ParticularPage';
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
      <AppConfigLoader />
      <Preloader />

      <Routes>
        {!usuario && (
        <Route path="/login" element={<Login />} />
        )}
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
         

          <Route path="/" element={<Home />} />
          <Route path="/anuncio/:slug" element={<PropertyDetail />} />
          

          <Route path="/terminos-condiciones" element={<TerminosCondiciones />} />
          <Route path="/publica-tu-aviso" element={<Publicatuanuncio />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/inversiones" element={<Inversiones />} />
          
          <Route path="/club" element={<Club />} />
          <Route path="/politicas-de-privacidad" element={<PoliticasPrivacidad />} />
          <Route path="/buscar" element={<BuscarPage />} />
          <Route path="/publica-tu-anuncio" element={<SeleccionPerfil />} />
          <Route path="/particular" element={<ParticularPage />} />
          

          {!usuario && (
            <>
              
              <Route path="/registro" element={<Register />} />
              <Route path="/recover-password" element={<RecoverPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              
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
            <Route path="/planes" element={<Planes />} />
            
            <Route
              path="/adm-planes"
              element={<RutaProtegida element={PlanesList} />}
            />

            <Route
              path="/adm-planes-club"
              element={<RutaProtegida element={PlanesListclub} />}
            />

            

            <Route
              path="/adm-usuarios"
              element={<RutaProtegida element={UsuariosList} />}
            />
            
            <Route path="/proyecto/:slug" element={<ProyectoDetalle />} />
            
            <Route
              path="/adm-usuarioplanes"
              element={<RutaProtegida element={UsuariosPlanesList} />}
            />
            
            <Route
              path="/adm-usuarioplanes-club"
              element={<RutaProtegida element={UsuariosPlanesListclub} />}
            />

            <Route
              path="/adm-tdocumento"
              element={<RutaProtegida element={TiposDocumentoList} />}
            />

            <Route
              path="/adm-operaciones"
              element={<RutaProtegida element={OperacionesList} />}
            />

            <Route
              path="/adm-tpropiedades"
              element={<RutaProtegida element={TiposPropiedadList} />}
            />
            
            <Route
              path="/adm-amenities"
              element={<RutaProtegida element={AmenityList} />}
            />
            <Route
              path="/adm-amenities-club"
              element={<RutaProtegida element={ServicioListclub} />}
            />
            
            <Route
              path="/adm-caracteristicas"
              element={<RutaProtegida element={CaracteristicaList} />}
            />
            <Route
              path="/adm-caracteristicas-club"
              element={<RutaProtegida element={CaracteristicaListclub} />}
            />
            

            <Route
              path="/adm-paginas"
              element={<RutaProtegida element={PaginasList} />}
            />

            <Route
              path="/adm-slider"
              element={<RutaProtegida element={SliderList} />}
            />

            <Route
              path="/adm-anunciospopups"
              element={<RutaProtegida element={PopupList} />}
            />

            <Route
              path="/adm-popupsconfig"
              element={<RutaProtegida element={ConfigPopupList} />}
            />

            <Route
              path="/adm-configuraciones"
              element={<RutaProtegida element={ConfiguracionesList} />}
            />

             <Route
              path="/adm-scripts"
              element={<RutaProtegida element={ConfigScriptsList} />}
            />

            <Route
              path="/adm-ubicaciones"
              element={<RutaProtegida element={UbicacionesList} />}
            />

            <Route
              path="/adm-bitacora"
              element={<RutaProtegida element={BitacoraList} />}
            />

            

            

            
            <Route
              path="/nuevo-anuncio"
              element={
                <RutaProtegidaPlan>
                  <NuevoAnuncio />
                </RutaProtegidaPlan>
              }
            />

            <Route
              path="/anuncios-activos"
              element={<RutaProtegida element={AnunciosActivos} />}
            />
            <Route
              path="/anuncios-revision"
              element={<RutaProtegida element={AnunciosRevision} />}
            />

            <Route
              path="/anuncios-vendidos"
              element={<RutaProtegida element={AnunciosVendidos} />}
            />
            

            <Route 
              path="/mis-favoritos" 
              element={<RutaProtegida element={MisFavoritos} />}
            />
            
            <Route
              path="/mensajes"
              element={<RutaProtegida element={MensajesPage} />}
            />


            <Route 
              path="/aldasaclub" 
              element={<RutaProtegida element={Club} />}
            />

            
            <Route
              path="/aldasainversioens"
              element={<RutaProtegida element={ProyectosUsuario} />}
            />
            
            <Route path="/propiedadremates/:slug" element={<PropertyClub />} />

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

            <GTMScripts />
            <AppRoutes />
          </Router>
        </UserProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}
