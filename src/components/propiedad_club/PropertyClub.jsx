import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import config from "../../config";

import BreadcrumbALDASA from "../../cuerpos_dashboard/BreadcrumbAldasa";
import NotFound from "../NotFound";
import { SkeletonInformacionPropiedaddetalle } from "../TablaSkeleton";

// COMPONENTES REUTILIZADOS

import Overviewclub from "./componentes/Overviewclub";
import PropiedadesRelacionadasclub from "./componentes/PropiedadesRelacionadasclub";
import PropertyTour360club from "./componentes/PropertyTour360club";
import PropertyVideoclub from "./componentes/PropertyVideoclub";
import FloorPlansclub from "./componentes/FloorPlansclub";
import MapLocationclub from "./componentes/MapLocationclub";
import Amenitiesclub from "./componentes/Amenitiesclub";
import PropertyGalleryclub from "./componentes/PropertyGalleryclub";
import PropertyHeadingclub from "./componentes/PropertyHeadingclub";
import ContactBoxclub from "./componentes/ContactBoxclub";
import { useParams } from "react-router-dom";

export default function PropertyClub() {
  const { slug } = useParams();
  const id = slug?.split("-")[0];
  const [anuncio, setAnuncio] = useState(null);
  const [loading, setLoading] = useState(true);
  const llamadaRealizada = useRef(false);

  useEffect(() => {
    if (!id) return;
    axios
      .get(`${config.apiUrl}api/aldasaclub/listardetalle/1`)
      .then((res) => setAnuncio(res.data))
      .catch(() => setAnuncio(null))
      .finally(() => setLoading(false));
  }, []);

  console.log(`${config.apiUrl}api/aldasaclub/listardetalle/${id}`);

  useEffect(() => {
    if (!anuncio?.id || llamadaRealizada.current) return;

    llamadaRealizada.current = true;
    axios.post(`${config.apiUrl}api/aldasaclub/propiedades/visita/${anuncio.id}`);
  }, [anuncio]);

  if (loading) return <SkeletonInformacionPropiedaddetalle />;
  if (!anuncio) return <NotFound />;

  const imagenes = anuncio.imagenes?.map((img) => ({
    imagen: img.imagen.replace(/\\/g, ""),
  }));

  return (
    <>
      <section className="single-listing-wrap1">
        <BreadcrumbALDASA />

        <div className="container">
          <PropertyHeadingclub anuncio={anuncio} />

          <div className="row">
            <div className="col-lg-8">
              <PropertyGalleryclub imagenes={imagenes} />

              <Overviewclub anuncio={anuncio} />
              <Amenitiesclub anuncio={anuncio} />
              <MapLocationclub anuncio={anuncio} />
              <FloorPlansclub anuncio={anuncio} />
              <PropertyVideoclub anuncio={anuncio} />
              <PropertyTour360club anuncio={anuncio} />
            </div>

            <div className="col-lg-4">
              <ContactBoxclub anuncio={anuncio} />
              <PropiedadesRelacionadasclub
                tipoId={anuncio.id_tipopropiedad}
                idpropiedad={anuncio.id}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
