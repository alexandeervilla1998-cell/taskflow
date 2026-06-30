import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { useAuth } from "../../hooks/useAuth";
import UniverseCanvas from "../../components/ui/UniverseCanvas";

const Register = () => {
    const { registrar, cargando } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ nombre: "", correo: "", contrasena: "" });
    const [errores, setErrores] = useState({});
    const [focused, setFocused] = useState(null);

    const validar = () => {
        const e = {};
        if (!form.nombre.trim()) e.nombre = "El nombre es obligatorio";
        if (!form.correo.trim()) e.correo = "El correo es obligatorio";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) e.correo = "Correo no válido";
        if (!form.contrasena) e.contrasena = "La contraseña es obligatoria";
        else if (form.contrasena.length < 8) e.contrasena = "Mínimo 8 caracteres";
        setErrores(e);
        return Object.keys(e).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validar()) return;
        try {
            await registrar(form.nombre, form.correo, form.contrasena);
            navigate("/");
        } catch (error) {
            const mensaje = error.response?.data?.mensaje || "No se pudo completar el registro";
            Swal.fire({ icon: "error", title: "Error", text: mensaje, background: "#0d1426", color: "#e2e8f0", confirmButtonColor: "#388bfd" });
        }
    };

    const fields = [
        { name: "nombre",     icon: "bi-person",   type: "text",     placeholder: "Tu nombre completo",  label: "Nombre" },
        { name: "correo",     icon: "bi-envelope",  type: "email",    placeholder: "tu@correo.com",       label: "Correo electrónico" },
        { name: "contrasena", icon: "bi-lock",      type: "password", placeholder: "Mínimo 8 caracteres", label: "Contraseña" },
    ];

    return (
        <div style={s.page}>
            <UniverseCanvas />

            <div className="animate-slideUp" style={s.card}>
                <div className="text-center mb-4 animate-fadeIn">
                    <div className="animate-pulse-glow" style={s.logoBox}>
                        <i className="bi bi-person-plus" style={s.logoIcon}></i>
                    </div>
                    <h1 style={s.title}>
                        Crear <span style={s.titleAccent}>cuenta</span>
                    </h1>
                    <p style={s.subtitle}>Únete a TaskFlow</p>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    {fields.map((f, i) => (
                        <div className={`mb-3 animate-slideLeft delay-${i + 1}`} key={f.name}>
                            <label className="tf-label">{f.label}</label>
                            <div style={s.inputWrapper}>
                                <i
                                    className={`bi ${f.icon}`}
                                    style={{ ...s.inputIcon, color: focused === f.name ? "#388bfd" : "#718096" }}
                                ></i>
                                <input
                                    type={f.type}
                                    name={f.name}
                                    className={`tf-input tf-input-icon${errores[f.name] ? " is-invalid" : ""}`}
                                    style={s.inputFull}
                                    value={form[f.name]}
                                    onChange={handleChange}
                                    onFocus={() => setFocused(f.name)}
                                    onBlur={() => setFocused(null)}
                                    placeholder={f.placeholder}
                                />
                            </div>
                            {errores[f.name] && <div className="tf-error">{errores[f.name]}</div>}
                        </div>
                    ))}

                    <button
                        type="submit"
                        className="tf-btn tf-btn-primary"
                        style={s.submitBtn}
                        disabled={cargando}
                    >
                        {cargando ? (
                            <>
                                <span style={s.spinner}></span>
                                Creando cuenta...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-rocket-takeoff"></i>
                                Registrarme
                            </>
                        )}
                    </button>
                </form>

                <hr className="tf-divider" />

                <p style={s.footerText}>
                    ¿Ya tienes cuenta?{" "}
                    <Link to="/login" style={s.footerLink}>
                        Inicia sesión
                    </Link>
                </p>
            </div>
        </div>
    );
};

const s = {
    page: {
        minHeight: "100vh",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    card: {
        position: "relative",
        zIndex: 10,
        width: "100%",
        maxWidth: "420px",
        margin: "1rem",
        background: "rgba(10, 15, 30, 0.75)",
        border: "1px solid rgba(56,139,253,0.25)",
        borderRadius: "20px",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 60px rgba(56,139,253,0.1)",
        padding: "2.5rem",
    },
    logoBox: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "56px",
        height: "56px",
        borderRadius: "16px",
        background: "linear-gradient(135deg, rgba(56,139,253,0.2), rgba(56,139,253,0.05))",
        border: "1px solid rgba(56,139,253,0.4)",
        marginBottom: "1rem",
    },
    logoIcon: {
        fontSize: "1.6rem",
        color: "#388bfd",
    },
    title: {
        fontSize: "1.5rem",
        fontWeight: 700,
        color: "#e2e8f0",
        margin: 0,
    },
    titleAccent: {
        color: "#388bfd",
        textShadow: "0 0 20px rgba(56,139,253,0.6)",
    },
    subtitle: {
        fontSize: "0.8rem",
        color: "#718096",
        marginTop: "0.25rem",
    },
    inputWrapper: {
        position: "relative",
    },
    inputIcon: {
        position: "absolute",
        left: "14px",
        top: "50%",
        transform: "translateY(-50%)",
        transition: "color 0.2s",
        zIndex: 1,
        fontSize: "0.9rem",
    },
    inputFull: {
        width: "100%",
    },
    submitBtn: {
        width: "100%",
        marginTop: "0.5rem",
    },
    spinner: {
        width: "16px",
        height: "16px",
        border: "2px solid rgba(255,255,255,0.3)",
        borderTopColor: "#fff",
        borderRadius: "50%",
        animation: "spin-slow 0.7s linear infinite",
        display: "inline-block",
    },
    footerText: {
        textAlign: "center",
        fontSize: "0.85rem",
        color: "#718096",
        margin: 0,
    },
    footerLink: {
        color: "#388bfd",
        textDecoration: "none",
        fontWeight: 600,
    },
};

export default Register;
