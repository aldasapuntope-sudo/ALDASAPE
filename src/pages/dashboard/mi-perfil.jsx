import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { useUsuario } from "../../context/UserContext";
import Cargando from "../../components/cargando";
import config from "../../config";
import { actualizarPerfil, obtenerdatosperfil } from "./logica/obtenerdatosperfil";
import { useNavigate } from "react-router-dom";
import BreadcrumbALDASA from "../../cuerpos_dashboard/BreadcrumbAldasa";
import axios from "axios";

export default function MiPerfil() {
  const { usuario } = useUsuario();
  const [datos, setDatos] = useState({});
  const [cargando, setCargando] = useState(false);
  const [tiposUsuario, setTiposUsuario] = useState([]);
  const [condicionesFiscales, setCondicionesFiscales] = useState([]);
  const [condicionesFiltradas, setCondicionesFiltradas] = useState([]);

  const esRuc = datos.tipodocumento === "RUC";
  const incompleto = !datos.documento; // si no hay documento, el usuario es nuevo
    const navigate = useNavigate();
  // 🔹 Cargar combos
  useEffect(() => {
    cargarCombos();
  }, []);

  async function cargarCombos() {
    try {
      const [resTipo, resCond] = await Promise.all([
        fetch(`${config.apiUrl}api/usuariosexterno/tipo-usuario`),
        fetch(`${config.apiUrl}api/usuariosexterno/tipo-documento`),
      ]);
      setTiposUsuario(await resTipo.json());
      setCondicionesFiscales(await resCond.json());
    } catch {
      /*Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los datos iniciales.",
      });*/
    }
  }

  // 🔹 Cargar datos del perfil
  useEffect(() => {
    if (usuario?.usuarioaldasa?.id) cargarDatosCompletos();
  }, [usuario]);

  async function cargarDatosCompletos() {
    setCargando(true);
    try {
      const codigo = usuario.usuarioaldasa.id;
      const respuesta = await obtenerdatosperfil(codigo);
      
      if (respuesta?.datos?.length > 0) {
        setDatos(respuesta.datos[0]);
        formik.setValues(respuesta.datos[0]);
      }
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setCargando(false);
    }
  }

  // 🔹 Validación con Yup
  /*const schema = Yup.object().shape({
    nombre: Yup.string().required("El nombre es obligatorio"),
    apellido: Yup.string().required("El apellido o razón social es obligatorio"),
    
    movil: Yup.string()
      .matches(/^[0-9]{9}$/, "El móvil debe tener exactamente 9 dígitos")
      .required("El teléfono móvil es obligatorio"),
  });*/

  const schema = Yup.object().shape({
    tipoUsuario: Yup.string().required("El tipo de usuario es obligatorio"),
    condicionFiscal: Yup.string().required("La condición fiscal es obligatoria"),
    documento: Yup.string()
        .required("El documento es obligatorio")
        .matches(/^[0-9]+$/, "El documento debe contener solo números"),

    nombre: Yup.string().required("El nombre es obligatorio"),
    apellido: Yup.string().required("El apellido o razón social es obligatorio"),

    movil: Yup.string()
        .matches(/^[0-9]{9}$/, "El móvil debe tener exactamente 9 dígitos")
        .required("El teléfono móvil es obligatorio"),
    });


  // 🔹 Formik
  const formik = useFormik({
    initialValues: {
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        movil: "",
        documento: "",
        tipoUsuario: "",
        condicionFiscal: "",
    },
    validationSchema: schema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setCargando(true);
      try {
        const { exito, mensaje } = await actualizarPerfil(usuario?.usuarioaldasa?.id, values);
        Swal.close();

        if (exito) {
          Swal.fire({
            icon: "success",
            title: "Éxito",
            text: mensaje || "Perfil actualizado correctamente",
            }).then(() => {
            window.location.reload(); // 🔁 recarga después de cerrar el Swal
        });

          const usuarioActualizado = {
            ...usuario,
            usuarioaldasa: {
            ...usuario.usuarioaldasa,
            numero_documento: values.documento,
            nombre: values.nombre,
            apellido: values.apellido,
            telefono: values.telefono,
            movil: values.movil,
            },
        };

        localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));

        // Verificamos si el contexto tiene setUsuario disponible
        if (typeof usuario?.setUsuario === 'function') {
            usuario.setUsuario(usuarioActualizado);
        } else {
            console.warn("⚠️ No se encontró setUsuario en el contexto de usuario");
        }

       

        } else {
          Swal.fire({
            icon: "warning",
            title: "Atención",
            text: mensaje || "No se pudo actualizar el perfil",
          });
        }
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error al actualizar el perfil. Intente nuevamente.",
        });
      } finally {
        setCargando(false);
      }
    },
  });

  // 🔹 Consultar Documento (DNI o RUC)
  async function consultarDocumento() {
    const { condicionFiscal, documento } = formik.values;

    if (!documento) {
      Swal.fire({
        icon: "warning",
        title: "Atención",
        text: "Ingresa un número de documento para consultar.",
      });
      return;
    }

    const tipo =
      condicionFiscal?.toString() === "1"
        ? "dni"
        : condicionFiscal?.toString() === "2"
        ? "ruc"
        : "dni";

    setCargando(true);
    try {
      const res = await fetch(`${config.apiUrl}api/usuariosexterno/consulta/${tipo}/${documento}`);
      const data = await res.json();

      if (res.ok && (data.nombre || data.apellidos || data.razon_social)) {
        formik.setValues({
          ...formik.values,
          nombre: data.nombre || "",
          apellido: data.apellidos || data.razon_social || "",
        });

        Swal.fire({
          icon: "success",
          title: "Datos encontrados",
          text: `Se obtuvieron los datos del ${tipo.toUpperCase()}.`,
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "warning",
          title: "No encontrado",
          text: "No se encontró información para este documento.",
        });
      }
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al consultar el documento.",
      });
    } finally {
      setCargando(false);
    }
  }

  // 🔹 Filtrar condiciones según tipo de usuario
useEffect(() => {
  if (formik.values.tipoUsuario && condicionesFiscales.length > 0) {
    const esParticular = formik.values.tipoUsuario.toString() === "3";

    const filtradas = condicionesFiscales.filter((c) =>
      esParticular
        ? c.nombre.toLowerCase().includes("dni")
        : c.nombre.toLowerCase().includes("ruc")
    );

    setCondicionesFiltradas(filtradas);

    // Si el usuario ya tenía un valor previo y no pertenece a las filtradas, lo limpiamos
    if (!filtradas.some((c) => c.id === formik.values.condicionFiscal)) {
      formik.setFieldValue("condicionFiscal", "");
    }
  }
}, [formik.values.tipoUsuario, condicionesFiscales]);


async function handleImagen(e) {
  const archivo = e.target.files[0];
  if (!archivo) return;

  const formData = new FormData();
  formData.append("imagen", archivo);

  setCargando(true);

  try {
    const res = await axios.post(
      `${config.apiUrl}api/paginaprincipal/actualizar-perfil/${usuario.usuarioaldasa.id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const data = res.data;

    if (data.exito) {
      Swal.fire({
        icon: "success",
        title: "Imagen actualizada",
        text: "Tu foto de perfil se actualizó correctamente",
        timer: 2000,
        showConfirmButton: false,
      });

      // Actualizar imagen en pantalla
      setDatos((prev) => ({ ...prev, imagen: data.imagen }));
    } else {
      Swal.fire("Atención", data.mensaje || "No se pudo actualizar la imagen", "warning");
    }
  } catch (error) {
    Swal.fire("Error", "No se pudo subir la imagen", "error");
  } finally {
    setCargando(false);
  }
}


  const imagenPerfil =
    datos.imagen
      ? `${config.urlserver}${datos.imagen}`
      : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

  return (
    <>
      <Cargando visible={cargando} />

      <BreadcrumbALDASA />

      <div className="container mt-4">
        <div class="containerunj">
          
          <div className="card border-0 rounded-4 overflow-hidden">
            

            <div className="card-body p-4">
              <div className="text-center mb-4">
                <label className="foto-perfil-container">
                <img
                  src={imagenPerfil}
                  alt="Perfil"
                  className="rounded-circle shadow"
                  style={{ width: "120px", height: "120px", objectFit: "cover" }}
                />

                <div className="icono-camara">
                  <i className="fa fa-camera"></i>
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImagen}
                  style={{ display: "none" }}
                />
              </label>
              </div>

              <form onSubmit={formik.handleSubmit} className="row g-3">

                {/* 🔹 Tipo de Usuario */}
                <div className="col-md-4">
                  <label className="form-label">Tipo de Usuario</label>
                  <select
                      className={`form-select ${formik.touched.tipoUsuario && formik.errors.tipoUsuario ? "is-invalid" : ""}`}
                      name="tipoUsuario"
                      value={formik.values.tipoUsuario || ""}
                      onChange={formik.handleChange}
                      disabled={!incompleto}
                  >
                      <option selected value="">Seleccione...</option>
                      {tiposUsuario.map((t) => (
                      <option key={t.id} value={t.id}>
                          {t.nombre}
                      </option>
                      ))}
                  </select>
                  <div className="invalid-feedback">{formik.errors.tipoUsuario}</div>
                  </div>


                {/* 🔹 Condición Fiscal */}
                <div className="col-md-4">
                  <label className="form-label">Condición Fiscal</label>
                  <select
                      className={`form-select ${formik.touched.condicionFiscal && formik.errors.condicionFiscal ? "is-invalid" : ""}`}
                      name="condicionFiscal"
                      value={formik.values.condicionFiscal || ""}
                      onChange={formik.handleChange}
                      disabled={!incompleto || !formik.values.tipoUsuario} // 👈 agregado aquí
                  >
                      <option value="">Seleccione...</option>
                      {condicionesFiltradas.map((c) => (
                      <option key={c.id} value={c.id}>
                          {c.nombre}
                      </option>
                      ))}
                  </select>
                  <div className="invalid-feedback">{formik.errors.condicionFiscal}</div>
                </div>



                {/* 🔹 Documento */}
                <div className="col-md-4">
                  <label className="form-label">Documento de Identidad</label>
                  <div className="input-group">
                      <input
                      type="text"
                      className={`form-control ${formik.touched.documento && formik.errors.documento ? "is-invalid" : ""}`}
                      name="documento"
                      value={formik.values.documento}
                      onChange={formik.handleChange}
                      disabled={!incompleto}
                      />
                      <button
                      type="button"
                      className="btn btn-outline-success"
                      onClick={consultarDocumento}
                      disabled={!incompleto}
                      >
                      Consultar
                      </button>
                      <div className="invalid-feedback">{formik.errors.documento}</div>
                  </div>
                </div>


                {/* 🔹 Nombre */}
                <div className="col-md-6">
                  <label className="form-label">Nombre</label>
                  <input
                    type="text"
                    className={`form-control ${formik.touched.nombre && formik.errors.nombre ? "is-invalid" : ""}`}
                    name="nombre"
                    value={formik.values.nombre}
                    //value={formik.values.nombre}
                    onChange={formik.handleChange}
                  />
                  <div className="invalid-feedback">{formik.errors.nombre}</div>
                </div>

                {/* 🔹 Apellido o Razón Social */}
                <div className="col-md-6">
                  <label className="form-label">{esRuc ? "Razón Social" : "Apellido"}</label>
                  <input
                    type="text"
                    className={`form-control ${formik.touched.apellido && formik.errors.apellido ? "is-invalid" : ""}`}
                    name="apellido"
                    value={formik.values.apellido}
                    //value={formik.values.apellido}
                    onChange={formik.handleChange}
                  />
                  <div className="invalid-feedback">{formik.errors.apellido}</div>
                </div>

                {/* 🔹 Correo */}
                <div className="col-md-6">
                  <label className="form-label">Correo Electrónico</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formik.values.email || usuario?.email || ""}
                    disabled
                  />
                </div>

                {/* 🔹 Teléfono fijo */}
                <div className="col-md-6">
                  <label className="form-label">Teléfono Fijo</label>
                  <input
                    type="text"
                    className={`form-control ${formik.touched.telefono && formik.errors.telefono ? "is-invalid" : ""}`}
                    name="telefono"
                    value={formik.values.telefono}
                    onChange={formik.handleChange}
                  />
                  <div className="invalid-feedback">{formik.errors.telefono}</div>
                </div>

                {/* 🔹 Teléfono móvil */}
                <div className="col-md-6">
                  <label className="form-label">Teléfono Móvil</label>
                  <input
                    type="text"
                    className={`form-control ${formik.touched.movil && formik.errors.movil ? "is-invalid" : ""}`}
                    name="movil"
                    value={formik.values.movil}
                    onChange={formik.handleChange}
                  />
                  <div className="invalid-feedback">{formik.errors.movil}</div>
                </div>

                <div className="text-center mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary px-4 py-2 rounded-3"
                    style={{
                      background: "linear-gradient(90deg, rgb(5 200 81), rgb(83 217 135))",
                      border: "none",
                      fontWeight: "600",
                    }}
                  >
                    {incompleto ? "Completar Registro" : "Guardar Cambios"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
