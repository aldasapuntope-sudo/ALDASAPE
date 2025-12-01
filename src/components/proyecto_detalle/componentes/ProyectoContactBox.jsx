import React from "react";

export default function ContactBoxproyecto({ anuncio }) {
  const nombre = `${anuncio.creador_nombre} ${anuncio.creador_apellido}`;
  const telefono = anuncio.creador_telefono || "No registrado";
  const email = anuncio.creador_email || "Sin correo";

  return (
    <div className="widget contact-info-widget">
      <h4 className="widget-title">Contacto del Creador</h4>

      <div className="contact-info mt-3">
        <p><strong>Nombre:</strong> {nombre}</p>
        <p><strong>Teléfono:</strong> {telefono}</p>
        <p><strong>Email:</strong> {email}</p>

        <a
          href={`https://wa.me/51${telefono}`}
          className="btn btn-success w-100 mt-3"
          target="_blank"
          rel="noopener noreferrer"
        >
          Contactar por WhatsApp
        </a>
      </div>
    </div>
  );
}
