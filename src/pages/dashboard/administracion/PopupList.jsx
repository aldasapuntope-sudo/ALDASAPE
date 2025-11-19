import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaCheck } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import config from "../../../config";
import Cargando from "../../../components/cargando";
import DataTableBase from "./componentes/DataTableBase";
import BreadcrumbALDASA from "../../../cuerpos_dashboard/BreadcrumbAldasa";
import PopupForm from "./componentes/PopupForm";

export default function PopupList() {
  const [popups, setPopups] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [cargando, setCargando] = useState(false);

  const fetchPopups = async () => {
    setCargando(true);
    try {
      const res = await axios.get(`${config.apiUrl}api/administracion/lpopups`);
      setPopups(res.data);
    } catch (error) {
      console.error("Error al cargar popups:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchPopups();
  }, []);

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
      title: newStatus ? "¿Activar Popup?" : "¿Desactivar Popup?",
      text: newStatus
        ? "El popup se activará nuevamente."
        : "El popup se desactivará.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: newStatus ? "Sí, activar" : "Sí, desactivar",
      cancelButtonText: "Cancelar",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.put(
          `${config.apiUrl}api/administracion/epopups/${id}/estado`,
          { is_active: newStatus }
        );

        fetchPopups();

        Swal.fire(
          "Actualizado",
          newStatus
            ? "El popup fue activado correctamente."
            : "El popup fue desactivado correctamente.",
          "success"
        );
      } catch (error) {
        Swal.fire("Error", "No se pudo actualizar el estado.", "error");
      }
    }
  };

  const handleCloseForm = (updated) => {
    setShowForm(false);
    if (updated) fetchPopups();
  };

  const columns = [
    {
      name: "#",
      selector: (row, i) => i + 1,
      width: "70px",
    },
    {
      name: "Imagen",
      selector: (row) =>
        row.imagen_url ? (
          <img
            src={`${config.urlserver}${row.imagen_url}`}
            alt="popup"
            width="80"
            height="40"
            className="rounded"
          />
        ) : (
          <span>-</span>
        ),
      width: "120px",
    },
    {
      name: "Título",
      selector: (row) => row.titulo,
      sortable: true,
    },
    {
      name: "Tiempo (segundos)",
      selector: (row) => row.tiempo_segundos,
      width: "180px",
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

        <DataTableBase title="" columns={columns} data={popups} actions={actions} />

        {showForm && <PopupForm popup={selectedItem} onClose={handleCloseForm} />}
      </div>
    </>
  );
}
