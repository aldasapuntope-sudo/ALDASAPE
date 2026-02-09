import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../css/HomeOptions.css";

export default function HomeOptions() {
  const items = [
    {
      label: "Departamentos en alquiler más vistos",
      tipo: "Departamento",
      mode: "alquiler",
    },
    {
      label: "Los inmuebles recién publicados",
      mode: "venta",
    },
    {
      label: "Casas recién publicadas y en venta",
      tipo: "Casa",
      mode: "venta",
    },
    {
      label: "Oficinas recién publicadas en alquiler",
      tipo: "Oficina",
      mode: "alquiler",
    },
  ];

  const buildUrl = ({ tipo, mode }) => {
    const params = new URLSearchParams();

    if (tipo) params.append("tipo[]", tipo);
    if (mode) params.append("mode", mode);

    return `/buscar?${params.toString()}`;
  };

  return (
    <section className="brand-wrap1 py-5">
      <div className="container">
        <div className="row align-items-center">
          {/* Columna izquierda */}
          <div className="col-lg-4 mb-4 mb-lg-0">
            <div className="brand-box1 fadeInUp">
              <span
                className="section-subtitle text-success"
                style={{
                  position: "relative",
                  paddingLeft: "25px",
                  display: "inline-block",
                  backgroundImage:
                    "url('/assets/images/favicon-aldasape.png')",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "23px 23px",
                  backgroundPosition: "0 50%",
                }}
              >
                Muchas Opciones para ti
              </span>
              <h2 className="section-title fw-bold">
                Listados de inmuebles que te pueden interesar
              </h2>
            </div>
          </div>

          {/* Columna derecha */}
          <div className="col-lg-8">
            <div className="row">
              {items.map((item, index) => (
                <div
                  className="col-lg-6 col-md-6 col-sm-6 mb-4"
                  key={index}
                >
                  <Link
                    to={buildUrl(item)}
                    className="text-decoration-none text-dark"
                  >
                    <div
                      className="brand-box2 fadeInUp"
                      style={{
                        animationDelay: `${0.2 + index * 0.1}s`,
                      }}
                    >
                      <div className="block-options-inmueble">
                        <div className="title-short-block">
                          <span className="title-span-inner">
                            {item.label}
                          </span>
                        </div>
                        <div className="icon-short-block">
                          <FaArrowRight />
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
