import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import { useAuth } from "../../hooks/useAuth";
import { actualizarPerfil, cambiarContrasena, obtenerPerfil } from "../../services/usuarioService";

const swalConfig = { background: "#0d1426", color: "#e2e8f0", confirmButtonColor: "#388bfd" };

const Profile = () => {
    const { guardarSesion } = useAuth();

    const [perfil, setPerfil] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [formPerfil, setFormPerfil] = useState({ nombre: "", fotoPerfil: "" });
    const [erroresPerfil, setErroresPerfil] = useState({});
    const [guardandoPerfil, setGuardandoPerfil] = useState(false);
    const [formContrasena, setFormContrasena] = useState({ contrasenaActual: "", contrasenaNueva: "", confirmarContrasena: "" });
    const [erroresContrasena, setErroresContrasena] = useState({});
    const [guardandoContrasena, setGuardandoContrasena] = useState(false);
    const [focusedPerfil, setFocusedPerfil] = useState(null);
    const [focusedPass, setFocusedPass] = useState(null);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const cargar = async () => {
            try {
                const r = await obtenerPerfil();
                const d = r.data.datos;
                setPerfil(d);
                setFormPerfil({ nombre: d.nombre, fotoPerfil: d.fotoPerfil || "" });
            } catch {
                Swal.fire({ icon: "error", title: "Error", text: "No se pudo cargar el perfil", ...swalConfig });
            } finally {
                setCargando(false);
            }
        };
        cargar();
    }, []);

    const validarPerfil = () => {
        const e = {};
        if (!formPerfil.nombre.trim()) e.nombre = "El nombre es obligatorio";
        setErroresPerfil(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmitPerfil = async (ev) => {
        ev.preventDefault();
        if (!validarPerfil()) return;
        setGuardandoPerfil(true);
        try {
            const r = await actualizarPerfil({ nombre: formPerfil.nombre, fotoPerfil: formPerfil.fotoPerfil || null });
            const actualizado = r.data.datos;
            setPerfil(actualizado);
            const tokenActual = localStorage.getItem("token") || sessionStorage.getItem("token");
            const recordar = Boolean(localStorage.getItem("token"));
            guardarSesion({ token: tokenActual, usuario: actualizado }, recordar);
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
        } catch (error) {
            Swal.fire({ icon: "error", title: "Error", text: error.response?.data?.mensaje || "No se pudo actualizar", ...swalConfig });
        } finally {
            setGuardandoPerfil(false);
        }
    };

    const validarContrasena = () => {
        const e = {};
        if (!formContrasena.contrasenaActual) e.contrasenaActual = "Ingresa tu contraseña actual";
        if (!formContrasena.contrasenaNueva) e.contrasenaNueva = "Ingresa la nueva contraseña";
        else if (formContrasena.contrasenaNueva.length < 8) e.contrasenaNueva = "Mínimo 8 caracteres";
        if (formContrasena.contrasenaNueva !== formContrasena.confirmarContrasena) e.confirmarContrasena = "Las contraseñas no coinciden";
        setErroresContrasena(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmitContrasena = async (ev) => {
        ev.preventDefault();
        if (!validarContrasena()) return;
        setGuardandoContrasena(true);
        try {
            await cambiarContrasena({ contrasenaActual: formContrasena.contrasenaActual, contrasenaNueva: formContrasena.contrasenaNueva });
            setFormContrasena({ contrasenaActual: "", contrasenaNueva: "", confirmarContrasena: "" });
            Swal.fire({ icon: "success", title: "Listo", text: "Contraseña actualizada correctamente", ...swalConfig });
        } catch (error) {
            Swal.fire({ icon: "error", title: "Error", text: error.response?.data?.mensaje || "No se pudo cambiar", ...swalConfig });
        } finally {
            setGuardandoContrasena(false);
        }
    };

    if (cargando) {
        return (
            <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
                <div className="tf-spinner animate-pulse-glow"></div>
                <p style={{ color: "var(--tf-muted)", fontSize: "0.85rem" }}>Cargando perfil...</p>
            </div>
        );
    }

    const inicial = perfil?.nombre?.charAt(0).toUpperCase();

    const passFields = [
        { name: "contrasenaActual",   label: "Contraseña actual",         placeholder: "••••••••" },
        { name: "contrasenaNueva",    label: "Nueva contraseña",           placeholder: "Mínimo 8 caracteres" },
        { name: "confirmarContrasena",label: "Confirmar nueva contraseña", placeholder: "••••••••" },
    ];

    return (
        <div>
            {/* Header */}
            <div className="animate-fadeIn mb-4">
                <h2 className="tf-page-title">Mi <span className="tf-glow-text">perfil</span></h2>
                <p className="tf-page-subtitle">Administra tu información personal y seguridad.</p>
            </div>

            <div className="row g-4">

                {/* Avatar card */}
                <div className="col-lg-4 animate-slideLeft">
                    <div className="tf-card text-center" style={{ padding: "2.5rem 1.5rem" }}>

                        {/* Anillo animado */}
                        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
                            <div className="tf-avatar-ring animate-float">
                                <div style={{
                                    width: "100px", height: "100px", borderRadius: "50%",
                                    background: "#07091a",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    border: "3px solid #0a0f1e",
                                    overflow: "hidden"
                                }}>
                                    {perfil?.fotoPerfil ? (
                                        <img
                                            src={perfil.fotoPerfil}
                                            alt="foto"
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        />
                                    ) : (
                                        <span style={{ fontSize: "2.2rem", fontWeight: 700, color: "#388bfd", textShadow: "0 0 20px rgba(56,139,253,0.6)" }}>
                                            {inicial}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <h5 style={{ color: "var(--tf-text)", fontWeight: 700, marginBottom: "0.25rem" }}>{perfil?.nombre}</h5>
                        <p style={{ color: "var(--tf-muted)", fontSize: "0.82rem", marginBottom: "0.75rem" }}>{perfil?.correo}</p>

                        <span
                            className="tf-badge tf-badge-blue"
                            style={{ marginBottom: "1rem", display: "inline-flex" }}
                        >
                            <i className="bi bi-shield-check me-1"></i>
                            {perfil?.rol}
                        </span>

                        <hr className="tf-divider" />

                        <div style={{ fontSize: "0.78rem", color: "var(--tf-muted)" }}>
                            <i className="bi bi-calendar3 me-1"></i>
                            Miembro desde{" "}
                            {perfil?.fechaRegistro
                                ? new Date(perfil.fechaRegistro).toLocaleDateString("es-ES", { year: "numeric", month: "long" })
                                : "—"}
                        </div>

                        {/* Stats mini */}
                        <div style={{
                            display: "grid", gridTemplateColumns: "1fr 1fr",
                            gap: "0.75rem", marginTop: "1.25rem"
                        }}>
                            {[
                                { icon: "bi-check2-all", label: "Cuenta activa", color: "var(--tf-success)" },
                                { icon: "bi-lock-fill",  label: "JWT seguro",    color: "var(--tf-primary)" },
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    style={{
                                        background: "rgba(255,255,255,0.03)",
                                        border: "1px solid var(--tf-border)",
                                        borderRadius: "10px", padding: "0.6rem",
                                        fontSize: "0.72rem", color: "var(--tf-muted)",
                                        display: "flex", flexDirection: "column",
                                        alignItems: "center", gap: "0.25rem"
                                    }}
                                >
                                    <i className={`bi ${item.icon}`} style={{ color: item.color, fontSize: "1rem" }}></i>
                                    {item.label}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Formularios */}
                <div className="col-lg-8">

                    {/* Información personal */}
                    <div className="tf-card animate-slideUp delay-1 mb-4" style={{ padding: "1.75rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.5rem" }}>
                            <div style={{
                                width: "32px", height: "32px", borderRadius: "8px",
                                background: "rgba(56,139,253,0.15)", border: "1px solid rgba(56,139,253,0.3)",
                                display: "flex", alignItems: "center", justifyContent: "center"
                            }}>
                                <i className="bi bi-person" style={{ color: "var(--tf-primary)", fontSize: "0.9rem" }}></i>
                            </div>
                            <h5 style={{ color: "var(--tf-text)", fontWeight: 600, margin: 0 }}>Información personal</h5>
                        </div>

                        <form onSubmit={handleSubmitPerfil}>
                            <div className="mb-3">
                                <label className="tf-label">Nombre</label>
                                <div style={{ position: "relative" }}>
                                    <i className="bi bi-person" style={{
                                        position: "absolute", left: "14px", top: "50%",
                                        transform: "translateY(-50%)",
                                        color: focusedPerfil === "nombre" ? "var(--tf-primary)" : "var(--tf-muted)",
                                        transition: "color 0.2s", zIndex: 1
                                    }}></i>
                                    <input
                                        type="text"
                                        className="tf-input"
                                        style={{ paddingLeft: "2.5rem", width: "100%" }}
                                        value={formPerfil.nombre}
                                        onChange={(e) => setFormPerfil((p) => ({ ...p, nombre: e.target.value }))}
                                        onFocus={() => setFocusedPerfil("nombre")}
                                        onBlur={() => setFocusedPerfil(null)}
                                    />
                                </div>
                                {erroresPerfil.nombre && <div className="tf-error">{erroresPerfil.nombre}</div>}
                            </div>

                            <div className="mb-3">
                                <label className="tf-label">Correo electrónico</label>
                                <div style={{ position: "relative" }}>
                                    <i className="bi bi-envelope" style={{
                                        position: "absolute", left: "14px", top: "50%",
                                        transform: "translateY(-50%)", color: "var(--tf-muted)", zIndex: 1
                                    }}></i>
                                    <input
                                        type="email"
                                        className="tf-input"
                                        style={{ paddingLeft: "2.5rem", width: "100%", opacity: 0.5, cursor: "not-allowed" }}
                                        value={perfil?.correo || ""}
                                        disabled
                                    />
                                </div>
                                <div className="tf-form-text">El correo no se puede cambiar.</div>
                            </div>

                            <div className="mb-4">
                                <label className="tf-label">URL de foto de perfil</label>
                                <div style={{ position: "relative" }}>
                                    <i className="bi bi-image" style={{
                                        position: "absolute", left: "14px", top: "50%",
                                        transform: "translateY(-50%)",
                                        color: focusedPerfil === "foto" ? "var(--tf-primary)" : "var(--tf-muted)",
                                        transition: "color 0.2s", zIndex: 1
                                    }}></i>
                                    <input
                                        type="text"
                                        className="tf-input"
                                        style={{ paddingLeft: "2.5rem", width: "100%" }}
                                        placeholder="https://ejemplo.com/foto.jpg"
                                        value={formPerfil.fotoPerfil}
                                        onChange={(e) => setFormPerfil((p) => ({ ...p, fotoPerfil: e.target.value }))}
                                        onFocus={() => setFocusedPerfil("foto")}
                                        onBlur={() => setFocusedPerfil(null)}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="tf-btn tf-btn-primary"
                                disabled={guardandoPerfil}
                                style={{ minWidth: "160px" }}
                            >
                                {guardandoPerfil ? (
                                    <>
                                        <span style={{
                                            width: "14px", height: "14px",
                                            border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff",
                                            borderRadius: "50%", animation: "spin-slow 0.7s linear infinite", display: "inline-block"
                                        }}></span>
                                        Guardando...
                                    </>
                                ) : saved ? (
                                    <>
                                        <i className="bi bi-check-lg" style={{ color: "#48bb78" }}></i>
                                        Guardado
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-floppy"></i>
                                        Guardar cambios
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Cambiar contraseña */}
                    <div className="tf-card animate-slideUp delay-2" style={{ padding: "1.75rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.5rem" }}>
                            <div style={{
                                width: "32px", height: "32px", borderRadius: "8px",
                                background: "rgba(252,129,129,0.12)", border: "1px solid rgba(252,129,129,0.3)",
                                display: "flex", alignItems: "center", justifyContent: "center"
                            }}>
                                <i className="bi bi-shield-lock" style={{ color: "var(--tf-danger)", fontSize: "0.9rem" }}></i>
                            </div>
                            <h5 style={{ color: "var(--tf-text)", fontWeight: 600, margin: 0 }}>Cambiar contraseña</h5>
                        </div>

                        <form onSubmit={handleSubmitContrasena}>
                            {passFields.map((f) => (
                                <div className="mb-3" key={f.name}>
                                    <label className="tf-label">{f.label}</label>
                                    <div style={{ position: "relative" }}>
                                        <i className="bi bi-lock" style={{
                                            position: "absolute", left: "14px", top: "50%",
                                            transform: "translateY(-50%)",
                                            color: focusedPass === f.name ? "var(--tf-danger)" : "var(--tf-muted)",
                                            transition: "color 0.2s", zIndex: 1
                                        }}></i>
                                        <input
                                            type="password"
                                            className="tf-input"
                                            style={{ paddingLeft: "2.5rem", width: "100%" }}
                                            value={formContrasena[f.name]}
                                            placeholder={f.placeholder}
                                            onChange={(e) => setFormContrasena((p) => ({ ...p, [f.name]: e.target.value }))}
                                            onFocus={() => setFocusedPass(f.name)}
                                            onBlur={() => setFocusedPass(null)}
                                        />
                                    </div>
                                    {erroresContrasena[f.name] && <div className="tf-error">{erroresContrasena[f.name]}</div>}
                                </div>
                            ))}

                            <button
                                type="submit"
                                className="tf-btn tf-btn-danger"
                                disabled={guardandoContrasena}
                                style={{ minWidth: "180px" }}
                            >
                                {guardandoContrasena ? (
                                    <>
                                        <span style={{
                                            width: "14px", height: "14px",
                                            border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff",
                                            borderRadius: "50%", animation: "spin-slow 0.7s linear infinite", display: "inline-block"
                                        }}></span>
                                        Cambiando...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-key"></i>
                                        Cambiar contraseña
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Profile;
