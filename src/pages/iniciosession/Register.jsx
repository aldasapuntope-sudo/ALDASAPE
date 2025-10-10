import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import '../../css/Login.css';
import config from '../../config';
import Cargando from '../../components/cargando';

export default function Register() {
  const [tiposUsuario, setTiposUsuario] = useState([]);
  const [condicionesFiscales, setCondicionesFiscales] = useState([]);
  const [condicionesFiltradas, setCondicionesFiltradas] = useState([]);
  const [camposHabilitados, setCamposHabilitados] = useState(false);
  const [cargando, setCargando] = useState(false);

  // 🧩 Cargar combos desde Laravel
  useEffect(() => {
    const fetchCombos = async () => {
      try {
        const resTipo = await fetch(`${config.apiUrl}api/usuariosexterno/tipo-usuario`);
        const resCond = await fetch(`${config.apiUrl}api/usuariosexterno/tipo-documento`);
        setTiposUsuario(await resTipo.json());
        setCondicionesFiscales(await resCond.json());
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los datos iniciales.'
        });
      }
    };
    fetchCombos();
  }, []);

  // 🧩 Configuración Formik + Yup
  const formik = useFormik({
    initialValues: {
      tipoUsuario: '',
      condicionFiscal: '',
      documento: '',
      nombre: '',
      apellido: '',
      email: '',
      password: '',
      telefono: '',
      movil: '',
      aceptaTerminos: false,
      aceptaInfo: false
    },
    validationSchema: Yup.object({
      tipoUsuario: Yup.string().required('Selecciona un tipo de usuario'),
      condicionFiscal: Yup.string().required('Selecciona un documento'),
      documento: Yup.string()
        .required('El documento es obligatorio')
        .matches(/^[0-9]+$/, 'Solo números'),

        
      nombre: Yup.string().required('El nombre es obligatorio'),
      email: Yup.string().email('Email inválido').required('El email es obligatorio'),
      password: Yup.string()
      .min(6, 'Mínimo 6 caracteres')
      .matches(
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).*$/,
        'Debe tener al menos una mayúscula, un número y un carácter especial'
      )
      .required('Contraseña obligatoria'),

      aceptaTerminos: Yup.boolean().oneOf([true], 'Debes aceptar los Términos y Condiciones'),
      movil: Yup.string()
      .required('El teléfono móvil es obligatorio')
      .matches(/^[0-9]+$/, 'Solo números'),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        console.log("📦 Datos enviados al backend:", values);

        const res = await fetch(`${config.apiUrl}api/usuariosexterno/registrar`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values)
        });

        console.log(res);


        const data = await res.json();

        if (res.ok) {
          Swal.fire({
            icon: 'success',
            title: '¡Registro exitoso!',
            text: 'Tu cuenta ha sido creada correctamente.'
          });
          resetForm();
          setCamposHabilitados(false);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: data.mensaje || 'Ocurrió un error al registrar el usuario.'
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo conectar con el servidor.'
        });
      } finally {
        setSubmitting(false);
      }
    }
  });

  // 🧩 Reaccionar al cambio de tipoUsuario
  useEffect(() => {
    const tipo = formik.values.tipoUsuario;

    if (tipo) {
      // ✅ Limpiar todos los campos excepto tipoUsuario
      formik.setValues({
        tipoUsuario: tipo,
        condicionFiscal: '',
        documento: '',
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        telefono: '',
        movil: '',
        aceptaTerminos: false,
        aceptaInfo: false
      });

      setCamposHabilitados(true);

      // Filtrar documentos disponibles según tipo
      if (tipo === '1') {
        // Particular → DNI y Carnet de Extranjería
        setCondicionesFiltradas(
          condicionesFiscales.filter(c =>
            c.nombre.toLowerCase().includes('dni') ||
            c.nombre.toLowerCase().includes('carnet de extranjería')
          )
        );
      } else {
        // Empresa o institucional → RUC y Carnet de Extranjería
        setCondicionesFiltradas(
          condicionesFiscales.filter(c =>
            c.nombre.toLowerCase().includes('ruc') ||
            c.nombre.toLowerCase().includes('carnet de extranjería')
          )
        );
      }
    } else {
      // Si no hay tipo seleccionado, limpiar todo y desactivar campos
      formik.resetForm();
      setCamposHabilitados(false);
      setCondicionesFiltradas([]);
    }
  }, [formik.values.tipoUsuario, condicionesFiscales]);

  // 🧩 Consultar DNI/RUC desde API Laravel
  const consultarDocumento = async () => {
    const { documento, condicionFiscal } = formik.values;

    if (!documento) {
      Swal.fire({
        icon: 'warning',
        title: 'Atención',
        text: 'Ingresa un número de documento para consultar.'
      });
      return;
    }

    const tipo =
      condicionFiscal.toString() === '1' ? 'dni' :
      condicionFiscal.toString() === '2' ? 'ruc' : 'dni';

      setCargando(true);
    try {
      const res = await fetch(`${config.apiUrl}api/usuariosexterno/consulta/${tipo}/${documento}`);
      const data = await res.json();

      if (res.ok && (data.nombre || data.apellidos || data.razon_social)) {
        if (tipo === 'dni') {
          // ✅ Para DNI: llena nombre y apellido
          formik.setFieldValue('nombre', data.nombre || '');
          formik.setFieldValue('apellido', data.apellidos || '');
        } else if (tipo === 'ruc') {
          // ✅ Para RUC: el nombre puede ir vacío, y se usa razón social
          formik.setFieldValue('nombre', data.nombre || '');
          formik.setFieldValue('apellido', data.razon_social || data.apellidos || '');
        }

        Swal.fire({
          icon: 'success',
          title: 'Datos encontrados',
          text: `Se obtuvieron los datos del ${tipo.toUpperCase()}.`,
          timer: 2000, // ⏱️ se cierra después de 1 segundos
          timerProgressBar: true,
          showConfirmButton: false, // ❌ quita el botón "OK"
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer; // pausa el temporizador al pasar el mouse
            toast.onmouseleave = Swal.resumeTimer; // lo reanuda al salir
          }
        });
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'No encontrado',
          text: 'No se encontró información para este documento, inténtalo nuevamente.'
        });
      }
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al consultar el documento.'
      });
    } finally {
      setCargando(false);
    }
  };


  return (
   <>
     <Cargando visible={cargando} /> 

    <div className="auth-page">
      <div className="auth-overlay"></div>
      <div className="auth-container">
        <div className="auth-card shadow-lg rounded-4 p-4">
          <h2 className="text-center mb-4 fw-bold text-success">Registro</h2>

          <form onSubmit={formik.handleSubmit}>
            {/* Tipo de usuario */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Tipo de usuario</label>
              <select
                className="form-select"
                {...formik.getFieldProps('tipoUsuario')}
              >
                <option value="">Seleccionar</option>
                {tiposUsuario.map(t => (
                  <option key={t.id} value={t.id}>{t.nombre}</option>
                ))}
              </select>
              {formik.touched.tipoUsuario && formik.errors.tipoUsuario && (
                <small className="text-danger">{formik.errors.tipoUsuario}</small>
              )}
            </div>

            {/* Condición Fiscal */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Documento de identidad</label>
              <select
                className="form-select"
                {...formik.getFieldProps('condicionFiscal')}
                disabled={!camposHabilitados}
              >
                <option value="">Seleccionar</option>
                {condicionesFiltradas.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
              {formik.touched.condicionFiscal && formik.errors.condicionFiscal && (
                <small className="text-danger">{formik.errors.condicionFiscal}</small>
              )}
            </div>

            {/* Documento */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Número de documento</label>
              <div className="d-flex gap-2">
                <input
                  type="text"
                  className="form-control"
                  {...formik.getFieldProps('documento')}
                  disabled={!camposHabilitados}
                />
                <button
                  type="button"
                  className="btn btn-outline-success"
                  onClick={consultarDocumento}
                  disabled={!camposHabilitados}
                >
                  Consultar
                </button>
              </div>
              {formik.touched.documento && formik.errors.documento && (
                <small className="text-danger">{formik.errors.documento}</small>
              )}
            </div>

            {/* Nombre */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Nombre</label>
              <input
                type="text"
                className="form-control"
                {...formik.getFieldProps('nombre')}
                disabled={!camposHabilitados}
              />
              {formik.touched.nombre && formik.errors.nombre && (
                <small className="text-danger">{formik.errors.nombre}</small>
              )}
            </div>

            {/* Apellido o razón social */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                {formik.values.tipoUsuario === '1' ? 'Apellidos' : 'Razón social'}
              </label>
              <input
                type="text"
                className="form-control"
                {...formik.getFieldProps('apellido')}
                disabled={!camposHabilitados}
              />
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input
                type="email"
                className="form-control"
                {...formik.getFieldProps('email')}
                disabled={!camposHabilitados}
              />
              {formik.touched.email && formik.errors.email && (
                <small className="text-danger">{formik.errors.email}</small>
              )}
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Contraseña</label>
              <input
                type="password"
                className="form-control"
                {...formik.getFieldProps('password')}
                disabled={!camposHabilitados}
              />
              {formik.touched.password && formik.errors.password && (
                <small className="text-danger">{formik.errors.password}</small>
              )}
            </div>

            {/* Teléfonos */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Teléfono</label>
              <input
                type="text"
                className="form-control"
                {...formik.getFieldProps('telefono')}
                disabled={!camposHabilitados}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Teléfono móvil</label>
              <input
                type="text"
                className="form-control"
                {...formik.getFieldProps('movil')}
                disabled={!camposHabilitados}
              />
              {formik.touched.movil && formik.errors.movil && (
                <small className="text-danger">{formik.errors.movil}</small>
              )}
            </div>

            {/* Checkboxes */}
            <div className="form-check mt-3">
              <input
                type="checkbox"
                className="form-check-input"
                id="checkTerminos"
                {...formik.getFieldProps('aceptaTerminos')}
              />
              <label className="form-check-label" htmlFor="checkTerminos">
                Acepto los <a href="/terminos-condiciones" target="_blank" rel="noopener noreferrer">Términos y Condiciones</a>.
              </label>
              {formik.touched.aceptaTerminos && formik.errors.aceptaTerminos && (
                <small className="text-danger d-block">{formik.errors.aceptaTerminos}</small>
              )}
            </div>

            <div className="form-check mt-2">
              <input
                type="checkbox"
                className="form-check-input"
                id="checkInfo"
                {...formik.getFieldProps('aceptaInfo')}
              />
              <label className="form-check-label" htmlFor="checkInfo">
                Autorizo el uso de mi información con fines adicionales.
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-success w-100 py-2 fw-semibold mt-3"
              disabled={formik.isSubmitting || !camposHabilitados}
            >
              {formik.isSubmitting ? 'Registrando...' : 'Registrarme'}
            </button>
          </form>
        </div>
      </div>
    </div>
   </>
  );
}
