import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaCheck } from "react-icons/fa";
import axios from "axios";
import config from "../../../config";
import Swal from "sweetalert2";
import PlanForm from "./componentes/PlanForm";
import Cargando from "../../../components/cargando";
import DataTableBase from "./componentes/DataTableBase";
import BreadcrumbALDASA from "../../../cuerpos_dashboard/BreadcrumbAldasa";
import { useUsuario } from "../../../context/UserContext";
import SinPrivilegios from "../../../components/SinPrivilegios";

export default function PlanesList() {
  const { usuario } = useUsuario();
  const [planes, setPlanes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [cargando, setCargando] = useState(false);

  const fetchPlanes = async () => {
    setCargando(true);
    try {
      const res = await axios.get(`${config.apiUrl}api/administracion/lplanes`);
      setPlanes(res.data);
    } catch (error) {
      console.error("Error al cargar los planes:", error);
    } finally {
      setCargando(false);
    }
  };

  console.log(planes);

  useEffect(() => {
    fetchPlanes();
  }, []);

  if (!usuario) return null;
   const perfil = usuario.usuarioaldasa?.perfil_id;

  if (perfil !== 1) {
    return <SinPrivilegios />;
  }

  const handleAdd = () => {
    setSelectedPlan(null);
    setShowForm(true);
  };

  const handleEdit = (plan) => {
    setSelectedPlan(plan);
    setShowForm(true);
  };

  const handleChangeStatus = async (id, newStatus) => {
    const confirm = await Swal.fire({
      title: newStatus ? "¿Activar plan?" : "¿Desactivar plan?",
      text: newStatus
        ? "El plan se activará nuevamente."
        : "El plan se desactivará y no estará disponible.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: newStatus ? "Sí, activar" : "Sí, desactivar",
      cancelButtonText: "Cancelar",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.put(`${config.apiUrl}api/administracion/eplanes/${id}/estado`, {
          is_active: newStatus,
        });
        fetchPlanes();
        Swal.fire(
          "Actualizado",
          newStatus
            ? "El plan fue activado correctamente."
            : "El plan fue desactivado correctamente.",
          "success"
        );
      } catch (error) {
        Swal.fire("Error", "No se pudo actualizar el estado del plan.", "error");
      }
    }
  };

  const handleCloseForm = (updated) => {
    setShowForm(false);
    if (updated) fetchPlanes();
  };

  // ✅ Definimos columnas para el DataTable
  const columns = [
    {
      name: "#",
      selector: (row, i) => i + 1,
      width: "70px",
    },
    {
      name: "Nombre",
      selector: (row) => row.nombre,
      sortable: true,
    },
    {
      name: "Descripción",
      selector: (row) => row.descripcion,
      wrap: true,
    },
    {
      name: "Precio (S/)",
      selector: (row) => row.precio,
      sortable: true,
    },
    {
      name: "Duración (días)",
      selector: (row) => row.duracion_dias,
      sortable: true,
    },
    {
      name: "Estado",
      selector: (row) => (
        <span className={`badge ${row.is_active ? "bg-success" : "bg-secondary"}`}>
          {row.is_active ? "Activo" : "Inactivo"}
        </span>
      ),
    },
  ];

  // ✅ Acciones del DataTable
  const actions = (row) => (
    <>
      <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(row)}>
        <FaEdit />
      </button>
      {row.is_active ? (
        <button
          className="btn btn-sm btn-danger"
          onClick={() => handleChangeStatus(row.id, 0)}
        >
          <FaTrash />
        </button>
      ) : (
        <button
          className="btn btn-sm btn-success"
          onClick={() => handleChangeStatus(row.id, 1)}
        >
          <FaCheck />
        </button>
      )}
    </>
  );

  return (
    <>
      <Cargando visible={cargando} />
      <div className="container mt-4">
        {/* Encabezado */}
        <BreadcrumbALDASA />
        <div className="d-flex justify-content-between align-items-center mb-3 mt-3">
          <h4 class="mb-0 text-success fw-bold"></h4>
          <button className="btn btn-primary" onClick={handleAdd}>
            <FaPlus className="me-2" /> Agregar nuevo
          </button>
        </div>

        {/* ✅ Tabla reutilizable */}
        <DataTableBase title="" columns={columns} data={planes} actions={actions} />

        {/* ✅ Modal del formulario */}
        {showForm && <PlanForm plan={selectedPlan} onClose={handleCloseForm} />}
      </div>
    </>
  );
}
