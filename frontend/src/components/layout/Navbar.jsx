import { useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";

const Navbar = () => {
    const { usuario, cerrarSesion } = useAuth();
    const navigate = useNavigate();

    const handleCerrarSesion = () => {
        cerrarSesion();
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm">

            <div className="container-fluid">

                <span className="navbar-brand fw-bold text-primary">
                    TaskFlow
                </span>

                <div className="d-flex align-items-center ms-auto gap-3">

                    <button className="btn btn-light border">
                        <i className="bi bi-bell"></i>
                    </button>

                    <span className="fw-semibold text-dark">
                        {usuario?.nombre || "Invitado"}
                    </span>

                    <button
                        className="btn btn-light border rounded-circle"
                        style={{ width: "40px", height: "40px" }}
                        data-bs-toggle="dropdown"
                    >
                        <i className="bi bi-person-fill"></i>
                    </button>

                    <ul className="dropdown-menu dropdown-menu-end">

                        <li>
                            <button className="dropdown-item">
                                Perfil
                            </button>
                        </li>

                        <li>
                            <button className="dropdown-item">
                                Configuración
                            </button>
                        </li>

                        <li>
                            <hr className="dropdown-divider" />
                        </li>

                        <li>
                            <button className="dropdown-item text-danger" onClick={handleCerrarSesion}>
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
