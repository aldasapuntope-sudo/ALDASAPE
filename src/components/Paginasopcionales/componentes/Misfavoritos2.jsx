import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Alert } from "react-bootstrap";
import { FaThLarge, FaList } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import BreadcrumbALDASA from "../../../cuerpos_dashboard/BreadcrumbAldasa";
import { CardSkeleton } from "../../../components/TablaSkeleton";
import Cargando from "../../../components/cargando";
import { useUsuario } from "../../../context/UserContext";
import config from "../../../config";
import FavoritoCards from "../../../pages/dashboard/mis-anuncios/componentes/FavoritoCard";
import EmptyState from "../../EmptyState";

const MisFavoritos2 = () => {
  const [favoritos, setFavoritos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [view, setView] = useState("cards");
  const { usuario } = useUsuario();
  const navigate = useNavigate();

  useEffect(() => {
    cargarFavoritos();
  }, []);

  const cargarFavoritos = async () => {
    if (!usuario?.usuarioaldasa?.id) return;
    setCargando(true);
    try {
      const res = await axios.get(
        `${config.apiUrl}api/misanuncios/anuncio-favoritos/${usuario.usuarioaldasa.id}`
      );

      const data = res.data;

      const favoritosAdaptados = (Array.isArray(data) ? data : data.data || []).map((a) => ({
        id: a.id,
        propiedad_id: a.id, // aseguramos un campo consistente
        titulo: a.propiedad_titulo || a.titulo,
        ubicacion: a.ubicacion,
        precio: a.precio,
        imagen: a.propiedad_imagen
          ? `${a.propiedad_imagen}`
          : `assets/images/default-property.png`,
        slug: a.slug || "",
        visitas: a.visitas,
      }));

      setFavoritos(favoritosAdaptados);
    } catch (error) {
      console.error("Error al cargar favoritos:", error);
    } finally {
      setCargando(false);
    }
  };

  // ✅ Nueva función para abrir el detalle del favorito
  const abrirFavorito = (fav) => {
    // Si ya tiene slug, úsalo directamente
    let slug = fav.slug;

    // Si no tiene, lo generamos desde el título y la ubicación
    if (!slug && fav.titulo) {
        const tituloSlug = fav.titulo
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-") // reemplaza espacios y símbolos por guiones
        .replace(/(^-|-$)/g, ""); // elimina guiones al inicio o final

        const ubicacionSlug = fav.ubicacion
        ? fav.ubicacion
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "")
        : "";

        // Combinar título y ubicación en un solo slug
        slug = `${tituloSlug}-${ubicacionSlug}`;
    }

    // Redirigir al detalle del anuncio
    navigate(`/anuncio/${fav.propiedad_id}-${slug}`);
    };


  return (
    <>
      <div>
        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-body p-4">
            {/* 🔹 Encabezado */}
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
              <h4 className="mb-0 text-success fw-bold"></h4>

              <div className="d-flex gap-2">
                <Button
                  variant={view === "cards" ? "primary" : "outline-primary"}
                  size="sm"
                  onClick={() => setView("cards")}
                >
                  <FaThLarge />
                </Button>
                <Button
                  variant={view === "list" ? "primary" : "outline-primary"}
                  size="sm"
                  onClick={() => setView("list")}
                >
                  <FaList />
                </Button>
              </div>
            </div>

            {/* 🔹 Contenido */}
            {cargando ? (
              <>
                <Cargando visible={cargando} />
                <CardSkeleton cards={6} />
              </>
            ) : favoritos.length === 0 ? (
              <EmptyState
                image="/assets/images/empty-sinresult.png"
                title="No tienes anuncios en tu lista de favoritos por el momento."
                description="Explora anuncios conviertelas en tus favoritos!"     
              />
              /*<Alert
                variant="info"
                className="text-center py-4 rounded-3 shadow-sm"
              >
                <p className="mb-0">
                  No tienes anuncios en tu lista de favoritos por el momento.
                </p>
              </Alert>*/
            ) : view === "list" ? (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-success">
                    <tr>
                      <th>Título</th>
                      <th>Ubicación</th>
                      <th>Precio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {favoritos.map((item) => (
                      <tr
                        key={item.id}
                        onClick={() => abrirFavorito(item)}
                        style={{ cursor: "pointer" }}
                      >
                        <td>{item.titulo}</td>
                        <td>{item.ubicacion}</td>
                        <td>S/ {item.precio}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="row">
                {favoritos.map((item) => (
                  <div className="col-md-4 mb-4" key={item.id}>
                    <div
                      className="position-relative"
                      onClick={() => abrirFavorito(item)}
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
    </>
  );
};

export default MisFavoritos2;
