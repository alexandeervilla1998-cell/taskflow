import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";

const Navbar = ({ onToggleSidebar }) => {
    const { usuario, cerrarSesion } = useAuth();
    const navigate = useNavigate();

    const handleCerrarSesion = () => {
        cerrarSesion();
        navigate("/login");
    };

    const inicial = usuario?.nombre?.charAt(0).toUpperCase() || "U";

    return (
        <nav className="tf-navbar">
            {/* Hamburger móvil */}
            <button
                className="d-md-none"
                onClick={onToggleSidebar}
                style={{
                    background: "rgba(56,139,253,0.1)", border: "1px solid var(--tf-border)",
                    borderRadius: "8px", color: "var(--tf-text)", padding: "0.35rem 0.6rem",
                    cursor: "pointer", fontSize: "1.1rem"
                }}
            >
                <i className="bi bi-list"></i>
            </button>

            {/* Brand */}
            <div className="tf-navbar-brand">
                <i className="bi bi-check2-square"></i>
                TaskFlow
            </div>

            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "1rem" }}>
                <span style={{ fontSize: "0.85rem", color: "var(--tf-muted)", display: "none" }}
                    className="d-md-inline">
                    {usuario?.nombre || "Usuario"}
                </span>

                {/* Avatar dropdown */}
                <div className="dropdown">
                    {usuario?.fotoPerfil ? (
                        <img
                            src={usuario.fotoPerfil}
                            alt="perfil"
                            data-bs-toggle="dropdown"
                            style={{
                                width: "38px", height: "38px", borderRadius: "50%",
                                objectFit: "cover", cursor: "pointer",
                                border: "2px solid var(--tf-primary)",
                                boxShadow: "0 0 12px var(--tf-primary-glow)"
                            }}
                        />
                    ) : (
                        <button
                            data-bs-toggle="dropdown"
                            style={{
                                width: "38px", height: "38px", borderRadius: "50%",
                                background: "linear-gradient(135deg, #388bfd, #0066cc)",
                                border: "none", cursor: "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                boxShadow: "0 0 16px rgba(56,139,253,0.4)",
                                color: "#fff", fontWeight: 700, fontSize: "0.95rem"
                            }}
                        >
                            {inicial}
                        </button>
                    )}

                    <ul
                        className="dropdown-menu dropdown-menu-end"
                        style={{
                            background: "#0d1426", border: "1px solid var(--tf-border)",
                            borderRadius: "12px", boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
                            minWidth: "200px", padding: "0.5rem"
                        }}
                    >
                        <li style={{ padding: "0.5rem 0.75rem 0.75rem" }}>
                            <p style={{ fontWeight: 600, color: "var(--tf-text)", margin: 0, fontSize: "0.9rem" }}>
                                {usuario?.nombre}
                            </p>
                            <p style={{ color: "var(--tf-muted)", margin: 0, fontSize: "0.75rem" }}>
                                {usuario?.correo}
                            </p>
                        </li>
                        <li><hr style={{ borderColor: "var(--tf-border)", margin: "0 0 0.25rem" }} /></li>
                        <li>
                            <Link
                                className="dropdown-item"
                                to="/profile"
                                style={{
                                    color: "var(--tf-text)", borderRadius: "8px",
                                    fontSize: "0.85rem", padding: "0.45rem 0.75rem"
                                }}
                            >
                                <i className="bi bi-person me-2" style={{ color: "var(--tf-primary)" }}></i>
                                Mi perfil
                            </Link>
                        </li>
                        <li><hr style={{ borderColor: "var(--tf-border)", margin: "0.25rem 0" }} /></li>
                        <li>
                            <button
                                className="dropdown-item"
                                onClick={handleCerrarSesion}
                                style={{
                                    color: "var(--tf-danger)", borderRadius: "8px",
                                    fontSize: "0.85rem", padding: "0.45rem 0.75rem", width: "100%", textAlign: "left"
                                }}
                            >
                                <i className="bi bi-box-arrow-right me-2"></i>
                                Cerrar sesión
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
