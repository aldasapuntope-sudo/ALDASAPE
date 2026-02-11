export default function HeroConstructora({ onContactar }) {
  return (
    <section className="container py-5">
      <div className="row align-items-center">
        <div className="col-lg-6">
          <h1 className="fw-bold mb-3">
            Proyectos <span className="text-success">inmobiliarios</span>
          </h1>

          <p className="text-muted mb-4">
            Anuncia tus proyectos en el portal líder del Perú.
          </p>

          <button
            className="btn btn-success px-4"
            onClick={onContactar}
          >
            Contactar a un ejecutivo
          </button>
        </div>

        <div className="col-lg-6 text-center">
          <img
            src="https://urbania.pe/ecommerce/images/Hero-Right-Urbania.png"
            className="img-fluid"
            alt="Proyectos inmobiliarios"
          />
        </div>
      </div>
    </section>
  );
}
