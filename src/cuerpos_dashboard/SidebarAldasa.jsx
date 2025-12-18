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
import { useUsuario } from '../context/UserContext';

const SidebarALDASA = ({ abrirModal, toggleSidebar }) => {
  const { usuario } = useUsuario();
  const [openMenu, setOpenMenu] = useState(null);
  const [modo, setModo] = useState('gestion'); // gestion o evaluacion
  const location = useLocation();
 
  const { darkMode } = useTheme();
  const logo = darkMode
    ? '../assets/images/logo-aldasape-color.png'
    : '../assets/images/logo-aldasape-color.png';

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
        
          <>
            {/* Administración */}
            <div className="menu-group">
              <button className="menu-btn" onClick={() => toggleMenu('administracion')}>
                <FaCogs className="me-2" /> Administración
                {openMenu === 'administracion'
                  ? <FaChevronDown className="ms-auto" />
                  : <FaChevronRight className="ms-auto" />}
              </button>

              <ul className={`submenu ${openMenu === 'administracion' ? 'open' : ''}`}>
                {/* Siempre visible para todos */}
                <li
                  className={`submenu-link ${location.pathname.startsWith('/mi-perfil') ? 'active' : ''}`}
                >
                  <Link to="/mi-perfil" onClick={toggleSidebar}>Mi Perfil</Link>
                </li>

                {/* Solo visible si el usuario es Administrador (perfil_id = 1) */}
                {usuario?.usuarioaldasa?.perfil_id === 1 && (
                  <>
                    <li
                      className={`submenu-link ${location.pathname.startsWith('/adm-usuarios') ? 'active' : ''}`}
                    >
                      <Link to="/adm-usuarios" onClick={toggleSidebar}>Usuarios</Link>
                    </li>

                    <li
                      className={`submenu-link ${location.pathname.startsWith('/adm-planes') ? 'active' : ''}`}
                    >
                      <Link to="/adm-planes" onClick={toggleSidebar}>Planes</Link>
                    </li>

                    <li
                      className={`submenu-link ${location.pathname.startsWith('/adm-usuarioplanes') ? 'active' : ''}`}
                    >
                      <Link to="/adm-usuarioplanes" onClick={toggleSidebar}>Planes Usuarios</Link>
                    </li>

                    <li
                      className={`submenu-link ${location.pathname.startsWith('/adm-tdocumento') ? 'active' : ''}`}
                    >
                      <Link to="/adm-tdocumento" onClick={toggleSidebar}>Tipo documentos</Link>
                    </li>

                    <li
                      className={`submenu-link ${location.pathname.startsWith('/adm-tpropiedades') ? 'active' : ''}`}
                    >
                      <Link to="/adm-tpropiedades" onClick={toggleSidebar}>Tipo de Propiedades</Link>
                    </li>
                   

                    <li
                      className={`submenu-link ${location.pathname.startsWith('/adm-amenities') ? 'active' : ''}`}
                    >
                      <Link to="/adm-amenities" onClick={toggleSidebar}>Servicios</Link>
                    </li>

                    <li
                      className={`submenu-link ${location.pathname.startsWith('/adm-caracteristicas') ? 'active' : ''}`}
                    >
                      <Link to="/adm-caracteristicas" onClick={toggleSidebar}>Características</Link>
                    </li>

                    <li
                      className={`submenu-link ${location.pathname.startsWith('/adm-operaciones') ? 'active' : ''}`}
                    >
                      <Link to="/adm-operaciones" onClick={toggleSidebar}>Operaciones</Link>
                    </li>

                    <li
                      className={`submenu-link ${location.pathname.startsWith('/adm-paginas') ? 'active' : ''}`}
                    >
                      <Link to="/adm-paginas" onClick={toggleSidebar}>Gestionar Páginas</Link>
                    </li>

                    <li
                      className={`submenu-link ${location.pathname.startsWith('/adm-slider') ? 'active' : ''}`}
                    >
                      <Link to="/adm-slider" onClick={toggleSidebar}>Gestionar Slider</Link>
                    </li>

                    <li
                      className={`submenu-link ${location.pathname.startsWith('/adm-anunciospopups') ? 'active' : ''}`}
                    >
                      <Link to="/adm-anunciospopups" onClick={toggleSidebar}>Gestionar Anuncios Popups</Link>
                    </li>

                    <li
                      className={`submenu-link ${location.pathname.startsWith('/adm-popupsconfig') ? 'active' : ''}`}
                    >
                      <Link to="/adm-popupsconfig" onClick={toggleSidebar}>Gestionar Configuración Popups</Link>
                    </li>

                    

                    

                    <li
                      className={`submenu-link ${location.pathname.startsWith('/adm-ubicaciones') ? 'active' : ''}`}
                    >
                      <Link to="/adm-ubicaciones" onClick={toggleSidebar}>Gestionar Ubicaciones</Link>
                    </li>


                    <li
                      className={`submenu-link ${location.pathname.startsWith('/adm-configuraciones') ? 'active' : ''}`}
                    >
                      <Link to="/adm-configuraciones" onClick={toggleSidebar}>Gestionar configuración</Link>
                    </li>

                    <li
                      className={`submenu-link ${location.pathname.startsWith('/adm-scripts') ? 'active' : ''}`}
                    >
                      <Link to="/adm-scripts" onClick={toggleSidebar}>Gestionar Scripts Campañas</Link>
                    </li>

                    <li
                      className={`submenu-link ${location.pathname.startsWith('/adm-bitacora') ? 'active' : ''}`}
                    >
                      <Link to="/adm-bitacora" onClick={toggleSidebar}>Bitácora</Link>
                    </li>

                    
                  </>
                )}
              </ul>
            </div>


            {/* Mis anuncios */}
            
            
            {/* Matrícula */}
            <div className="menu-group">
              <button className="menu-btn" onClick={() => toggleMenu('mis-anuncios')}>
                <FaBookOpen className="me-2" /> Mis Anuncios
                {openMenu === 'mis-anuncios'
                  ? <FaChevronDown className="ms-auto" />
                  : <FaChevronRight className="ms-auto" />}
              </button>
              
                <ul className={`submenu ${openMenu === 'mis-anuncios' ? 'open' : ''}`}>
                  
                  <li
                    className={`submenu-link ${location.pathname.startsWith('/mis-favoritos') ? 'active' : ''}`}
                  >
                    <Link to="/mis-favoritos" onClick={toggleSidebar}>Mis Anuncios Favoritos</Link>
                  </li>
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
                  <li
                    className={`submenu-link ${location.pathname.startsWith('/anuncios-vendidos') ? 'active' : ''}`}
                  >
                    <Link to="/anuncios-vendidos" onClick={toggleSidebar}>Anuncios Vendidos</Link>
                  </li>
                </ul>
              
            </div>


            

            {/* Aldasa Club */}
            {usuario?.usuarioaldasa?.perfil_id === 1 ? (
              <div className="menu-group">
                <button
                  className="menu-btn"
                  onClick={() => toggleMenu('aldasaclub')}
                >
                  <FaHome className="me-2" /> Aldasa Club
                  {openMenu === 'aldasaclub'
                    ? <FaChevronDown className="ms-auto" />
                    : <FaChevronRight className="ms-auto" />}
                </button>

                <ul className={`submenu ${openMenu === 'aldasaclub' ? 'open' : ''}`}>
                  <li
                    className={`submenu-link ${location.pathname === '/aldasaclub' ? 'active' : ''}`}
                  >
                    <Link to="/aldasaclub" onClick={toggleSidebar}>
                      Inicio Aldasa Club
                    </Link>
                  </li>

                  <li
                    className={`submenu-link ${location.pathname === '/adm-planes-club' ? 'active' : ''}`}
                  >
                    <Link to="/adm-planes-club" onClick={toggleSidebar}>
                      Planes
                    </Link>
                  </li>

                  <li
                    className={`submenu-link ${location.pathname === '/adm-usuarioplanes-club' ? 'active' : ''}`}
                  >
                    <Link to="/adm-usuarioplanes-club" onClick={toggleSidebar}>
                      Planes Usuarios
                    </Link>
                  </li>

                  <li
                    className={`submenu-link ${location.pathname === '/adm-caracteristicas-club' ? 'active' : ''}`}
                  >
                    <Link to="/adm-caracteristicas-club" onClick={toggleSidebar}>
                      Características
                    </Link>
                  </li>

                  <li
                    className={`submenu-link ${location.pathname === '/adm-amenities-club' ? 'active' : ''}`}
                  >
                    <Link to="/adm-amenities-club" onClick={toggleSidebar}>
                      Servicios
                    </Link>
                  </li>

                  
                </ul>
              </div>
            ) : (
              <Link
                to="/aldasaclub"
                className={`menu-btn ${location.pathname === '/aldasaclub' ? 'active' : ''}`}
                onClick={() => cambiarModo('gestion')}
              >
                <FaHome className="me-2" /> Aldasa Club
              </Link>
            )}


            {/* Aldasa Inversiones */}
            <Link
              to="/aldasainversioens"
              className={`menu-btn ${location.pathname === '/aldasainversioens' ? 'active' : ''}`}
              onClick={() => cambiarModo('gestion')}
            >
              <FaHome className="me-2" /> Aldasa Inversiones
            </Link>

          </>
       


        {/* COLABORADOR */}
        {usuario?.usuarioaldasa?.perfil_id === 2 && (
          <div className="menu-group">
            <button className="menu-btn" onClick={() => toggleMenu('colaborador')}>
              <FaClipboardList className="me-2" /> Revisión
              {openMenu === 'colaborador'
                ? <FaChevronDown className="ms-auto" />
                : <FaChevronRight className="ms-auto" />}
            </button>

            <ul className={`submenu ${openMenu === 'colaborador' ? 'open' : ''}`}>
              <li
                className={`submenu-link ${location.pathname.startsWith('/col-revision-anuncios') ? 'active' : ''}`}
              >
                <Link to="/col-revision-anuncios" onClick={toggleSidebar}>
                  Revisar Anuncios
                </Link>
              </li>
            </ul>
          </div>
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
