import React, { useEffect, useState } from "react";
import axios from "axios";
import { Alert } from "react-bootstrap";
import config from "../../../../config";
import ProyectoCardUsuario from "./componentes/ProyectoCardUsuario";
import { useUsuario } from "../../../../context/UserContext";
import BreadcrumbALDASA from "../../../../cuerpos_dashboard/BreadcrumbAldasa";
import Cargando from "../../../../components/cargando";
import { CardSkeleton2 } from "../../../../components/TablaSkeleton";

export default function ProyectosUsuario() {
  const { usuario } = useUsuario();
  const [proyectos, setProyectos] = useState([]);
  const [permitidoID, setPermitidoID] = useState(null);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  
  const cargarDatos = async () => {
    setCargando(true);
    try {
        // 1️⃣ Traer todos los proyectos
        const res = await axios.get(`${config.apiUrl}api/inversiones/mis-proyectos`);
        
        // 2️⃣ Traer el proyecto permitido
        const asignacion = await axios.get(
        `${config.apiUrl}api/inversiones/mis-proyectos/${usuario.usuarioaldasa.id}`
        );

        const asignadoID = asignacion.data?.proyecto_id || null;

        // 3️⃣ Ordenar → Primero el permitido, luego los demás
        const proyectosOrdenados = res.data.sort((a, b) => {
        if (a.id === asignadoID) return -1;
        if (b.id === asignadoID) return 1;
        return 0;
        });

        // 4️⃣ Guardar ordenados
        setProyectos(proyectosOrdenados);
        setPermitidoID(asignadoID);

    } catch (error) {
        console.log(error);
    } finally {
        setCargando(false);
    }
    };


  return (
    <>
      {/* 🔹 Breadcrumb */}
      <BreadcrumbALDASA />

      <div className="container pt-4">
        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-body p-4">

            <h3 className="fw-bold text-success mb-4"></h3>

            {/* 🔹 Cargando */}
            {cargando ? (
              <>
                <Cargando visible={true} />
                <CardSkeleton2 cards={6} />
              </>
            ) : proyectos.length === 0 ? (
              <Alert variant="info">No hay proyectos disponibles.</Alert>
            ) : (
              <div className="row mt-3">
                {proyectos.map((proy) => (
                  <div className="col-md-4 mb-4" key={proy.id}>
                    <ProyectoCardUsuario
                      proyecto={proy}
                      activo={proy.id === permitidoID}
                    />
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}
