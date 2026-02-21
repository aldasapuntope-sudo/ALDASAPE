import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../css/cookies.css";

export default function CookiesBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const aceptadas = localStorage.getItem("cookiesAceptadas");
    if (!aceptadas) setVisible(true);
  }, []);

  const aceptar = () => {
    localStorage.setItem("cookiesAceptadas", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-container">
      <div className="cookie-box">
        <div className="cookie-text">
          <h4>Este sitio utiliza cookies</h4>
          <p>
            Las cookies son importantes para el funcionamiento de este sitio web,
            para garantizar tu seguridad y mejorar tu experiencia. Al hacer clic
            en OK, aceptas su uso. Más información en nuestra{" "}
            <Link to="/terminos-condiciones" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Política de cookies</Link> y{" "}
            <Link to="/politicas-de-privacidad" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Política de privacidad</Link>.
          </p>
        </div>

        <button className="cookie-btn" onClick={aceptar}>
          OK
        </button>
      </div>
    </div>
  );
}
