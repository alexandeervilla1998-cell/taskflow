import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { useAuth } from "../../hooks/useAuth";

const Register = () => {
    const { registrar, cargando } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ nombre: "", correo: "", contrasena: "" });
    const [errores, setErrores] = useState({});

    const validar = () => {
        const nuevosErrores = {};

        if (!form.nombre.trim()) {
            nuevosErrores.nombre = "El nombre es obligatorio";
        }

        if (!form.correo.trim()) {
            nuevosErrores.correo = "El correo es obligatorio";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) {
            nuevosErrores.correo = "El correo debe ser válido";
        }

        if (!form.contrasena) {
            nuevosErrores.contrasena = "La contraseña es obligatoria";
        } else if (form.contrasena.length < 8) {
            nuevosErrores.contrasena = "La contraseña debe tener al menos 8 caracteres";
        }

        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validar()) {
            return;
        }

        try {
            await registrar(form.nombre, form.correo, form.contrasena);
            navigate("/");
        } catch (error) {
            const mensaje = error.response?.data?.mensaje || "No se pudo completar el registro";
            Swal.fire("Error", mensaje, "error");
        }
    };

    return (
        <div className="container py-5" style={{ maxWidth: "420px" }}>
            <h2 className="mb-4">Crear cuenta</h2>

            <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input
                        type="text"
                        name="nombre"
                        className={`form-control ${errores.nombre ? "is-invalid" : ""}`}
                        value={form.nombre}
                        onChange={handleChange}
                    />
                    {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
                </div>

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

                <button type="submit" className="btn btn-primary w-100" disabled={cargando}>
                    {cargando ? "Creando cuenta..." : "Registrarme"}
                </button>
            </form>

            <p className="mt-3">
                ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
            </p>
        </div>
    );
};

export default Register;
