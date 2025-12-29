import { Link } from "react-router-dom";
import useTypingText from "../../../hooks/useTypingText";
import { BsPeopleFill, BsChatDotsFill, BsKeyFill } from "react-icons/bs";

export default function HeroVender() {
  const animatedWord = useTypingText(
    ["Vende", "Alquila", "Compra"],
    120,
    80,
    1200
  );

  return (
    <section className="container py-5">
      <div className="row align-items-center">
        {/* Texto */}
        <div className="col-lg-6">
          <h1 className="fw-bold mb-3">
            <span className="text-success">
              {animatedWord}
              <span className="cursor">|</span>
            </span>{" "}
            tu inmueble <br /> de forma rápida y sencilla
          </h1>

          <p className="text-muted mb-4">
            Te conectamos con las personas que buscan su próximo hogar.
          </p>

          <div className="d-flex gap-3">
        

            <Link to="/login" className="btn btn-success px-4">
              Publicar mi inmueble →
            </Link>
          </div>
        </div>

        {/* Ilustración */}
        <div className="col-lg-6 text-center">
          <img
            src="https://urbania.pe/ecommerce/images/Hero-Right-Urbania.png"
            alt="Vender inmueble"
            className="img-fluid"
          />
        </div>
      </div>

      {/* Métricas */}
        <div className="metrics-section mt-5 py-4">
        <div className="row text-center text-md-start">

            <div className="col-md-4 d-flex align-items-center gap-3 mb-3 mb-md-0">
            <div className="metric-icon">
                <BsPeopleFill />
            </div>
            <div>
                <h4 className="fw-bold mb-0">737 mil</h4>
                <p className="text-muted mb-0">
                personas ingresan por mes en busca de su hogar.
                </p>
            </div>
            </div>

            <div className="col-md-4 d-flex align-items-center gap-3 mb-3 mb-md-0">
            <div className="metric-icon">
                <BsChatDotsFill />
            </div>
            <div>
                <h4 className="fw-bold mb-0">17 mil</h4>
                <p className="text-muted mb-0">
                consultas mensuales reciben nuestros avisos.
                </p>
            </div>
            </div>

            <div className="col-md-4 d-flex align-items-center gap-3">
            <div className="metric-icon">
                <BsKeyFill />
            </div>
            <div>
                <h4 className="fw-bold mb-0">+ 1 mil</h4>
                <p className="text-muted mb-0">
                dueños alquilan y publican sus inmuebles.
                </p>
            </div>
            </div>

        </div>
        </div>

    </section>
  );
}
