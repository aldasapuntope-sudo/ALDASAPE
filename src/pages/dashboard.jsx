import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from 'react';
import SidebarALDASA from "../cuerpos_dashboard/SidebarAldasa";
import CerrarSesionModal from "../components/modales/CerrarSesionModal";
import '../css/Layout.css';
import HeaderTopBar from "../cuerpos_dashboard/HeaderTopBar";


export default function DashboardLayout() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const abrirModalCerrarSesion = () => setMostrarModal(true);
  
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const confirmarCerrarSesion = () => {
    localStorage.removeItem('usuario');
   // navigate("/");
    window.location.href = '/';
  };
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    document.body.style.backgroundImage = "url('assets/images/bg-buscador.webp')";
    const data = localStorage.getItem('usuario');
    if (data) setUsuario(JSON.parse(data));
  }, []);

  const location = useLocation();

  const isAppsRoute = location.pathname === "/apps";

  return (

    
    <div className="layout-container">
      {/* Sidebar */}
      <div className={`sidebar-wrapper  ${isSidebarVisible ? 'show' : 'hide'}`}>
        <SidebarALDASA abrirModal={abrirModalCerrarSesion} toggleSidebar={toggleSidebar} />
      </div>

      {/* Contenido principal */}
      <div className="main-content">
        <HeaderTopBar toggleSidebar={toggleSidebar} sidebarOpen={isSidebarVisible} abrirModal={abrirModalCerrarSesion} />
        <CerrarSesionModal
              show={mostrarModal}
              onConfirm={confirmarCerrarSesion}
              onCancel={() => setMostrarModal(false)}
            />
            {isAppsRoute ? (
        // Mostrar <Apps /> fuera del page-body
        <Outlet />
        ) : (
          <main className="page-body">
            <Outlet />
          </main>
        )}
        
      </div>
    </div>

    
  );
}
