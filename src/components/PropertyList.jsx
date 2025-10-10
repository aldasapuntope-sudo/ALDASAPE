import React, { useState } from 'react';
import PropertyCard from './PropertyCard';
import '../css/property.css';

export default function PropertyList() {
  const [filter, setFilter] = useState('all');

  const properties = [
    {
      id: 1,
      title: 'Lujoso Departamento en Venta',
      category: 'Departamento',
      type: 'comprar',
      price: 'S/240,000',
      location: 'Av. Santa Victoria, Chiclayo',
      img: 'https://aldasa.pe/wp-content/themes/theme_aldasape/img/comprar-inmueble.jpg',
      details: { dorms: 3, baths: 2, area: '931 Sqft' },
    },
    {
      id: 2,
      title: 'Countryside Modern Lake View',
      category: 'Oficina',
      type: 'alquilar',
      price: 'S/1,500 /mes',
      location: 'Downey, California',
      img: 'https://aldasa.pe/wp-content/themes/theme_aldasape/img/alquilar-inmueble.jpg',
      details: { dorms: 3, baths: 2, area: '931 Sqft' },
    },
    {
      id: 3,
      title: 'Family House For Sell',
      category: 'Terreno / Lote',
      type: 'comprar',
      price: 'S/25,000',
      location: 'Downey, California',
      img: 'https://aldasa.pe/wp-content/themes/theme_aldasape/img/comprar-inmueble.jpg',
      details: { dorms: 3, baths: 2, area: '931 Sqft' },
    },
  ];

  const filtered =
    filter === 'all' ? properties : properties.filter((p) => p.type === filter);

  return (
    <section className="property-wrap1 py-5">
      <div className="container">
        {/* Encabezado */}
        <div className="row mb-4 align-items-center">
          <div className="col-lg-6 col-md-5 col-sm-12">
            <div className="item-heading-left">
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
              >Nuestras Propiedades</span>
              <h2 className="section-title">Últimos Ingresos</h2>
              
            </div>
          </div>

          <div className="col-lg-6 col-md-7 col-sm-12 text-md-end mt-3 mt-md-0">
            <div className="isotope-classes-tab btn-group">
              <button
                className={`btn btn-outline-success ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                Todos
              </button>
              <button
                className={`btn btn-outline-success ${filter === 'comprar' ? 'active' : ''}`}
                onClick={() => setFilter('comprar')}
              >
                Comprar
              </button>
              <button
                className={`btn btn-outline-success ${filter === 'alquilar' ? 'active' : ''}`}
                onClick={() => setFilter('alquilar')}
              >
                Alquilar
              </button>
            </div>
          </div>
        </div>

        {/* Listado de propiedades */}
        <div className="row">
          {filtered.map((p, i) => (
            <div
              key={p.id}
              className="col-xl-4 col-lg-6 col-md-6 mb-4 wow fadeInUp"
              data-wow-delay={`${0.2 + i * 0.1}s`}
            >
              <PropertyCard prop={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
