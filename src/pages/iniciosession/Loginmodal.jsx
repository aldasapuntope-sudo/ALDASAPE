import React, { useEffect } from "react";
import "../../css/Login.css";
import BotonGoogle from "./componentes/LoginBotonGoogle";
import Formulario from "./componentes/LoginForm";
import BotonFacebook from "./componentes/BotonFacebook";
import BotonGooglemodal from "./componentes/LoginBotonGooglemodal";

export default function LoginModal({ show, onClose, setUsuario  }) {
  useEffect(() => {
    if (show) document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, [show]);

  if (!show) return null;
  
  return (
    <div
      className="modal fade show d-block"
      style={{
        background: "rgba(0,0,0,.6)",
        zIndex: 99999,
      }}
    >
      <div className="modal-dialog modal-dialog-centered modal-md">
        <div className="modal-content rounded-4 shadow-lg">

          <div className="modal-header">
            <h5 className="modal-title text-success fw-bold">
              Iniciar sesión
            </h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            <Formulario />

            <div className="my-3 text-center text-muted">o</div>

            <BotonGooglemodal setUsuario={setUsuario} />
            <div className="my-1 text-center text-muted">o</div>
            <BotonFacebook />

            <div className="text-center mt-3">
              <small>¿No tienes una cuenta?</small>
              <br />
              <a href="/registro" className="text-success fw-semibold">
                Regístrate
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
