import React, { useEffect, useState } from "react";
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


const AnunciosList = ({ isPublish }) => {
  const { tienePlan, cargando2 } = useVerificarPlan();
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
      const res = await fetch(
        `${config.apiUrl}api/misanuncios/listar/${isPublish}/${usuario.usuarioaldasa.id}`
      );
      
      const data = await res.json();
      
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
        isPublish: a.is_active_publish,
        imagen: a.imagen_principal
          ? a.imagen_principal.replace(
              "C:/Users/ALDASA/Desktop/propiedades\\",
              `${config.apiUrl}propiedades/`
            )
          : "https://aldasa.pe/wp-content/themes/theme_aldasape/img/comprar-inmueble.jpg",

        caracteristicas: a.caracteristicas || [],
        caracteristicas_secundarios: a.amenities || [],
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

  if (!tienePlan) {
    Swal.fire({
      icon: "warning",
      title: "Plan requerido",
      text: "Debes adquirir un plan para poder publicar un anuncio.",
      confirmButtonText: "Ver planes",
    }).then(() => {
      window.location.href = "/planes";
    });
    return;
  }

  // Si tiene plan, abre el modal
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
        ) : (
          <span className="bg-warning text-dark px-2 py-1 rounded text-uppercase small d-flex align-items-center justify-content-center">
            <FaEye className="me-1" /> En revisión
          </span>
        ),
    },
    {
      name: "Acciones",
      center: true,
      cell: (row) => (
        <Button
          variant="outline-success"
          size="sm"
          onClick={() => handleEditar(row)}
        >
          <FaEdit />
        </Button>
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
                {isPublish === 1 ? "Anuncios Activos" : "Anuncios en Revisión"}
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
              <Alert variant="info" className="text-center py-4 rounded-3 shadow-sm">
                <p className="mb-0">
                  {isPublish === 1
                    ? "Actualmente no tienes anuncios activos."
                    : "No tienes anuncios en revisión por el momento."}
                </p>
              </Alert>
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
                      <Button
                        variant="outline-success"
                        size="sm"
                        className="position-absolute top-0 end-0 m-2 rounded-circle"
                        onClick={() => handleEditar(item)}
                      >
                        <FaEdit />
                      </Button>
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
