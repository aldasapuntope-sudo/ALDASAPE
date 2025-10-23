import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Card, Spinner } from "react-bootstrap";
import config from "../../config";
import PropiedadesRow from "./componentes/PropiedadesRow";
import PropiedadesTabs from "./componentes/PropiedadesTabs";
import "../../css/Buscadordetalle.css";
export default function BuscarPage() {
  const location = useLocation();
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";
    const tipo = params.get("tipo") || "";
    const mode = params.get("mode") || "";

    setLoading(true);
    axios
      .get(
        `${config.apiUrl}api/paginaprincipal/propiedades/buscar?q=${q}&tipo=${tipo}&mode=${mode}`
      )
      .then((res) => setResultados(res.data.data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [location.search]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <Spinner animation="border" variant="success" />
      </div>
    );
  }

  if (!resultados.length) {
    return <p className="text-center py-5">No se encontraron propiedades</p>;
  }

  return (
    <section className="grid-wrap3">
        <div className="container">
            <div className="row gutters-40">
                <div className="col-lg-4 widget-break-lg sidebar-widget">

                </div>
                <div className="col-lg-8">
                    <PropiedadesRow resultados={resultados} />
                    <PropiedadesTabs resultados={resultados} />
                </div>
            </div>
        </div>
    </section>
  );
}
