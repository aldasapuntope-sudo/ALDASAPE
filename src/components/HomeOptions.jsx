import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import '../css/HomeOptions.css';

export default function HomeOptions() {
  const items = [
    'Departamentos en alquiler más vistos',
    'Los Inmuebles recién publicados',
    'Casas recién publicadas y en venta',
    'Oficinas recién publicadas en alquiler'
  ];

  return (
    <section className="brand-wrap1 py-5">
      <div className="container">
        <div className="row align-items-center">

          {/* Columna izquierda */}
          <div className="col-lg-4 mb-4 mb-lg-0">
            <div className="brand-box1 fadeInUp" data-wow-delay=".2s">
              <span className="section-subtitle text-success" 
                style={{
                  position: "relative",
                  paddingLeft: "25px",
                  display: "inline-block",
                  backgroundImage: "url('/assets/images/favicon-aldasape.png')",
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
                <div className="col-lg-6 col-md-6 col-sm-6 mb-4" key={index}>
                  <div className="brand-box2 fadeInUp" style={{ animationDelay: `${0.2 + index * 0.1}s` }}>
                    <div className="item-img">
                      <a href="#" className="text-decoration-none text-dark">
                        <div className="block-options-inmueble">
                          <div className="title-short-block">
                            <span className="title-span-inner">{item}</span>
                          </div>
                          <div className="icon-short-block">
                            <FaArrowRight />
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
