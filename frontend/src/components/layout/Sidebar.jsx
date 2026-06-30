import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";

const menuItems = [
    { title: "Dashboard",  icon: "bi-grid-fill",   path: "/"           },
    { title: "Mis tareas", icon: "bi-list-task",   path: "/tasks"      },
    { title: "Categorías", icon: "bi-folder-fill", path: "/categories" },
    { title: "Perfil",     icon: "bi-person-fill", path: "/profile"    },
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
            <div className="tf-sidebar-brand">
                <i className="bi bi-check2-square" style={s.brandIcon}></i>
                TaskFlow
                {onClose && (
                    <button style={s.closeBtn} onClick={onClose}>
                        <i className="bi bi-x-lg"></i>
                    </button>
                )}
            </div>

            <nav style={s.nav}>
                <p style={s.navLabel}>Navegación</p>
                {menuItems.map((item) => (
                    <NavLink
                        key={item.title}
                        to={item.path}
                        end={item.path === "/"}
                        className={({ isActive }) => `tf-nav-link${isActive ? " active" : ""}`}
                        onClick={onClose}
                    >
                        <i className={`bi ${item.icon}`} style={s.navIcon}></i>
                        {item.title}
                    </NavLink>
                ))}
            </nav>

            <div>
                <hr style={s.divider} />
                <button className="tf-nav-link" style={s.logoutBtn} onClick={handleCerrarSesion}>
                    <i className="bi bi-box-arrow-right"></i>
                    Cerrar sesión
                </button>
            </div>
        </aside>
    );
};

// ---- Styles ----
const s = {
    brandIcon:  { fontSize: "1.3rem" },
    closeBtn:   { marginLeft: "auto", background: "none", border: "none", color: "var(--tf-muted)", cursor: "pointer", fontSize: "1.1rem" },
    nav:        { flexGrow: 1 },
    navLabel:   { fontSize: "0.68rem", color: "var(--tf-muted)", letterSpacing: "0.12em", textTransform: "uppercase", padding: "0 0.5rem", marginBottom: "0.5rem" },
    navIcon:    { fontSize: "1rem" },
    divider:    { borderColor: "var(--tf-border)", margin: "1rem 0" },
    logoutBtn:  { border: "none", cursor: "pointer", width: "100%", background: "none", color: "var(--tf-danger)" },
};

export default Sidebar;
