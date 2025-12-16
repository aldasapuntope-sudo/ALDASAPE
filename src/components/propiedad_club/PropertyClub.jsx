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
import "../../css/PropertyDetail.css";

export default function PropertyClub() {
  const { slug } = useParams();
  const id = slug?.split("-")[0];
  const [anuncio, setAnuncio] = useState(null);
  const [loading, setLoading] = useState(true);
  const llamadaRealizada = useRef(false);

  useEffect(() => {
    if (!id) return;

    axios
      .get(`${config.apiUrl}api/aldasaclub/listardetalle/${id}`)
      .then((res) => {
        setAnuncio(res.data[0] ?? null);
      })
      .catch(() => setAnuncio(null))
      .finally(() => setLoading(false));
  }, [id]);



console.log(`${config.apiUrl}api/aldasaclub/listardetalle/${id}`);
console.log(anuncio);
  /*useEffect(() => {
    if (!anuncio?.id || llamadaRealizada.current) return;

    llamadaRealizada.current = true;
    axios.post(`${config.apiUrl}api/aldasaclub/propiedades/visita/${anuncio.id}`);
  }, [anuncio]);
*/
  if (loading) return <SkeletonInformacionPropiedaddetalle />;
  if (!anuncio) return <NotFound />;

  const imagenes = anuncio.imagenes?.map((img) => ({
    imagen: img.imagen.replace(/\\/g, ""),
  }));

  return (
    <>
      <div className="property-heading">
        <section className="single-listing-wrap1">
          <BreadcrumbALDASA />
          <br></br>
          <div className="container">
            <div className="single-property">
              <div className="content-wrapper">
                {/* Aquí usamos el componente */}
                <PropertyHeadingclub anuncio={anuncio} />

                <dv className="row">
                  <div className="col-lg-8">
                      <PropertyGalleryclub imagenes={imagenes} />

                      <div className="single-listing-box1">
                          <Overviewclub anuncio={anuncio} />

                          <div className="overview-area listing-area mt-1">
                            <h3 className="item-title mb-3">Sobre este anuncio</h3>
                            <p>{anuncio.descripcion}</p>
                          </div>

                          <Amenitiesclub anuncio={anuncio} />

                          <MapLocationclub anuncio={anuncio} />
                          <FloorPlansclub anuncio={anuncio} />
                          <PropertyVideoclub anuncio={anuncio} />
                          <PropertyTour360club anuncio={anuncio} />
                      </div>

                      
                  </div>
                  <div className="col-lg-4 widget-break-lg sidebar-widget">
                      <ContactBoxclub anuncio={anuncio}/>
                      <PropiedadesRelacionadasclub  tipoId={anuncio?.id_tipopropiedad} idpropiedad={anuncio?.id} operaciones={anuncio?.operaciones}  />
                  </div>

                </dv>

                {/* Aquí continúas con el resto del layout (overview, amenities, mapa...) */}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
