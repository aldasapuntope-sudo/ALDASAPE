import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaCheck } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import CaracteristicaForm from "./componentes/CaracteristicaForm";
import config from "../../../config";
import Cargando from "../../../components/cargando";
import DataTableBase from "./componentes/DataTableBase";
import BreadcrumbALDASA from "../../../cuerpos_dashboard/BreadcrumbAldasa";
import { useUsuario } from "../../../context/UserContext";
import SinPrivilegios from "../../../components/SinPrivilegios";

export default function CaracteristicaList() {
  const { usuario } = useUsuario();
  const [caracteristicas, setCaracteristicas] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [cargando, setCargando] = useState(false);

  const fetchCaracteristicas = async () => {
    setCargando(true);
    try {
      const res = await axios.get(`${config.apiUrl}api/administracion/lcaracteristicas`);
      setCaracteristicas(res.data);
    } catch (error) {
      console.error("Error al cargar características:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchCaracteristicas();
  }, []);

  if (!usuario) return null;
   const perfil = usuario.usuarioaldasa?.perfil_id;

  if (perfil !== 1) {
    return <SinPrivilegios />;
  }

  const handleAdd = () => {
    setSelectedItem(null);
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setShowForm(true);
  };

  const handleChangeStatus = async (id, newStatus) => {
    const confirm = await Swal.fire({
      title: newStatus ? "¿Activar Característica?" : "¿Desactivar Característica?",
      text: newStatus
        ? "La característica se activará nuevamente."
        : "La característica se desactivará.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: newStatus ? "Sí, activar" : "Sí, desactivar",
      cancelButtonText: "Cancelar",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.put(`${config.apiUrl}api/administracion/ecaracteristica/${id}/estado`, {
          is_active: newStatus,
        });
        fetchCaracteristicas();
        Swal.fire(
          "Actualizado",
          newStatus
            ? "La característica fue activada correctamente."
            : "La característica fue desactivada correctamente.",
          "success"
        );
      } catch (error) {
        Swal.fire("Error", "No se pudo actualizar el estado.", "error");
      }
    }
  };

  const handleCloseForm = (updated) => {
    setShowForm(false);
    if (updated) fetchCaracteristicas();
  };

  // ✅ Definición de columnas
  const columns = [
    {
      name: "#",
      selector: (row, i) => i + 1,
      width: "70px",
    },
    {
      name: "Icono",
      selector: (row) =>
        row.icono ? (
          <img
            src={`${config.urlserver}iconos/${row.icono}`}
            alt="icono"
            width="16"
            height="16"
          />
        ) : (
          <span>-</span>
        ),
      width: "90px",
    },
    {
      name: "Nombre",
      selector: (row) => row.nombre,
      sortable: true,
    },
    {
      name: "Unidad",
      selector: (row) => row.unidad,
    },
    {
      name: "Propiedad",
      selector: (row) => (
        
        <span className="badge bg-success" style={{background: 'var(--green) !important' }}>{row.propiedad_titulo}</span>
      ),
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

  // ✅ Acciones
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
        <BreadcrumbALDASA />
        <div className="d-flex justify-content-between align-items-center mb-3 mt-3">
          <h3 className="fw-bold"></h3>
          <button className="btn btn-primary" onClick={handleAdd}>
            <FaPlus className="me-2" /> Agregar nuevo
          </button>
        </div>

        <DataTableBase title="" columns={columns} data={caracteristicas} actions={actions} />

        {showForm && (
          <CaracteristicaForm Caracteristica={selectedItem} onClose={handleCloseForm} />
        )}
      </div>
    </>
  );
}
