import React, { useEffect, useState } from "react";
import axios from "axios";
import { Alert, Button } from "react-bootstrap";
import { FaThLarge, FaList, FaHistory } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import Cargando from "../../../components/cargando";
import { CardSkeleton } from "../../../components/TablaSkeleton";
import { useUsuario } from "../../../context/UserContext";

import FavoritoCards from "../../../pages/dashboard/mis-anuncios/componentes/FavoritoCard";
import config from "../../../config";

const HistorialVisitas = () => {
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [view, setView] = useState("cards");

  const { usuario } = useUsuario();
  const navigate = useNavigate();

  useEffect(() => {
    cargarHistorial();
  }, []);

  const cargarHistorial = async () => {
    if (!usuario?.usuarioaldasa?.id) return;

    setCargando(true);
    try {
      const res = await axios.get(
        `${config.apiUrl}api/administracion/lhistorialvisitapropiedad/${usuario.usuarioaldasa.id}`
      );

      const data = Array.isArray(res.data) ? res.data : [];

      const adaptados = data.map((a) => ({
        id: a.id,
        propiedad_id: a.propiedad_id,
        titulo: a.titulo,
        ubicacion: a.ubicacion,
        precio: a.precio,
        imagen: a.imagen_principal
          ? `${a.imagen_principal}`
          : "assets/images/default-property.png",
        fecha: a.created_at,
        visitas: a.visitas,
        slug: a.slug
      }));

      setHistorial(adaptados);
    } catch (error) {
      console.error("Error al cargar historial:", error);
    } finally {
      setCargando(false);
    }
  };

  const abrirPropiedad = (item) => {
    navigate(`/anuncio/${item.propiedad_id}-${item.slug}`);
  };

  return (
    <div>
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body p-4">

          {/* HEADER */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="fw-bold text-success mb-0">
              <FaHistory className="me-2" /> Historial
            </h4>

            <div className="d-flex gap-2">
              <Button
                size="sm"
                variant={view === "cards" ? "primary" : "outline-primary"}
                onClick={() => setView("cards")}
              >
                <FaThLarge />
              </Button>
              <Button
                size="sm"
                variant={view === "list" ? "primary" : "outline-primary"}
                onClick={() => setView("list")}
              >
                <FaList />
              </Button>
            </div>
          </div>

          {/* CONTENIDO */}
          {cargando ? (
            <>
              <Cargando visible />
              <CardSkeleton cards={6} />
            </>
          ) : historial.length === 0 ? (
            <Alert variant="light" className="text-center py-5 rounded-4">
              <h5 className="fw-bold">Aún no has visitado propiedades</h5>
              <p className="text-muted mb-0">
                Explora anuncios y aquí verás tu historial
              </p>
            </Alert>
          ) : view === "list" ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-success">
                  <tr>
                    <th>Título</th>
                    <th>Ubicación</th>
                    <th>Precio</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {historial.map((item) => (
                    <tr
                      key={item.id}
                      style={{ cursor: "pointer" }}
                      onClick={() => abrirPropiedad(item)}
                    >
                      <td>{item.titulo}</td>
                      <td>{item.ubicacion}</td>
                      <td>S/ {item.precio}</td>
                      <td>{new Date(item.fecha).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="row">
              {historial.map((item) => (
                <div className="col-md-4 mb-4" key={item.id}>
                  <div
                    onClick={() => abrirPropiedad(item)}
                    style={{ cursor: "pointer" }}
                  >
                    <FavoritoCards anuncio={item} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistorialVisitas;
