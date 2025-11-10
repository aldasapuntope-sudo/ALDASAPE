import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaCheck } from "react-icons/fa";
import axios from "axios";
import config from "../../../config";
import Swal from "sweetalert2";
import DataTableBase from "./componentes/DataTableBase";
import Cargando from "../../../components/cargando";
import UsuarioPlanForm from "./componentes/UsuarioPlanForm";
import BreadcrumbALDASA from "../../../cuerpos_dashboard/BreadcrumbAldasa";

export default function UsuariosPlanesList() {
  const [data, setData] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(null);

  const fetchData = async () => {
    setCargando(true);
    try {
      const res = await axios.get(`${config.apiUrl}api/administracion/lplanes_usuario`);
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setCargando(false);
    }
  };
  

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    setSelected(null);
    setShowForm(true);
  };

  const handleEdit = (row) => {
    setSelected(row);
    setShowForm(true);
  };

  const handleCloseForm = (updated) => {
    setShowForm(false);
    if (updated) fetchData();
  };

  const columns = [
    { name: "#", selector: (r, i) => i + 1, width: "60px" },
    { name: "Usuario", selector: (r) => r.usuario, sortable: true },
    { name: "Plan", selector: (r) => r.plan, sortable: true },
    { name: "Inicio", selector: (r) => r.fecha_inicio },
    { name: "Fin", selector: (r) => r.fecha_fin },
    { name: "Anuncios", selector: (r) => r.anuncios_disponibles },
    {
      name: "Estado",
      selector: (r) => (
        <span className={`badge ${r.estado === "activo" ? "bg-success" : "bg-secondary"}`}>
          {r.estado}
        </span>
      ),
    },
  ];

  const actions = (row) => (
    <>
      <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(row)}>
        <FaEdit />
      </button>
      <button className="btn btn-sm btn-danger">
        <FaTrash />
      </button>
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
            <FaPlus className="me-2" /> Asignar nuevo
          </button>
        </div>
        <DataTableBase title="" columns={columns} data={data} actions={actions} />
        {showForm && <UsuarioPlanForm planUsuario={selected} onClose={handleCloseForm} />}
      </div>
    </>
  );
}
