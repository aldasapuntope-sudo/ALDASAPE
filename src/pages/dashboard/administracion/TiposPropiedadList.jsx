import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaCheck } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import config from "../../../config";
import Cargando from "../../../components/cargando";
import DataTableBase from "./componentes/DataTableBase";
import TiposPropiedadForm from "./componentes/TiposPropiedadForm";
import BreadcrumbALDASA from "../../../cuerpos_dashboard/BreadcrumbAldasa";

export default function TiposPropiedadList() {
  const [tipos, setTipos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedTipo, setSelectedTipo] = useState(null);
  const [cargando, setCargando] = useState(false);

  const fetchTipos = async () => {
    setCargando(true);
    try {
      const res = await axios.get(`${config.apiUrl}api/administracion/ltipospropiedad`);
      setTipos(res.data);
    } catch (error) {
      console.error("Error al cargar tipos de propiedad:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchTipos();
  }, []);

  const handleAdd = () => {
    setSelectedTipo(null);
    setShowForm(true);
  };

  const handleEdit = (tipo) => {
    setSelectedTipo(tipo);
    setShowForm(true);
  };

  const handleChangeStatus = async (id, newStatus) => {
    const confirm = await Swal.fire({
      title: newStatus ? "¿Activar Tipo de Propiedad?" : "¿Desactivar Tipo de Propiedad?",
      text: newStatus
        ? "El tipo de propiedad se activará nuevamente."
        : "El tipo de propiedad se desactivará y no estará disponible.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: newStatus ? "Sí, activar" : "Sí, desactivar",
      cancelButtonText: "Cancelar",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.put(`${config.apiUrl}api/administracion/etipospropiedad/${id}/estado`, {
          is_active: newStatus,
        });
        fetchTipos();
        Swal.fire(
          "Actualizado",
          newStatus
            ? "El tipo de propiedad fue activado correctamente."
            : "El tipo de propiedad fue desactivado correctamente.",
          "success"
        );
      } catch (error) {
        Swal.fire("Error", "No se pudo actualizar el estado del tipo de propiedad.", "error");
      }
    }
  };

  const handleCloseForm = (updated) => {
    setShowForm(false);
    if (updated) fetchTipos();
  };

  // Columnas del DataTable
  const columns = [
    {
      name: "#",
      selector: (row, i) => i + 1,
      width: "70px",
      center: true,
    },
    {
      name: "Nombre",
      selector: (row) => row.nombre,
      sortable: true,
      center: true,
    },
    {
      name: "Estado",
      selector: (row) => (
        <span className={`badge ${row.is_active ? "bg-success" : "bg-secondary"}`}>
          {row.is_active ? "Activo" : "Inactivo"}
        </span>
      ),
      center: true,
    },
  ];

  // Acciones
  const actions = (row) => (
    <div className="text-center">
      <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(row)}>
        <FaEdit />
      </button>
      {row.is_active ? (
        <button className="btn btn-sm btn-danger" onClick={() => handleChangeStatus(row.id, 0)}>
          <FaTrash />
        </button>
      ) : (
        <button className="btn btn-sm btn-success" onClick={() => handleChangeStatus(row.id, 1)}>
          <FaCheck />
        </button>
      )}
    </div>
  );

  return (
    <>
      <Cargando visible={cargando} />
      <div className="container mt-4">
        {/* Header */}
        <BreadcrumbALDASA />
        <div className="d-flex justify-content-between align-items-center mb-3 mt-3">
          <h3 className="fw-bold"></h3>
          <button className="btn btn-primary" onClick={handleAdd}>
            <FaPlus className="me-2" /> Agregar nuevo
          </button>
        </div>

        {/* Tabla */}
        <DataTableBase title="" columns={columns} data={tipos} actions={actions} />

        {/* Modal */}
        {showForm && (
          <TiposPropiedadForm tipo={selectedTipo} onClose={handleCloseForm} />
        )}
      </div>
    </>
  );
}
