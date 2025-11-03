import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "../../css/Login.css";
import config from "../../config";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [form, setForm] = useState({
    password: "",
    password_confirmation: "",
  });
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);

  // Verificar el token al cargar
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await axios.post(`${config.apiUrl}api/verify-reset-token`, { token, email });
        if (res.data.valid) {
          setValid(true);
        }
      } catch (error) {
        Swal.fire("Token inválido o expirado", "Solicita un nuevo enlace de recuperación", "error");
        navigate("/recover-password");
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token, email, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${config.apiUrl}api/reset-password`, {
        ...form,
        email,
        token,
      });
      Swal.fire("Éxito", "Contraseña actualizada correctamente", "success");
      navigate("/login");
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || "No se pudo restablecer", "error");
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Verificando enlace...</div>;
  }

  if (!valid) {
    return null; // Ya se redirigió
  }

  return (
    <div className="auth-page">
      <div className="auth-overlay"></div>
      <div className="auth-container">
        <div className="auth-card shadow-lg rounded-4 p-4">
          <h2 className="text-center mb-4 fw-bold text-success">Restablecer Contraseña</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Nueva contraseña</label>
              <input
                type="password"
                name="password"
                className="form-control form-control-lg"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Confirmar contraseña</label>
              <input
                type="password"
                name="password_confirmation"
                className="form-control form-control-lg"
                value={form.password_confirmation}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-success w-100 py-2 fw-semibold mt-2">
              Guardar nueva contraseña
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
