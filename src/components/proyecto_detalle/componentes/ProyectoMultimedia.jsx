import React from "react";
import config from "../../../config";

export default function ProyectoMultimedia({ multimedia }) {
  if (!multimedia || multimedia.length === 0) return null;

  return (
    <div className="single-listing-box1 mt-4">
      <h4>Multimedia</h4>

      <div className="mt-3">
        {multimedia.map((item) => {
          if (item.tipo === "imagen") {
            return (
              <img
                key={item.id}
                src={`${config.urlserver}${item.archivo}`}
                className="img-fluid rounded mb-3"
                style={{ width: "100%", objectFit: "cover" }}
                alt="Multimedia"
              />
            );
          }

          if (item.tipo === "video") {
            return (
              <div key={item.id} className="mb-3">
                <iframe
                  width="100%"
                  height="315"
                  src={item.archivo}
                  title="Video"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
