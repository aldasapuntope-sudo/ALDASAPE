import React, { useState, useEffect } from "react";
import { FaSync } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import config from "../../../config";
import Cargando from "../../../components/cargando";
import DataTableBase from "./componentes/DataTableBase";
import BreadcrumbALDASA from "../../../cuerpos_dashboard/BreadcrumbAldasa";
import SinPrivilegios from "../../../components/SinPrivilegios";
import { useUsuario } from "../../../context/UserContext";

export default function LibroReclamacionesList() {
  const { usuario } = useUsuario();
  const [reclamaciones, setReclamaciones] = useState([]);
  const [cargando, setCargando] = useState(false);

  // 🔹 Cargar reclamaciones
  const fetchReclamaciones = async () => {
    setCargando(true);
    try {
      const res = await axios.get(
        `${config.apiUrl}api/administracion/llibroreclamaciones`
      );
      setReclamaciones(res.data);
    } catch (error) {
      console.error("Error al cargar reclamaciones:", error);
      Swal.fire(
        "Error",
        "No se pudieron cargar los registros del libro de reclamaciones.",
        "error"
      );
    } finally {
      setCargando(false);
    }
  };

  const actualizarEstado = async (id, nuevoEstado) => {
    console.log(nuevoEstado);
  try {
    await axios.put(`${config.apiUrl}api/administracion/alibroreclamaciones/${id}/estado`, { 
        estado: nuevoEstado 
    });

    Swal.fire("Correcto", "Estado actualizado correctamente", "success");

    setReclamaciones((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, estado: nuevoEstado } : item
      )
    );
  } catch (error) {
    console.error("ERROR REAL:", error.response || error);
    Swal.fire("Error", "No se pudo actualizar el estado", "error");
  }
};




  useEffect(() => {
    fetchReclamaciones();
  }, []);

  if (!usuario) return null;
  const perfil = usuario.usuarioaldasa?.perfil_id;

  if (perfil !== 1) {
    return <SinPrivilegios />;
  }

  // ✅ Columnas del DataTable
  const columns = [
    {
      name: "#",
      selector: (row, i) => i + 1,
      width: "70px",
      center: true,
    },
    {
      name: "Nombre",
      selector: (row) => row.nombre,
      sortable: true,
      wrap: true,
    },
    {
      name: "Documento",
      selector: (row) => row.documento,
      center: true,
    },
    {
      name: "Correo",
      selector: (row) => row.correo,
      wrap: true,
    },
    {
      name: "Teléfono",
      selector: (row) => row.telefono || "-",
      center: true,
    },
    {
      name: "Tipo",
      selector: (row) =>
        row.tipo === "reclamo" ? "Reclamo" : "Queja",
      sortable: true,
      center: true,
    },
    {
      name: "Detalle",
      selector: (row) =>
        row.detalle.length > 70
          ? row.detalle.substring(0, 70) + "..."
          : row.detalle,
      wrap: true,
    },
    {
    name: "Estado",
    center: true,
    cell: (row) => (
        <select
        className="form-select form-select-sm"
        value={row.estado}
        onChange={(e) => {
            const nuevoEstado = e.target.value; // 👈 GUARDAMOS EL VALOR

            Swal.fire({
                title: "¿Cambiar estado?",
                text: `¿Deseas cambiar el estado a "${nuevoEstado}"?`,
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Sí, cambiar",
                cancelButtonText: "Cancelar",
            }).then((result) => {
                if (result.isConfirmed) {
                actualizarEstado(row.id, nuevoEstado);
                }
            });
            }}

        >
        <option value="pendiente">Pendiente</option>
        <option value="atendido">Atendido</option>
        <option value="cerrado">Cerrado</option>
        </select>
    ),
    },

    {
      name: "Fecha",
      selector: (row) =>
        row.created_at
          ? new Date(row.created_at).toLocaleString("es-PE", {
              dateStyle: "short",
              timeStyle: "short",
            })
          : "-",
      sortable: true,
      center: true,
    },
  ];

  return (
    <>
      <Cargando visible={cargando} />
      <div className="container mt-4">
        <BreadcrumbALDASA />

        <div className="d-flex justify-content-between align-items-center mb-3 mt-3">
          <h3 className="fw-bold"></h3>
          <button
            className="btn btn-outline-primary"
            onClick={fetchReclamaciones}
          >
            <FaSync className="me-2" /> Actualizar
          </button>
        </div>

        <DataTableBase
          title=""
          columns={columns}
          data={reclamaciones}
        />
      </div>
    </>
  );
}
