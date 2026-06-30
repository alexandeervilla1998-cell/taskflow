import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { useAuth } from "../../hooks/useAuth";
import UniverseCanvas from "../../components/ui/UniverseCanvas";

/* ---- Login form ---- */
const Login = () => {
    const { login, cargando } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ correo: "", contrasena: "", recordar: false });
    const [errores, setErrores] = useState({});
    const [focused, setFocused] = useState(null);

    const validar = () => {
        const e = {};
        if (!form.correo.trim()) e.correo = "El correo es obligatorio";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) e.correo = "Correo no válido";
        if (!form.contrasena) e.contrasena = "La contraseña es obligatoria";
        setErrores(e);
        return Object.keys(e).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validar()) return;
        try {
            await login(form.correo, form.contrasena, form.recordar);
            navigate("/");
        } catch (error) {
            const mensaje = error.response?.data?.mensaje || "No se pudo iniciar sesión";
            Swal.fire({ icon: "error", title: "Error", text: mensaje, background: "#0d1426", color: "#e2e8f0", confirmButtonColor: "#388bfd" });
        }
    };

    return (
        <div style={s.page}>
            <UniverseCanvas />

            {/* Glassmorphism card */}
            <div className="animate-slideUp" style={s.card}>

                {/* Logo */}
                <div className="text-center mb-4 animate-fadeIn">
                    <div className="animate-pulse-glow" style={s.logoBox}>
                        <i className="bi bi-check2-square" style={s.logoIcon}></i>
                    </div>
                    <h1 style={s.title}>
                        Task<span style={s.titleAccent}>Flow</span>
                    </h1>
                    <p style={s.subtitle}>Accede a tu espacio de trabajo</p>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    {/* Correo */}
                    <div className="mb-3 animate-slideLeft delay-1">
                        <label className="tf-label">Correo electrónico</label>
                        <div style={s.inputWrapper}>
                            <i
                                className="bi bi-envelope"
                                style={{ ...s.inputIcon, color: focused === "correo" ? "#388bfd" : "#718096" }}
                            ></i>
                            <input
                                type="email"
                                name="correo"
                                className="tf-input tf-input-icon"
                                style={s.inputFull}
                                value={form.correo}
                                onChange={handleChange}
                                onFocus={() => setFocused("correo")}
                                onBlur={() => setFocused(null)}
                                placeholder="tu@correo.com"
                            />
                        </div>
                        {errores.correo && <div className="tf-error">{errores.correo}</div>}
                    </div>

                    {/* Contraseña */}
                    <div className="mb-3 animate-slideLeft delay-2">
                        <label className="tf-label">Contraseña</label>
                        <div style={s.inputWrapper}>
                            <i
                                className="bi bi-lock"
                                style={{ ...s.inputIcon, color: focused === "contrasena" ? "#388bfd" : "#718096" }}
                            ></i>
                            <input
                                type="password"
                                name="contrasena"
                                className="tf-input tf-input-icon"
                                style={s.inputFull}
                                value={form.contrasena}
                                onChange={handleChange}
                                onFocus={() => setFocused("contrasena")}
                                onBlur={() => setFocused(null)}
                                placeholder="••••••••"
                            />
                        </div>
                        {errores.contrasena && <div className="tf-error">{errores.contrasena}</div>}
                    </div>

                    {/* Recordar sesión — usa localStorage o sessionStorage según este flag */}
                    <div className="mb-4 animate-slideLeft delay-3" style={s.checkRow}>
                        <input
                            type="checkbox"
                            name="recordar"
                            className="tf-checkbox"
                            checked={form.recordar}
                            onChange={handleChange}
                            id="recordarSesion"
                        />
                        <label htmlFor="recordarSesion" style={s.checkLabel}>
                            Recordar sesión
                        </label>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="tf-btn tf-btn-primary w-100 animate-slideLeft delay-4"
                        style={s.submitBtn}
                        disabled={cargando}
                    >
                        {cargando ? (
                            <>
                                <span style={s.spinner}></span>
                                Ingresando...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-arrow-right-circle"></i>
                                Ingresar
                            </>
                        )}
                    </button>
                </form>

                <hr className="tf-divider" />

                <p style={s.footerText}>
                    ¿No tienes cuenta?{" "}
                    <Link to="/register" style={s.footerLink}>
                        Regístrate
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
    checkRow: {
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
    },
    checkLabel: {
        fontSize: "0.85rem",
        color: "#718096",
        cursor: "pointer",
    },
    submitBtn: {
        width: "100%",
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

export default Login;
