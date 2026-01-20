import React from "react";

export default function MegaDropdown({ data, mode, isMobile, isOpen }) {
  if (!data || (isMobile && !isOpen)) return null;

  if (isMobile) {
    /* =========================
       MOBILE
    ========================== */

    // DATA COMO OBJETO (mega menu)
    if (!Array.isArray(data)) {
      const sections = Object.entries(data).filter(
        ([_, items]) => Array.isArray(items) && items.length > 0
      );

      if (sections.length === 0) return null;

      return (
        <ul className={`dropdown-menu p-2 ${isOpen ? "show" : ""}`}>
          {sections.map(([sectionName, items]) => {
            const title =
              sectionName === "tipo"
                ? "TIPO DE PROPIEDADES"
                : sectionName.replace(/_/g, " ").toUpperCase();

            return (
              <li key={sectionName}>
                <h6 className="dropdown-header">{title}</h6>

                {items.map((item) => {
                  let url = "#";

                  if (sectionName === "tipo") {
                    url = `/buscar?tipo=${item.id}${mode ? `&mode=${mode}` : ""}`;
                  } else if (sectionName === "ciudad") {
                    url = `/buscar?ciudad=${encodeURIComponent(item.nombre)}${mode ? `&mode=${mode}` : ""}`;
                  } else {
                    url = item.url;
                  }

                  return (
                    <a
                      key={item.id || item.nombre}
                      className="dropdown-item"
                      href={url}
                      target={sectionName === "propiedades_mas_vistas" ? "_blank" : "_self"}
                      rel="noopener noreferrer"
                    >
                      {item.titulo || item.nombre.toUpperCase()}
                    </a>
                  );
                })}
              </li>
            );
          })}
        </ul>
      );
    }

    // DATA COMO ARRAY (servicios)
    if (data.length === 0) return null;

    return (
      <ul className={`dropdown-menu p-2 ${isOpen ? "show" : ""}`}>
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
      </ul>
    );
  }

  /* =========================
     DESKTOP
  ========================== */

  // DATA COMO OBJETO (mega menu)
  if (!Array.isArray(data)) {
    const sections = Object.entries(data).filter(
      ([_, items]) => Array.isArray(items) && items.length > 0
    );

    if (sections.length === 0) return null;

    return (
      <div className="dropdown-menu mega-menu fade-up p-3 shadow">
        <div className="container">
          <div className="row">
            {sections.map(([sectionName, items]) => {
              const title =
                sectionName === "tipo"
                  ? "TIPO DE PROPIEDADES"
                  : sectionName.replace(/_/g, " ").toUpperCase();

              return (
                <div key={sectionName} className="col-6 col-md-3">
                  <h6 className="dropdown-header">{title}</h6>

                  {items.map((item) => {
                    let url = "#";

                    if (sectionName === "tipo") {
                      url = `/buscar?tipo=${item.id}${mode ? `&mode=${mode}` : ""}`;
                    } else if (sectionName === "ciudad") {
                      url = `/buscar?ciudad=${encodeURIComponent(item.nombre)}${mode ? `&mode=${mode}` : ""}`;
                    } else {
                      url = item.url;
                    }

                    return (
                      <a
                        key={item.id || item.nombre}
                        className="dropdown-item"
                        href={url}
                        target={sectionName === "propiedades_mas_vistas" ? "_blank" : "_self"}
                        rel="noopener noreferrer"
                      >
                        {item.titulo || item.nombre}
                      </a>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // DATA COMO ARRAY (servicios)
  if (data.length === 0) return null;

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
