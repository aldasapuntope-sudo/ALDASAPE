import React from "react";

export default function MapLocation({ anuncio }) {
  console.log(anuncio);
  // Si no hay dirección, usar ubicación por defecto (Chiclayo)
  const defaultLocation = "Chiclayo, Perú";

  // Escapar la dirección para incluirla en la URL de Google Maps
  const locationQuery = encodeURIComponent(anuncio.direccion || defaultLocation);

  // URL del iframe con la dirección o ubicación por defecto
  const mapUrl = `https://www.google.com/maps?q=${locationQuery}&output=embed`;

  return (
    <div className="overview-area map-box mt-1">
      <h3 className="item-title mb-3">Ubicación en el mapa</h3>
      <div className="item-map">
        <iframe
          src={mapUrl}
          width="100%"
          height="350"
          style={{ border: 0, borderRadius: "12px" }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Ubicación del inmueble"
        ></iframe>
      </div>
    </div>
  );
}


/*import React from "react";

export default function MapLocation({ lat, lng }) {
  // Si no hay coordenadas, usar una ubicación por defecto
  const latitude = lat || -6.7714; // Ejemplo: Chiclayo
  const longitude = lng || -79.8409;

  // URL del iframe con Google Maps
  const mapUrl = `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15000!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0`;

  return (
    <div className="overview-area map-box mt-1">
      <h3 className="item-title mb-3">Ubicación en el mapa</h3>
      <div className="item-map">
        <iframe
          src={mapUrl}
          width="100%"
          height="350"
          style={{ border: 0, borderRadius: "12px" }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Ubicación del inmueble"
        ></iframe>
      </div>
    </div>
  );
}
*/