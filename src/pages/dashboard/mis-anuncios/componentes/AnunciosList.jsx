import React, { useEffect, useState } from "react";
import axios from "axios"; 
import DataTable from "react-data-table-component";
import { Card, Button, Alert, Modal } from "react-bootstrap";
import { FaThLarge, FaList, FaEye, FaEdit, FaPlus } from "react-icons/fa"; // 👈 Se agregó FaPlus
import config from "../../../../config";
import { useUsuario } from "../../../../context/UserContext";
import Cargando from "../../../../components/cargando";
import AnuncioCard from "./AnuncioCard";
import BreadcrumbALDASA from "../../../../cuerpos_dashboard/BreadcrumbAldasa";
import NuevoAnuncio from "../nuevo-anuncio";
import { CardSkeleton } from "../../../../components/TablaSkeleton";
import useVerificarPlan from "../../../../hooks/useVerificarPlan";
import Swal from "sweetalert2";
import EmptyState from "../../../../components/EmptyState";


const AnunciosList = ({ isPublish }) => {
  const { planInfo, cargando2 } = useVerificarPlan();
  const [anuncios, setAnuncios] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [view, setView] = useState("cards");
  const [showModal, setShowModal] = useState(false);
  const [anuncioSeleccionado, setAnuncioSeleccionado] = useState(null);
  const { usuario } = useUsuario();
  
  useEffect(() => {
    cargarDatos();
  }, [isPublish]);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const userId = usuario.usuarioaldasa.perfil_id === 1
      ? 0   // 👑 ADMIN → ve todo
      : usuario.usuarioaldasa.id;

      
      const res = await axios.get(
        `${config.apiUrl}api/misanuncios/listar/${isPublish}/${userId}`
      );

      // Axios ya convierte la respuesta a JSON automáticamente
      const data = res.data;
      
      const anunciosAdaptados = (Array.isArray(data) ? data : data.data || []).map((a) => ({
        id: a.id,
        titulo: a.titulo,
        tipo_id: `${a.id_tipopropiedad}`,
        tipo: `${a.tipo_propiedad}`,
        operacion_id: `${a.id_operacion}`,
        operacion: `${a.operaciones}`,
        ubicacion_id: `${a.id_ubicacion}`,
        ubicacion: `${a.ubicacion}`,
        descripcion: `${a.descripcion}`,
        area: a.area,
        banos: a.banos,
        dormitorios: a.dormitorios,
        precio: a.precio,
        simbolo: a.moneda_simbolo,
        moneda_id: a.moneda_id,
        direccion: a.direccion,
        isPublish: a.is_active_publish,
        imagen: a.imagen_principal
          ? a.imagen_principal.replace(
              "C:/Users/ALDASA/Desktop/propiedades\\",
              `${config.apiUrl}propiedades/`
            )
          : "https://aldasa.pe/wp-content/themes/theme_aldasape/img/comprar-inmueble.jpg",

        caracteristicas: a.caracteristicas || [],
        caracteristicas_secundarios: a.amenities || [],
        videos: a.videos || [],
      }));

      setAnuncios(anunciosAdaptados);
    } catch (error) {
      console.error("Error al cargar anuncios:", error);
    } finally {
      setCargando(false);
    }
  };

  const handleEditar = (anuncio) => {
    setAnuncioSeleccionado(anuncio);
    setShowModal(true);
  };

  const handleNuevo = () => {
    if (cargando) {
      return Swal.fire({
        icon: "info",
        title: "Verificando...",
        text: "Por favor espera mientras verificamos tu plan.",
      });
    }

    if (!planInfo.tienePlan || !planInfo.activo) {
      Swal.fire({
        icon: "warning",
        title: "Plan requerido",
        text: "Debes adquirir o renovar tu plan para poder publicar un anuncio.",
        confirmButtonText: "Ver planes",
      }).then(() => {
        window.location.href = "/planes";
      });
      return;
    }

    if (planInfo.anunciosDisponibles <= 0) {
      Swal.fire({
        icon: "info",
        title: "Límite alcanzado",
        text: "Ya has publicado todos tus anuncios disponibles. Amplía tu plan o renueva para continuar.",
        confirmButtonText: "Ver planes",
      }).then(() => {
        window.location.href = "/planes";
      });
      return;
    }

    // ✅ Si todo está bien, abre el modal
    setAnuncioSeleccionado(null);
    setShowModal(true);
  };



  const columns = [
    { name: "Título", selector: (row) => row.titulo, sortable: true },
    { name: "Tipo", selector: (row) => row.tipo, sortable: true },
    { name: "Operación", selector: (row) => row.operacion, sortable: true },
    { name: "Precio", selector: (row) => `S/ ${row.precio}`, sortable: true },
    { name: "Ubicación", selector: (row) => row.ubicacion },
    {
      name: "Estado",
      cell: (row) =>
        row.isPublish === 1 ? (
          <span className="bg-success text-light px-2 py-1 rounded text-uppercase small d-flex align-items-center justify-content-center">
            <FaEye className="me-1" /> En circulación
          </span>
        ) : row.isPublish === 0 ? (
          <span className="bg-warning text-dark px-2 py-1 rounded text-uppercase small d-flex align-items-center justify-content-center">
            <FaEye className="me-1" /> En revisión
          </span>
        ) : (
          <span className="bg-primary text-light px-2 py-1 rounded text-uppercase small d-flex align-items-center justify-content-center" style={{background: 'var(--green) !important'}}>
            <FaEye className="me-1" /> Vendido
          </span>
        ),
    },

    {
      name: "Acciones",
      center: true,
      cell: (row) =>
        row.isPublish !== 2 ? (
          <Button
            variant="outline-success"
            size="sm"
            onClick={() => handleEditar(row)}
          >
            <FaEdit />
          </Button>
        ) : (
          <span className="text-muted small">—</span> // opcional, puedes dejarlo vacío
        ),
    },

  ];

  const customStyles = {
    headCells: {
      style: {
        justifyContent: "center",
        textAlign: "center",
        fontWeight: "600",
      },
    },
    cells: {
      style: {
        textAlign: "center",
        justifyContent: "center",
      },
    },
  };

  return (
    <>
      <BreadcrumbALDASA />

      <div className="container pt-4">
        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-body p-4">
            {/* 🔹 Encabezado */}
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
              <h4 className="mb-0 text-success fw-bold">
                {isPublish === 1
                  ? "Anuncios Activos"
                  : isPublish === 0
                  ? "Anuncios en Revisión"
                  : "Anuncios Vendidos"}

              </h4>
              
              <div className="d-flex gap-2">
                {/* 🔸 Botón nuevo anuncio */}
                <Button
                  variant="success"
                  size="sm"
                  className="fw-bold d-flex align-items-center"
                  onClick={handleNuevo}
                >
                  <FaPlus className="me-2" /> Nuevo anuncio
                </Button>

                {/* 🔸 Botones de vista */}
                <Button
                  variant={view === "cards" ? "primary" : "outline-primary"}
                  size="sm"
                  onClick={() => setView("cards")}
                >
                  <FaThLarge />
                </Button>
                <Button
                  variant={view === "list" ? "primary" : "outline-primary"}
                  size="sm"
                  onClick={() => setView("list")}
                >
                  <FaList />
                </Button>
              </div>
            </div>

            {/* 🔹 Cuerpo principal */}
            {cargando ? (
              <>
                <Cargando visible={cargando} />
                <CardSkeleton cards={6} />
              </>
            ) : anuncios.length === 0 ? (
              <EmptyState
                image="/assets/images/empty-property.png"
                title={
                  isPublish === 1
                    ? "No tienes anuncios activos"
                    : isPublish === 0
                      ? "No tienes anuncios en revisión"
                      : "No tienes anuncios vendidos"
                }
                description={
                  isPublish === 1
                    ? "Actualmente no cuentas con anuncios activos. Publica uno nuevo para empezar a recibir contactos."
                    : isPublish === 0
                      ? "En este momento no tienes anuncios en revisión. Cuando envíes uno, lo evaluaremos rápidamente."
                      : "Aún no tienes anuncios vendidos. Sigue publicando y pronto llegarán los resultados."
                }
              />

              /*<Alert variant="info" className="text-center py-4 rounded-3 shadow-sm">
                <p className="mb-0">
                  {isPublish === 1
                    ? "Actualmente no tienes anuncios activos."
                    : isPublish === 0
                      ? "No tienes anuncios en revisión por el momento."
                      : "No tienes anuncios vendidos por el momento."}
                </p>
              </Alert> */

              
            ) : view === "list" ? (
              <DataTable
                columns={columns}
                data={anuncios}
                pagination
                highlightOnHover
                responsive
                noDataComponent="No hay datos disponibles"
                customStyles={customStyles}
              />
            ) : (
              <div className="row">
                {anuncios.map((item) => (
                  <div className="col-md-4 mb-4" key={item.id}>
                    <div className="position-relative">
                      <AnuncioCard anuncio={item} />
                     {item.isPublish !== 2 && (
                      <Button
                        variant="outline-success"
                        size="sm"
                        className="position-absolute top-0 end-0 m-2 rounded-circle boton-editar-card"
                        onClick={() => handleEditar(item)}
                      >
                        <FaEdit />
                      </Button>
                    )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 🔹 Modal para crear o editar anuncio */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold text-success">
            <img
              alt="Logo UNJ"
              className="logounj mb-3"
              src="assets/images/logo-aldasape-color.png"
              style={{ background: "#ffffff", width: "13%", padding: "4px 15px", borderRadius: "5px" }}
            />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <NuevoAnuncio
            anuncio={anuncioSeleccionado}
            onClose={() => setShowModal(false)}
            onRefresh={cargarDatos}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AnunciosList;
