import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaCheck } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import config from "../../../config";
import Cargando from "../../../components/cargando";
import DataTableBase from "./componentes/DataTableBase";
import PaginaForm from "./componentes/PaginaForm";
import BreadcrumbALDASA from "../../../cuerpos_dashboard/BreadcrumbAldasa";
import SinPrivilegios from "../../../components/SinPrivilegios";
import { useUsuario } from "../../../context/UserContext";

export default function PaginasList() {
  const { usuario } = useUsuario();
  const [paginas, setPaginas] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedPagina, setSelectedPagina] = useState(null);
  const [cargando, setCargando] = useState(false);

  // 🔹 Cargar páginas
  const fetchPaginas = async () => {
    setCargando(true);
    try {
      const res = await axios.get(`${config.apiUrl}api/administracion/lpaginas`);
      setPaginas(res.data);
    } catch (error) {
      console.error("Error al cargar las páginas:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchPaginas();
  }, []);

  if (!usuario) return null;
   const perfil = usuario.usuarioaldasa?.perfil_id;

  if (perfil !== 1) {
    return <SinPrivilegios />;
  }

  // 🔹 Abrir modal para agregar
  const handleAdd = () => {
    setSelectedPagina(null);
    setShowForm(true);
  };

  // 🔹 Abrir modal para editar
  const handleEdit = (pagina) => {
    setSelectedPagina(pagina);
    setShowForm(true);
  };

  // 🔹 Cambiar estado activo/inactivo
  const handleChangeStatus = async (id, newStatus) => {
    const confirm = await Swal.fire({
      title: newStatus ? "¿Activar página?" : "¿Desactivar página?",
      text: newStatus
        ? "La página se activará nuevamente."
        : "La página se desactivará y no estará visible.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: newStatus ? "Sí, activar" : "Sí, desactivar",
      cancelButtonText: "Cancelar",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.put(`${config.apiUrl}api/administracion/epaginas/${id}/estado`, {
          is_active: newStatus,
        });
        fetchPaginas();
        Swal.fire(
          "Actualizado",
          newStatus ? "La página fue activada." : "La página fue desactivada.",
          "success"
        );
      } catch (error) {
        Swal.fire("Error", "No se pudo actualizar el estado de la página.", "error");
      }
    }
  };

  const handleCloseForm = (updated) => {
    setShowForm(false);
    if (updated) fetchPaginas();
  };

  // ✅ Columnas del DataTable
  const columns = [
    { name: "#", selector: (row, i) => i + 1, width: "70px", center: true },
    { name: "Slug", selector: (row) => row.slug, sortable: true, center: true },
    { name: "Título", selector: (row) => row.titulo, sortable: true, center: true },
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
        <BreadcrumbALDASA />
        <div className="d-flex justify-content-between align-items-center mb-3 mt-3">
          <h3 className="fw-bold"></h3>
          <button className="btn btn-primary" onClick={handleAdd}>
            <FaPlus className="me-2" /> Agregar nueva
          </button>
        </div>

        <DataTableBase title="" columns={columns} data={paginas} actions={actions} />

        {showForm && <PaginaForm Pagina={selectedPagina} onClose={handleCloseForm} />}
      </div>
    </>
  );
}
