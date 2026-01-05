import React, { useEffect, useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import { FaUser, FaPlus, FaSun, FaMoon, FaChevronDown } from "react-icons/fa";

import "../css/Header.css";

import UserInfoBoxAldasa from "./UserInfoBoxAldasa";
import { useTheme } from "../context/ThemeContext";
import MegaDropdown from "./MegaDropdown";
import config from "../config";

export default function HeaderAldasa({ abrirModal, abrirLoginModal }) {
  const [user, setUser] = useState(null);
  const { darkMode, toggleDarkMode } = useTheme();
  const [menuData, setMenuData] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  // 🔹 Dropdown usuario
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const userBtnRef = useRef(null);

  /* ================== RESPONSIVE ================== */
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
      if (showUserMenu) calcularPosicion();
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [showUserMenu]);

  /* ================== USUARIO ================== */
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) {
      const parsed = JSON.parse(usuarioGuardado);
      const data = parsed.usuarioaldasa || parsed.googleUser || parsed;
      setUser(data);
    }
  }, []);

  /* ================== MENUS ================== */
  useEffect(() => {
    fetch(`${config.apiUrl}api/menus`)
      .then((res) => res.json())
      .then(setMenuData)
      .catch((err) => console.error("Error al cargar menús:", err));
  }, []);

  const toggleMenu = (menuKey) => {
    setActiveMenu(activeMenu === menuKey ? null : menuKey);
  };

  /* ================== POSICIÓN DROPDOWN ================== */
  const calcularPosicion = () => {
    if (!userBtnRef.current) return;

    const rect = userBtnRef.current.getBoundingClientRect();

    setMenuPos({
      top: rect.bottom + 8,
      left: rect.right - 280, // ancho del menú
    });
  };

  const abrirUserMenu = () => {
    calcularPosicion();
    setShowUserMenu(true);
  };

  const cerrarUserMenu = () => {
    setShowUserMenu(false);
  };

  return (
    <>
      <nav
        className={`navbar navbar-expand-lg ${
          darkMode
            ? "bg-dark navbar-dark shadow-sm sticky-top"
            : "bg-white shadow-sm sticky-top"
        }`}
      >
        <div className="container">
          <NavLink className="navbar-brand d-flex align-items-center" to="/">
            <img
              src="/assets/images/logo-aldasape-color.png"
              alt="ALDASA"
              style={{ height: 40 }}
            />
          </NavLink>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#menuPrincipal"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="menuPrincipal">
            <ul className="navbar-nav mx-auto">
              {!user ? (
                <>
                  {menuData &&
                    Object.entries(menuData).map(([key, value]) => {
                      const hasSubmenu =
                        Array.isArray(value) || typeof value === "object";

                      return (
                        <li
                          key={key}
                          className="nav-item dropdown position-static"
                        >
                          <NavLink
                            className="nav-link dropdown-toggle text-capitalize d-flex align-items-center"
                            to="#"
                            onClick={() =>
                              isMobile && hasSubmenu && toggleMenu(key)
                            }
                          >
                            {key}
                            {isMobile && hasSubmenu && (
                              <FaChevronDown
                                className={`ms-1 ${
                                  activeMenu === key ? "rotate-180" : ""
                                }`}
                                size={12}
                              />
                            )}
                          </NavLink>

                          {hasSubmenu && (
                            <MegaDropdown
                              data={value}
                              mode={key}
                              isMobile={isMobile}
                              isOpen={activeMenu === key}
                            />
                          )}
                        </li>
                      );
                    })}

                  <li className="nav-item">
                    <a className="nav-link" href="https://aldasa.pe/proyectos">
                      Proyectos
                    </a>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/nuevo-anuncio">
                      Subir anuncios
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/anuncios-activos">
                      Mis anuncios
                    </NavLink>
                  </li>
                </>
              )}
            </ul>

            {/* ================== LADO DERECHO ================== */}
            <div className="d-flex align-items-center gap-2">
              {!user ? (
                <>
                  <NavLink to="/club" className="btn btn-outline-success">
                    Inversiones TOP
                  </NavLink>

                  <NavLink to="/publica-tu-anuncio" className="btn-publicar">
                    <FaPlus /> Publicar Anuncio
                  </NavLink>

                  {/* ICONO USUARIO */}
                  <button
                    ref={userBtnRef}
                    className="bbtn p-0 border-0 bg-success rounded-circle d-flex align-items-center justify-content-center user-icon-btn"
                    type="button"
                    onMouseEnter={abrirUserMenu}
                    onMouseLeave={cerrarUserMenu}
                    onClick={abrirLoginModal}
                  >
                    <FaUser className="login-icon" size={14} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    className={`btn btn-${
                      darkMode ? "warning" : "secondary"
                    }`}
                    onClick={toggleDarkMode}
                  >
                    {darkMode ? <FaSun /> : <FaMoon />}
                  </button>
                  <UserInfoBoxAldasa abrirModal={abrirModal} />
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ================== DROPDOWN FIXED ================== */}
      {showUserMenu && !user && (
        <div
          className="user-menu-panel visible"
          style={{
            position: "fixed",
            top: `${menuPos.top}px`,
            left: `${menuPos.left}px`,
            zIndex: 99999,
          }}
          onMouseEnter={abrirUserMenu}
          onMouseLeave={cerrarUserMenu}
        >
          <div className="user-dropdown-header">
            <p style={{ fontSize: "15px" }}>
              Ingresa y accede a los avisos que contactaste, tus favoritos y
              búsquedas guardadas
            </p>

            <button
              className="btn btn-success w-100"
              onClick={abrirLoginModal}
            >
              Ingresar
            </button>
          </div>

          <hr />

          <button className="dropdown-item" onClick={abrirLoginModal}>
            Mis contactos
          </button>
          <button className="dropdown-item" onClick={abrirLoginModal}>
            Favoritos
          </button>
          <button className="dropdown-item" onClick={abrirLoginModal}>
            Búsquedas y alertas
          </button>
          <button className="dropdown-item" onClick={abrirLoginModal}>
            Historial
          </button>

          <hr />

          <div className="px-3 pb-2">
            <small className="text-muted d-block">Mi cuenta</small>
            <small className="text-muted d-block">
              Ajustes de notificaciones
            </small>
          </div>
        </div>
      )}
    </>
  );
}
