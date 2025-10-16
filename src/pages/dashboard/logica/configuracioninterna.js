import { useNavigate } from "react-router-dom";
import { useUsuario } from "../../../context/UserContext";
import useVerificarPlan from "../../../hooks/useVerificarPlan";
import { useEffect } from "react";
import Swal from "sweetalert2";
import Cargando from "../../../components/cargando";

export function RutaProtegidaPlan({ children }) {
  const { usuario } = useUsuario();
  const navigate = useNavigate();
  const { planInfo, cargando } = useVerificarPlan();

  useEffect(() => {
    if (!usuario) {
      navigate("/login");
    }
  }, [usuario, navigate]);

  if (cargando) {
    return <Cargando visible={true} />;
  }

  // Si no tiene plan
  if (!planInfo.tienePlan) {
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

  // Si el plan está vencido
  if (!planInfo.activo) {
    Swal.fire({
      icon: "info",
      title: "Plan vencido",
      text: "Tu plan ha expirado. Por favor, renueva tu plan para continuar publicando.",
      confirmButtonText: "Ver planes",
    }).then(() => {
      navigate("/planes");
    });
    return null;
  }

  // Si ya no tiene anuncios disponibles
  if (planInfo.anunciosDisponibles <= 0) {
    Swal.fire({
      icon: "info",
      title: "Límite de anuncios alcanzado",
      text: "Ya usaste todos tus anuncios disponibles. Amplía tu plan para publicar más.",
      confirmButtonText: "Ver planes",
    }).then(() => {
      navigate("/planes");
    });
    return null;
  }

  // ✅ Si todo está OK, renderiza el contenido protegido
  return children;
}
