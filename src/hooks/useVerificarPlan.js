// src/hooks/useVerificarPlan.js
import { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";
import { useUsuario } from "../context/UserContext";

export default function useVerificarPlan() {
  const { usuario } = useUsuario();
  const [tienePlan, setTienePlan] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const verificarPlan = async () => {
      if (!usuario?.usuarioaldasa?.id) {
        setTienePlan(false);
        setCargando(false);
        return;
      }

      try {
        const res = await axios.get(
          `${config.apiUrl}api/planes/usuario/${usuario.usuarioaldasa.id}`
        );
        setTienePlan(res.data.tiene_plan || false);
      } catch (error) {
        console.error("Error verificando plan:", error);
        setTienePlan(false);
      } finally {
        setCargando(false);
      }
    };

    verificarPlan();
  }, [usuario]);

  return { tienePlan, cargando };
}
