import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";

const menuItems = [
    {
        title: "Dashboard",
        icon: "bi bi-grid",
        path: "/"
    },
    {
        title: "Mis tareas",
        icon: "bi bi-list-task",
        path: "/tasks"
    },
    {
        title: "Categorías",
        icon: "bi bi-folder",
        path: "/categories"
    },
    {
        title: "Perfil",
        icon: "bi bi-person",
        path: "/profile"
    }
];

const Sidebar = () => {
    const { cerrarSesion } = useAuth();
    const navigate = useNavigate();

    const handleCerrarSesion = () => {
        cerrarSesion();
        navigate("/login");
    };

    return (
        <aside className="bg-white border-end vh-100 p-3">

            <h5 className="fw-bold text-primary mb-4">
                Menú
            </h5>

            <ul className="nav flex-column">

                {menuItems.map((item) => (

                    <li className="nav-item mb-2" key={item.title}>

                        <NavLink
                            to={item.path}
                            className="nav-link text-dark rounded px-3 py-2"
                        >

                            <i className={`${item.icon} me-2`}></i>

                            {item.title}

                        </NavLink>

                    </li>

                ))}

            </ul>

            <hr />

            <ul className="nav flex-column">

                <li className="nav-item mb-2">

                    <NavLink
                        to="/settings"
                        className="nav-link text-dark rounded px-3 py-2"
                    >

                        <i className="bi bi-gear me-2"></i>

                        Configuración

                    </NavLink>

                </li>

                <li className="nav-item">

                    <button
                        className="btn btn-link nav-link text-danger text-start px-3"
                        onClick={handleCerrarSesion}
                    >

                        <i className="bi bi-box-arrow-right me-2"></i>

                        Cerrar sesión

                    </button>

                </li>

            </ul>

        </aside>
    );
};

export default Sidebar;