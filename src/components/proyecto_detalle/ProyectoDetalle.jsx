// src/pages/proyectos/ProyectoDetalle.jsx
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import config from "../../config";

import Breadcrumb from "../Breadcrumb";
import NotFound from "../NotFound";
import { SkeletonInformacionPropiedaddetalle } from "../TablaSkeleton";

import ProyectoHeading from "./componentes/ProyectoHeading";
import ProyectoGallery from "./componentes/ProyectoGallery";
import ProyectoDescripcion from "./componentes/ProyectoDescripcion";
import ProyectoCaracteristicas from "./componentes/ProyectoCaracteristicas";
import ProyectoMultimedia from "./componentes/ProyectoMultimedia";
import ProyectoContactBox from "./componentes/ProyectoContactBox";

export default function ProyectoDetalle() {
  const { slug } = useParams();
  const id = slug?.split("-")[0];

  const [proyecto, setProyecto] = useState(null);
  const [loading, setLoading] = useState(true);
  const llamadaRealizada = useRef(false);

  // Obtener detalle
  useEffect(() => {
    if (!id) return;

    axios
      .get(`${config.apiUrl}api/inversiones/proyectos/detalle/${id}`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data[0] : res.data;
        setProyecto(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);


  // Registrar visita
  useEffect(() => {
    if (!proyecto?.id) return;

    if (!llamadaRealizada.current) {
      llamadaRealizada.current = true;

      axios
        .post(`${config.apiUrl}api/proyectos/visita/${proyecto.id}`)
        .then((res) => console.log("Visita registrada:", res.data))
        .catch((err) => console.error("Error visita:", err));
    }
  }, [proyecto?.id]);


  if (loading) return <SkeletonInformacionPropiedaddetalle />;
  if (!proyecto) return <NotFound />;

  return (
    <div className="property-heading">
      <section className="single-listing-wrap1">
        <Breadcrumb />

        <div className="container">
          <div className="single-property">
            <div className="content-wrapper">

              {/* ENCABEZADO */}
              <ProyectoHeading proyecto={proyecto} />

              <div className="row">
                <div className="col-lg-8">

                  {/* GALERÍA */}
                  <ProyectoGallery imagenes={proyecto.imagenes} />

                  <div className="single-listing-box1">

                    {/* DESCRIPCIÓN */}
                    <ProyectoDescripcion descripcion={proyecto.descripcion} />

                    {/* CARACTERÍSTICAS */}
                    <ProyectoCaracteristicas caracteristicas={proyecto.caracteristicas} />

                    {/* MULTIMEDIA */}
                    <ProyectoMultimedia multimedia={proyecto.multimedia} />

                  </div>
                </div>

                {/* LADO DERECHO */}
                <div className="col-lg-4 widget-break-lg sidebar-widget">
                  <ProyectoContactBox anuncio={proyecto} />
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
