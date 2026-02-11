export default function PlanesPublicacion({ onContactar }) {
  const planes = [
    { nombre: "Super Destacado", color: "success" },
    { nombre: "Destacado", color: "primary" },
    { nombre: "Simple", color: "secondary" },
  ];

  return (
    <section className="container py-5">
      <h2 className="fw-bold text-center mb-5">
        Nuestros planes de publicación
      </h2>

      <div className="row">
        {planes.map((p, i) => (
          <div key={i} className="col-md-4 mb-4">
            <div className="card shadow-sm h-100 text-center">
              <div className={`card-header bg-${p.color} text-white`}>
                {p.nombre}
              </div>

              <div className="card-body">
                <p className="text-muted">
                  Descripción del plan
                </p>

                <button
                  className="btn btn-outline-success"
                  onClick={onContactar}
                >
                  Quiero saber más
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
