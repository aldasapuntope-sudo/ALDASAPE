// src/componentes/HeaderTopBar.js
import React from 'react';
import { useState } from 'react';
import { Navbar, Container, Button, Image, Dropdown, Nav } from 'react-bootstrap';
import { useUsuario } from '../context/UserContext';
import { useTheme } from '../context/ThemeContext';
import { FaBars, FaSun, FaMoon } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import {
  FaChevronDown,
  FaChevronRight,
  FaUpload,
  FaSignOutAlt,
  FaHome,
  FaBookOpen,
  FaClipboardList,
  FaChartBar,
  FaCogs
} from 'react-icons/fa';
import UserInfoBoxAldasa from '../components/UserInfoBoxAldasa';


function HeaderTopBar({ toggleSidebar, sidebarOpen, abrirModal }) {
  const { usuario } = useUsuario();
  const { darkMode, toggleDarkMode } = useTheme();

  

  return (
    <Navbar
      bg={darkMode ? 'dark' : 'UNJ'}
      variant={darkMode ? 'dark' : 'UNJ'}
      expand="lg"
      className={`header_top_bar border-bottom ${sidebarOpen ? 'with-sidebar' : 'full'}`}
    >
      <Container fluid className="d-flex justify-content-between align-items-center">
        {/* Lado izquierdo: menú, modo oscuro y más íconos si deseas */}
        <div className="d-flex align-items-center">
          
          <Button
                variant="outline-secondary"
                onClick={toggleSidebar}
                className="me-2 floating-menutoggle"
              >
                <FaBars />
          </Button>
          <Button
            variant={darkMode ? 'warning' : 'blancounj'}
            onClick={toggleDarkMode}
            className="me-2"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </Button>

          {/* Aquí puedes agregar más botones o íconos a la izquierda */}
          {/* <Button className="me-2">Otro Icono</Button> */}
        </div>

        {/* Lado derecho: dropdown de usuario */}
        
        <div className="d-flex align-items-center">
          
          <UserInfoBoxAldasa abrirModal={abrirModal}/>
          {/* <Dropdown align="end">
            <Dropdown.Toggle
            
              variant={darkMode ? 'warning' : 'blancounj'}
              className="d-flex align-items-center"
              id="dropdown-menumodulos"
            >
              <FaBars className='btn-menumodulos'/>

            </Dropdown.Toggle>

            <Dropdown.Menu>

              <div className="menu-group">

                
                <button className="menu-btn">
                  <FaCogs className="me-2" /> Administración
                
                </button>
                        
                      </div>
              <Dropdown.Divider />
              <Dropdown.Item onClick={abrirModal}>Salir</Dropdown.Item>
              {/*<Dropdown.Item as={Link} to="/datos">Mi Perfil</Dropdown.Item>
              <Dropdown.Item onClick={() => window.location.reload()}>Recargar</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={abrirModal}>Cerrar sesión</Dropdown.Item>}
            </Dropdown.Menu>
          </Dropdown> */}
            <div className="  mx-2 pt-1">
                <Nav.Link
                  as={Link}
                  to="/apps"
                  // onClick={() => {
                  //   setShowGap(!showGap);
                  // }}
                >
                  <i className="bi bi-grid-3x3-gap-fill fs-2 text-secondary"></i>
                </Nav.Link>
              </div>
        </div>
      </Container>

    </Navbar>

    
  );
}

export default HeaderTopBar;



/*
import React, { useEffect, useState } from 'react';
import '../resource/HeaderTopBar.css'; // si deseas aplicar estilos adicionales
import { useUsuario } from '../context/UserContext';
import { useTheme } from '../context/ThemeContext';

function HeaderTopBar({ toggleSidebar, sidebarOpen  }) {
  const { usuario } = useUsuario();
  const recargar = () => window.location.reload();

  


  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <div className={`header_top_bar d-flex justify-content-between align-items-center px-3 py-2 bg-light border-bottom ${sidebarOpen ? 'with-sidebar' : 'full'}`}>
      
      
      {/* se quito la clase d-md-none 
      <a href="#"  style={{ display: 'block !important'}} className="floating-menutoggle "
        onClick={(e) => {
          e.preventDefault();
          toggleSidebar();
        }}
      >
        <i className="fa fa-bars"></i>
      </a>

      
      <div className="top_left_menu me-auto ms-3">
        <ul className="list-unstyled mb-0 d-flex">
          <li className="me-3">
            <a href="#" onClick={recargar}><i className="fa fa-repeat"></i></a>
          </li>
        </ul>
      </div>

     
      <button className="btn btn-outline-dark me-3" onClick={toggleDarkMode}>
        {darkMode ? <i className="fa fa-sun"></i> : <i className="fa fa-moon"></i>}
      </button>

      
        
      
      <div className="user_admin dropdown">
        <a href="#" className="d-flex align-items-center" data-bs-toggle="dropdown">
          <img src={usuario?.picture || 'https://pruebas.unj.edu.pe/zetunajaen/images/sigazet.png'} alt="Usuario" className="me-2" style={{ height: '30px' }} />
          <span className="user_adminname">{`${usuario.alumno.primernombre} ${usuario.alumno.apellidopaterno}`}</span>
        </a>
      
      </div>
      
      
    </div>
  );
}


export default HeaderTopBar;*/
