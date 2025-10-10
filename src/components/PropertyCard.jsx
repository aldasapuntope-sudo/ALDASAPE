import React from 'react';
import {
  FaHeart,
  FaArrowsAltH,
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaRulerCombined,
} from 'react-icons/fa';
import '../css/PropertyCard.css';

export default function PropertyCard({ prop }) {
  const { title, category, type, price, location, img, details } = prop;

  return (
    <div className="property-box2 shadow-sm">
      <div className="item-img position-relative">
        <a href="single-listing1.html">
          <img src={img} alt={title} width="510" height="340" className="img-fluid" />
        </a>

        {/* Categoría superior */}
        <div className="item-category-box1 position-absolute top-0 start-0 m-2">
          <div className="item-category text-uppercase bg-success text-light px-2 py-1 rounded">
            {type === 'comprar' ? 'Comprar' : 'Alquilar'}
          </div>
        </div>

        {/* Precio */}
        <div className="rent-price position-absolute bottom-0 start-0 bg-dark bg-opacity-75 text-white px-3 py-2">
          <div className="item-price">{price}</div>
        </div>

        {/* Íconos superiores */}
        <div className="react-icon position-absolute top-0 end-0 m-2">
          <ul className="list-unstyled d-flex gap-2">
            <li>
              <a href="favourite.html" title="Favoritos" className="text-white">
                <i className="flaticon-heart"></i>
              </a>
            </li>
            <li>
              <a href="compare.html" title="Comparar" className="text-white">
                <i className="flaticon-left-and-right-arrows"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Contenido */}
      <div className="item-category10 mt-2">
        <a href="single-listing1.html" className="text-success fw-semibold">
          {category}
        </a>
      </div>

      <div className="item-content">
        <div className="verified-area">
          <h3 className="item-title">
            <a href="single-listing1.html" className="text-dark text-decoration-none">
              {title}
            </a>
          </h3>
        </div>

        <div className="location-area text-muted mb-2">
          <FaMapMarkerAlt className="text-success me-2" />
          {location}
        </div>

        <div className="item-categoery3">
          <ul className="list-inline mb-0 small text-secondary">
            <li className="list-inline-item me-3">
              <FaBed className="text-success me-1 style1" />
              Dormitorios: {details.dorms}
            </li>
            <li className="list-inline-item me-3">
              <FaBath className="text-success me-1 style1" />
              Baños: {details.baths}
            </li>
            <li className="list-inline-item">
              <FaRulerCombined className="text-success me-1 style1" />
              {details.area}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
