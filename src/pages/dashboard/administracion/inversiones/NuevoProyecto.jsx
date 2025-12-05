import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import config from "../../../../config";
import Cargando from "../../../../components/cargando";

export default function NuevoProyecto({ proyectoId, onClose, onSuccess }) {
  const [cargando, setCargando] = useState(false);
  const [datosProyecto, setDatosProyecto] = useState(null);
  const [multimedia, setMultimedia] = useState([]);
  const [caracteristicas, setCaracteristicas] = useState([]);
  const [etapas, setEtapas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [inversionistas, setInversionistas] = useState([]);

  const esEdicion = Boolean(proyectoId);

 const extraerIdYoutube = (url) => {
  try {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  } catch {
    return null;
  }
};

  useEffect(() => {
    cargarUsuarios();
    if (esEdicion) cargarDatosEditar();
  }, [proyectoId]);

  const cargarUsuarios = async () => {
    try {
      const res = await axios.get(`${config.apiUrl}api/inversiones/usuarios`);
      setUsuarios(res.data);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudieron cargar los usuarios", "error");
    }
  };

  const cargarDatosEditar = async () => {
    setCargando(true);
    try {
      const res = await axios.get(
        `${config.apiUrl}api/inversiones/proyectos/detalle/${proyectoId.id}`
      );

      const data = Array.isArray(res.data) ? res.data[0] : res.data;

      setDatosProyecto(data);
      setMultimedia(data.multimedia || []);
      setCaracteristicas(data.caracteristicas || []);
      setEtapas(data.etapas || []);

      // Inversionistas formateados
      setInversionistas(
        (data.inversionistas || []).map((inv) => ({
          id: inv.id,
          interesado_id: inv.interesado_id,
          estado: inv.estado,
        }))
      );
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo cargar el proyecto", "error");
    } finally {
      setCargando(false);
    }
  };


  const confirmarEliminacion = async (callback) => {
    Swal.fire({
      title: "¿Eliminar elemento?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        await callback();
        Swal.fire("Eliminado", "El elemento ha sido eliminado", "success");
      }
    });
  };


  const eliminarMultimedia = async (item, index) => {
    confirmarEliminacion(async () => {
      if (item.id) {
        await axios.delete(`${config.apiUrl}api/inversiones/emultimedia/${item.id}`);
      }

      const copia = [...multimedia];
      copia.splice(index, 1);
      setMultimedia(copia);
    });
  };


  const eliminarEtapa = async (item, index) => {
    confirmarEliminacion(async () => {
      if (item.id) {
        await axios.delete(`${config.apiUrl}api/inversiones/eetapas/${item.id}`);
      }

      const copia = [...etapas];
      copia.splice(index, 1);
      setEtapas(copia);
    });
  };

  const eliminarCaracteristica = async (item, index) => {
    confirmarEliminacion(async () => {
      if (item.id) {
        await axios.delete(`${config.apiUrl}api/inversiones/ecaracteristicas/${item.id}`);
      }

      const copia = [...caracteristicas];
      copia.splice(index, 1);
      setCaracteristicas(copia);
    });
  };

  const eliminarInversionista = async (item, index) => {
    confirmarEliminacion(async () => {
      if (item.id) {
        await axios.delete(`${config.apiUrl}api/inversiones/einversionistas/${item.id}`);
      }

      const copia = [...inversionistas];
      copia.splice(index, 1);
      setInversionistas(copia);
    });
  };




  // ==========================================================
  // VALIDACIÓN FORM
  // ==========================================================
  const esquema = Yup.object().shape({
    titulo: Yup.string().required("El título es obligatorio"),
    descripcion: Yup.string().required("La descripción es obligatoria"),
    ubicacion: Yup.string().required("La ubicación es obligatoria"),
    porcentaje_avance: Yup.number()
      .min(0, "Mínimo 0%")
      .max(100, "Máximo 100%")
      .required("El porcentaje es obligatorio"),
  });

  // ==========================================================
  // FORMULARIO
  // ==========================================================
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      titulo: datosProyecto?.titulo || "",
      descripcion: datosProyecto?.descripcion || "",
      ubicacion: datosProyecto?.ubicacion || "",
      porcentaje_avance: datosProyecto?.porcentaje_avance || 0,
      imagen_principal: null,
      is_active: datosProyecto?.is_active ?? 1,
    },
    validationSchema: esquema,

    onSubmit: async (values) => {
      setCargando(true);
      try {
        let formData = new FormData();

        // Valores simples
        Object.entries(values).forEach(([k, v]) => {
          if (k === "imagen_principal" && v === null) return;
          formData.append(k, v);
        });

        // MULTIMEDIA
        multimedia.forEach((item, i) => {
          if (item.archivo instanceof File) {
            // archivo nuevo → se envía archivo
            formData.append(`multimedia[${i}][archivo]`, item.archivo);
            formData.append(`multimedia[${i}][tipo]`, item.tipo);
          } else {
            // archivo existente → NO se envía "archivo", solo el id
            formData.append(`multimedia[${i}][id]`, item.id);
            formData.append(`multimedia[${i}][tipo]`, item.tipo);
          }
        });

        // INVERSIONISTAS
        inversionistas.forEach((item, i) => {
          formData.append(`inversionistas[${i}][id]`, item.id || "");
          formData.append(`inversionistas[${i}][interesado_id]`, item.interesado_id);
          formData.append(`inversionistas[${i}][estado]`, item.estado);
        });

        // CARACTERÍSTICAS
        caracteristicas.forEach((item, i) => {
          formData.append(`caracteristicas[${i}][id]`, item.id || "");
          formData.append(`caracteristicas[${i}][titulo]`, item.titulo);
          formData.append(`caracteristicas[${i}][descripcion]`, item.descripcion);
        });

        // ETAPAS
        etapas.forEach((item, i) => {
          formData.append(`etapas[${i}][id]`, item.id || "");
          formData.append(`etapas[${i}][nombre]`, item.nombre);
          formData.append(`etapas[${i}][descripcion]`, item.descripcion);
          formData.append(`etapas[${i}][orden]`, item.orden);
          formData.append(`etapas[${i}][completado]`, item.completado ? 1 : 0);
          formData.append(`etapas[${i}][fecha_completado]`, item.fecha_completado || "");
        });

        for (let pair of formData.entries()) {
  console.log(pair[0] + ": ", pair[1]);
}
        let r;
        if (esEdicion) {
          r = await axios.post(
            `${config.apiUrl}api/proyectos/${proyectoId.id}/actualizar`,
            formData
          );

          
        } else {
          r = await axios.post(`${config.apiUrl}api/proyectos/crear`, formData);
        }
        
        Swal.fire("Éxito", r.data.mensaje, "success");
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "No se pudo guardar el proyecto", "error");
      } finally {
        setCargando(false);
      }
    },
  });

  // ==========================================================
  // AGREGAR MULTIMEDIA
  // ==========================================================
  const agregarMultimedia = (tipo) => {
    setMultimedia([...multimedia, { tipo, archivo: null }]);
  };

  const cambiarArchivo = (index, file) => {
    const copia = [...multimedia];
    copia[index].archivo = file;
    setMultimedia(copia);
  };

  // ==========================================================
  // UI
  // ==========================================================
  return (
    <div className="container py-3">
      <Card className="shadow-sm border-0 rounded-4">
        <Card.Body>
          <h3 className="fw-bold mb-3">
            {esEdicion ? "Editar Proyecto" : "Nuevo Proyecto"}
          </h3>

          {cargando && <Cargando visible={true} />}

          <Form onSubmit={formik.handleSubmit}>
            <Row>
              <Col md={12}>
                {/* TITULO */}
                <Form.Group className="mb-3">
                  <Form.Label>Título</Form.Label>
                  <Form.Control
                    name="titulo"
                    value={formik.values.titulo}
                    onChange={formik.handleChange}
                  />
                </Form.Group>

                {/* DESCRIPCIÓN */}
                <Form.Group className="mb-3">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="descripcion"
                    value={formik.values.descripcion}
                    onChange={formik.handleChange}
                  />
                </Form.Group>

                {/* UBICACIÓN */}
                <Form.Group className="mb-3">
                  <Form.Label>Ubicación</Form.Label>
                  <Form.Control
                    name="ubicacion"
                    value={formik.values.ubicacion}
                    onChange={formik.handleChange}
                  />
                </Form.Group>

                {/* IMAGEN PRINCIPAL */}
                <Form.Group className="mb-3">
                  <Form.Label>Imagen principal</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={(e) =>
                      formik.setFieldValue("imagen_principal", e.target.files[0])
                    }
                  />
                </Form.Group>
              </Col>

              {/* ====================================================== */}
              {/* INVERSIONISTAS */}
              {/* ====================================================== */}

              <h5 className="mt-4">Inversionistas del Proyecto</h5>

              <Button
                variant="primary"
                size="sm"
                className="mb-2"
                onClick={() =>
                  setInversionistas([
                    ...inversionistas,
                    { interesado_id: "", estado: "interesado" },
                  ])
                }
              >
                + Agregar Inversionista
              </Button>

              {inversionistas.map((inv, index) => (
                <div key={index} className="p-2 mt-2 border rounded">
                  {/* SELECT USUARIO */}
                  <Form.Group className="mb-2">
                    <Form.Label>Usuario</Form.Label>
                    <Form.Select
                      value={inv.id}
                      onChange={(e) => {
                        const copia = [...inversionistas];
                        copia[index].interesado_id = e.target.value;
                        setInversionistas(copia);
                      }}
                    >
                      <option value="">Seleccione un usuario</option>
                      {usuarios.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.nombre} {u.apellido}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  {/* ESTADO */}
                  <Form.Group className="mb-2">
                    <Form.Label>Estado</Form.Label>
                    <Form.Select
                      value={inv.estado}
                      onChange={(e) => {
                        const copia = [...inversionistas];
                        copia[index].estado = e.target.value;
                        setInversionistas(copia);
                      }}
                    >
                      <option value="interesado">Interesado</option>
                      <option value="aceptado">Aceptado</option>
                      <option value="rechazado">Rechazado</option>
                    </Form.Select>
                  </Form.Group>

                  {/* ELIMINAR */}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => eliminarInversionista(inv, index)}
                  >
                    Eliminar
                  </Button>

                </div>
              ))}

              {/* ====================================================== */}
              {/* CARACTERÍSTICAS */}
              {/* ====================================================== */}

              <h5 className="mt-4">Características del Proyecto</h5>

              <Button
                variant="primary"
                size="sm"
                className="mb-2"
                onClick={() =>
                  setCaracteristicas([
                    ...caracteristicas,
                    { titulo: "", descripcion: "" },
                  ])
                }
              >
                + Agregar Característica
              </Button>

              {caracteristicas.map((item, index) => (
                <div key={index} className="p-2 mt-2 border rounded">
                  <Form.Group className="mb-2">
                    <Form.Label>Título</Form.Label>
                    <Form.Control
                      value={item.titulo}
                      onChange={(e) => {
                        const copia = [...caracteristicas];
                        copia[index].titulo = e.target.value;
                        setCaracteristicas(copia);
                      }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-2">
                    <Form.Label>Descripción</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={item.descripcion}
                      onChange={(e) => {
                        const copia = [...caracteristicas];
                        copia[index].descripcion = e.target.value;
                        setCaracteristicas(copia);
                      }}
                    />
                  </Form.Group>

                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => eliminarCaracteristica(item, index)}
                  >
                    Eliminar
                  </Button>
                </div>
              ))}

              {/* ====================================================== */}
              {/* ETAPAS */}
              {/* ====================================================== */}

              <h5 className="mt-4">Etapas del Proyecto</h5>

              <Button
                variant="primary"
                size="sm"
                className="mb-2"
                onClick={() =>
                  setEtapas([
                    ...etapas,
                    {
                      nombre: "",
                      descripcion: "",
                      orden: etapas.length + 1,
                      completado: 0,
                      fecha_completado: "",
                    },
                  ])
                }
              >
                + Agregar Etapa
              </Button>

              {etapas.map((item, index) => (
                <div key={index} className="p-2 mt-2 border rounded">
                  <Form.Group className="mb-2">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                      value={item.nombre}
                      onChange={(e) => {
                        const copia = [...etapas];
                        copia[index].nombre = e.target.value;
                        setEtapas(copia);
                      }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-2">
                    <Form.Label>Descripción</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={item.descripcion}
                      onChange={(e) => {
                        const copia = [...etapas];
                        copia[index].descripcion = e.target.value;
                        setEtapas(copia);
                      }}
                    />
                  </Form.Group>

                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-2">
                        <Form.Label>Orden</Form.Label>
                        <Form.Control
                          type="number"
                          value={item.orden}
                          onChange={(e) => {
                            const copia = [...etapas];
                            copia[index].orden = e.target.value;
                            setEtapas(copia);
                          }}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={4}>
                      <Form.Group className="mb-2">
                        <Form.Check
                          type="checkbox"
                          label="Completado"
                          checked={item.completado === 1}
                          onChange={(e) => {
                            const copia = [...etapas];
                            copia[index].completado = e.target.checked ? 1 : 0;
                            setEtapas(copia);
                          }}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={4}>
                      <Form.Group className="mb-2">
                        <Form.Label>Fecha completado</Form.Label>
                        <Form.Control
                          type="datetime-local"
                          value={item.fecha_completado || ""}
                          onChange={(e) => {
                            const copia = [...etapas];
                            copia[index].fecha_completado = e.target.value;
                            setEtapas(copia);
                          }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => eliminarEtapa(item, index)}
                  >
                    Eliminar
                  </Button>
                </div>
              ))}

              {/* ====================================================== */}
              {/* MULTIMEDIA + PREVIEW */}
              {/* ====================================================== */}

              {/* ====================================================== */}
                <Col md={12} className="mt-4">
                <h5>Multimedia</h5>

                <Button
                    variant="primary"
                    size="sm"
                    className="me-2"
                    onClick={() => agregarMultimedia("imagen")}
                >
                    + Imagen
                </Button>

                <Button
                    variant="primary"
                    size="sm"
                    onClick={() => agregarMultimedia("video")}
                >
                    + Video
                </Button>

                {multimedia.map((item, index) => {
                    const esFile = item.archivo instanceof File;
                    const esString = typeof item.archivo === "string";

                    return (
                        <div key={index} className="mt-3 p-2 border rounded">

                        <strong>{item.tipo.toUpperCase()}</strong>

                        {/* INPUT FILE */}
                        <Form.Control
                            type="file"
                            className="mt-2"
                            accept={item.tipo === "imagen" ? "image/*" : "video/*"}
                            onChange={(e) => cambiarArchivo(index, e.target.files[0])}
                        />

                        {/* PREVIEW SI ES NUEVO FILE */}
                        {esFile && (
                            <div className="mt-2">
                            {item.tipo === "imagen" ? (
                                <img
                                src={URL.createObjectURL(item.archivo)}
                                alt="preview"
                                style={{ width: "120px", borderRadius: "6px" }}
                                />
                            ) : (
                                <video
                                src={URL.createObjectURL(item.archivo)}
                                width="150"
                                controls
                                style={{ borderRadius: "6px" }}
                                />
                            )}
                            </div>
                        )}

                        {/* PREVIEW SI ES STRING (YA GUARDADO) */}
                        {esString && item.archivo !== "" && (
                            <div className="mt-2">
                            {item.tipo === "imagen" ? (
                                <img
                                src={`${config.urlserver}${item.archivo}`}
                                alt="preview"
                                style={{ width: "120px", borderRadius: "6px" }}
                                />
                            ) : (
                                <iframe
                                width="250"
                                height="150"
                                style={{ borderRadius: "6px" }}
                                src={`https://www.youtube.com/embed/${extraerIdYoutube(item.archivo)}`}
                                title="YouTube video"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                ></iframe>
                            )}
                            </div>
                        )}

                        {/* BOTÓN ELIMINAR */}
                        <Button
                          variant="danger"
                          size="sm"
                          className="mt-2"
                          onClick={() => eliminarMultimedia(item, index)}
                        >
                          Eliminar
                        </Button>


                        </div>
                    );
                    })}

                </Col>

            </Row>

            <div className="mt-4 d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={onClose}>
                Cancelar
              </Button>
                <Button type="submit" variant="primary">
                    {esEdicion ? "Actualizar" : "Registrar"}
                </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
