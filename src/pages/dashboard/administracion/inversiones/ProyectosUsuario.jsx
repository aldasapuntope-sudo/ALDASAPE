// src/.../ProyectosUsuario.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Alert, Modal } from "react-bootstrap";
import config from "../../../../config";
import ProyectoCardUsuario from "./componentes/ProyectoCardUsuario";
import { useUsuario } from "../../../../context/UserContext";
import BreadcrumbALDASA from "../../../../cuerpos_dashboard/BreadcrumbAldasa";
import Cargando from "../../../../components/cargando";
import { CardSkeleton2 } from "../../../../components/TablaSkeleton";
import NuevoProyecto from "./NuevoProyecto"; // ← IMPORTANTE

export default function ProyectosUsuario() {
  const { usuario } = useUsuario();
  const [proyectos, setProyectos] = useState([]);
  const [permitidoID, setPermitidoID] = useState(null);
  const [cargando, setCargando] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [proyectoSel, setProyectoSel] = useState(null);

  const esAdmin = usuario?.usuarioaldasa?.perfil_id === 1;

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const res = await axios.get(`${config.apiUrl}api/inversiones/mis-proyectos`);

      if (esAdmin) {
        setProyectos(res.data);
        setPermitidoID(null);
        return;
      }

      const asignacion = await axios.get(
        `${config.apiUrl}api/inversiones/mis-proyectos/${usuario.usuarioaldasa.id}`
      );

      const asignadoID = asignacion.data?.proyecto_id || null;

      const proyectosOrdenados = res.data.sort((a, b) => {
        if (a.id === asignadoID) return -1;
        if (b.id === asignadoID) return 1;
        return 0;
      });

      setProyectos(proyectosOrdenados);
      setPermitidoID(asignadoID);

    } catch (error) {
      console.log(error);
    } finally {
      setCargando(false);
    }
  };

  const handleNuevo = () => {
    setProyectoSel(null);
    setShowModal(true);
  };

  const handleEditar = (proyecto) => {
    setProyectoSel(proyecto);
    setShowModal(true);
  };

  
  return (
    <>
      <BreadcrumbALDASA />

      <div className="container pt-4">
        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-body p-4">

            {/* Título + Botón Nuevo */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="fw-bold">Proyectos</h3>

              {esAdmin && (
                <button className="btn btn-primary" onClick={handleNuevo}>
                  ➕ Nuevo Proyecto
                </button>
              )}
            </div>

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
                      proyecto={proy}   // ← Manda el OBJETO COMPLETO
                      activo={esAdmin || proy.id === permitidoID}
                      onEditar={handleEditar}
                      esAdmin={esAdmin}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
      >
        <NuevoProyecto
          proyectoId={proyectoSel}   // ← enviar ID real
          onClose={() => setShowModal(false)}
          onSuccess={cargarDatos}
        />
      </Modal>
    </>
  );
}
