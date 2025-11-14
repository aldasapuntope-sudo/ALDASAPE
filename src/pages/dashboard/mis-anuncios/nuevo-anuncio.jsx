import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSave, FaBullhorn } from "react-icons/fa";

import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import config from "../../../config";
import { useUsuario } from "../../../context/UserContext";
import Cargando from "../../../components/cargando";
import axios from "axios";

const NuevoAnuncio = ({ anuncio = null, onClose, onRefresh }) => {
  console.log(anuncio);
  const [tipos, setTipos] = useState([]);
  const [operaciones, setOperaciones] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [caracteristicas, setCaracteristicas] = useState([]);
  const [caracteristicasid, setCaracteristicasid] = useState([]);
  const [caracteristicasSeleccionadas, setCaracteristicasSeleccionadas] = useState({});
  const [amenities, setAmenities] = useState([]);
  const [amenitiesId, setAmenitiesId] = useState([]);
  const [monedas, setMonedas] = useState([]);
  const [simbolo, setSimbolo] = useState("");
  const [amenitiesSeleccionadas, setAmenitiesSeleccionadas] = useState({});
  const [planos, setPlanos] = useState([{ titulo: "", archivo: null }]);
  const [planosExistentes, setPlanosExistentes] = useState([]);  

  const [imagen, setImagen] = useState(null);
  const [cargando, setCargando] = useState(false);
  const { usuario } = useUsuario();
  const navigate = useNavigate();

  // 🖼️ IMÁGENES ADICIONALES
  const [imagenesSecundarias, setImagenesSecundarias] = useState([]);
  /*const addImagenSecundaria = () => setImagenesSecundarias([...imagenesSecundarias, null]);*/
  const addImagenSecundaria = () => 
  setImagenesSecundarias([...imagenesSecundarias, { id: null, imagen: null }]);

  const removeImagenSecundaria = (index) => {
    const updated = imagenesSecundarias.filter((_, i) => i !== index);
    setImagenesSecundarias(updated);
  };
  const handleImagenSecundariaChange = (e, index) => {
    const updated = [...imagenesSecundarias];
    updated[index] = e.target.files[0];
    setImagenesSecundarias(updated);
  };

  // 📐 PLANOS

  const addPlano = () => setPlanos([...planos, null]);
  const removePlano = (index) => {
    const updated = planos.filter((_, i) => i !== index);
    setPlanos(updated);
  };
  const handlePlanoChange = (e, index) => {
    const updated = [...planos];
    updated[index] = e.target.files[0];
    setPlanos(updated);
  };

  // 🎥 VIDEO
  const [videoUrl, setVideoUrl] = useState("");
  

  // 🧩 Formik
  const formik = useFormik({
    initialValues: {
      tipo_id: anuncio?.tipo_id || "",
      operacion_id: anuncio?.operacion_id || "",
      ubicacion_id: anuncio?.ubicacion_id || "",
      moneda_id: anuncio?.moneda_id || "",
      titulo: anuncio?.titulo || "",
      descripcion: anuncio?.descripcion || "",
      precio: anuncio?.precio || "",
      direccion: anuncio?.direccion || "",
      video_url: anuncio?.videos?.[0]?.url || "",
      imagen_principal: null,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      tipo_id: Yup.string().required("Seleccione un tipo de propiedad"),
      operacion_id: Yup.string().required("Seleccione un tipo de operación"),
      ubicacion_id: Yup.string().required("Seleccione una ubicación"),
      moneda_id: Yup.string().required("Seleccione una moneda"),
      direccion: Yup.string().required("La Dirección es obligatorio"),
      titulo: Yup.string().required("El título es obligatorio"),
      
      descripcion: Yup.string().required("La descripción es obligatoria"),
      precio: Yup.number()
        .typeError("Debe ser un número")
        .positive("Debe ser mayor a 0")
        .required("El precio es obligatorio"),
    }),
    onSubmit: async (values) => {
  setCargando(true);
  try {
    const formData = new FormData();

    // 1️⃣ Campos simples
    Object.entries(values).forEach(([key, value]) => {
      if (value !== null) formData.append(key, value);
    });

    // 2️⃣ User
    formData.append("user_id", usuario?.usuarioaldasa?.id);

    // 3️⃣ Características principales con valores
    const seleccionadas = Object.entries(caracteristicasSeleccionadas)
      .filter(([_, data]) => data.checked)
      .map(([id, data]) => ({
        id: parseInt(id),
        valor: data.valor || "",
      }));
    formData.append("caracteristicas", JSON.stringify(seleccionadas));

    // 4️⃣ Características secundarias (amenities)
    const seleccionadasSecundarias = Object.entries(amenitiesSeleccionadas)
      .filter(([_, data]) => data.checked)
      .map(([id]) => ({ id: parseInt(id) }));
    formData.append("caracteristicas_secundarias", JSON.stringify(seleccionadasSecundarias));

    // 5️⃣ Imagen principal
    if (values.imagen_principal) {
      formData.append("imagen_principal", values.imagen_principal);
    }

    // 6️⃣ Imágenes secundarias
    imagenesSecundarias.forEach((img, index) => {
      if (img) formData.append(`imagenes_secundarias[${index}]`, img);
    });

    // 7️⃣ Planos (cada plano tiene titulo y archivo)
    planos.forEach((plano, index) => {
      if (plano?.archivo) {
        formData.append(`planos[${index}][archivo]`, plano.archivo);
        formData.append(`planos[${index}][titulo]`, plano.titulo || "");
      }
    });

    // 8️⃣ Video URL
    if (videoUrl) formData.append("video_url", videoUrl);

    // 9️⃣ Endpoint Laravel
    const url = anuncio
      ? `${config.apiUrl}api/misanuncios/actualizar/${anuncio.id}`
      : `${config.apiUrl}api/misanuncios/registrar`;

    if (anuncio) formData.append("_method", "PUT");



    //  🔟 Enviar FormData
    const response = await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // ✅ Respuesta
    if (response.status === 200 || response.status === 201) {
      Swal.fire({
        icon: "success",
        title: anuncio ? "Anuncio actualizado" : "Anuncio publicado",
        text: anuncio
          ? "Los cambios han sido guardados correctamente."
          : "Tu propiedad ha sido publicada exitosamente.",
      });
      formik.resetForm();
      setImagen(null);
      setImagenesSecundarias([]);
      setPlanos([]);
      setCaracteristicasSeleccionadas({});
      setAmenitiesSeleccionadas({});
      onClose?.();
      onRefresh?.();
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: response.data.mensaje || "No se pudo guardar el anuncio",
      });
    }
  } catch (error) {
    console.error(error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.response.data.mensaje ||"No se pudo conectar con el servidor",
    });
  } finally {
    setCargando(false);
  }
},

  });

  // 🧩 Cargar combos al iniciar
  useEffect(() => {
    cargarCombos();
  }, []);

  useEffect(() => {
  if (caracteristicas.length && caracteristicasid.length) {
    const seleccionadas = {};

    caracteristicas.forEach((c) => {
      const existente = caracteristicasid.find(ci => ci.caracteristica_id === c.id);
      seleccionadas[c.id] = {
        checked: !!existente, // si existe, se marca
        valor: existente?.valor || "", // si tiene valor, se llena
      };
    });

    setCaracteristicasSeleccionadas(seleccionadas);
  }
}, [caracteristicas, caracteristicasid]);

useEffect(() => {
  if (formik.values.tipo_id) {
    cargarCaracteristicasPorTipo(formik.values.tipo_id);
  }
}, [formik.values.tipo_id]);

useEffect(() => {
  if (amenities.length && amenitiesId.length) {
    const seleccionadas = {};
    amenities.forEach((a) => {
      const existente = amenitiesId.find(ai => ai.amenity_id === a.id);
      seleccionadas[a.id] = {
        checked: !!existente, // marcado si existe
      };
    });
    setAmenitiesSeleccionadas(seleccionadas);
  }
}, [amenities, amenitiesId]);

  // 🧩 Cargar selección de características según el anuncio
  /*seEffect(() => {
    if (caracteristicas.length && anuncio?.caracteristicas) {
      const seleccionadas = {};
      caracteristicas.forEach((c) => {
        seleccionadas[c.id] = {
          checked: anuncio.caracteristicas.some(ac => ac.id === c.id),
          valor: anuncio.caracteristicas.find(ac => ac.id === c.id)?.valor || "",
        };
      });
      setCaracteristicasSeleccionadas(seleccionadas);
    }
  }, [caracteristicas, anuncio]);*/

  // 🔧 Cargar características y amenities según el tipo de propiedad seleccionado
  async function cargarCaracteristicasPorTipo(tipoId) {
    try {
      setCargando(true);

      // Trae características principales y secundarias relacionadas al tipo
      const [resCarac, resAmenities] = await Promise.all([
        axios.get(`${config.apiUrl}api/misanuncios/caracteristicas-catalogo/${tipoId}`),
        axios.get(`${config.apiUrl}api/misanuncios/propiedad_amenities/${tipoId}`), // si amenities son generales
      ]);

      setCaracteristicas(resCarac.data.data || resCarac.data);
      setAmenities(resAmenities.data.data || resAmenities.data);

      // Reinicia las selecciones previas
      setCaracteristicasSeleccionadas({});
      setAmenitiesSeleccionadas({});
    } catch (error) {
      console.error("❌ Error al cargar características por tipo:", error);
    } finally {
      setCargando(false);
    }
  }


  async function cargarCombos() {
    setCargando(true);
    try {
      const [resTipos, resOps, resUbic, resMonedas, resCarac, resAmenities] = await Promise.all([
        axios.get(`${config.apiUrl}api/misanuncios/tipos-propiedad`),
        axios.get(`${config.apiUrl}api/misanuncios/tipos-operacion`),
        axios.get(`${config.apiUrl}api/misanuncios/tipos-ubicaciones`),
        axios.get(`${config.apiUrl}api/misanuncios/monedas`),
       // axios.get(`${config.apiUrl}api/misanuncios/caracteristicas-catalogo/${anuncio.tipo_id}`),
       // axios.get(`${config.apiUrl}api/misanuncios/propiedad_amenities`),
      ]);

      setTipos(resTipos.data);
      setOperaciones(resOps.data);
      setUbicaciones(resUbic.data);
      setMonedas(resMonedas.data);
     // setCaracteristicas(resCarac.data.data || resCarac.data);
     // setAmenities(resAmenities.data.data || resAmenities.data);

      // Cargar características del anuncio si existe
      if (anuncio && anuncio.id) {
        // Cargar planos, características, amenities e imágenes secundarias al mismo tiempo
        const [resPlanos, resCaracid, resAmenitiesId, resImagenesSecundarias] = await Promise.all([
          axios.get(`${config.apiUrl}api/misanuncios/lplanos/${anuncio.id}`),
          axios.get(`${config.apiUrl}api/misanuncios/caracteristicas-catalogoid/${anuncio.id}`),
          axios.get(`${config.apiUrl}api/misanuncios/propiedad_amenitiesid/${anuncio.id}`),
          axios.get(`${config.apiUrl}api/misanuncios/limagenesecundarias/${anuncio.id}`), // 👈 NUEVA PETICIÓN
        ]);

        // Guardar los resultados en los estados correspondientes
        setPlanosExistentes(resPlanos.data || []);
        setCaracteristicasid(resCaracid.data || []);
        setAmenitiesId(resAmenitiesId.data || []);
        setImagenesSecundarias(resImagenesSecundarias.data || []); // 👈 NUEVO ESTADO
      }

      /*if (anuncio && anuncio.id) {

        const resPlanos = await axios.get(`${config.apiUrl}api/misanuncios/lplanos/${anuncio.id}`);
        setPlanosExistentes(resPlanos.data || []);


        const resCaracid = await axios.get(
          `${config.apiUrl}api/misanuncios/caracteristicas-catalogoid/${anuncio.id}`
        );
        
        setCaracteristicasid(resCaracid.data || resCaracid.data);
        
        const resAmenitiesId = await axios.get(
          `${config.apiUrl}api/misanuncios/propiedad_amenitiesid/${anuncio.id}`
        );
        setAmenitiesId(resAmenitiesId.data || resAmenitiesId.data);
      }*/
    } catch (error) {
      console.error("❌ Error cargando combos:", error);
    } finally {
      setCargando(false);
    }
  }



  // 🧩 Manejar check y valor
  const handleCheckChange = (id) => {
    setCaracteristicasSeleccionadas((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        checked: !prev[id]?.checked,
      },
    }));
  };

  const handleValorChange = (id, valor) => {
    setCaracteristicasSeleccionadas((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        valor,
      },
    }));
  };

  // 🧩 Imagen
  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      formik.setFieldValue("imagen_principal", file);
      setImagen(URL.createObjectURL(file));
    }
  };

  const handleAmenityCheckChange = (id) => {
    setAmenitiesSeleccionadas((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        checked: !prev[id]?.checked,
      },
    }));
  };

  const eliminarImagenSecundaria = async (imagenId) => {
    Swal.fire({
      title: "¿Eliminar imagen?",
      text: "Esta acción eliminará la imagen seleccionada.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`${config.apiUrl}api/misanuncios/eimagenesecundarias/${imagenId}`);
          if (response.data.success) {
            setImagenesSecundarias(imagenesSecundarias.filter((i) => i.id !== imagenId));
            Swal.fire({
              title: "Eliminada",
              text: "La imagen fue eliminada correctamente.",
              icon: "success",
              timer: 1800,
              showConfirmButton: false,
            });
          } else {
            Swal.fire({ title: "Error", text: "No se pudo eliminar la imagen.", icon: "error" });
          }
        } catch (error) {
          console.error("Error al eliminar imagen:", error);
          Swal.fire({ title: "Error", text: "Ocurrió un problema al eliminar la imagen.", icon: "error" });
        }
      }
    });
  };



  const eliminarPlanoExistente = async (planoId) => {
    Swal.fire({
      title: "¿Eliminar plano?",
      text: "Esta acción desactivará el plano seleccionado.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`${config.apiUrl}api/misanuncios/eplanos/${planoId}`);
          if (response.data.success) {
            // Actualiza la lista
            setPlanosExistentes(planosExistentes.filter(p => p.id !== planoId));
            Swal.fire({
              title: "Eliminado",
              text: "El plano fue eliminado correctamente.",
              icon: "success",
              timer: 1800,
              showConfirmButton: false
            });
          } else {
            Swal.fire({
              title: "Error",
              text: "No se pudo eliminar el plano. Inténtalo nuevamente.",
              icon: "error"
            });
          }
        } catch (error) {
          console.error("Error al eliminar plano:", error);
          Swal.fire({
            title: "Error",
            text: "Ocurrió un problema al eliminar el plano.",
            icon: "error"
          });
        }
      }
    });
  };

  

  return (
    <div className="card shadow-sm border-0 p-4">
      <h4 className="mb-4 text-success fw-bold">
        {anuncio ? "✏️ Editar anuncio" : "🏠 Publicar nuevo anuncio"}
      </h4>

      {cargando && <Cargando visible={true} />}

      <form onSubmit={formik.handleSubmit} className="row g-3">
        {/* Tipo */}
        <div className="col-md-6">
          <label className="form-label fw-semibold">Tipo</label>
          <select className="form-select" {...formik.getFieldProps("tipo_id")}>
            <option value="">Selecciona</option>
            {tipos.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nombre.toUpperCase()}
              </option>
            ))}
          </select>
          {formik.touched.tipo_id && formik.errors.tipo_id && (
            <small className="text-danger">{formik.errors.tipo_id}</small>
          )}
        </div>

        {/* Operación */}
        <div className="col-md-6">
          <label className="form-label fw-semibold">Operación</label>
          <select className="form-select" {...formik.getFieldProps("operacion_id")}>
            <option value="">Selecciona</option>
            {operaciones.map((o) => (
              <option key={o.id} value={o.id}>
                {o.nombre.toUpperCase()}
              </option>
            ))}
          </select>
          {formik.touched.operacion_id && formik.errors.operacion_id && (
            <small className="text-danger">{formik.errors.operacion_id}</small>
          )}
        </div>

        {/* Ubicación */}
        <div className="col-md-12">
          <label className="form-label fw-semibold">Ubicación</label>
          <select className="form-select" {...formik.getFieldProps("ubicacion_id")}>
            <option value="">Selecciona</option>
            {ubicaciones.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nombre.toUpperCase()}
              </option>
            ))}
          </select>
          {formik.touched.ubicacion_id && formik.errors.ubicacion_id && (
            <small className="text-danger">{formik.errors.ubicacion_id}</small>
          )}
        </div>

         {/* Dirección */}
        <div className="col-md-12">
          <label className="form-label fw-semibold">Dirección</label>
          <input type="text" className="form-control" {...formik.getFieldProps("direccion")} />
          {formik.touched.direccion && formik.errors.direccion && (
            <small className="text-danger">{formik.errors.direccion}</small>
          )}
        </div>
        
        {/* Título */}
        <div className="col-md-12">
          <label className="form-label fw-semibold">Título</label>
          <input type="text" className="form-control" {...formik.getFieldProps("titulo")} />
          {formik.touched.titulo && formik.errors.titulo && (
            <small className="text-danger">{formik.errors.titulo}</small>
          )}
        </div>

        {/* Descripción */}
        <div className="col-md-12">
          <label className="form-label fw-semibold">Descripción</label>
          <textarea
            rows="3"
            className="form-control"
            {...formik.getFieldProps("descripcion")}
          ></textarea>
          {formik.touched.descripcion && formik.errors.descripcion && (
            <small className="text-danger">{formik.errors.descripcion}</small>
          )}
        </div>

        {/* Moneda */}
        <div className="col-md-6">
          <label className="form-label fw-semibold">Moneda</label>
          <select
            className="form-select"
            {...formik.getFieldProps("moneda_id")}
            onChange={(e) => {
              formik.handleChange(e);
              const monedaSeleccionada = monedas.find(
                (m) => m.id === parseInt(e.target.value)
              );
              setSimbolo(monedaSeleccionada ? monedaSeleccionada.simbolo : "");
            }}
          >
            <option value="">Selecciona</option>
            {monedas.map((m) => (
              <option key={m.id} value={m.id}>
                {m.simbolo} - {m.nombre}
              </option>
            ))}
          </select>
          {formik.touched.moneda_id && formik.errors.moneda_id && (
            <small className="text-danger">{formik.errors.moneda_id}</small>
          )}
        </div>

        {/* Precio */}
        <div className="col-md-6">
          <label className="form-label fw-semibold">
            Precio {simbolo && `(${simbolo})`}
          </label>
          <input
            type="number"
            className="form-control"
            {...formik.getFieldProps("precio")}
          />
          {formik.touched.precio && formik.errors.precio && (
            <small className="text-danger">{formik.errors.precio}</small>
          )}
        </div>



        {/* Imagen */}
        <div className="col-md-6">
          <label className="form-label fw-semibold">Imagen principal</label>
          <input type="file" accept="image/*" className="form-control" onChange={handleImagenChange} />
          {formik.touched.imagen_principal && formik.errors.imagen_principal && (
            <small className="text-danger">{formik.errors.imagen_principal}</small>
          )}
          {imagen && (
            <div className="mt-3">
              <img
                src={imagen}
                alt="Vista previa"
                className="rounded shadow-sm"
                style={{ width: "200px", height: "150px", objectFit: "cover" }}
              />
            </div>
          )}
        </div>

   

      

       {/* SECCIÓN DE ATRIBUTOS Y ARCHIVOS */}
<div className="col-12 mt-3">
  {/* 🖼️ Acordeón para Imágenes Adicionales */}
  <div className="accordion mb-3" id="accordionImagenesAdicionales">
    <div className="accordion-item">
      <h2 className="accordion-header" id="headingImgsAdic">
        <button
          className="accordion-button collapsed accordion-btn-green"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapseImgsAdic"
          aria-expanded="false"
          aria-controls="collapseImgsAdic"
        >
          Imágenes Adicionales
        </button>
      </h2>
      <div
        id="collapseImgsAdic"
        className="accordion-collapse collapse show"
        aria-labelledby="headingImgsAdic"
        data-bs-parent="#accordionImagenesAdicionales"
      >
        <div className="accordion-body">

          {/* 🔹 Imágenes existentes */}
          {Array.isArray(imagenesSecundarias) && imagenesSecundarias.length > 0 && (
            <div className="mb-4">
              <h6 className="fw-bold">Imágenes adicionales existentes</h6>
              <div className="row">
                {imagenesSecundarias.map((img, index) => (
                  <div key={img.id || index} className="col-md-3 mb-3 text-center">
                    <div className="border rounded-3 p-2 shadow-sm">
                      {img.imagen ? (
                        <>
                          <img
                            src={
                              img.imagen.startsWith("http")
                                ? img.imagen
                                : `${config.urlserver}${img.imagen}`
                            }
                            alt="Imagen secundaria"
                            className="img-fluid rounded mb-2"
                            style={{ height: "150px", objectFit: "cover" }}
                          />
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => eliminarImagenSecundaria(img.id)}
                          >
                            Eliminar
                          </button>
                        </>
                      ) : (
                        <div className="d-flex align-items-center">
                          <input
                            type="file"
                            accept="image/*"
                            className="form-control"
                            onChange={(e) => handleImagenSecundariaChange(e, index)}
                          />
                          <button
                            type="button"
                            className="btn btn-danger btn-sm ms-2"
                            onClick={() => removeImagenSecundaria(index)}
                          >
                            Eliminar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 🔹 Agregar nuevas imágenes */}
          

          <button
            type="button"
            className="btn btn-outline-success btn-sm mt-2"
            onClick={addImagenSecundaria}
          >
            + Agregar otra imagen
          </button>
        </div>
      </div>
    </div>
  </div>


  {/* ⚙️ Acordeón para Características Principales */}
  <div className="accordion mb-3" id="accordionCaracteristicas">
    <div className="accordion-item">
      <h2 className="accordion-header" id="headingCarac">
        <button
          className="accordion-button collapsed accordion-btn-green"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapseCarac"
          aria-expanded="false"
          aria-controls="collapseCarac"
        >
          Características Principales
        </button>
      </h2>
      <div
        id="collapseCarac"
        className="accordion-collapse collapse show"
        aria-labelledby="headingCarac"
        data-bs-parent="#accordionCaracteristicas"
      >
        <div className="accordion-body">
          <div className="row">
            {caracteristicas.map((carac) => {
              const checked = caracteristicasSeleccionadas[carac.id]?.checked || false;
              const valor = caracteristicasSeleccionadas[carac.id]?.valor || "";
              return (
                <div className="col-md-6 mb-2" key={carac.id}>
                  <div
                    className={`border rounded-3 p-2 d-flex align-items-center ${
                      checked ? "border-success bg-light" : ""
                    }`}
                  >
                    <div className="form-check me-2">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`carac-${carac.id}`}
                        checked={checked}
                        onChange={() => handleCheckChange(carac.id)}
                      />
                      <label htmlFor={`carac-${carac.id}`} className="form-check-label">
                        {carac.nombre}
                      </label>
                    </div>
                    {checked && (
                      <input
                        type="text"
                        className="form-control form-control-sm ms-2"
                        placeholder="Valor (opcional)"
                        value={valor}
                        onChange={(e) => handleValorChange(carac.id, e.target.value)}
                        style={{ maxWidth: "150px" }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* 🏘️ Acordeón para Características Secundarias */}
  <div className="accordion mb-3" id="accordionAmenities">
    <div className="accordion-item">
      <h2 className="accordion-header" id="headingAmen">
        <button
          className="accordion-button collapsed accordion-btn-green"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapseAmen"
          aria-expanded="false"
          aria-controls="collapseAmen"
        >
          Características Secundarias
        </button>
      </h2>
      <div
        id="collapseAmen"
        className="accordion-collapse collapse show"
        aria-labelledby="headingAmen"
        data-bs-parent="#accordionAmenities"
      >
        <div className="accordion-body">
          <div className="row">
            {amenities.map((amenity) => {
              const checked = amenitiesSeleccionadas[amenity.id]?.checked || false;
              return (
                <div className="col-md-6 mb-2" key={amenity.id}>
                  <div
                    className={`border rounded-3 p-2 d-flex align-items-center ${
                      checked ? "border-success bg-light" : ""
                    }`}
                  >
                    <div className="form-check me-2">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`amenity-${amenity.id}`}
                        checked={checked}
                        onChange={() => handleAmenityCheckChange(amenity.id)}
                      />
                      <label htmlFor={`amenity-${amenity.id}`} className="form-check-label">
                        {amenity.nombre}
                      </label>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* 📐 Acordeón para Planos */}
  {/* 📐 Acordeón para Planos */}
<div className="accordion mb-3" id="accordionPlanos">
  <div className="accordion-item">
    <h2 className="accordion-header" id="headingPlanos">
      <button
        className="accordion-button collapsed accordion-btn-green"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#collapsePlanos"
        aria-expanded="false"
        aria-controls="collapsePlanos"
      >
        Planos
      </button>
    </h2>
    <div
      id="collapsePlanos"
      className="accordion-collapse collapse show"
      aria-labelledby="headingPlanos"
      data-bs-parent="#accordionPlanos"
    >
      <div className="accordion-body">

        {/* 🔹 Planos existentes */}
        {Array.isArray(planosExistentes) && planosExistentes.length > 0 && (
          <div className="mb-4">
            <h6 className="fw-bold">Planos existentes</h6>
            <div className="row">
              {planosExistentes.map((plano) => (
                <div key={plano.id} className="col-md-4 mb-3 text-center">
                  <div className="border rounded-3 p-2 shadow-sm">
                    <p className="fw-semibold mb-1">{plano.titulo}</p>
                    <img
                      src={plano.archivo?.startsWith('http') ? plano.archivo : `${config.urlserver}${plano.imagen}`}
                      alt={plano.titulo}
                      className="img-fluid rounded mb-2"
                      style={{ maxHeight: "150px", objectFit: "contain" }}
                    />
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => eliminarPlanoExistente(plano.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}


        {/* 🔹 Agregar nuevos planos */}
        <h6 className="fw-bold">Agregar nuevos planos</h6>
        {planos.map((plano, index) => (
          <div key={index} className="mb-3 border rounded-3 p-2">
            <div className="mb-2">
              <label className="form-label fw-semibold">Título del plano</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ingrese título"
                value={plano?.titulo || ""}
                onChange={(e) => {
                  const updated = [...planos];
                  updated[index] = { ...updated[index], titulo: e.target.value };
                  setPlanos(updated);
                }}
              />
            </div>
            <div className="d-flex align-items-center">
              <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={(e) => {
                  const updated = [...planos];
                  updated[index] = { ...updated[index], archivo: e.target.files[0] };
                  setPlanos(updated);
                }}
              />
              <button
                type="button"
                className="btn btn-danger btn-sm ms-2"
                onClick={() => removePlano(index)}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          className="btn btn-outline-success btn-sm mt-2"
          onClick={() => setPlanos([...planos, { titulo: "", archivo: null }])}
        >
          + Agregar otro plano
        </button>
      </div>
    </div>
  </div>
</div>




  {/* 🎥 Acordeón para Video */}
  <div className="accordion mb-3" id="accordionVideo">
    <div className="accordion-item">
      <h2 className="accordion-header" id="headingVideo">
        <button
          className="accordion-button collapsed accordion-btn-green"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapseVideo"
          aria-expanded="false"
          aria-controls="collapseVideo"
        >
          Video
        </button>
      </h2>
      <div
        id="collapseVideo"
        className="accordion-collapse collapse show"
        aria-labelledby="headingVideo"
        data-bs-parent="#accordionVideo"
      >
        <div className="accordion-body">
          
          <input
            type="url"
            className="form-control"
            placeholder="https://youtube.com/..."
            {...formik.getFieldProps("video_url")}
          />
         

        </div>
      </div>
    </div>
  </div>
</div>



        {/* Botón */}
        <div className="col-12 mt-4 text-end">
          <button type="submit" className="btn btn-success px-4 py-2 fw-bold rounded-3">
            {anuncio ? <><FaSave /> Guardar cambios</> : <><FaBullhorn /> Publicar anuncio</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NuevoAnuncio;
