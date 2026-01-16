import React from "react";

export default function EmptyState({
  image,
  title = "Sin resultados",
  description = "No se encontraron registros.",
  action,
}) {
  return (
    <div className="text-center py-1">
      {image && (
        <img
          src={image}
          alt="Sin resultados"
          style={{ maxWidth: "50%"}}
          className="mb-4"
        />
      )}

      <h4 className="fw-bold">{title}</h4>
      <p style={{textAlign: 'center'}} className="text-muted">{description}</p>

      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
