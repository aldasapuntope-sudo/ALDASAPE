import { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";
import { useUsuario } from "../context/UserContext";

export default function useVerificarPlan(intervaloMs = 60000) {
  const { usuario } = useUsuario();

  const [planInfo, setPlanInfo] = useState({
    tienePlan: false,
    activo: false,
    anunciosDisponibles: 0,
    datos: null,
  });

  const [cargando, setCargando] = useState(true);

  const verificarPlan = async () => {

    // 🚫 SIN USUARIO
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

    // 👑 ADMIN → PLAN ILIMITADO
    if (usuario.usuarioaldasa.perfil_id === 1) {
      setPlanInfo({
        tienePlan: true,
        activo: true,
        anunciosDisponibles: Infinity, // 🔥 ilimitado
        datos: {
          nombre: "Administrador",
          is_admin: true,
        },
      });
      setCargando(false);
      return;
    }

    // 👤 USUARIO NORMAL → VALIDAR PLAN REAL
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
    verificarPlan();

    // 🔄 Intervalo SOLO para usuarios normales
    if (usuario?.usuarioaldasa?.perfil_id !== 1) {
      const intervalo = setInterval(verificarPlan, intervaloMs);
      return () => clearInterval(intervalo);
    }
  }, [usuario]);

  return {
    planInfo,
    cargando,
    refrescarPlan: verificarPlan,
  };
}
