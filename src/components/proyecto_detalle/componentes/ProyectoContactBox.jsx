import React from "react";

export default function ContactBoxProyecto({ anuncio }) {
  const nombre = `${anuncio.creador_nombre} ${anuncio.creador_apellido}`;
  const telefono = anuncio.creador_telefono || "No registrado";
  const email = anuncio.creador_email || "Sin correo";

  return (
    <div className="card shadow-sm border-0 rounded-4 p-4">
      <h4 className="mb-3">Contacto del Creador</h4>

      <div className="contact-info mt-2">
        <p><strong>Nombre:</strong> {nombre}</p>
        <p><strong>Teléfono:</strong> {telefono}</p>
        <p><strong>Email:</strong> {email}</p>

        {telefono !== "No registrado" && (
          <a
            href={`https://wa.me/51${telefono}`}
            className="btn btn-success w-100 mt-3"
            target="_blank"
            rel="noopener noreferrer"
          >
            Contactar por WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}
