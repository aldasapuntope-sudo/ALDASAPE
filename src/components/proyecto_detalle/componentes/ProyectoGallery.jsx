import React from "react";
import config from "../../../config";

export default function ProyectoGallery({ imagenes }) {
  if (!imagenes || imagenes.length === 0) return null;

  return (
    <div className="single-listing-box1 mt-4">
      <h4>Galería del Proyecto</h4>

      <div className="row mt-3">
        {imagenes.map((img) => (
          <div key={img.id} className="col-md-4 mb-3">
            <img
              src={`${config.urlserver}${img.archivo}`}
              alt={img.titulo}
              className="img-fluid rounded"
              style={{ width: "100%", height: 150, objectFit: "cover" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
