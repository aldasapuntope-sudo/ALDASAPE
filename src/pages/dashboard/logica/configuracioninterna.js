import { useNavigate } from "react-router-dom";
import { useUsuario } from "../../../context/UserContext";
import useVerificarPlan from "../../../hooks/useVerificarPlan";
import { useEffect } from "react";
import Swal from "sweetalert2";

export function RutaProtegidaPlan({ children }) {
  const { usuario } = useUsuario();
  const navigate = useNavigate();
  const { tienePlan, cargando } = useVerificarPlan();

  useEffect(() => {
    if (!usuario) {
      navigate("/login");
    }
  }, [usuario, navigate]);

  if (cargando) {
    return <div className="text-center mt-5">Verificando plan...</div>;
  }

  if (!tienePlan) {
    Swal.fire({
      icon: "warning",
      title: "Plan requerido",
      text: "Debes adquirir un plan para poder publicar un anuncio.",
      confirmButtonText: "Ver planes",
    }).then(() => {
      navigate("/planes");
    });
    return null;
  }

  return children;
}
