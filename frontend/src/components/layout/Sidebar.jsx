const Sidebar = () => {
    return (
        <div className="p-3 vh-100">

            <h5>Menú</h5>

            <ul className="nav flex-column">

                <li className="nav-item">
                    <a className="nav-link" href="#">
                        Dashboard
                    </a>
                </li>

                <li className="nav-item">
                    <a className="nav-link" href="#">
                        Mis tareas
                    </a>
                </li>

                <li className="nav-item">
                    <a className="nav-link" href="#">
                        Categorías
                    </a>
                </li>

                <li className="nav-item">
                    <a className="nav-link" href="#">
                        Perfil
                    </a>
                </li>

            </ul>

        </div>
    );
};

export default Sidebar;