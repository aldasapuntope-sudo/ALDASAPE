import React, { useEffect, useState } from 'react';
import { Dropdown, Image, Badge, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope } from 'react-icons/fa';
import config from '../config';
import axios from 'axios';
import { useUsuario } from '../context/UserContext';

export default function UserInfoBoxAldasa({ abrirModal }) {
  const { usuario } = useUsuario();
  const [mensajes, setMensajes] = useState([]);
  const [mensajesNoLeidos, setMensajesNoLeidos] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!usuario) return;

    axios
      .get(`${config.apiUrl}api/misanuncios/mensajes-anuncio/${usuario.usuarioaldasa.id}`)
      .then(res => {
        const mensajesArray = res.data;
        setMensajes(mensajesArray);

        const noLeidos = mensajesArray.filter(msg => msg.is_active === 1).length;
        setMensajesNoLeidos(noLeidos);
      })
      .catch(err => console.error('Error al cargar mensajes:', err));
  }, [usuario]);

  if (!usuario) return null;

  const nombre = usuario.usuarioaldasa?.nombre || usuario.name || 'Usuario';
  const escuela = usuario.escuela || 'Aldasa';
  const imgSrc =
    usuario.imagen || usuario.usuarioaldasa?.imagen || `${config.urlserver}image/animoji-1.png`;

  const ultimosMensajes = mensajes.slice(-3).reverse();

  // 🔗 Navegar al mensaje seleccionado
  const abrirMensaje = (msg) => {
    navigate('/mensajes', { state: { mensajeSeleccionado: msg } });
  };

  return (
    <div className="d-flex align-items-center me-1">
      <Dropdown align="end" className="me-2">
        <Dropdown.Toggle as="div" style={{ cursor: 'pointer', position: 'relative', marginRight: '8px' }}>
          <FaEnvelope size={20} />
          {mensajesNoLeidos > 0 && (
            <Badge pill bg="danger" style={{ position: 'absolute', top: '-5px', right: '-5px' }}>
              {mensajesNoLeidos}
            </Badge>
          )}
        </Dropdown.Toggle>

        <Dropdown.Menu style={{ minWidth: '400px', maxHeight: '400px', overflowY: 'auto' }}>
          {ultimosMensajes.length > 0 ? (
            ultimosMensajes.map((msg) => (
              <Dropdown.Item
                key={msg.id}
                className="p-2"
                onClick={() => abrirMensaje(msg)}
              >
                <div className="d-flex">
                  <div>
                    <img
                      src={
                        msg.propiedad_imagen
                          ? `${config.urlserver}${msg.propiedad_imagen}`
                          : `${config.urlserver}assets/images/default-property.png`
                      }
                      alt={msg.propiedad_titulo || 'Propiedad'}
                      style={{
                        width: '60px',
                        height: '60px',
                        objectFit: 'cover',
                        borderRadius: '4px',
                      }}
                    />
                  </div>

                  <div style={{ marginLeft: '10px', flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--green)' }}>
                      {msg.propiedad_titulo || 'Propiedad'}
                    </div>
                    <strong>{msg.nombre}</strong>
                    <div style={{ fontSize: '12px', color: '#555' }}>
                      {msg.mensaje.length > 80 ? msg.mensaje.substring(0, 80) + '...' : msg.mensaje}
                    </div>
                    <div style={{ fontSize: '10px', color: '#888' }}>
                      {msg.email} | {msg.telefono}
                    </div>
                  </div>
                </div>
              </Dropdown.Item>
            ))
          ) : (
            <Dropdown.Item>No hay mensajes</Dropdown.Item>
          )}

          {mensajes.length > 3 && (
            <div className="about-button">
              <Button
                variant="link"
                style={{ fontSize: '12px', width: '100%', textDecoration: 'none' }}
                onClick={() => navigate('/mensajes')}
                className="item-btn"
              >
                Ver más...
              </Button>
            </div>
          )}
        </Dropdown.Menu>
      </Dropdown>

      <div className="d-flex flex-column text-end me-2">
        <span style={{ color: '#252526', fontWeight: '900', fontSize: '12px' }}>{nombre}</span>
        <span style={{ color: '#ffffffff', fontSize: '10px' }}>{escuela}</span>
      </div>

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
          <Dropdown.Item as={Link} to="/mi-perfil">
            Mi Perfil
          </Dropdown.Item>
          <Dropdown.Item onClick={() => window.location.reload()}>Recargar</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={abrirModal}>Cerrar sesión</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}
