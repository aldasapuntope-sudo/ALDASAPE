// src/pages/PropertyDetail.jsx  (tu archivo actual)
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card, Spinner } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import config from "../../config";
import PropertyHeading from "./componentes/PropertyHeading";
import "../../css/PropertyDetail.css";
import PropertyGallery from "./componentes/PropertyGallery";
import Overview from "./componentes/Overview";
import Amenities from "./componentes/Amenities";
import MapLocation from "./componentes/MapLocation";
import FloorPlans from "./componentes/FloorPlans";
import PropertyVideo from "./componentes/PropertyVideo";
import Breadcrumb from "../Breadcrumb";
import NotFound from "../NotFound";


export default function PropertyDetail() {
  const { slug } = useParams();
  const id = slug?.split("-")[0];
  const [anuncio, setAnuncio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  useEffect(() => {
    if (!id) return;

    axios
      .get(`${config.apiUrl}api/paginaprincipal/listardetalle/${id}`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data[0] : res.data;
        setAnuncio(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <Spinner animation="border" variant="success" />
      </div>
    );
  }

  if (!anuncio) {
    return <NotFound />;
  }

  const imagenes = anuncio.imagenes?.map((img) => ({
    imagen: img.imagen.replace(/\\/g, ""),
  }));

  return (
    <>
    <Breadcrumb />
      <section className="single-listing-wrap1">
        <div className="container">
          <div className="single-property">
            <div className="content-wrapper">
              {/* Aquí usamos el componente */}
              <PropertyHeading anuncio={anuncio} />

              <dv className="row">
                <div className="col-lg-8">
                    <PropertyGallery imagenes={imagenes} />

                    <div className="single-listing-box1">
                        <Overview anuncio={anuncio} />

                        <div className="overview-area listing-area mt-1">
                          <h3 className="item-title mb-3">Sobre este anuncio</h3>
                          <p>{anuncio.descripcion}</p>
                        </div>

                        <Amenities anuncio={anuncio} />

                        <MapLocation lat={-6.7714} lng={-79.8409} />
                        <FloorPlans anuncio={anuncio} />
                        <PropertyVideo anuncio={anuncio} />
                    </div>

                    
                </div>
                <div className="col-lg-4 widget-break-lg sidebar-widget">
                    
                </div>

              </dv>

              {/* Aquí continúas con el resto del layout (overview, amenities, mapa...) */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
