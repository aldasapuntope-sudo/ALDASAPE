// src/components/propiedad_detalle/componentes/PropertyGallery.jsx
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
// opcional si luego quieres estilos personalizados

export default function PropertyGallery({ imagenes = [] }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  if (!imagenes || imagenes.length === 0) {
    return (
      <div className="text-center py-4 text-muted">
        No hay imágenes disponibles para esta propiedad.
      </div>
    );
  }

  return (
    <div className="featured-thumb-slider-area">
      {/* Slider principal */}
      <Swiper
        spaceBetween={10}
        navigation={true}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[Navigation, Thumbs]}
        className="feature-box3"
      >
        {imagenes.map((img, index) => (
          <SwiperSlide key={index}>
            <div className="feature-img1 zoom-image-hover">
              <img
                src={img.imagen}
                alt={`imagen-${index}`}
                width="100%"
                height="auto"
                style={{
                  borderRadius: "10px",
                  objectFit: "cover",
                  maxHeight: "500px",
                  width: "100%",
                }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Slider miniaturas */}
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={5}
        slidesPerView={5}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[Navigation, Thumbs]}
        className="featured-thum-slider2 mt-3"
      >
        {imagenes.map((img, index) => (
          <SwiperSlide key={index}>
            <div className="item-img">
              <img
                src={img.imagen}
                alt={`thumb-${index}`}
                width="100%"
                height="auto"
                style={{
                  borderRadius: "5px",
                  cursor: "pointer",
                  objectFit: "cover",
                  height: "90px",
                }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
