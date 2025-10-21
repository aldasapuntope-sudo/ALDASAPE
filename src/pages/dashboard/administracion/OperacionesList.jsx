import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaCheck } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import config from "../../../config";
import Cargando from "../../../components/cargando";
import DataTableBase from "./componentes/DataTableBase";
import OperacionForm from "./componentes/OperacionForm";
import BreadcrumbALDASA from "../../../cuerpos_dashboard/BreadcrumbAldasa";

export default function OperacionesList() {
  const [operaciones, setOperaciones] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedOperacion, setSelectedOperacion] = useState(null);
  const [cargando, setCargando] = useState(false);

  // 🔹 Cargar operaciones
  const fetchOperaciones = async () => {
    setCargando(true);
    try {
      const res = await axios.get(`${config.apiUrl}api/administracion/loperaciones`);
      setOperaciones(res.data);
    } catch (error) {
      console.error("Error al cargar las operaciones:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchOperaciones();
  }, []);

  // 🔹 Abrir modal para agregar
  const handleAdd = () => {
    setSelectedOperacion(null);
    setShowForm(true);
  };

  // 🔹 Abrir modal para editar
  const handleEdit = (operacion) => {
    setSelectedOperacion(operacion);
    setShowForm(true);
  };

  // 🔹 Cambiar estado activo/inactivo
  const handleChangeStatus = async (id, newStatus) => {
    const confirm = await Swal.fire({
      title: newStatus ? "¿Activar operación?" : "¿Desactivar operación?",
      text: newStatus
        ? "La operación se activará nuevamente."
        : "La operación se desactivará y no estará disponible.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: newStatus ? "Sí, activar" : "Sí, desactivar",
      cancelButtonText: "Cancelar",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.put(`${config.apiUrl}api/administracion/eoperaciones/${id}/estado`, {
          is_active: newStatus,
        });
        fetchOperaciones();
        Swal.fire(
          "Actualizado",
          newStatus ? "La operación fue activada." : "La operación fue desactivada.",
          "success"
        );
      } catch (error) {
        Swal.fire("Error", "No se pudo actualizar el estado de la operación.", "error");
      }
    }
  };

  const handleCloseForm = (updated) => {
    setShowForm(false);
    if (updated) fetchOperaciones();
  };

  // ✅ Columnas del DataTable
  const columns = [
    { name: "#", selector: (row, i) => i + 1, width: "70px", center: true },
    { name: "Nombre", selector: (row) => row.nombre, sortable: true, center: true },
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

  // ✅ Acciones
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
        {/* Encabezado */}
        <BreadcrumbALDASA />
        <div className="d-flex justify-content-between align-items-center mb-3 mt-3">
          <h3 className="fw-bold"></h3>
          <button className="btn btn-primary" onClick={handleAdd}>
            <FaPlus className="me-2" /> Agregar nueva
          </button> 
        </div>

        {/* Tabla reutilizable */}
        <DataTableBase title="" columns={columns} data={operaciones} actions={actions} />

        {/* Modal del formulario */}
        {showForm && (
          <OperacionForm Operacion={selectedOperacion} onClose={handleCloseForm} />
        )}
      </div>
    </>
  );
}
