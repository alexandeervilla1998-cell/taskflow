import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import { useAuth } from "../../hooks/useAuth";
import { actualizarPerfil, cambiarContrasena, obtenerPerfil } from "../../services/usuarioService";

const Profile = () => {
    const { guardarSesion } = useAuth();

    const [perfil, setPerfil] = useState(null);
    const [cargando, setCargando] = useState(true);

    const [formPerfil, setFormPerfil] = useState({ nombre: "", fotoPerfil: "" });
    const [erroresPerfil, setErroresPerfil] = useState({});
    const [guardandoPerfil, setGuardandoPerfil] = useState(false);

    const [formContrasena, setFormContrasena] = useState({
        contrasenaActual: "",
        contrasenaNueva: "",
        confirmarContrasena: ""
    });
    const [erroresContrasena, setErroresContrasena] = useState({});
    const [guardandoContrasena, setGuardandoContrasena] = useState(false);

    useEffect(() => {
        const cargar = async () => {
            try {
                const respuesta = await obtenerPerfil();
                const datos = respuesta.data.datos;
                setPerfil(datos);
                setFormPerfil({ nombre: datos.nombre, fotoPerfil: datos.fotoPerfil || "" });
            } catch {
                Swal.fire("Error", "No se pudo cargar el perfil", "error");
            } finally {
                setCargando(false);
            }
        };
        cargar();
    }, []);

    const validarPerfil = () => {
        const errores = {};
        if (!formPerfil.nombre.trim()) errores.nombre = "El nombre es obligatorio";
        setErroresPerfil(errores);
        return Object.keys(errores).length === 0;
    };

    const handleSubmitPerfil = async (e) => {
        e.preventDefault();
        if (!validarPerfil()) return;

        setGuardandoPerfil(true);
        try {
            const respuesta = await actualizarPerfil({
                nombre: formPerfil.nombre,
                fotoPerfil: formPerfil.fotoPerfil || null
            });
            const actualizado = respuesta.data.datos;
            setPerfil(actualizado);

            // Sincronizar el contexto para que el Navbar refleje el nombre nuevo
            const tokenActual = localStorage.getItem("token") || sessionStorage.getItem("token");
            const recordar = Boolean(localStorage.getItem("token"));
            guardarSesion({ token: tokenActual, usuario: actualizado }, recordar);

            Swal.fire("Guardado", "Perfil actualizado correctamente", "success");
        } catch (error) {
            const mensaje = error.response?.data?.mensaje || "No se pudo actualizar el perfil";
            Swal.fire("Error", mensaje, "error");
        } finally {
            setGuardandoPerfil(false);
        }
    };

    const validarContrasena = () => {
        const errores = {};
        if (!formContrasena.contrasenaActual) errores.contrasenaActual = "Ingresa tu contraseña actual";
        if (!formContrasena.contrasenaNueva) errores.contrasenaNueva = "Ingresa la nueva contraseña";
        else if (formContrasena.contrasenaNueva.length < 8) errores.contrasenaNueva = "Mínimo 8 caracteres";
        if (formContrasena.contrasenaNueva !== formContrasena.confirmarContrasena)
            errores.confirmarContrasena = "Las contraseñas no coinciden";
        setErroresContrasena(errores);
        return Object.keys(errores).length === 0;
    };

    const handleSubmitContrasena = async (e) => {
        e.preventDefault();
        if (!validarContrasena()) return;

        setGuardandoContrasena(true);
        try {
            await cambiarContrasena({
                contrasenaActual: formContrasena.contrasenaActual,
                contrasenaNueva: formContrasena.contrasenaNueva
            });
            setFormContrasena({ contrasenaActual: "", contrasenaNueva: "", confirmarContrasena: "" });
            Swal.fire("Listo", "Contraseña actualizada correctamente", "success");
        } catch (error) {
            const mensaje = error.response?.data?.mensaje || "No se pudo cambiar la contraseña";
            Swal.fire("Error", mensaje, "error");
        } finally {
            setGuardandoContrasena(false);
        }
    };

    if (cargando) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
                <div className="spinner-border text-primary" role="status"></div>
            </div>
        );
    }

    return (
        <div className="container-fluid">
            <div className="mb-4">
                <h2 className="fw-bold">Mi perfil</h2>
                <p className="text-muted">Administra tu información personal y contraseña.</p>
            </div>

            <div className="row g-4">

                {/* Tarjeta de avatar */}
                <div className="col-lg-4">
                    <div className="card shadow-sm border-0 text-center p-4">
                        <div className="mb-3">
                            {perfil?.fotoPerfil ? (
                                <img
                                    src={perfil.fotoPerfil}
                                    alt="Foto de perfil"
                                    className="rounded-circle"
                                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                />
                            ) : (
                                <div
                                    className="rounded-circle bg-primary d-flex align-items-center justify-content-center mx-auto"
                                    style={{ width: "100px", height: "100px" }}
                                >
                                    <span className="text-white fw-bold" style={{ fontSize: "2rem" }}>
                                        {perfil?.nombre?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                        </div>
                        <h5 className="fw-bold mb-1">{perfil?.nombre}</h5>
                        <p className="text-muted small mb-1">{perfil?.correo}</p>
                        <span className="badge bg-primary">{perfil?.rol}</span>
                        <p className="text-muted small mt-2 mb-0">
                            Miembro desde{" "}
                            {perfil?.fechaRegistro
                                ? new Date(perfil.fechaRegistro).toLocaleDateString("es-ES", {
                                      year: "numeric",
                                      month: "long"
                                  })
                                : ""}
                        </p>
                    </div>
                </div>

                {/* Formularios */}
                <div className="col-lg-8">

                    {/* Editar datos */}
                    <div className="card shadow-sm border-0 mb-4">
                        <div className="card-body">
                            <h5 className="fw-bold mb-3">Información personal</h5>
                            <form onSubmit={handleSubmitPerfil}>
                                <div className="mb-3">
                                    <label className="form-label">Nombre</label>
                                    <input
                                        type="text"
                                        className={`form-control ${erroresPerfil.nombre ? "is-invalid" : ""}`}
                                        value={formPerfil.nombre}
                                        onChange={(e) => setFormPerfil((p) => ({ ...p, nombre: e.target.value }))}
                                    />
                                    {erroresPerfil.nombre && (
                                        <div className="invalid-feedback">{erroresPerfil.nombre}</div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Correo electrónico</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={perfil?.correo || ""}
                                        disabled
                                    />
                                    <div className="form-text">El correo no se puede cambiar.</div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">URL de foto de perfil</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="https://ejemplo.com/mi-foto.jpg"
                                        value={formPerfil.fotoPerfil}
                                        onChange={(e) => setFormPerfil((p) => ({ ...p, fotoPerfil: e.target.value }))}
                                    />
                                </div>

                                <button type="submit" className="btn btn-primary" disabled={guardandoPerfil}>
                                    {guardandoPerfil ? "Guardando..." : "Guardar cambios"}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Cambiar contraseña */}
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <h5 className="fw-bold mb-3">Cambiar contraseña</h5>
                            <form onSubmit={handleSubmitContrasena}>
                                <div className="mb-3">
                                    <label className="form-label">Contraseña actual</label>
                                    <input
                                        type="password"
                                        className={`form-control ${erroresContrasena.contrasenaActual ? "is-invalid" : ""}`}
                                        value={formContrasena.contrasenaActual}
                                        onChange={(e) =>
                                            setFormContrasena((p) => ({ ...p, contrasenaActual: e.target.value }))
                                        }
                                    />
                                    {erroresContrasena.contrasenaActual && (
                                        <div className="invalid-feedback">{erroresContrasena.contrasenaActual}</div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Nueva contraseña</label>
                                    <input
                                        type="password"
                                        className={`form-control ${erroresContrasena.contrasenaNueva ? "is-invalid" : ""}`}
                                        value={formContrasena.contrasenaNueva}
                                        onChange={(e) =>
                                            setFormContrasena((p) => ({ ...p, contrasenaNueva: e.target.value }))
                                        }
                                    />
                                    {erroresContrasena.contrasenaNueva && (
                                        <div className="invalid-feedback">{erroresContrasena.contrasenaNueva}</div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Confirmar nueva contraseña</label>
                                    <input
                                        type="password"
                                        className={`form-control ${erroresContrasena.confirmarContrasena ? "is-invalid" : ""}`}
                                        value={formContrasena.confirmarContrasena}
                                        onChange={(e) =>
                                            setFormContrasena((p) => ({ ...p, confirmarContrasena: e.target.value }))
                                        }
                                    />
                                    {erroresContrasena.confirmarContrasena && (
                                        <div className="invalid-feedback">{erroresContrasena.confirmarContrasena}</div>
                                    )}
                                </div>

                                <button type="submit" className="btn btn-warning" disabled={guardandoContrasena}>
                                    {guardandoContrasena ? "Cambiando..." : "Cambiar contraseña"}
                                </button>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Profile;
