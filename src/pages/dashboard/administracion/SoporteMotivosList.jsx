import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaCheck } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import SoporteMotivoForm from "./componentes/SoporteMotivoForm";
import config from "../../../config";
import Cargando from "../../../components/cargando";
import DataTableBase from "./componentes/DataTableBase";
import BreadcrumbALDASA from "../../../cuerpos_dashboard/BreadcrumbAldasa";
import { useUsuario } from "../../../context/UserContext";
import SinPrivilegios from "../../../components/SinPrivilegios";

export default function SoporteMotivoList() {
  const { usuario } = useUsuario();
  const [motivos, setMotivos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [cargando, setCargando] = useState(false);

  const fetchMotivos = async () => {
    setCargando(true);
    try {
      const res = await axios.get(
        `${config.apiUrl}api/administracion/lsoporte-motivos`
      );
      setMotivos(res.data);
    } catch (error) {
      console.error("Error al cargar motivos:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchMotivos();
  }, []);

  if (!usuario) return null;
  const perfil = usuario.usuarioaldasa?.perfil_id;
  if (perfil !== 1) return <SinPrivilegios />;

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
      title: newStatus ? "¿Activar motivo?" : "¿Desactivar motivo?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "Cancelar",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.put(
          `${config.apiUrl}api/administracion/esoporte-motivo/${id}/estado`,
          { is_active: newStatus }
        );
        fetchMotivos();
        Swal.fire("Actualizado", "Estado actualizado correctamente", "success");
      } catch {
        Swal.fire("Error", "No se pudo cambiar el estado", "error");
      }
    }
  };

  const columns = [
    { name: "#", selector: (row, i) => i + 1, width: "70px" },
    {
      name: "Nombre",
      selector: (row) => row.nombre,
      sortable: true,
    },
    {
      name: "Descripción",
      selector: (row) => row.descripcion || "-",
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
      <button
        className="btn btn-sm btn-warning me-2"
        onClick={() => handleEdit(row)}
      >
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

        <DataTableBase
          title=""
          columns={columns}
          data={motivos}
          actions={actions}
        />

        {showForm && (
          <SoporteMotivoForm
            motivo={selectedItem}
            onClose={(updated) => {
              setShowForm(false);
              if (updated) fetchMotivos();
            }}
          />
        )}
      </div>
    </>
  );
}
