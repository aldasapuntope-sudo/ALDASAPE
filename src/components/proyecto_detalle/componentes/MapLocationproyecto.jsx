// MapLocation.jsx
import React from "react";

export default function MapLocationproyecto({ direccion }) {
  // Si no hay dirección, usar ubicación por defecto (Chiclayo)
  const defaultLocation = "Chiclayo, Perú";
  const locationQuery = encodeURIComponent(direccion || defaultLocation);

  // URL de Google Maps
  const mapUrl = `https://www.google.com/maps?q=${locationQuery}&output=embed`;

  return (
    <div className="card shadow-sm border-0 rounded-4 p-3 mt-3">
      <h5 className="mb-3">Ubicación en el mapa</h5>
      <iframe
        src={mapUrl}
        width="100%"
        height="250"
        style={{ border: 0, borderRadius: "12px" }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Ubicación del proyecto"
      />
    </div>
  );
}
