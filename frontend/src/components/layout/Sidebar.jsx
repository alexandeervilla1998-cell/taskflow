import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";

const menuItems = [
    { title: "Dashboard",   icon: "bi-grid-fill",    path: "/" },
    { title: "Mis tareas",  icon: "bi-list-task",    path: "/tasks" },
    { title: "Categorías",  icon: "bi-folder-fill",  path: "/categories" },
    { title: "Perfil",      icon: "bi-person-fill",  path: "/profile" },
];

const Sidebar = ({ onClose }) => {
    const { cerrarSesion } = useAuth();
    const navigate = useNavigate();

    const handleCerrarSesion = () => {
        cerrarSesion();
        navigate("/login");
    };

    return (
        <aside className="tf-sidebar">
            {/* Brand */}
            <div className="tf-sidebar-brand">
                <i className="bi bi-check2-square" style={{ fontSize: "1.3rem" }}></i>
                TaskFlow
                {onClose && (
                    <button
                        onClick={onClose}
                        style={{
                            marginLeft: "auto", background: "none", border: "none",
                            color: "var(--tf-muted)", cursor: "pointer", fontSize: "1.1rem"
                        }}
                    >
                        <i className="bi bi-x-lg"></i>
                    </button>
                )}
            </div>

            {/* Nav */}
            <nav style={{ flexGrow: 1 }}>
                <p style={{ fontSize: "0.68rem", color: "var(--tf-muted)", letterSpacing: "0.12em", textTransform: "uppercase", padding: "0 0.5rem", marginBottom: "0.5rem" }}>
                    Navegación
                </p>
                {menuItems.map((item) => (
                    <NavLink
                        key={item.title}
                        to={item.path}
                        end={item.path === "/"}
                        className={({ isActive }) => `tf-nav-link${isActive ? " active" : ""}`}
                        onClick={onClose}
                    >
                        <i className={`bi ${item.icon}`} style={{ fontSize: "1rem" }}></i>
                        {item.title}
                    </NavLink>
                ))}
            </nav>

            {/* Footer */}
            <div>
                <hr style={{ borderColor: "var(--tf-border)", margin: "1rem 0" }} />
                <button
                    className="tf-nav-link"
                    style={{ border: "none", cursor: "pointer", width: "100%", background: "none", color: "var(--tf-danger)" }}
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
