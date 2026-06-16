const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="bg-white border-top shadow-sm mt-auto">

            <div className="container-fluid py-3">

                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">

                    <div>

                        <h6 className="fw-bold text-primary mb-1">
                            TaskFlow
                        </h6>

                        <small className="text-muted">
                            Sistema de gestión de tareas
                        </small>

                    </div>

                    <div className="text-center text-md-end mt-3 mt-md-0">

                        <small className="d-block text-muted">
                            Versión 1.0.0
                        </small>

                        <small className="text-muted">
                            © {year} TaskFlow
                        </small>

                    </div>

                </div>

            </div>

        </footer>
    );
};

export default Footer;