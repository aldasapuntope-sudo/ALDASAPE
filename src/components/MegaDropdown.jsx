import React from "react";

export default function MegaDropdown({ data, mode }) {
  if (!data) return null;

  const BASE_URL = window.location.origin; // Detecta automáticamente http://localhost:3000 o el dominio actual

  // Si data es un objeto con secciones
  if (!Array.isArray(data)) {
    const sections = Object.entries(data);

    return (
      <div className="dropdown-menu mega-menu fade-up p-3 shadow">
        <div className="container">
          <div className="row">
            {sections.map(([sectionName, items]) => {
              let title =
                sectionName === "tipo"
                  ? "TIPO DE PROPIEDADES"
                  : sectionName.replace(/_/g, " ").toUpperCase();

              return (
                <div key={sectionName} className="col-6 col-md-3">
                  <h6 className="dropdown-header">{title}</h6>

                  {Array.isArray(items) && items.length > 0 ? (
                    items.map((item) => {
                      let url = "#";

                      // 🔹 Si es tipo o ciudad, va a /buscar
                      if (sectionName === "tipo") {
                        url = `/buscar?tipo=${item.id}${
                          mode ? `&mode=${mode}` : ""
                        }`;
                      } else if (sectionName === "ciudad") {
                        url = `/buscar?ciudad=${encodeURIComponent(
                          item.nombre
                        )}${mode ? `&mode=${mode}` : ""}`;
                      }
                      // 🔹 Si es propiedades más vistas, usar URL amigable completa
                      else if (sectionName === "propiedades_mas_vistas") {
                        url = `${item.url}`;
                      }

                      return (
                        <a
                          key={item.id || item.nombre}
                          className="dropdown-item"
                          href={url}
                          target={
                            sectionName === "propiedades_mas_vistas"
                              ? "_blank"
                              : "_self"
                          }
                          rel="noopener noreferrer"
                        >
                          {item.titulo || item.nombre}
                        </a>
                      );
                    })
                  ) : (
                    <span className="dropdown-item text-muted">Sin datos</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Si data es un array simple (por ejemplo, servicios)
  return (
    <div className="dropdown-menu mega-menu fade-up p-3 shadow">
      <div className="container">
        <div className="row">
          <div className="col-6 col-md-3">
            <h6 className="dropdown-header">SERVICIOS</h6>
            {data.map((item) => (
              <a
                key={item.nombre}
                className="dropdown-item"
                href={item.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.nombre}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
