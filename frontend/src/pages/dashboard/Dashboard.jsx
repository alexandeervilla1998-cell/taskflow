const Dashboard = () => {
    return (
        <div className="container-fluid">

            <div className="mb-4">

                <h2 className="fw-bold">
                    Bienvenido
                </h2>

                <p className="text-muted">
                    Organiza y administra tus tareas desde un solo lugar.
                </p>

            </div>

            <div className="row g-4">

                <div className="col-lg-3 col-md-6">

                    <div className="card shadow-sm border-0">

                        <div className="card-body">

                            <h6 className="text-muted">
                                Total tareas
                            </h6>

                            <h2 className="fw-bold">
                                0
                            </h2>

                        </div>

                    </div>

                </div>

                <div className="col-lg-3 col-md-6">

                    <div className="card shadow-sm border-0">

                        <div className="card-body">

                            <h6 className="text-muted">
                                Pendientes
                            </h6>

                            <h2 className="fw-bold">
                                0
                            </h2>

                        </div>

                    </div>

                </div>

                <div className="col-lg-3 col-md-6">

                    <div className="card shadow-sm border-0">

                        <div className="card-body">

                            <h6 className="text-muted">
                                En progreso
                            </h6>

                            <h2 className="fw-bold">
                                0
                            </h2>

                        </div>

                    </div>

                </div>

                <div className="col-lg-3 col-md-6">

                    <div className="card shadow-sm border-0">

                        <div className="card-body">

                            <h6 className="text-muted">
                                Finalizadas
                            </h6>

                            <h2 className="fw-bold">
                                0
                            </h2>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Dashboard;