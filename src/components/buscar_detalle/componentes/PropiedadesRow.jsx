import React from "react";

export default function PropiedadesRow({ resultados }) {
  if (!resultados?.length) return null;

  return (
    <div className="row justify-content-center">
      <div className="col-lg-12 col-md-12">
        <div className="item-shorting-box">
          <div className="shorting-title">
            <h4 className="item-title">
              Mostrando 1–{resultados.length} resultados
            </h4>
          </div>
          <div className="item-shorting-box-2 d-flex justify-content-between align-items-center">
            <div className="by-shorting d-flex align-items-center gap-2">
              <div className="shorting">Ordenar por:</div>
              <select className="select single-select mr-0">
                <option value="1">Default</option>
                <option value="2">High Price</option>
                <option value="3">Medium Price</option>
                <option value="4">Low Price</option>
              </select>
            </div>
            <div className="grid-button">
              <ul className="nav nav-tabs" role="tablist">
                <li className="nav-item">
                  <a className="nav-link" data-bs-toggle="tab" href="#mylisting">
                    <i className="fas fa-th"></i>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link active" data-bs-toggle="tab" href="#reviews">
                    <i className="fas fa-list-ul"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
