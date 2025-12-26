import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { FaUser, FaPlus, FaSun, FaMoon, FaChevronDown } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../css/Header.css";

import UserInfoBoxAldasa from "./UserInfoBoxAldasa";
import { useTheme } from "../context/ThemeContext";
import MegaDropdown from "./MegaDropdown";
import config from "../config";

export default function HeaderAldasa({ abrirModal }) {
  const [user, setUser] = useState(null);
  const { darkMode, toggleDarkMode } = useTheme();
  const [menuData, setMenuData] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  // 🔹 Estado para dropdown del usuario
  const [showUserMenu, setShowUserMenu] = useState(false);

  /* ================== RESPONSIVE ================== */
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  return (
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
                          data-bs-toggle={
                            !isMobile && hasSubmenu ? "dropdown" : null
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
                <button className="btn btn-outline-success">
                  Inversiones TOP
                </button>

                <button className="btn-publicar">
                  <FaPlus /> Publicar Anuncio
                </button>

                {/* ===== DROPDOWN USUARIO (HOVER) ===== */}
                <div
                  className={`dropdown login-icon-wrapper ms-2 ${
                    showUserMenu ? "show" : ""
                  }`}
                  onMouseEnter={() => setShowUserMenu(true)}
                  onMouseLeave={() => setShowUserMenu(false)}
                >
                  <button
                    className="btn p-0 border-0 bg-transparent"
                    type="button"
                  >
                    <FaUser className="login-icon" size={18} />
                  </button>

                  <ul
                    className={`dropdown-menu dropdown-menu-end shadow ${
                      showUserMenu ? "show" : ""
                    }`}
                  >
                    <li>
                      <button className="dropdown-item">
                        Iniciar sesión
                      </button>
                    </li>
                    <li>
                      <button className="dropdown-item">
                        Mi cuenta
                      </button>
                    </li>
                    <li>
                      <button className="dropdown-item">
                        Favoritos
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <button
                  className={`btn btn-${darkMode ? "warning" : "secondary"}`}
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
  );
}
