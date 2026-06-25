import { useEffect, useState } from "react";

import { obtenerEstadisticas } from "../../services/tareaService";

const Dashboard = () => {
    const [estadisticas, setEstadisticas] = useState({
        total: 0,
        pendientes: 0,
        enProgreso: 0,
        finalizadas: 0
    });

    useEffect(() => {
        const cargarEstadisticas = async () => {
            try {
                const respuesta = await obtenerEstadisticas();
                setEstadisticas(respuesta.data.datos);
            } catch {
                // El dashboard se mantiene en 0 si la API no responde
            }
        };

        cargarEstadisticas();
    }, []);

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
                                {estadisticas.total}
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
                                {estadisticas.pendientes}
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
                                {estadisticas.enProgreso}
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
                                {estadisticas.finalizadas}
                            </h2>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Dashboard;
