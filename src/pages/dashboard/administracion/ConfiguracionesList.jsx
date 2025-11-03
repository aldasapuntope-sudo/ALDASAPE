import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaCheck } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import Cargando from "../../../components/cargando";
import BreadcrumbALDASA from "../../../cuerpos_dashboard/BreadcrumbAldasa";
import config from "../../../config";
import ConfiguracionForm from "./componentes/ConfiguracionForm";
import DataTableBase from "./componentes/DataTableBase";

export default function ConfiguracionesList() {
  const [configuraciones, setConfiguraciones] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [cargando, setCargando] = useState(false);

  const fetchConfiguraciones = async () => {
    setCargando(true);
    try {
      const res = await axios.get(`${config.apiUrl}api/administracion/lconfiguraciones`);
      setConfiguraciones(res.data);
    } catch (error) {
      console.error("Error al cargar las configuraciones:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchConfiguraciones();
  }, []);

  const handleAdd = () => {
    setSelectedConfig(null);
    setShowForm(true);
  };

  const handleEdit = (configItem) => {
    setSelectedConfig(configItem);
    setShowForm(true);
  };

  const handleChangeStatus = async (id, newStatus) => {
    const confirm = await Swal.fire({
      title: newStatus ? "¿Activar configuración?" : "¿Desactivar configuración?",
      text: newStatus
        ? "La configuración se activará nuevamente."
        : "La configuración se desactivará temporalmente.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: newStatus ? "Sí, activar" : "Sí, desactivar",
      cancelButtonText: "Cancelar",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.put(`${config.apiUrl}api/administracion/econfiguraciones/${id}/estado`, {
          is_active: newStatus,
        });
        fetchConfiguraciones();
        Swal.fire(
          "Actualizado",
          newStatus ? "Configuración activada." : "Configuración desactivada.",
          "success"
        );
      } catch {
        Swal.fire("Error", "No se pudo cambiar el estado.", "error");
      }
    }
  };

  const handleCloseForm = (updated) => {
    setShowForm(false);
    if (updated) fetchConfiguraciones();
  };

  const columns = [
  {
    name: "#",
    selector: (row, i) => i + 1,
    width: "70px",
  },
  {
    name: "Clave",
    selector: (row) => row.clave,
    sortable: true,
  },
  {
    name: "Tipo",
    selector: (row) => row.tipo,
    wrap: true,
  },
  {
    name: "Valor",
    selector: (row) => {
      const valor = row.valor || "";
      return valor.length > 20 ? valor.substring(0, 20) + "..." : valor;
    },
    sortable: true,
    wrap: true,
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

  /*const columns = [
    { name: "#", selector: (row, i) => i + 1, width: "70px", center: true },
    { name: "Clave", selector: (row) => row.clave, sortable: true },
    { name: "Tipo", selector: (row) => row.tipo, sortable: true, center: true },
    { name: "Valor", selector: (row) => row.valor, center: true },
    {
      name: "Estado",
      selector: (row) => (
        <span className={`badge ${row.is_active ? "bg-success" : "bg-secondary"}`}>
          {row.is_active ? "Activo" : "Inactivo"}
        </span>
      ),
      center: true,
    },
  ];*/

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
          <h3 className="fw-bold"></h3>
          <button className="btn btn-primary" onClick={handleAdd}>
            <FaPlus className="me-2" /> Nueva configuración
          </button>
        </div>

        <DataTableBase title="" columns={columns} data={configuraciones} actions={actions} />

        {showForm && <ConfiguracionForm ConfigItem={selectedConfig} onClose={handleCloseForm} />}
      </div>
    </>
  );
}
