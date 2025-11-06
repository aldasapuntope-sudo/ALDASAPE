// src/componentes/HeaderAldasa.js
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { FaUser, FaPlus, FaSun, FaMoon } from "react-icons/fa";
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

  // Cargar usuario
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) {
      const parsed = JSON.parse(usuarioGuardado);
      const data = parsed.usuarioaldasa || parsed.googleUser || parsed;
      setUser(data);
    }
  }, []);

  // Cargar menús desde la API
  useEffect(() => {
    fetch(`${config.apiUrl}api/menus`)
      .then((res) => res.json())
      .then(setMenuData)
      .catch((err) => console.error("Error al cargar menús:", err));
  }, []);

  console.log(menuData);
  return (
    <nav
      className={`navbar navbar-expand-lg ${
        darkMode
          ? "bg-dark navbar-dark shadow-sm sticky-top"
          : "bg-white shadow-sm sticky-top"
      }`}
    >
      <div className="container">
        {/* LOGO */}
        <NavLink className="navbar-brand d-flex align-items-center" to="/">
          <img
            src="/assets/images/logo-aldasape-color.png"
            alt="ALDASA"
            style={{ height: 40 }}
          />
        </NavLink>

        {/* TOGGLER MÓVIL */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#menuPrincipal"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* MENÚ PRINCIPAL */}
        <div className="collapse navbar-collapse" id="menuPrincipal">
          <ul className="navbar-nav mx-auto">
            {!user ? (
              <>
                {/* 🔁 Generar menús automáticamente desde el JSON */}
                {menuData &&
                  Object.entries(menuData).map(([key, value]) => (
                    <li key={key} className="nav-item dropdown position-static">
                      <NavLink
                        className="nav-link dropdown-toggle text-capitalize"
                        to="#"
                      >
                        {key}
                      </NavLink>

                      {/* Mostrar el mega menú solo si no es la sección de servicios */}
                      {key !== "servicios" ? (
                        <MegaDropdown data={value} mode={key} />
                      ) : (
                        <MegaDropdown data={value} mode="servicios" />
                      )}
                    </li>
                  ))}


                {/* Ejemplo: si la API no trae “proyectos” */}
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="https://aldasa.pe/proyectos"
                  >
                    Proyectos
                  </a>
                </li>
              </>
            ) : (
              // ✅ MENÚS PARA USUARIO LOGUEADO
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/subir-anuncio">
                    Subir anuncio
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/mis-anuncios">
                    Mis anuncios
                  </NavLink>
                </li>
              </>
            )}
          </ul>

          {/* DERECHA: Modo Noche/Día + Usuario */}
          <div className="d-flex align-items-center gap-2">
            {!user ? (
              <>
                <button className="btn btn-outline-success">
                  Inversiones TOP
                </button>

                <button
                  className="btn-publicar"
                  onClick={() => {
                    const usuarioGuardado = localStorage.getItem("usuario");
                    if (usuarioGuardado) {
                      window.location.href = "/nuevo-anuncio";
                    } else {
                      localStorage.setItem(
                        "redirectAfterLogin",
                        "/nuevo-anuncio"
                      );
                      window.location.href = "/login";
                    }
                  }}
                >
                  <span className="icon-wrapper">
                    <FaPlus />
                  </span>
                  Publicar Anuncio
                </button>

                <NavLink to="/login" className="login-icon-wrapper ms-2">
                  <FaUser className="login-icon" size={18} />
                </NavLink>
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
  );
}
