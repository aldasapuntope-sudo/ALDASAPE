import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaCheck } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import Cargando from "../../../components/cargando";
import BreadcrumbALDASA from "../../../cuerpos_dashboard/BreadcrumbAldasa";
import config from "../../../config";
import ConfigScriptsForm from "./componentes/ConfigScriptsForm";
import DataTableBase from "./componentes/DataTableBase";
import SinPrivilegios from "../../../components/SinPrivilegios";
import { useUsuario } from "../../../context/UserContext";

export default function ConfigScriptsList() {
  const { usuario } = useUsuario();
  const [scripts, setScripts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    fetchScripts();
  }, []);

  const fetchScripts = async () => {
    setCargando(true);
    try {
      const res = await axios.get(`${config.apiUrl}api/administracion/lscripts`);
      setScripts(res.data);
    } catch {
      Swal.fire("Error", "No se pudieron cargar los scripts", "error");
    } finally {
      setCargando(false);
    }
  };

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
      title: newStatus ? "¿Activar script?" : "¿Desactivar script?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: newStatus ? "Sí, activar" : "Sí, desactivar",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.put(`${config.apiUrl}api/administracion/escripts/${id}/estado`, {
          is_active: newStatus,
        });

        Swal.fire("Actualizado", "Estado actualizado", "success");
        fetchScripts();
      } catch {
        Swal.fire("Error", "No se pudo actualizar el estado", "error");
      }
    }
  };

  const handleCloseForm = (updated) => {
    setShowForm(false);
    if (updated) fetchScripts();
  };

  const columns = [
    { name: "#", selector: (row, i) => i + 1, width: "70px" },
    { name: "Nombre", selector: (row) => row.nombre, sortable: true },
    { 
        name: "Script HEAD",
        selector: (row) => 
            row.script_head
            ? row.script_head.substring(0, 20) + "..."
            : "",
    },
    { 
        name: "Script BODY",
        selector: (row) => 
            row.script_body
            ? row.script_body.substring(0, 20) + "..."
            : "",
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

  const actions = (row) => (
    <div className="text-center">
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
    </div>
  );

  return (
    <>
      <Cargando visible={cargando} />

      <div className="container mt-4">
        <BreadcrumbALDASA />
        <div className="d-flex justify-content-between align-items-center mb-3 mt-3">
          <h3 className="fw-bold">Scripts del sistema</h3>
          <button className="btn btn-primary" onClick={handleAdd}>
            <FaPlus className="me-2" /> Nuevo Script
          </button>
        </div>

        <DataTableBase
          title=""
          columns={columns}
          data={scripts}
          actions={actions}
        />

        {showForm && (
          <ConfigScriptsForm
            scriptItem={selectedItem}
            onClose={handleCloseForm}
          />
        )}
      </div>
    </>
  );
}
