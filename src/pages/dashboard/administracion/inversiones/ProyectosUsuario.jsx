// src/.../ProyectosUsuario.jsx
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

import { FaThLarge, FaList, FaEye, FaEdit, FaPlus, FaWhatsapp  } from "react-icons/fa"; // 👈 Se agregó FaPlus
import { Alert, Modal, Button } from "react-bootstrap";
import config from "../../../../config";
import ProyectoCardUsuario from "./componentes/ProyectoCardUsuario";
import { useUsuario } from "../../../../context/UserContext";
import BreadcrumbALDASA from "../../../../cuerpos_dashboard/BreadcrumbAldasa";
import Cargando from "../../../../components/cargando";
import { CardSkeleton2 } from "../../../../components/TablaSkeleton";
import NuevoProyecto from "./NuevoProyecto"; // ← IMPORTANTE
import EmptyState from "../../../../components/EmptyState";

export default function ProyectosUsuario() {
  const proyectosRef = useRef(null);
  const { usuario } = useUsuario();
  const [proyectos, setProyectos] = useState([]);
  const [permitidoID, setPermitidoID] = useState(null);
  const [cargando, setCargando] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [proyectoSel, setProyectoSel] = useState(null);
  const [dataInfo, setDataInfo] = useState(null);
  const [loadingInfo, setLoadingInfo] = useState(true);

  const esAdmin = usuario?.usuarioaldasa?.perfil_id === 1;

  useEffect(() => {
    cargarDatos();
    fetchInfo();
  }, []);

  

  const fetchInfo = async () => {
      try {
        const res = await axios.get(
          `${config.apiUrl}api/paginaprincipal/aldasainversiones`
        );
        setDataInfo(res.data[0]);
      } catch (error) {
        console.error("Error cargando información:", error);
      } finally {
        setLoadingInfo(false);
      }
    };



  const decodeHTML = (html) => {
    if (!html) return "";
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };
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
      {!loadingInfo && dataInfo && (
        <section className="about-wrap2 rounded-4 py-5 mt-5" style={{ background: "white" }}>
          <h2 className="text-center fw-bold mb-4" style={{ color: "var(--green)" }}>
            {dataInfo.titulo}
          </h2>
          

          <div
            className="container"
            dangerouslySetInnerHTML={{ __html: decodeHTML(dataInfo.contenido) }}
          />

          <div className="d-flex justify-content-center align-items-center gap-3 flex-wrap mt-4">
            <Button
              variant="success"
              className="fw-bold"
              onClick={() => {
                proyectosRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
            >
              Ver Proyectos
            </Button>

            <Button
              variant="success"
              className="fw-bold d-flex align-items-center gap-2"
              onClick={() =>
                window.open(
                  `https://wa.me/${dataInfo.meta_titulo}?text=Hola, deseo información sobre proyectos de inversión`,
                  "_blank"
                )
              }
            >
              <FaWhatsapp size={20} />
              Contactar a un asesor
            </Button>


          </div>

        
        </section>
      )}

      <div className="container pt-4">
        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-body p-4">

            {/* Título + Botón Nuevo */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="fw-bold">Proyectos</h3>

              {esAdmin && (
                <Button
                    variant="success"
                    size="sm"
                    className="fw-bold d-flex align-items-center"
                    onClick={handleNuevo}
                    >
                    <FaPlus className="me-2" /> Nuevo Proyecto
                    </Button>
                
              )}
            </div>

            {cargando ? (
              <>
                <Cargando visible={true} />
                <CardSkeleton2 cards={6} />
              </>
            ) : proyectos.length === 0 ? (
              <EmptyState
                image="/assets/images/empty-property.png"
                title="No hay proyectos disponibles"
                description="En este momento no contamos con proyectos disponibles. Pronto tendremos nuevas opciones para ti."
                
              />
              /*<Alert variant="info">No hay proyectos disponibles.</Alert>*/
            ) : (
              <div className="row mt-3" ref={proyectosRef}>
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
        size="xl"
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
