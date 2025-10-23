import React from "react";

export default function PropiedadesTabs({ resultados }) {
  if (!resultados?.length) return null;

  return (
    <div className="tab-style-1 tab-style-3">
      <div className="tab-content" id="myTabContent">
        {/* Grid view */}
        <div className="tab-pane fade" id="mylisting" role="tabpanel">
          <div className="row">
            {resultados.map((propiedad, index) => (
              <div className="col-lg-6 col-md-6" key={index}>
                <div className="property-box2 wow fadeInUp animated" data-wow-delay=".3s">
                  <div className="item-img">
                    <a href={`/propiedad/${propiedad.id}`}>
                      <img
                        src={propiedad.imagen || "default.jpg"}
                        alt={propiedad.titulo}
                        width="510"
                        height="340"
                        className="img-fluid"
                      />
                    </a>
                    <div className="item-category-box1">
                      <div className="item-category">{propiedad.tipo}</div>
                    </div>
                    <div className="rent-price">
                      <div className="item-price">${propiedad.precio}<span><i>/</i>mo</span></div>
                    </div>
                  </div>
                  <div className="item-category10">
                    <a href={`/propiedad/${propiedad.id}`}>{propiedad.categoria}</a>
                  </div>
                  <div className="item-content">
                    <div className="verified-area">
                      <h3 className="item-title">
                        <a href={`/propiedad/${propiedad.id}`}>{propiedad.titulo}</a>
                      </h3>
                    </div>
                    <div className="location-area">
                      <i className="flaticon-maps-and-flags"></i>{propiedad.ubicacion}
                    </div>
                    <div className="item-categoery3">
                      <ul>
                        <li><i className="flaticon-bed"></i>Beds: {propiedad.beds}</li>
                        <li><i className="flaticon-shower"></i>Baths: {propiedad.baths}</li>
                        <li><i className="flaticon-two-overlapping-square"></i>{propiedad.area} Sqft</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Paginación */}
          <div className="pagination-style-1 mt-4">
            <ul className="pagination">
              <li className="page-item">
                <a className="page-link" href="#" aria-label="Previous">
                  <span aria-hidden="true">«</span>
                </a>
              </li>
              <li className="page-item"><a className="page-link active" href="#">1</a></li>
              <li className="page-item"><a className="page-link" href="#">2</a></li>
              <li className="page-item"><a className="page-link" href="#">3</a></li>
              <li className="page-item">
                <a className="page-link" href="#" aria-label="Next">
                  <span aria-hidden="true">»</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* List view */}
        <div className="tab-pane fade show active" id="reviews" role="tabpanel">
          <div className="row">
            {resultados.map((propiedad, index) => (
              <div className="col-lg-12" key={index}>
                <div className="property-box2 property-box4 wow fadeInUp animated" data-wow-delay=".6s">
                  <div className="item-img">
                    <a href={`/propiedad/${propiedad.id}`}>
                      <img
                        src={propiedad.imagen || "default.jpg"}
                        alt={propiedad.titulo}
                        width="250"
                        height="200"
                        className="img-fluid"
                      />
                    </a>
                    <div className="item-category-box1">
                      <div className="item-category">{propiedad.tipo}</div>
                    </div>
                  </div>
                  <div className="item-content item-content-property">
                    <div className="item-category10">
                      <a href={`/propiedad/${propiedad.id}`}>{propiedad.categoria}</a>
                    </div>
                    <div className="verified-area">
                      <h3 className="item-title">
                        <a href={`/propiedad/${propiedad.id}`}>{propiedad.titulo}</a>
                      </h3>
                    </div>
                    <div className="location-area">
                      <i className="flaticon-maps-and-flags"></i>{propiedad.ubicacion}
                    </div>
                    <div className="item-categoery3">
                      <ul>
                        <li><i className="flaticon-bed"></i>Beds: {propiedad.beds}</li>
                        <li><i className="flaticon-shower"></i>Baths: {propiedad.baths}</li>
                        <li><i className="flaticon-two-overlapping-square"></i>{propiedad.area} Sqft</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Paginación */}
          <div className="pagination-style-1 mt-4">
            <ul className="pagination">
              <li className="page-item">
                <a className="page-link" href="#" aria-label="Previous">
                  <span aria-hidden="true">«</span>
                </a>
              </li>
              <li className="page-item"><a className="page-link active" href="#">1</a></li>
              <li className="page-item"><a className="page-link" href="#">2</a></li>
              <li className="page-item"><a className="page-link" href="#">3</a></li>
              <li className="page-item">
                <a className="page-link" href="#" aria-label="Next">
                  <span aria-hidden="true">»</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
