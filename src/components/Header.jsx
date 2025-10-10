// src/componentes/HeaderAldasa.js
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaUser, FaPlus, FaSun, FaMoon } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../css/Header.css';
import UserMenu from '../pages/iniciosession/componentes/UserMenu';

import UserInfoBoxAldasa from './UserInfoBoxAldasa';
import { useTheme } from '../context/ThemeContext';

export default function HeaderAldasa({ abrirModal }) {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('');
  const { darkMode, toggleDarkMode } = useTheme();

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      const parsed = JSON.parse(usuarioGuardado);
      const data = parsed.usuarioaldasa || parsed.googleUser || parsed;
      setUser(data);
      setUserName(data.nombre || data.name || '');
    }
  }, []);

  return (
    <nav className={`navbar navbar-expand-lg ${darkMode ? 'bg-dark navbar-dark shadow-sm sticky-top' : 'bg-white shadow-sm sticky-top'}`}>
      <div className="container">
        {/* LOGO */}
        <NavLink className="navbar-brand d-flex align-items-center" to="/">
          <img src="/assets/images/logo-aldasape-color.png" alt="ALDASA" style={{ height: 40 }} />
        </NavLink>

        {/* TOGGLER MÓVIL */}
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menuPrincipal">
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* MENÚ PRINCIPAL */}
        <div className="collapse navbar-collapse" id="menuPrincipal">
          <ul className="navbar-nav mx-auto">

            {/* MENÚS SI NO ESTÁ LOGUEADO */}
            {!user ? (
              <>
                <li className="nav-item dropdown">
                  <NavLink className="nav-link dropdown-toggle" to="#">Comprar</NavLink>
                  <ul className="dropdown-menu fade-up">
                    <li><a className="dropdown-item" href="https://aldasa.pe/venta-de-departamentos">Departamento</a></li>
                    <li><a className="dropdown-item" href="https://aldasa.pe/venta-de-casas">Casa</a></li>
                    <li><a className="dropdown-item" href="https://aldasa.pe/venta-de-lotes">Terreno / Lote</a></li>
                    <li><a className="dropdown-item" href="https://aldasa.pe/venta-de-oficinas">Oficina</a></li>
                    <li><a className="dropdown-item" href="https://aldasa.pe/venta-de-locales-comerciales">Local Comercial</a></li>
                  </ul>
                </li>

                <li className="nav-item dropdown">
                  <NavLink className="nav-link dropdown-toggle" to="#">Alquilar</NavLink>
                  <ul className="dropdown-menu fade-up">
                    <li><a className="dropdown-item" href="https://aldasa.pe/alquiler-de-departamentos">Departamento</a></li>
                    <li><a className="dropdown-item" href="https://aldasa.pe/alquiler-de-casas">Casa</a></li>
                    <li><a className="dropdown-item" href="https://aldasa.pe/alquiler-de-oficinas">Oficina</a></li>
                    <li><a className="dropdown-item" href="https://aldasa.pe/alquiler-de-locales-comerciales">Local Comercial</a></li>
                  </ul>
                </li>

                <li className="nav-item dropdown position-static">
                  <NavLink className="nav-link dropdown-toggle" to="#">Servicios</NavLink>
                  <div className="dropdown-menu mega-menu fade-up p-3 shadow">
                    <div className="container">
                      <div className="row">
                        <div className="col-6 col-md-3">
                          <h6 className="dropdown-header">Otros Servicios</h6>
                          <a className="dropdown-item" href="https://aldasa.pe/publica-tu-aviso">Publica un inmueble</a>
                          <a className="dropdown-item" href="https://aldasa.pe/revista-aldasa">Revista Aldasa</a>
                        </div>
                        <div className="col-6 col-md-3">
                          <h6 className="dropdown-header">Guías</h6>
                          <a className="dropdown-item" href="https://aldasa.pe/guia-para-comprar-inmueble">Guía para comprar</a>
                          <a className="dropdown-item" href="https://aldasa.pe/guia-para-vender-inmueble">Guía para vender</a>
                          <a className="dropdown-item" href="https://aldasa.pe/guia-para-alquiler-inmueble">Guía para alquilar</a>
                        </div>
                        <div className="col-6 col-md-3">
                          <h6 className="dropdown-header">Informes</h6>
                          <a className="dropdown-item" href="https://aldasa.pe/conoce-valor-de-las-propiedades">Valor de propiedades</a>
                          <a className="dropdown-item" href="https://aldasa.pe/reporte-indice-m2">Índice m2</a>
                          <a className="dropdown-item" href="https://aldasa.pe/rentabilidad">Rentabilidad</a>
                        </div>
                        <div className="col-6 col-md-3">
                          <h6 className="dropdown-header">Novedades</h6>
                          <a className="dropdown-item" href="https://aldasa.pe/mercado-inmobiliario">Mercado inmobiliario</a>
                          <a className="dropdown-item" href="https://aldasa.pe/tendencias-inmobiliarias">Tendencias</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>

                <li className="nav-item">
                  <a className="nav-link" href="https://aldasa.pe/proyectos">Proyectos</a>
                </li>
              </>
            ) : (
              // MENÚS SI ESTÁ LOGUEADO
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/subir-anuncio">Subir anuncio</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/mis-anuncios">Mis anuncios</NavLink>
                </li>
                {/* Puedes agregar más menús de usuario aquí */}
              </>
            )}
          </ul>

          {/* DERECHA: Modo Noche/Día + UserInfo */}
          <div className="d-flex align-items-center gap-2">
            

            {!user ? (
              <>
              <button className="btn btn-outline-success">Inversiones TOP</button>
                <NavLink to="/publicar" className="btn-publicar">
                  <span className="icon-wrapper"><FaPlus /></span>
                  Publicar Anuncio
                </NavLink>
                <NavLink to="/login" className="login-icon-wrapper ms-2">
                  <FaUser className="login-icon" size={18} />
                </NavLink>
                
              </>
            ) : (
              <>
                <button className={`btn btn-${darkMode ? 'warning' : 'secondary'}`} onClick={toggleDarkMode}>
                  {darkMode ? <FaSun /> : <FaMoon />}
                </button>
                <UserInfoBoxAldasa abrirModal={abrirModal} />
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
