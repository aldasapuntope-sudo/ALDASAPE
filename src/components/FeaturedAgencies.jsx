import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/FeaturedAgencies.css';
import config from '../config';
import EmptyState from './EmptyState';

export default function FeaturedAgencies() {
  const [agencies, setAgencies] = useState([]);

  useEffect(() => {
    axios
      .get(`${config.apiUrl}api/paginaprincipal/inmobiliariasdestacadas`)
      .then(res => {
        setAgencies(res.data); 
      })
      .catch(err => {
        console.error('Error al cargar inmobiliarias destacadas', err);
      });
  }, []);

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
                  backgroundImage: "url('/assets/images/favicon-aldasape.png')",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "23px 23px",
                  backgroundPosition: "0 50%",
                }}
              >
                Algunas de
              </span>
              <h2 className="section-title fw-bold">
                Nuestras inmobiliarias más destacadas
              </h2>
              <p className="text-muted">
                Inmobiliarias con mayor número de visitas en sus propiedades.
              </p>
            </div>
          </div>

          {/* Columna derecha */}
          <div className="col-lg-8">
            <div className="row">

              {agencies.map((agency, index) => (
                <div
                  className="col-lg-4 col-md-4 col-sm-6 mb-4"
                  key={agency.inmobiliaria_id}
                >
                  <div
                    className="brand-box2 fadeInUp text-center"
                    style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                  >
                    <div className="item-img p-3 shadow-sm rounded-3 bg-white">

                      {/* LOGO */}
                      <img
                        src={agency.logo}
                        alt={agency.nombre}
                        className="img-fluid brand-logo mb-2"
                      />

                      {/* NOMBRE */}
                      <div className="brand-name fw-semibold">
                        {agency.nombre}
                      </div>

                    </div>
                  </div>
                </div>
              ))}

              {agencies.length === 0 && (
                <EmptyState
                  image="/assets/images/empty-sinresult.png"
                  title="Aún no hay inmobiliarias destacadas"
                  //description="En este momento no contamos con inmobiliarias destacadas. Pronto tendremos nuevas opciones para ti."
                    description=""          
                />
              )}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
