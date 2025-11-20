import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaCheck } from "react-icons/fa";
import axios from "axios";
import config from "../../../config";
import Swal from "sweetalert2";
import DataTableBase from "./componentes/DataTableBase";
import Cargando from "../../../components/cargando";
import BreadcrumbALDASA from "../../../cuerpos_dashboard/BreadcrumbAldasa";
import UbicacionForm from "./componentes/UbicacionForm";
import SinPrivilegios from "../../../components/SinPrivilegios";
import { useUsuario } from "../../../context/UserContext";

export default function UbicacionesList() {
  const { usuario } = useUsuario();
  const [data, setData] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(null);

  // 🔹 Cargar ubicaciones
  const fetchData = async () => {
    setCargando(true);
    try {
      const res = await axios.get(`${config.apiUrl}api/administracion/lubicaciones`);
      setData(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudieron cargar las ubicaciones", "error");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!usuario) return null;
   const perfil = usuario.usuarioaldasa?.perfil_id;

  if (perfil !== 1) {
    return <SinPrivilegios />;
  }

  const handleAdd = () => {
    setSelected(null);
    setShowForm(true);
  };

  const handleEdit = (row) => {
    setSelected(row);
    setShowForm(true);
  };

  const handleDelete = (row) => {
    Swal.fire({
        title: row.is_active
        ? "¿Desactivar ubicación?"
        : "¿Activar ubicación?",
        text: "Puedes volver a cambiar su estado cuando quieras.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, continuar",
        cancelButtonText: "Cancelar",
    }).then(async (result) => {
        if (result.isConfirmed) {
        try {
            const newStatus = !row.is_active;

            await axios.put(`${config.apiUrl}api/administracion/eubicaciones/${row.id}/estado`, {
            is_active: newStatus,
            });

            Swal.fire(
            "Actualizado",
            newStatus
                ? "La ubicación fue activada correctamente."
                : "La ubicación fue desactivada correctamente.",
            "success"
            );
            fetchData();
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "No se pudo actualizar el estado de la ubicación.", "error");
        }
        }
    });
    };


  const handleCloseForm = (updated) => {
    setShowForm(false);
    if (updated) fetchData();
  };

  const columns = [
    { name: "#", selector: (r, i) => i + 1, width: "60px" },
    { name: "Nombre", selector: (r) => r.nombre, sortable: true },
    {
      name: "Estado",
      selector: (r) => (
        <span className={`badge ${r.is_active ? "bg-success" : "bg-secondary"}`}>
          {r.is_active ? "Activo" : "Inactivo"}
        </span>
      ),
    },
  ];

  const actions = (row) => (
    <>
        <button
        className="btn btn-sm btn-warning me-2"
        onClick={() => handleEdit(row)}
        title="Editar ubicación"
        >
        <FaEdit />
        </button>

        {row.is_active ? (
        <button
            className="btn btn-sm btn-danger"
            onClick={() => handleDelete(row)}
            title="Desactivar ubicación"
        >
            <FaTrash />
        </button>
        ) : (
        <button
            className="btn btn-sm btn-success"
            onClick={() => handleDelete(row)}
            title="Activar ubicación"
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
        <BreadcrumbALDASA />
        <div className="d-flex justify-content-between align-items-center mb-3 mt-3">
          <h4 className="text-success fw-bold"></h4>
          <button className="btn btn-primary" onClick={handleAdd}>
            <FaPlus className="me-2" /> Nueva ubicación
          </button>
        </div>
        <DataTableBase title="" columns={columns} data={data} actions={actions} />
        {showForm && <UbicacionForm ubicacion={selected} onClose={handleCloseForm} />}
      </div>
    </>
  );
}
