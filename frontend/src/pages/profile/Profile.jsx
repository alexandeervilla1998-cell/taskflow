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
    const [imgError, setImgError] = useState(false);

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

    // Resetea imgError al cambiar la URL para que el preview reintente cargar la imagen
    useEffect(() => {
        setImgError(false);
    }, [formPerfil.fotoPerfil]);

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
            // guardarSesion sincroniza el token existente con los datos actualizados del usuario
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
            <div style={s.loadingWrapper}>
                <div className="tf-spinner animate-pulse-glow"></div>
                <p style={s.loadingText}>Cargando perfil...</p>
            </div>
        );
    }

    const inicial = perfil?.nombre?.charAt(0).toUpperCase();
    // Usa el valor del form para que el avatar se actualice mientras el usuario escribe
    const fotoPreview = formPerfil.fotoPerfil && !imgError ? formPerfil.fotoPerfil : null;

    const passFields = [
        { name: "contrasenaActual",    label: "Contraseña actual",         placeholder: "••••••••" },
        { name: "contrasenaNueva",     label: "Nueva contraseña",           placeholder: "Mínimo 8 caracteres" },
        { name: "confirmarContrasena", label: "Confirmar nueva contraseña", placeholder: "••••••••" },
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
                    <div className="tf-card text-center" style={s.avatarCard}>

                        {/* Anillo animado con preview en tiempo real */}
                        <div style={s.avatarRingWrapper}>
                            <div className="tf-avatar-ring animate-float">
                                <div style={s.avatarInner}>
                                    {fotoPreview ? (
                                        <img
                                            src={fotoPreview}
                                            alt="foto"
                                            onError={() => setImgError(true)}
                                            style={s.avatarImg}
                                        />
                                    ) : (
                                        <span style={s.avatarInitial}>{inicial}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Indicador de URL inválida */}
                        {formPerfil.fotoPerfil && imgError && (
                            <div style={s.imgErrorMsg}>
                                <i className="bi bi-exclamation-triangle"></i>
                                URL de imagen no válida
                            </div>
                        )}

                        <h5 style={s.profileName}>{formPerfil.nombre || perfil?.nombre}</h5>
                        <p style={s.profileEmail}>{perfil?.correo}</p>

                        <span className="tf-badge tf-badge-blue" style={s.rolBadge}>
                            <i className="bi bi-shield-check me-1"></i>
                            {perfil?.rol}
                        </span>

                        <hr className="tf-divider" />

                        <div style={s.memberSince}>
                            <i className="bi bi-calendar3 me-1"></i>
                            Miembro desde{" "}
                            {perfil?.fechaRegistro
                                ? new Date(perfil.fechaRegistro).toLocaleDateString("es-ES", { year: "numeric", month: "long" })
                                : "—"}
                        </div>

                        <div style={s.statsGrid}>
                            {[
                                { icon: "bi-check2-all", label: "Cuenta activa", color: "var(--tf-success)" },
                                { icon: "bi-lock-fill",  label: "JWT seguro",    color: "var(--tf-primary)" },
                            ].map((item) => (
                                <div key={item.label} style={s.statItem}>
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
                    <div className="tf-card animate-slideUp delay-1 mb-4" style={s.formCard}>
                        <div style={s.sectionHeader}>
                            <div style={s.sectionIconBox}>
                                <i className="bi bi-person" style={s.sectionIconPrimary}></i>
                            </div>
                            <div>
                                <h5 style={s.sectionTitle}>Información personal</h5>
                                <p style={s.sectionSubtitle}>Actualiza tu nombre y foto</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmitPerfil}>
                            <div className="mb-3">
                                <label className="tf-label">Nombre</label>
                                <div style={s.inputWrapper}>
                                    <i className="bi bi-person" style={{
                                        ...s.inputIcon,
                                        color: focusedPerfil === "nombre" ? "var(--tf-primary)" : "var(--tf-muted)",
                                    }}></i>
                                    <input
                                        type="text"
                                        className="tf-input tf-input-icon"
                                        style={s.inputFull}
                                        value={formPerfil.nombre}
                                        onChange={(e) => setFormPerfil((p) => ({ ...p, nombre: e.target.value }))}
                                        onFocus={() => setFocusedPerfil("nombre")}
                                        onBlur={() => setFocusedPerfil(null)}
                                        placeholder="Tu nombre completo"
                                    />
                                </div>
                                {erroresPerfil.nombre && <div className="tf-error">{erroresPerfil.nombre}</div>}
                            </div>

                            <div className="mb-3">
                                <label className="tf-label">Correo electrónico</label>
                                <div style={s.inputWrapper}>
                                    <i className="bi bi-envelope" style={s.inputIconStatic}></i>
                                    <input
                                        type="email"
                                        className="tf-input tf-input-icon"
                                        style={s.inputDisabled}
                                        value={perfil?.correo || ""}
                                        disabled
                                    />
                                </div>
                                <div className="tf-form-text">
                                    <i className="bi bi-info-circle me-1"></i>
                                    El correo electrónico no se puede cambiar.
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="tf-label">URL de foto de perfil</label>
                                <div style={s.inputWrapper}>
                                    <i className="bi bi-image" style={{
                                        ...s.inputIcon,
                                        color: focusedPerfil === "foto" ? "var(--tf-primary)" : "var(--tf-muted)",
                                    }}></i>
                                    <input
                                        type="text"
                                        className="tf-input tf-input-icon"
                                        style={{ ...s.inputFull, paddingRight: fotoPreview ? "2.5rem" : "1rem" }}
                                        placeholder="https://ejemplo.com/foto.jpg"
                                        value={formPerfil.fotoPerfil}
                                        onChange={(e) => setFormPerfil((p) => ({ ...p, fotoPerfil: e.target.value }))}
                                        onFocus={() => setFocusedPerfil("foto")}
                                        onBlur={() => setFocusedPerfil(null)}
                                    />
                                    {/* Indicador de preview OK */}
                                    {fotoPreview && (
                                        <i className="bi bi-check-circle-fill" style={s.previewOkIcon}></i>
                                    )}
                                </div>
                                <div className="tf-form-text">
                                    <i className="bi bi-lightbulb me-1"></i>
                                    El avatar se actualiza en tiempo real mientras escribes.
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="tf-btn tf-btn-primary"
                                disabled={guardandoPerfil}
                                style={s.saveBtnPerfil}
                            >
                                {guardandoPerfil ? (
                                    <>
                                        <span style={s.spinnerSm}></span>
                                        Guardando...
                                    </>
                                ) : saved ? (
                                    <>
                                        <i className="bi bi-check-lg" style={s.savedIcon}></i>
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
                    <div className="tf-card animate-slideUp delay-2" style={s.formCard}>
                        <div style={s.sectionHeader}>
                            <div style={s.sectionIconBoxDanger}>
                                <i className="bi bi-shield-lock" style={s.sectionIconDanger}></i>
                            </div>
                            <div>
                                <h5 style={s.sectionTitle}>Cambiar contraseña</h5>
                                <p style={s.sectionSubtitle}>Mínimo 8 caracteres</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmitContrasena}>
                            {passFields.map((f) => (
                                <div className="mb-3" key={f.name}>
                                    <label className="tf-label">{f.label}</label>
                                    <div style={s.inputWrapper}>
                                        <i className="bi bi-lock" style={{
                                            ...s.inputIcon,
                                            color: focusedPass === f.name ? "var(--tf-danger)" : "var(--tf-muted)",
                                        }}></i>
                                        <input
                                            type="password"
                                            className={`tf-input tf-input-icon${erroresContrasena[f.name] ? " is-invalid" : ""}`}
                                            style={s.inputFull}
                                            value={formContrasena[f.name]}
                                            placeholder={f.placeholder}
                                            onChange={(e) => setFormContrasena((p) => ({ ...p, [f.name]: e.target.value }))}
                                            onFocus={() => setFocusedPass(f.name)}
                                            onBlur={() => setFocusedPass(null)}
                                        />
                                    </div>
                                    {erroresContrasena[f.name] && (
                                        <div className="tf-error">
                                            <i className="bi bi-exclamation-circle me-1"></i>
                                            {erroresContrasena[f.name]}
                                        </div>
                                    )}
                                </div>
                            ))}

                            <button
                                type="submit"
                                className="tf-btn tf-btn-danger"
                                disabled={guardandoContrasena}
                                style={s.saveBtnPass}
                            >
                                {guardandoContrasena ? (
                                    <>
                                        <span style={s.spinnerSm}></span>
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

const s = {
    loadingWrapper: {
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
    },
    loadingText: {
        color: "var(--tf-muted)",
        fontSize: "0.85rem",
    },
    avatarCard: {
        padding: "2.5rem 1.5rem",
    },
    avatarRingWrapper: {
        display: "flex",
        justifyContent: "center",
        marginBottom: "1.5rem",
    },
    avatarInner: {
        width: "108px",
        height: "108px",
        borderRadius: "50%",
        background: "linear-gradient(135deg, #07091a, #0d1426)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "3px solid #0a0f1e",
        overflow: "hidden",
        position: "relative",
    },
    avatarImg: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
    },
    avatarInitial: {
        fontSize: "2.5rem",
        fontWeight: 700,
        color: "#388bfd",
        textShadow: "0 0 24px rgba(56,139,253,0.7), 0 0 48px rgba(56,139,253,0.3)",
    },
    imgErrorMsg: {
        fontSize: "0.72rem",
        color: "var(--tf-danger)",
        marginBottom: "0.75rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.35rem",
    },
    profileName: {
        color: "var(--tf-text)",
        fontWeight: 700,
        marginBottom: "0.2rem",
    },
    profileEmail: {
        color: "var(--tf-muted)",
        fontSize: "0.82rem",
        marginBottom: "0.75rem",
    },
    rolBadge: {
        marginBottom: "1rem",
        display: "inline-flex",
    },
    memberSince: {
        fontSize: "0.78rem",
        color: "var(--tf-muted)",
    },
    statsGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "0.75rem",
        marginTop: "1.25rem",
    },
    statItem: {
        background: "rgba(255,255,255,0.03)",
        border: "1px solid var(--tf-border)",
        borderRadius: "10px",
        padding: "0.6rem",
        fontSize: "0.72rem",
        color: "var(--tf-muted)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.25rem",
    },
    formCard: {
        padding: "1.75rem",
    },
    sectionHeader: {
        display: "flex",
        alignItems: "center",
        gap: "0.6rem",
        marginBottom: "1.5rem",
    },
    sectionIconBox: {
        width: "36px",
        height: "36px",
        borderRadius: "10px",
        background: "rgba(56,139,253,0.15)",
        border: "1px solid rgba(56,139,253,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
    },
    sectionIconPrimary: {
        color: "var(--tf-primary)",
        fontSize: "1rem",
    },
    sectionIconBoxDanger: {
        width: "36px",
        height: "36px",
        borderRadius: "10px",
        background: "rgba(252,129,129,0.12)",
        border: "1px solid rgba(252,129,129,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
    },
    sectionIconDanger: {
        color: "var(--tf-danger)",
        fontSize: "1rem",
    },
    sectionTitle: {
        color: "var(--tf-text)",
        fontWeight: 600,
        margin: 0,
    },
    sectionSubtitle: {
        color: "var(--tf-muted)",
        fontSize: "0.75rem",
        margin: 0,
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
    },
    inputIconStatic: {
        position: "absolute",
        left: "14px",
        top: "50%",
        transform: "translateY(-50%)",
        color: "var(--tf-muted)",
        zIndex: 1,
    },
    inputFull: {
        width: "100%",
    },
    inputDisabled: {
        width: "100%",
        opacity: 0.45,
        cursor: "not-allowed",
    },
    previewOkIcon: {
        position: "absolute",
        right: "12px",
        top: "50%",
        transform: "translateY(-50%)",
        color: "var(--tf-success)",
        fontSize: "0.85rem",
    },
    saveBtnPerfil: {
        minWidth: "160px",
    },
    saveBtnPass: {
        minWidth: "180px",
    },
    spinnerSm: {
        width: "14px",
        height: "14px",
        border: "2px solid rgba(255,255,255,0.3)",
        borderTopColor: "#fff",
        borderRadius: "50%",
        animation: "spin-slow 0.7s linear infinite",
        display: "inline-block",
        flexShrink: 0,
    },
    savedIcon: {
        color: "#48bb78",
    },
};

export default Profile;
