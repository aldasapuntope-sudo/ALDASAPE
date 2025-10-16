// src/hooks/useVerificarPlan.js
import { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";
import { useUsuario } from "../context/UserContext";

export default function useVerificarPlan(intervaloMs = 60000) {
  // 👆 parámetro: tiempo de actualización (default 1 min)

  const { usuario } = useUsuario();
  const [planInfo, setPlanInfo] = useState({
    tienePlan: false,
    activo: false,
    anunciosDisponibles: 0,
    datos: null,
  });
  const [cargando, setCargando] = useState(true);

  const verificarPlan = async () => {
    if (!usuario?.usuarioaldasa?.id) {
      setPlanInfo({
        tienePlan: false,
        activo: false,
        anunciosDisponibles: 0,
        datos: null,
      });
      setCargando(false);
      return;
    }

    try {
      const res = await axios.get(
        `${config.apiUrl}api/planes/usuario/${usuario.usuarioaldasa.id}`
      );

      const data = res.data.original || res.data;
      const tienePlan = data?.tiene_plan || false;
      const plan = data?.plan || null;

      if (tienePlan && plan) {
        const hoy = new Date();
        const fechaFin = new Date(plan.fecha_fin);
        const activo = fechaFin >= hoy && plan.is_active === 1;

        setPlanInfo({
          tienePlan: true,
          activo,
          anunciosDisponibles: plan.anuncios_disponibles || 0,
          datos: plan,
        });
      } else {
        setPlanInfo({
          tienePlan: false,
          activo: false,
          anunciosDisponibles: 0,
          datos: null,
        });
      }
    } catch (error) {
      console.error("Error verificando plan:", error);
      setPlanInfo({
        tienePlan: false,
        activo: false,
        anunciosDisponibles: 0,
        datos: null,
      });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    verificarPlan(); // 🔹 Llamada inicial

    // 🔄 Verifica automáticamente cada "intervaloMs" milisegundos
    const intervalo = setInterval(verificarPlan, intervaloMs);

    return () => clearInterval(intervalo); // 🧹 Limpia el intervalo al desmontar
  }, [usuario]);

  return { planInfo, cargando, refrescarPlan: verificarPlan };
}
