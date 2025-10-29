// src/components/MensajesPage.js
import React, { useEffect, useState } from 'react';
import { Row, Col, ListGroup, Card, Button } from 'react-bootstrap';
import axios from 'axios';
import { useUsuario } from '../../../context/UserContext';
import config from '../../../config';
import { FaWhatsapp, FaEnvelope } from 'react-icons/fa';

export default function MensajesPage() {
  const { usuario } = useUsuario();
  const [mensajes, setMensajes] = useState([]);
  const [mensajeSeleccionado, setMensajeSeleccionado] = useState(null);

  useEffect(() => {
    if (!usuario) return;

    axios.get(`${config.apiUrl}api/misanuncios/mensajes-anuncio/${usuario.usuarioaldasa.id}`)
      .then(res => {
        setMensajes(res.data); // todos los mensajes
      })
      .catch(err => console.error('Error al cargar mensajes:', err));
  }, [usuario]);

  if (!usuario) return <p>Cargando usuario...</p>;

  const handleWhatsApp = (telefono) => {
    if (!telefono) return;
    // Limpiar número de caracteres no numéricos
    const numero = telefono.replace(/\D/g, '');
    window.open(`https://wa.me/${numero}`, '_blank');
  };

  const handleCorreo = (email) => {
    if (!email) return;
    window.location.href = `mailto:${email}`;
  };

  return (
    <Row style={{ height: '80vh', marginTop: '20px' }}>
      {/* Lado izquierdo: lista de mensajes */}
      <Col md={4}>
        <Card style={{ height: '100%', overflowY: 'auto' }}>
          <Card.Header>Mensajes</Card.Header>
          <ListGroup variant="flush">
            {mensajes.map(msg => (
              <ListGroup.Item
                key={msg.id}
                action
                active={mensajeSeleccionado?.id === msg.id}
                onClick={() => setMensajeSeleccionado(msg)}
              >
                <div className="d-flex align-items-center">
                  <img
                    src={msg.propiedad_imagen ? `${config.urlserver}${msg.propiedad_imagen}` : '/assets/images/default-property.png'}
                    alt={msg.propiedad_titulo || 'Propiedad'}
                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px', marginRight: '10px' }}
                  />
                  <div style={{ flex: 1 }}>
                    <strong>
                        {msg.propiedad_titulo
                            ? msg.propiedad_titulo.charAt(0).toUpperCase() + msg.propiedad_titulo.slice(1).toLowerCase()
                            : 'Propiedad'}
                    </strong>
                    <div style={{ fontSize: '12px', color: '#555' }}>
                      {msg.mensaje.length > 60 ? msg.mensaje.substring(0, 60) + '...' : msg.mensaje}
                    </div>
                  </div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card>
      </Col>

      {/* Lado derecho: detalle del mensaje */}
      <Col md={8}>
        <Card style={{ height: '100%' }}>
          <Card.Header>
            {mensajeSeleccionado ? mensajeSeleccionado.nombre : 'Selecciona un mensaje'}
          </Card.Header>
          <Card.Body style={{ overflowY: 'auto' }}>
            {mensajeSeleccionado ? (
              <>
                <p><strong>Propiedad:</strong> {mensajeSeleccionado.propiedad_titulo}</p>
                
                {/* Botones dinámicos */}
                <div className="mb-2">
                  <Button 
                    variant="success" 
                    size="sm" 
                    className="me-2"
                    onClick={() => handleWhatsApp(mensajeSeleccionado.telefono)}
                  >
                     <FaWhatsapp style={{ marginRight: '5px' }} />  WhatsApp: {mensajeSeleccionado.telefono}
                  </Button>
                  <Button 
                    variant="info" 
                    size="sm" 
                    onClick={() => handleCorreo(mensajeSeleccionado.email)}
                    style={{color: 'white'}}
                  >
                    <FaEnvelope style={{ marginRight: '5px' }} /> Email: {mensajeSeleccionado.email}
                  </Button>
                </div>

                <p><strong>Mensaje:</strong></p>
                <p>{mensajeSeleccionado.mensaje}</p>
              </>
            ) : (
              <p>No has seleccionado ningún mensaje.</p>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
