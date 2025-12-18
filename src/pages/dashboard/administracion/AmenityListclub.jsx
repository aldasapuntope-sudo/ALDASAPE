import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaCheck } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import config from "../../../config";
import Cargando from "../../../components/cargando";
import DataTableBase from "./componentes/DataTableBase";
import BreadcrumbALDASA from "../../../cuerpos_dashboard/BreadcrumbAldasa";
import { useUsuario } from "../../../context/UserContext";
import SinPrivilegios from "../../../components/SinPrivilegios";
import AmenityFormclub from "./componentes/AmenityFormclub";


export default function ServicioListclub() {
  const { usuario } = useUsuario();
  const [amenities, setAmenities] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedServicio, setSelectedServicio] = useState(null);
  const [cargando, setCargando] = useState(false);

  const fetchAmenities = async () => {
    setCargando(true);
    try {
      const res = await axios.get(`${config.apiUrl}api/administracion/lamenitiesclub`);
      setAmenities(res.data);
    } catch (error) {
      console.error("Error al cargar amenities:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchAmenities();
  }, []);

  if (!usuario) return null;
   const perfil = usuario.usuarioaldasa?.perfil_id;

  if (perfil !== 1) {
    return <SinPrivilegios />;
  }

  const handleAdd = () => {
    setSelectedServicio(null);
    setShowForm(true);
  };

  const handleEdit = (servicio) => {
    setSelectedServicio(servicio);
    setShowForm(true);
  };

  const handleChangeStatus = async (id, newStatus) => {
    const confirm = await Swal.fire({
      title: newStatus ? "¿Activar Servicio?" : "¿Desactivar Servicio?",
      text: newStatus
        ? "El Servicio se activará nuevamente."
        : "El Servicio se desactivará y no estará disponible.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: newStatus ? "Sí, activar" : "Sí, desactivar",
      cancelButtonText: "Cancelar",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.put(`${config.apiUrl}api/administracion/eamenitiesclub/${id}/estado`, {
          is_active: newStatus,
        });
        fetchAmenities();
        Swal.fire(
          "Actualizado",
          newStatus
            ? "El Servicio fue activado correctamente."
            : "El Servicio fue desactivado correctamente.",
          "success"
        );
      } catch (error) {
        Swal.fire("Error", "No se pudo actualizar el estado del Servicio.", "error");
      }
    }
  };

  const handleCloseForm = (updated) => {
    setShowForm(false);
    if (updated) fetchAmenities();
  };

  // ✅ Definimos columnas
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
      name: "Tipo de Propiedad",
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

  // ✅ Definimos acciones
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

        <DataTableBase
          title=""
          columns={columns}
          data={amenities}
          actions={actions}
        />

        {showForm && (
          <AmenityFormclub Servicio={selectedServicio} onClose={handleCloseForm} />
        )}
      </div>
    </>
  );
}
