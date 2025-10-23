import React from "react";
import { Link, useLocation } from "react-router-dom";

const Breadcrumb = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);

  // Si estás en la raíz, no mostramos breadcrumb
  if (pathSegments.length === 0) return null;

  // Detectamos el último segmento
  const lastSegment = pathSegments[pathSegments.length - 1];

  // 🧠 Convertimos slug en texto legible (ej. "1-departamento-de-lujo" → "Departamento de lujo")
  const formatSlug = (slug) => {
    // Removemos el ID si existe al inicio
    const sinId = slug.replace(/^\d+-/, "");
    // Reemplazamos guiones por espacios y capitalizamos
    return sinId
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Mapeo de páginas conocidas
  const titles = {
    "politicas-de-privacidad": "Políticas de Privacidad",
    "terminos-condiciones": "Términos & Condiciones",
    nosotros: "Nosotros",
    contacto: "Contacto",
    propiedades: "Propiedades",
  };

  // Verificamos si el último segmento es una propiedad
  let pageName = titles[lastSegment] || formatSlug(lastSegment);

  return (
    <div className="breadcrumb-wrap breadcrumb-wrap-2 mb-4">
      <div className="container">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb bread-principal">
            <li className="breadcrumb-item">
              <Link to="/">Inicio</Link>
            </li>

            {/* Si hay más de un segmento (por ejemplo /propiedad/slug), mostramos el intermedio */}
            {pathSegments.length > 1 && (
              <li className="breadcrumb-item">
                <Link to={`/${pathSegments[0]}`}>
                  {titles[pathSegments[0]] || "Propiedades"}
                </Link>
              </li>
            )}

            {/* Último elemento (actual) */}
            <li className="breadcrumb-item active" aria-current="page">
              {pageName}
            </li>
          </ol>
        </nav>
      </div>
    </div>
  );
};

export default Breadcrumb;
