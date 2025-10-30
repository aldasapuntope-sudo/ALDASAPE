import React, { useState, useEffect } from "react";
import { FaSync } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import config from "../../../config";
import Cargando from "../../../components/cargando";
import DataTableBase from "./componentes/DataTableBase";
import BreadcrumbALDASA from "../../../cuerpos_dashboard/BreadcrumbAldasa";

export default function BitacoraList() {
  const [bitacora, setBitacora] = useState([]);
  const [cargando, setCargando] = useState(false);

  // 🔹 Cargar registros de la bitácora
  const fetchBitacora = async () => {
    setCargando(true);
    try {
      const res = await axios.get(`${config.apiUrl}api/administracion/lbitacora`);
      setBitacora(res.data);
    } catch (error) {
      console.error("Error al cargar la bitácora:", error);
      Swal.fire("Error", "No se pudieron cargar los registros de la bitácora.", "error");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchBitacora();
  }, []);

  // ✅ Columnas del DataTable
  const columns = [
    { name: "#", selector: (row, i) => i + 1, width: "70px", center: true },
    { name: "Usuario", selector: (row) => row.user_name || "-", sortable: true, center: true },
    { name: "Acción", selector: (row) => row.accion, sortable: true, center: true },
    { name: "Tabla afectada", selector: (row) => row.tabla_afectada, sortable: true, center: true },
    { name: "Registro ID", selector: (row) => row.registro_id, center: true },
    {
      name: "Descripción",
      selector: (row) => (row.descripcion ? row.descripcion.substring(0, 70) + "..." : "-"),
      sortable: true,
      wrap: true,
    },
    { name: "IP", selector: (row) => row.ip || "-", center: true },
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

  // ✅ Acciones (solo botón para refrescar)
  const actions = () => (
    <div className="text-center">
      <button className="btn btn-sm btn-secondary" onClick={fetchBitacora}>
        <FaSync /> Recargar
      </button>
    </div>
  );

  return (
    <>
      <Cargando visible={cargando} />
      <div className="container mt-4">
        <BreadcrumbALDASA />
        <div className="d-flex justify-content-between align-items-center mb-3 mt-3">
          <h3 className="fw-bold"></h3>
          <button className="btn btn-outline-primary" onClick={fetchBitacora}>
            <FaSync className="me-2" /> Actualizar
          </button>
        </div>

        <DataTableBase title="" columns={columns} data={bitacora} />
      </div>
    </>
  );
}
