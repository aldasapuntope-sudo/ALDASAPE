import React, { useEffect, useState } from "react";
import {
  FaMapMarkerAlt,
  FaShareAlt,
  FaHeart,
  FaPrint,
  FaClock,
  FaEye,
} from "react-icons/fa";
import Swal from "sweetalert2";
import config from "../../../config";
import { useUsuario } from "../../../context/UserContext"; // ✅ asegúrate de importar el componente
import Cargando from "../../cargando";

const tiempoTranscurrido = (fecha) => {
  if (!fecha) return "Fecha no disponible";
  const ahora = new Date();
  const creada = new Date(fecha);
  const diff = ahora - creada;
  const segundos = Math.floor(diff / 1000);
  const minutos = Math.floor(segundos / 60);
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);
  const meses = Math.floor(dias / 30);
  const años = Math.floor(meses / 12);

  if (años > 0) return `Hace ${años} año${años > 1 ? "s" : ""}`;
  if (meses > 0) return `Hace ${meses} mes${meses > 1 ? "es" : ""}`;
  if (dias > 0) return `Hace ${dias} día${dias > 1 ? "s" : ""}`;
  if (horas > 0) return `Hace ${horas} hora${horas > 1 ? "s" : ""}`;
  if (minutos > 0) return `Hace ${minutos} minuto${minutos > 1 ? "s" : ""}`;
  return "Hace unos segundos";
};

export default function PropertyHeading({ anuncio }) {
  const [tipoCambio, setTipoCambio] = useState(null);
  const [esFavorito, setEsFavorito] = useState(false);
  const [cargando, setCargando] = useState(false); // ✅ Estado del cargando
  const { usuario } = useUsuario();

  // 🔹 Obtener tipo de cambio
  useEffect(() => {
    const obtenerTipoCambio = async () => {
      try {
        const res = await fetch(`${config.apiUrl}api/paginaprincipal/tipo-cambio`);
        const data = await res.json();
        setTipoCambio(data.venta);
      } catch (error) {
        console.error("Error al obtener tipo de cambio:", error);
      }
    };
    obtenerTipoCambio();
  }, []);

  // 🔹 Verificar si el anuncio ya está en favoritos
  useEffect(() => {
    const verificarFavorito = async () => {
      if (!usuario) return;
      setCargando(true);
      try {
        const res = await fetch(
          `${config.apiUrl}api/paginaprincipal/favoritos/existe/${usuario.usuarioaldasa.id}/${anuncio.id}`
        );
        const data = await res.json();
        setEsFavorito(data.existe);
      } catch (error) {
        console.error("Error al verificar favorito:", error);
      } finally {
        setCargando(false);
      }
    };
    verificarFavorito();
  }, [usuario, anuncio]);

  // 📱 Compartir
  const handleShare = () => {
    const url = window.location.href;
    const title = anuncio?.titulo || "Propiedad en venta";

    if (navigator.share) {
      navigator
        .share({
          title,
          text: `Mira esta propiedad: ${title}`,
          url,
        })
        .then(() => console.log("Compartido con éxito"))
        .catch((err) => console.error("Error al compartir:", err));
    } else {
      navigator.clipboard.writeText(url);
      Swal.fire({
        icon: "success",
        title: "¡Enlace copiado!",
        text: "El enlace se ha copiado al portapapeles.",
        confirmButtonColor: "#28a745",
      });
    }
  };

  // ❤️ Agregar o quitar favorito
  const handleFavorito = async () => {
    if (!usuario) {
      Swal.fire({
        title: "Inicia sesión",
        text: "Debes iniciar sesión para guardar en favoritos.",
        icon: "warning",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Entendido",
      });
      return;
    }

    setCargando(true);
    try {
      const url = esFavorito
        ? `${config.apiUrl}api/paginaprincipal/favoritos/eliminar`
        : `${config.apiUrl}api/paginaprincipal/favoritos/guardar`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario_id: usuario.usuarioaldasa.id,
          anuncio_id: anuncio.id,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setEsFavorito(!esFavorito);
        Swal.fire({
          icon: "success",
          title: esFavorito
            ? "Eliminado de favoritos 💔"
            : "Agregado a favoritos ❤️",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message || "No se pudo actualizar el favorito.",
        });
      }
    } catch (error) {
      console.error("Error al guardar/eliminar favorito:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al procesar tu solicitud.",
      });
    } finally {
      setCargando(false);
    }
  };

  const handlePrint = () => window.print();

  const precioSoles = parseFloat(anuncio?.precio) || 0;
  const precioDolares = tipoCambio ? (precioSoles / tipoCambio).toFixed(2) : null;

  return (
    <div className="position-relative">
      {/* 🌀 Loader visible durante las acciones */}
      <Cargando visible={cargando} />

      <div className="property-heading">
        {/* 🏷️ Operación y precio */}
        <div className="row">
          <div className="col-lg-6 col-md-12">
            <div className="single-list-cate">
                <div className="item-categoery text-uppercase fw-semibold text-success">
                  {anuncio?.operaciones ? anuncio.operaciones.toUpperCase() : "SIN OPERACIÓN"}
                </div>
            </div>
            
          </div>
          <div className="col-lg-6 col-md-12">
            <div className="single-list-price text-end fs-4 fw-bold text-primary">
              {(() => {
                if (!anuncio?.precio) return <div>Precio no disponible</div>;

                const precio = parseFloat(anuncio.precio);
                const simbolo = anuncio?.moneda_simbolo || "";
                const nombre = anuncio?.moneda_nombre?.toLowerCase() || "";

                if (!tipoCambio) {
                  return (
                    <div>
                      {nombre.toUpperCase()} = {simbolo}
                      {precio.toLocaleString("es-PE", { minimumFractionDigits: 2 })}
                      <br />
                      <small className="text-muted">Cargando tipo de cambio...</small>
                    </div>
                  );
                }

                // 💵 Si la moneda es SOLES
                if (nombre.includes("Sol") || simbolo === "S/") {
                  const precioUSD = (precio / tipoCambio).toFixed(2);
                  return (
                    <>
                      <div>
                        SOL = S/
                        {precio.toLocaleString("es-PE", { minimumFractionDigits: 2 })}
                      </div>
                      <small className="text-muted">
                        USD = $
                        {parseFloat(precioUSD).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </small>
                    </>
                  );
                }

                // 💲 Si la moneda es DÓLAR
                if (nombre.includes("Dólar") || simbolo === "$") {
                  const precioPEN = (precio * tipoCambio).toFixed(2);
                  return (
                    <>
                      <div>
                        USD = ${precio.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </div>
                      <small className="text-muted">
                        SOL = S/
                        {parseFloat(precioPEN).toLocaleString("es-PE", {
                          minimumFractionDigits: 2,
                        })}
                      </small>
                    </>
                  );
                }

                // 🌍 Otras monedas (por si acaso)
                return (
                  <div>
                    {nombre.toUpperCase()} = {simbolo}
                    {precio.toLocaleString("es-PE", { minimumFractionDigits: 2 })}
                  </div>
                );
              })()}
            </div>
          </div>


        </div>

        {/* 🏠 Título y dirección */}
        <div className="row align-items-center">
          <div className="col-lg-8 col-md-12">
            <h3 className="fw-bold text-dark mb-2">{anuncio?.titulo || "Propiedad sin título"}</h3>

            <ul className="list-unstyled mb-0 d-flex flex-wrap align-items-center gap-3 text-muted">
              <li>
                <FaMapMarkerAlt className="me-2 text-success" />
                {anuncio?.direccion
                  ? `${anuncio.direccion} - ${anuncio.ubicacion}`
                  : anuncio?.ubicacion || "Ubicación no disponible"}{" "}
                /
              </li>
              <li>
                <FaClock className="me-2 text-success" />
                {tiempoTranscurrido(anuncio?.created_at)} /
              </li>
              <li>
                <FaEye className="me-2 text-success" />
                Vistas: {(anuncio?.visitas ?? 0) + 1}
              </li>
            </ul>
          </div>

          {/* 🔘 Botones de acción */}
          <div className="col-lg-4 col-md-12">
            <div className="side-button text-end">
              <ul className="list-inline mb-0 d-flex justify-content-end gap-2">
                <li>
                  <button onClick={handleShare} className="btn btn-outline-success btn-sm rounded-circle">
                    <FaShareAlt />
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleFavorito}
                    className={`btn btn-sm rounded-circle ${
                      esFavorito ? "btn-danger" : "btn-outline-danger"
                    }`}
                  >
                    <FaHeart />
                  </button>
                </li>
                <li>
                  <button onClick={handlePrint} className="btn btn-outline-dark btn-sm rounded-circle">
                    <FaPrint />
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
