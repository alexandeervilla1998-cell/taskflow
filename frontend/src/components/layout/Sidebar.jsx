import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";

const menuItems = [
    { title: "Dashboard", icon: "bi bi-grid-fill", path: "/" },
    { title: "Mis tareas", icon: "bi bi-list-task", path: "/tasks" },
    { title: "Categorías", icon: "bi bi-folder-fill", path: "/categories" },
    { title: "Perfil", icon: "bi bi-person-fill", path: "/profile" }
];

const Sidebar = () => {
    const { cerrarSesion } = useAuth();
    const navigate = useNavigate();

    const handleCerrarSesion = () => {
        cerrarSesion();
        navigate("/login");
    };

    return (
        <aside className="d-flex flex-column bg-white border-end vh-100 p-3" style={{ minWidth: "220px" }}>

            <div className="d-flex align-items-center gap-2 mb-4 px-2">
                <i className="bi bi-check2-square text-primary fs-4"></i>
                <span className="fw-bold text-primary fs-5">TaskFlow</span>
            </div>

            <nav className="flex-grow-1">
                <ul className="nav flex-column gap-1">
                    {menuItems.map((item) => (
                        <li className="nav-item" key={item.title}>
                            <NavLink
                                to={item.path}
                                end={item.path === "/"}
                                className={({ isActive }) =>
                                    `nav-link d-flex align-items-center gap-2 rounded px-3 py-2 fw-medium ${
                                        isActive
                                            ? "bg-primary text-white"
                                            : "text-secondary"
                                    }`
                                }
                            >
                                <i className={item.icon}></i>
                                {item.title}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="border-top pt-3">
                <button
                    className="btn btn-link nav-link text-danger d-flex align-items-center gap-2 px-3 w-100 text-start"
                    onClick={handleCerrarSesion}
                >
                    <i className="bi bi-box-arrow-right"></i>
                    Cerrar sesión
                </button>
            </div>

        </aside>
    );
};

export default Sidebar;
