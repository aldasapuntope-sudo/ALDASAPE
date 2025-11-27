import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import Cargando from "../../../components/cargando";
import BreadcrumbALDASA from "../../../cuerpos_dashboard/BreadcrumbAldasa";
import config from "../../../config";
import ConfigPopupForm from "./componentes/ConfigPopupForm";
import SinPrivilegios from "../../../components/SinPrivilegios";
import { useUsuario } from "../../../context/UserContext";
import DataTableBase from "./componentes/DataTableBase";

export default function ConfigPopupList() {
  const { usuario } = useUsuario();
  const [popupConfig, setPopupConfig] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchPopupConfig();
  }, []);

  const fetchPopupConfig = async () => {
    setCargando(true);
    try {
      const res = await axios.get(`${config.apiUrl}api/administracion/lpopupconfig`);
      setPopupConfig([res.data]); // lo convertimos a array para DataTable
    } catch {
      Swal.fire("Error", "No se pudo cargar la configuración", "error");
    } finally {
      setCargando(false);
    }
  };

  if (!usuario) return null;
  const perfil = usuario.usuarioaldasa?.perfil_id;
  if (perfil !== 1) return <SinPrivilegios />;

  const columns = [
    { name: "#", selector: (row, i) => i + 1, width: "80px" },
    { 
      name: "Tiempo Inicio (seg)", 
      selector: (row) => row.tiempo_inicio_seg,
      sortable: true 
    },
    { 
      name: "Actualizado", 
      selector: (row) => row.updated_at 
    },
  ];

  const actions = (row) => (
    <button
      className="btn btn-sm btn-warning"
      onClick={() => setShowForm(true)}
    >
      <FaEdit />
    </button>
  );

  return (
    <>
      <Cargando visible={cargando} />

      <div className="container mt-4">
        <BreadcrumbALDASA />

        <div className="d-flex justify-content-between align-items-center mb-3 mt-3">
          <h3 className="fw-bold"></h3>
        </div>

        <DataTableBase
          title=""
          columns={columns}
          data={popupConfig}
          actions={actions}
        />

        {showForm && (
          <ConfigPopupForm
            popupItem={popupConfig[0]}
            onClose={(updated) => {
              setShowForm(false);
              if (updated) fetchPopupConfig();
            }}
          />
        )}
      </div>
    </>
  );
}
