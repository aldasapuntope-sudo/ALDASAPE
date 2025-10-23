import React, { useEffect, useState } from "react";
import PropertyCard from "./PropertyCard";
import "../css/property.css";
import config from "../config";
import Cargando from "./cargando";
import { CardSkeleton } from "./TablaSkeleton";


export default function PropertyList() {
  const [filter, setFilter] = useState("all");
  const [anuncios, setAnuncios] = useState([]);
  const [cargando, setCargando] = useState(true);


  useEffect(() => {
    cargarAnuncios();
  }, []);

  const cargarAnuncios = async () => {
    try {
      setCargando(true);
      const res = await fetch(`${config.apiUrl}api/paginaprincipal/listaranuncios/1`);
      const data = await res.json();

      // Adaptamos datos para la estructura del PropertyCard
      const adaptados = (Array.isArray(data) ? data : data.data || []).map((a) => ({
        id: a.id,
        titulo: a.titulo,
        tipo_id: `${a.id_tipopropiedad}`,
        tipo: `${a.tipo_propiedad}`,
        operacion_id: `${a.id_operacion}`,
        operacion: `${a.operaciones}`,
        ubicacion_id: `${a.id_ubicacion}`,
        ubicacion: `${a.ubicacion}`,
        descripcion: `${a.descripcion}`,
        area: a.area,
        banos: a.banos,
        dormitorios: a.dormitorios,
        precio: a.precio,
        direccion: a.direccion,
        isPublish: a.is_active_publish,
        imagen: a.imagen_principal
          ? a.imagen_principal.replace(
              "C:/Users/ALDASA/Desktop/propiedades\\",
              `${config.apiUrl}propiedades/`
            )
          : "https://aldasa.pe/wp-content/themes/theme_aldasape/img/comprar-inmueble.jpg",

        caracteristicas: a.caracteristicas || [],
        caracteristicas_secundarios: a.amenities || [],
      }));

      setAnuncios(adaptados);
    } catch (error) {
      console.error("Error al cargar anuncios:", error);
    } finally {
      setCargando(false);
    }
  };

  const filtered =
    filter === "all" ? anuncios : anuncios.filter((p) => p.operacion === filter);

  return (
    <section className="property-wrap1 py-5">
      <div className="container">
        {/* Encabezado */}
        <div className="row mb-4 align-items-center">
          <div className="col-lg-6 col-md-5 col-sm-12">
            <div className="item-heading-left">
              <span
                className="section-subtitle text-success"
                style={{
                  position: "relative",
                  paddingLeft: "25px",
                  display: "inline-block",
                  backgroundImage: "url('/assets/images/favicon-aldasape.png')",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "23px 23px",
                  backgroundPosition: "0 50%",
                }}
              >
                Nuestras Propiedades
              </span>
              <h2 className="section-title">Últimos Ingresos</h2>
            </div>
          </div>

          <div className="col-lg-6 col-md-7 col-sm-12 text-md-end mt-3 mt-md-0">
            <div className="isotope-classes-tab btn-group">
              <button
                className={`btn btn-outline-success ${filter === "all" ? "active" : ""}`}
                onClick={() => setFilter("all")}
              >
                Todos
              </button>
              <button
                className={`btn btn-outline-success ${filter === "comprar" ? "active" : ""}`}
                onClick={() => setFilter("comprar")}
              >
                Comprar
              </button>
              <button
                className={`btn btn-outline-success ${filter === "alquiler" ? "active" : ""}`}
                onClick={() => setFilter("alquiler")}
              >
                Alquiler
              </button>
              <button
                className={`btn btn-outline-success ${filter === "venta" ? "active" : ""}`}
                onClick={() => setFilter("venta")}
              >
                Venta
              </button>
            </div>
          </div>
        </div>

        {/* Listado de propiedades */}
        {cargando ? (
          <>
            <Cargando visible={true} />
            <CardSkeleton cards={6} />
          </>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted py-4">No hay propiedades disponibles.</p>
        ) : (
          <div className="row">
            {filtered.map((p, i) => (
              <div
                key={p.id}
                className="col-xl-4 col-lg-6 col-md-6 mb-4 wow fadeInUp"
                data-wow-delay={`${0.2 + i * 0.1}s`}
              >
                <PropertyCard anuncio={p} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
