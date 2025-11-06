import React from "react";

export default function MegaDropdown({ data, mode }) {
  if (!data) return null;

  // Si data es un objeto con secciones
  if (!Array.isArray(data)) {
    const sections = Object.entries(data);

    return (
      <div className="dropdown-menu mega-menu fade-up p-3 shadow">
        <div className="container">
          <div className="row">
            {sections.map(([sectionName, items]) => {
              // Determinar el título
              let title =
                sectionName === "tipo"
                  ? "TIPO DE PROPIEDADES"
                  : sectionName.replace(/_/g, " ").toUpperCase();

              return (
                <div key={sectionName} className="col-6 col-md-3">
                  <h6 className="dropdown-header">{title}</h6>

                  {Array.isArray(items) && items.length > 0 ? (
                    items.map((item) => {
                      // 👇 Parametro y valor correctos
                      let paramName = "";
                      let paramValue = "";

                      if (sectionName === "tipo") {
                        paramName = "tipo";
                        paramValue = item.id; // ✅ usar ID
                      } else if (sectionName === "ciudad") {
                        paramName = "ciudad";
                        paramValue = encodeURIComponent(item.nombre); // ✅ usar nombre
                      } else {
                        paramName = sectionName;
                        paramValue = encodeURIComponent(item.nombre);
                      }

                      const url = `/buscar?${paramName}=${paramValue}${
                        mode ? `&mode=${mode}` : ""
                      }`;

                      return (
                        <a
                          key={item.id || item.nombre}
                          className="dropdown-item"
                          href={url}
                        >
                          {item.nombre}
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
