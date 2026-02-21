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

export default function ChatConversacionesList() {
  const { usuario } = useUsuario();
  const [conversaciones, setConversaciones] = useState([]);
  const [cargando, setCargando] = useState(false);

  const fetchConversaciones = async () => {
    setCargando(true);
    try {
      const res = await axios.get(`${config.apiUrl}api/administracion/chat/conversaciones`);
      setConversaciones(res.data);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudieron cargar las conversaciones.", "error");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchConversaciones();
  }, []);

  if (!usuario) return null;
  const perfil = usuario.usuarioaldasa?.perfil_id;

  if (perfil !== 1) {
    return <SinPrivilegios />;
  }

  const columns = [
    { name: "#", selector: (row, i) => i + 1, width: "70px", center: true },
    { name: "Session ID", selector: (row) => row.session_id, sortable: true },
    {
      name: "Pregunta del Usuario",
      selector: (row) => row.pregunta,
      sortable: true,
      wrap: true,
    },
    {
      name: "Respuesta del Bot",
      selector: (row) => row.respuesta || "Sin respuesta",
      sortable: true,
      wrap: true,
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
          <button className="btn btn-outline-primary" onClick={fetchConversaciones}>
            <FaSync className="me-2" /> Actualizar
          </button>
        </div>

        <DataTableBase title="" columns={columns} data={conversaciones} />
      </div>
    </>
  );
}