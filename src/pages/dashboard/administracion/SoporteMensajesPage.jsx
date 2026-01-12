import React, { useEffect, useState, useRef } from "react";
import {
  Row,
  Col,
  ListGroup,
  Card,
  Button,
  Form,
} from "react-bootstrap";
import axios from "axios";
import { useUsuario } from "../../../context/UserContext";
import config from "../../../config";
import BreadcrumbALDASA from "../../../cuerpos_dashboard/BreadcrumbAldasa";
import { FaPaperPlane, FaPlus } from "react-icons/fa";
import SoporteModal from "../../../components/modales/SoporteModal";

export default function SoporteMensajesPage() {
  const { usuario } = useUsuario();

  const [tickets, setTickets] = useState([]);
  const [ticketSeleccionado, setTicketSeleccionado] = useState(null);
  const [mensajesChat, setMensajesChat] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const [mostrarSoporte, setMostrarSoporte] = useState(false);

  const mensajesRef = useRef(null);

  const perfilId = usuario?.usuarioaldasa?.perfil_id;
  const esAdmin = [1, 2].includes(perfilId);

  const ticketsUrl = esAdmin
    ? `${config.apiUrl}api/admin/soporte/tickets`
    : `${config.apiUrl}api/soporte/tickets/${usuario?.usuarioaldasa?.id}`;

  /* =========================
     TICKETS
  ==========================*/
  useEffect(() => {
    if (!usuario) return;

    const cargarTickets = async () => {
      try {
       
        const res = await axios.get(ticketsUrl);
        setTickets(res.data);
      } catch (error) {
        console.error("Error cargando tickets", error);
      }
    };

    cargarTickets();
    const intervalo = setInterval(cargarTickets, 5000);
    return () => clearInterval(intervalo);
  }, [usuario, ticketsUrl]);

  /* =========================
     MENSAJES
  ==========================*/
  useEffect(() => {
    if (!ticketSeleccionado) return;

    const cargarMensajes = async () => {
      try {
        const res = await axios.get(
          `${config.apiUrl}api/soporte/tickets/${ticketSeleccionado.id}/mensajes`
        );
        setMensajesChat(res.data);
      } catch (error) {
        console.error("Error cargando mensajes", error);
      }
    };

    cargarMensajes();
    const intervalo = setInterval(cargarMensajes, 3000);
    return () => clearInterval(intervalo);
  }, [ticketSeleccionado]);

  /* =========================
     AUTO SCROLL
  ==========================*/
  useEffect(() => {
    mensajesRef.current?.scrollTo({
      top: mensajesRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [mensajesChat]);

  /* =========================
     ENVIAR MENSAJE
  ==========================*/
  const enviarMensaje = async () => {
    if (cargando) return;
    if (!nuevoMensaje.trim() || !ticketSeleccionado) return;

    try {
      setCargando(true);

      await axios.post(
        `${config.apiUrl}api/soporte/tickets/${ticketSeleccionado.id}/mensajes`,
        {
          mensaje: nuevoMensaje,
          user_id: usuario.usuarioaldasa.id,
        }
      );

      setNuevoMensaje("");
    } catch (error) {
      console.error("Error enviando mensaje", error);
    } finally {
      setCargando(false);
    }
  };

  const manejarEnter = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviarMensaje();
    }
  };

  return (
    <>
      <BreadcrumbALDASA />

      <Row style={{ height: "80vh", marginTop: 20 }}>
        {/* =========================
            TICKETS
        ==========================*/}
        <Col md={4} className="mb-4">
          <Card style={{ height: "100%" }}>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <strong>Tickets de soporte</strong>
              <Button
                size="sm"
                onClick={() => setMostrarSoporte(true)}
                style={{ backgroundColor: "var(--green)", border: "none" }}
              >
                <FaPlus className="me-1" />
                Nueva consulta
              </Button>
            </Card.Header>

            <ListGroup style={{ overflowY: "auto", maxHeight: "70vh" }}>
              {tickets.map((ticket) => (
                <ListGroup.Item
                  key={ticket.id}
                  action
                  active={ticketSeleccionado?.id === ticket.id}
                  onClick={() => setTicketSeleccionado(ticket)}
                >
                  <strong>{ticket.titulo}</strong>
                  <div className="text-muted" style={{ fontSize: 12 }}>
                    {ticket.descripcion?.substring(0, 50)}...
                  </div>
                  <small className="text-muted">
                    Estado: {ticket.estado}
                  </small>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>

        {/* =========================
            CHAT
        ==========================*/}
        <Col md={8}>
          <Card style={{ height: "100%" }}>
            <Card.Header >
              {ticketSeleccionado ? (
                <>
                  <h6 className="mb-1 fw-semibold">
                    {ticketSeleccionado.titulo}
                  </h6>
                  <div className="text-muted" style={{ fontSize: "0.85rem" }}>
                    {ticketSeleccionado.descripcion}
                  </div>
                  {esAdmin && (
                    <div
                      className="text-success mt-1"
                      style={{ fontSize: "0.75rem", fontWeight: 500 }}
                    >
                      Consulta de: {ticketSeleccionado.usuario}
                    </div>
                  )}
                </>
              ) : (
                "Selecciona un ticket"
              )}
            </Card.Header>

            <Card.Body
              className="d-flex flex-column"
              style={{ overflow: "hidden" }}
            >
              {/* MENSAJES */}
              <div
                  ref={mensajesRef}
                  style={{
                    flex: 1,
                    overflowY: "auto",
                    paddingRight: 10,
                  }}
                >
                {mensajesChat.map((msg) => {
                  const esMio =
                    msg.user_id === usuario.usuarioaldasa.id;

                  return (
                    <div
                      key={msg.id}
                      className={`d-flex mb-2 ${
                        esMio
                          ? "justify-content-end"
                          : "justify-content-start"
                      }`}
                    >
                      <div style={{ maxWidth: "70%" }}>
                        <div
                          className={`mb-1 ${
                            esMio ? "text-end text-success" : "text-muted"
                          }`}
                          style={{
                            fontSize: "0.75rem",
                            fontWeight: 500,
                          }}
                        >
                          {msg.nombrecompleto}
                        </div>

                        <div
                          className={`p-2 rounded ${
                            esMio ? "chat-mio" : "bg-light"
                          }`}
                        >
                          {msg.mensaje}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* INPUT */}
              {ticketSeleccionado && (
                <div className="d-flex align-items-center gap-2 mt-2">
                  <Form.Control
                    as="textarea"
                    rows={1}
                    placeholder={
                      cargando ? "Enviando mensaje..." : "Escribe un mensaje"
                    }
                    value={nuevoMensaje}
                    disabled={cargando}
                    onChange={(e) => setNuevoMensaje(e.target.value)}
                    onKeyDown={manejarEnter}
                    style={{ resize: "none" }}
                  />

                  <Button
                    onClick={enviarMensaje}
                    disabled={cargando || !nuevoMensaje.trim()}
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: 45,
                      height: 45,
                      backgroundColor: "var(--green)",
                      border: "none",
                      opacity: cargando ? 0.7 : 1,
                    }}
                  >
                    {cargando ? "..." : <FaPaperPlane />}
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* MODAL */}
      <SoporteModal
        show={mostrarSoporte}
        onClose={() => setMostrarSoporte(false)}
      />
    </>
  );
}
