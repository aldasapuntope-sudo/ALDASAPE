import React from "react";
import { Link, useLocation } from "react-router-dom";

const Breadcrumb = () => {
  const location = useLocation();
  const path = location.pathname.split("/").filter(Boolean).pop();

  let pageName = "";

  switch (path) {
    case "politicas-de-privacidad":
      pageName = "Políticas de Privacidad";
      break;
    case "terminos-condiciones":
      pageName = "Términos & Condiciones";
      break;
    case "nosotros":
      pageName = "Nosotros";
      break;
    case "contacto":
      pageName = "Contacto";
      break;
    default:
      pageName = "";
  }

  // Si estás en el inicio, no muestra el breadcrumb
  if (!pageName) return null;

  return (
    <div className="breadcrumb-wrap breadcrumb-wrap-2">
      <div className="container">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/">Inicio</Link>
            </li>
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
