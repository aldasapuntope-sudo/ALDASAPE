// src/componentes/UserInfoBoxAldasa.js
import React from 'react';
import { Dropdown, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import config from '../config';
import { useUsuario } from '../context/UserContext';

export default function UserInfoBoxAldasa({ abrirModal }) {
  const { usuario } = useUsuario();

  if (!usuario) return null;
  console.log(usuario);
  //console.log(usuario);

  const nombre = usuario.usuarioaldasa.nombre || usuario.name || 'Usuario';
  const escuela = usuario.escuela || 'Aldasa';

  //console.log(usuario);
  const imgSrc = usuario.imagen || usuario.usuarioaldasa.imagen || `${config.urlserver}image/animoji-1.png`;

  return (
    <div className="d-flex flex-row-reverse align-items-center me-1">
      {/* Imagen a la derecha */}
      <Dropdown align="end">
        <Dropdown.Toggle as="div" id="dropdown-custom-components" style={{ cursor: 'pointer' }}>
          <Image
            src={imgSrc}
            alt="Usuario"
            style={{ background: '#085a9b' }}
            roundedCircle
            height="40"
            width="40"
            className="ms-2"
          />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          
          <Dropdown.Item as={Link} to="/mi-perfil">Mi Perfil</Dropdown.Item>
          <Dropdown.Item onClick={() => window.location.reload()}>Recargar</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={abrirModal}>Cerrar sesión</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>



      {/* Nombre y escuela a la izquierda */}
      <div className="d-flex flex-column text-end">
        <span style={{ color: '#252526', fontWeight: '900', fontSize: '12px' }}>
          {nombre}
        </span>
        <span style={{ color: '#ffffffff', fontSize: '10px' }}>
          {escuela}
        </span>
      </div>
    </div>
  );
}
