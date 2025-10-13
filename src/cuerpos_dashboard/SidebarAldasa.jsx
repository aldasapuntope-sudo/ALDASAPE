import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../css/SidebarALDASA.css';
import {
  FaChevronDown,
  FaChevronRight,
  FaSignOutAlt,
  FaHome,
  FaBookOpen,
  FaClipboardList,
  FaChartBar,
  FaCogs,
  FaChalkboardTeacher
} from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const SidebarALDASA = ({ abrirModal, toggleSidebar }) => {
  const [openMenu, setOpenMenu] = useState(null);
  const [modo, setModo] = useState('gestion'); // gestion o evaluacion
  const location = useLocation();

  const { darkMode } = useTheme();
  const logo = darkMode
    ? 'assets/images/logo-aldasape-color.png'
    : 'assets/images/logo-aldasape-color.png';

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  // Cargar modo desde localStorage
  useEffect(() => {
    const modoGuardado = localStorage.getItem('modo');
    if (modoGuardado) {
      setModo(modoGuardado);
    }
  }, []);

  // Cambiar modo y guardarlo
  const cambiarModo = (nuevoModo) => {
    localStorage.setItem('modo', nuevoModo);
    setModo(nuevoModo);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <img
          alt="Logo UNJ"
          className="logounj mb-3"
          src={logo}
        />

        {/* PRINCIPAL */}
        <Link
          to="/"
          className={`menu-btn ${location.pathname === '/Inicio' ? 'active' : ''}`}
          onClick={() => cambiarModo('gestion')}
        >
          <FaHome className="me-2" /> Principal
        </Link>

        {/* Si el modo es "gestion", mostramos todos los menús de gestión académica */}
        {modo === 'gestion' && (
          <>
            {/* Administración */}
            <div className="menu-group">
              <button className="menu-btn" onClick={() => toggleMenu('administracion')}>
                <FaCogs className="me-2" /> Administración
                {openMenu === 'administracion'
                  ? <FaChevronDown className="ms-auto" />
                  : <FaChevronRight className="ms-auto" />}
              </button>
              {openMenu === 'administracion' && (
                <ul className="submenu">
                  <li
                    className={`submenu-link ${location.pathname.startsWith('/mi-perfil') ? 'active' : ''}`}
                  >
                    <Link to="/mi-perfil" onClick={toggleSidebar}>Mi Perfil</Link>
                  </li>
                </ul>
              )}
            </div>

            {/* Mis anuncios */}
            

            {/* Matrícula */}
            <div className="menu-group">
              <button className="menu-btn" onClick={() => toggleMenu('mis-anuncios')}>
                <FaBookOpen className="me-2" /> Mis Anuncios
                {openMenu === 'matricula'
                  ? <FaChevronDown className="ms-auto" />
                  : <FaChevronRight className="ms-auto" />}
              </button>
              {openMenu === 'mis-anuncios' && (
                <ul className="submenu">
                  <li
                    className={`submenu-link ${location.pathname.startsWith('/nuevo-anuncio') ? 'active' : ''}`}
                  >
                    <Link to="/nuevo-anuncio" onClick={toggleSidebar}>Nuevo anuncio</Link>
                  </li>
                  <li
                    className={`submenu-link ${location.pathname.startsWith('/anuncios-activos') ? 'active' : ''}`}
                  >
                    <Link to="/anuncios-activos" onClick={toggleSidebar}>Anuncios activos</Link>
                  </li>
                  <li
                    className={`submenu-link ${location.pathname.startsWith('/anuncios-revision') ? 'active' : ''}`}
                  >
                    <Link to="/anuncios-revision" onClick={toggleSidebar}>Anuncios en revisión</Link>
                  </li>
                </ul>
              )}
            </div>

            {/* Reportes */}
            <div className="menu-group">
              <button className="menu-btn" onClick={() => toggleMenu('reportes')}>
                <FaChartBar className="me-2" /> Reportes
                {openMenu === 'reportes'
                  ? <FaChevronDown className="ms-auto" />
                  : <FaChevronRight className="ms-auto" />}
              </button>
              {openMenu === 'reportes' && (
                <ul className="submenu">
                  <li
                    className={`submenu-link ${location.pathname.startsWith('/reportestud') ? 'active' : ''}`}
                  >
                    <Link to="/reportestud" onClick={toggleSidebar}>Reportes estudiantes</Link>
                  </li>
                </ul>
              )}
            </div>

          </>
        )}

        {/* Si el modo es "evaluacion", mostramos solo ese menú */}
        {modo === 'evaluacion' && (
          <Link
            to="/estudiante/evaluacion"
            className={`menu-btn ${location.pathname === '/estudiante/evaluacion' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              window.location.href = '/estudiante/evaluacion';
            }}
          >
            <FaClipboardList className="me-2" /> Evaluación Docente
          </Link>
        )}

        <hr className="my-3" />

        {/* Botón cerrar sesión que abre modal */}
        <button className="salir-btn mt-auto w-100" onClick={abrirModal}>
          Salir <FaSignOutAlt className="me-2" />
        </button>
      </div>
    </div>
  );
};

export default SidebarALDASA;
