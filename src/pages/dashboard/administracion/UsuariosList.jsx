import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaCheck } from "react-icons/fa";
import axios from "axios";
import config from "../../../config";
import Swal from "sweetalert2";
import DataTableBase from "./componentes/DataTableBase";
import Cargando from "../../../components/cargando";
import BreadcrumbALDASA from "../../../cuerpos_dashboard/BreadcrumbAldasa";
import UsuarioForm from "./componentes/UsuarioForm";
import { useUsuario } from "../../../context/UserContext";
import SinPrivilegios from "../../../components/SinPrivilegios";

export default function UsuariosList() {
  const { usuario } = useUsuario();
  const [data, setData] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(null);

  const fetchData = async () => {
    setCargando(true);
    try {
      const res = await axios.get(`${config.apiUrl}api/administracion/lusuarios`);
      setData(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudieron cargar los usuarios", "error");
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

  const handleToggleEstado = (row) => {
    const activo = row.is_active === 1;

    Swal.fire({
      title: activo ? "¿Desactivar usuario?" : "¿Activar usuario?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, continuar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.put(
            `${config.apiUrl}api/administracion/eusuarios/${row.id}/estado`,
            { is_active: activo ? 0 : 1 }
          );

          Swal.fire("Actualizado", "El estado fue cambiado", "success");
          fetchData();
        } catch (error) {
          console.error(error);
          Swal.fire("Error", "No se pudo actualizar", "error");
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
    { name: "Nombre", selector: (r) => `${r.nombre} ${r.apellido}` },
    { name: "Email", selector: (r) => r.email },
    { name: "Documento", selector: (r) => `${r.numero_documento}` },
    { name: "Teléfono", selector: (r) => r.telefono_movil },
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
      >
        <FaEdit />
      </button>

      {row.is_active ? (
        <button
          className="btn btn-sm btn-danger"
          onClick={() => handleToggleEstado(row)}
        >
          <FaTrash />
        </button>
      ) : (
        <button
          className="btn btn-sm btn-success"
          onClick={() => handleToggleEstado(row)}
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
            <FaPlus className="me-2" /> Nuevo Usuario
          </button>
        </div>

        <DataTableBase title="" columns={columns} data={data} actions={actions} />

        {showForm && (
          <UsuarioForm usuario={selected} onClose={handleCloseForm} />
        )}
      </div>
    </>
  );
}
