import { useNavigate, Link } from "react-router-dom";

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
        <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm">
            <div className="container-fluid px-4">

                <button
                    className="btn btn-light border d-md-none me-2"
                    onClick={onToggleSidebar}
                    aria-label="Abrir menú"
                >
                    <i className="bi bi-list fs-5"></i>
                </button>

                <span className="navbar-brand fw-bold text-primary d-flex align-items-center gap-2">
                    <i className="bi bi-check2-square"></i>
                    TaskFlow
                </span>

                <div className="d-flex align-items-center ms-auto gap-3">

                    <span className="fw-semibold text-dark d-none d-md-inline">
                        {usuario?.nombre || "Usuario"}
                    </span>

                    <div className="dropdown">
                        {usuario?.fotoPerfil ? (
                            <img
                                src={usuario.fotoPerfil}
                                alt="perfil"
                                className="rounded-circle border border-2 border-primary"
                                style={{ width: "38px", height: "38px", objectFit: "cover", cursor: "pointer" }}
                                data-bs-toggle="dropdown"
                            />
                        ) : (
                            <button
                                className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center p-0 border-0"
                                style={{ width: "38px", height: "38px" }}
                                data-bs-toggle="dropdown"
                            >
                                <span className="fw-bold text-white small">{inicial}</span>
                            </button>
                        )}

                        <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0">
                            <li className="px-3 py-2">
                                <p className="fw-semibold mb-0 small">{usuario?.nombre}</p>
                                <p className="text-muted mb-0" style={{ fontSize: "0.75rem" }}>{usuario?.correo}</p>
                            </li>
                            <li><hr className="dropdown-divider my-1" /></li>
                            <li>
                                <Link className="dropdown-item" to="/profile">
                                    <i className="bi bi-person me-2"></i>
                                    Mi perfil
                                </Link>
                            </li>
                            <li><hr className="dropdown-divider my-1" /></li>
                            <li>
                                <button className="dropdown-item text-danger" onClick={handleCerrarSesion}>
                                    <i className="bi bi-box-arrow-right me-2"></i>
                                    Cerrar sesión
                                </button>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>
        </nav>
    );
};

export default Navbar;
