import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { useAuth } from "../../hooks/useAuth";

const Login = () => {
    const { login, cargando } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ correo: "", contrasena: "", recordar: false });
    const [errores, setErrores] = useState({});

    const validar = () => {
        const nuevosErrores = {};

        if (!form.correo.trim()) {
            nuevosErrores.correo = "El correo es obligatorio";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) {
            nuevosErrores.correo = "El correo debe ser válido";
        }

        if (!form.contrasena) {
            nuevosErrores.contrasena = "La contraseña es obligatoria";
        }

        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validar()) {
            return;
        }

        try {
            await login(form.correo, form.contrasena, form.recordar);
            navigate("/");
        } catch (error) {
            const mensaje = error.response?.data?.mensaje || "No se pudo iniciar sesión";
            Swal.fire("Error", mensaje, "error");
        }
    };

    return (
        <div className="container py-5" style={{ maxWidth: "420px" }}>
            <h2 className="mb-4">Iniciar sesión</h2>

            <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                    <label className="form-label">Correo</label>
                    <input
                        type="email"
                        name="correo"
                        className={`form-control ${errores.correo ? "is-invalid" : ""}`}
                        value={form.correo}
                        onChange={handleChange}
                    />
                    {errores.correo && <div className="invalid-feedback">{errores.correo}</div>}
                </div>

                <div className="mb-3">
                    <label className="form-label">Contraseña</label>
                    <input
                        type="password"
                        name="contrasena"
                        className={`form-control ${errores.contrasena ? "is-invalid" : ""}`}
                        value={form.contrasena}
                        onChange={handleChange}
                    />
                    {errores.contrasena && <div className="invalid-feedback">{errores.contrasena}</div>}
                </div>

                <div className="form-check mb-3">
                    <input
                        type="checkbox"
                        name="recordar"
                        className="form-check-input"
                        checked={form.recordar}
                        onChange={handleChange}
                        id="recordarSesion"
                    />
                    <label className="form-check-label" htmlFor="recordarSesion">
                        Recordar sesión
                    </label>
                </div>

                <button type="submit" className="btn btn-primary w-100" disabled={cargando}>
                    {cargando ? "Ingresando..." : "Ingresar"}
                </button>
            </form>

            <p className="mt-3">
                ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
            </p>
        </div>
    );
};

export default Login;
