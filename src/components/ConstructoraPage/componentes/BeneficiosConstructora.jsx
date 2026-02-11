import { BsGraphUp, BsPeople, BsLightning } from "react-icons/bs";

export default function BeneficiosConstructora() {
  return (
    <section className="container py-5">
      <h2 className="fw-bold text-center mb-5">
        ¿Por qué elegir Urbania?
      </h2>

      <div className="row">
        <div className="col-md-4 d-flex gap-3 mb-4">
          <BsGraphUp size={30} className="text-success" />
          <div>
            <h6 className="fw-bold">Mayor tráfico del Perú</h6>
            <p className="text-muted mb-0">
              Más de 2 millones de visitas mensuales.
            </p>
          </div>
        </div>

        <div className="col-md-4 d-flex gap-3 mb-4">
          <BsPeople size={30} className="text-success" />
          <div>
            <h6 className="fw-bold">Prospectos calificados</h6>
            <p className="text-muted mb-0">
              Personas listas para comprar o alquilar.
            </p>
          </div>
        </div>

        <div className="col-md-4 d-flex gap-3 mb-4">
          <BsLightning size={30} className="text-success" />
          <div>
            <h6 className="fw-bold">Tecnología e innovación</h6>
            <p className="text-muted mb-0">
              Herramientas modernas de publicación.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
