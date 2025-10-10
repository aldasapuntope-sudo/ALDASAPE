import React from 'react';
import '../css/FeaturedAgencies.css';

export default function FeaturedAgencies() {
  const agencies = [
    { img: 'https://aldasa.pe/wp-content/themes/theme_aldasape/img/brand/brand1.svg', alt: 'Inmobiliaria 1' },
    { img: 'https://aldasa.pe/wp-content/themes/theme_aldasape/img/brand/brand2.svg', alt: 'Inmobiliaria 2' },
    { img: 'https://aldasa.pe/wp-content/themes/theme_aldasape/img/brand/brand3.svg', alt: 'Inmobiliaria 3' },
    { img: 'https://aldasa.pe/wp-content/themes/theme_aldasape/img/brand/brand4.svg', alt: 'Inmobiliaria 4' },
    { img: 'https://aldasa.pe/wp-content/themes/theme_aldasape/img/brand/brand5.svg', alt: 'Inmobiliaria 5' },
    { img: 'https://aldasa.pe/wp-content/themes/theme_aldasape/img/brand/brand6.svg', alt: 'Inmobiliaria 6' },
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
              >Algunas de</span>
              <h2 className="section-title fw-bold">Nuestras inmobiliarias más destacadas</h2>
              <p className="text-muted">
                Inmobiliarias, promotores y corretajes con mayor número de inmuebles destacados y vendidos.
              </p>
            </div>
          </div>

          {/* Columna derecha */}
          <div className="col-lg-8">
            <div className="row">
              {agencies.map((agency, index) => (
                <div className="col-lg-4 col-md-4 col-sm-6 mb-4" key={index}>
                  <div
                    className="brand-box2 fadeInUp text-center"
                    style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                  >
                    <div className="item-img p-3 shadow-sm rounded-3 bg-white">
                      <a href="#" className="d-inline-block">
                        <img
                          src={agency.img}
                          alt={agency.alt}
                          className="img-fluid brand-logo"
                        />
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
