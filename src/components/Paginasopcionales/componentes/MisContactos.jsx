import React, { useEffect, useState } from "react";
import axios from "axios";
import { Alert, Button } from "react-bootstrap";
import { FaWhatsapp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import config from "../../../config";
import { useUsuario } from "../../../context/UserContext";
import Cargando from "../../../components/cargando";
import "../../../css/CuentaLayout.css";
const generarSlug = (texto) =>
  texto
    ?.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const MisContactos = () => {
  const [contactos, setContactos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const { usuario } = useUsuario();
  const navigate = useNavigate();

  useEffect(() => {
    cargarContactos();
  }, []);

  const cargarContactos = async () => {
    if (!usuario?.usuarioaldasa?.numero_documento) return;

    setCargando(true);
    try {
      const res = await axios.get(
        `${config.apiUrl}api/administracion/lmensajecontactos/${usuario.usuarioaldasa.numero_documento}`
      );
      setContactos(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error al cargar contactos:", error);
      setContactos([]);
    } finally {
      setCargando(false);
    }
  };

  const irADetalle = (c) => {
    const slug = generarSlug(`${c.titulo}-chiclayo`);
    navigate(`/anuncio/${c.idpropiedad}-${slug}`);
  };

  return (
    <div>
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body p-4">
          {/* HEADER */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold text-success mb-0">Mis contactos</h4>
            <small className="text-muted">Ordenar ⬍</small>
          </div>

          {cargando ? (
            <Cargando visible={cargando} />
          ) : contactos.length === 0 ? (
            <Alert variant="light" className="text-center py-5 rounded-4 border-0">
              <img
                src="/assets/images/empty-contactos.png"
                alt="Sin contactos"
                style={{ maxWidth: 260 }}
                className="mb-4"
              />
              <h5 className="fw-bold">
                Aún no contactaste ningún anunciante
              </h5>
              <p className="text-muted mb-0">
                ¡No pierdas tiempo! Tu próximo hogar te está esperando
              </p>
            </Alert>
          ) : (
            <div className="d-flex flex-column gap-3">
              {contactos.map((c) => (
                <div
                  key={c.id}
                  onClick={() => irADetalle(c)}
                  className="d-flex align-items-center justify-content-between p-3 border rounded-3 contacto-hover"
                  style={{ cursor: "pointer" }}
                >
                  {/* IZQUIERDA */}
                  <div className="d-flex align-items-center gap-3">
                    <img
                      src={
                        c.imagen_principal
                          ? `${config.urlserver}${c.imagen_principal}`
                          : "/assets/images/default-property.png"
                      }
                      alt={c.titulo}
                      style={{
                        width: 90,
                        height: 65,
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                    />

                    <div>
                      <strong className="d-block">{c.titulo}</strong>
                      <small className="text-muted d-block">
                        {c.direccion}
                      </small>
                      <small className="text-muted">
                        {c.nombrecompleto}
                      </small>
                    </div>
                  </div>

                  {/* BOTÓN WHATSAPP */}
                  <Button
                    variant="success"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation(); // ⛔ evita redirección
                      window.open(`https://wa.me/${c.telefono}`, "_blank");
                    }}
                  >
                    <FaWhatsapp className="me-1" /> Contactar
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MisContactos;
