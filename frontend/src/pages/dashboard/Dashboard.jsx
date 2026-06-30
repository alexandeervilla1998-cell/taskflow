import { useEffect, useState } from "react";

import { useAuth } from "../../hooks/useAuth";
import { obtenerEstadisticas } from "../../services/tareaService";

const tarjetas = [
    { key: "total", label: "Total tareas", icon: "bi bi-list-check", color: "primary" },
    { key: "pendientes", label: "Pendientes", icon: "bi bi-hourglass-split", color: "warning" },
    { key: "enProgreso", label: "En progreso", icon: "bi bi-arrow-repeat", color: "info" },
    { key: "finalizadas", label: "Finalizadas", icon: "bi bi-check-circle-fill", color: "success" }
];

const Dashboard = () => {
    const { usuario } = useAuth();
    const [estadisticas, setEstadisticas] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const cargarEstadisticas = async () => {
            try {
                const respuesta = await obtenerEstadisticas();
                setEstadisticas(respuesta.data.datos);
            } catch {
                setEstadisticas({ total: 0, pendientes: 0, enProgreso: 0, finalizadas: 0 });
            } finally {
                setCargando(false);
            }
        };

        cargarEstadisticas();
    }, []);

    return (
        <div className="container-fluid">

            <div className="mb-4">
                <h2 className="fw-bold mb-1">
                    Hola, {usuario?.nombre?.split(" ")[0] || "usuario"} 👋
                </h2>
                <p className="text-muted">
                    Organiza y administra tus tareas desde un solo lugar.
                </p>
            </div>

            {cargando ? (
                <div className="row g-4">
                    {tarjetas.map((t) => (
                        <div className="col-lg-3 col-md-6" key={t.key}>
                            <div className="card shadow-sm border-0 placeholder-glow">
                                <div className="card-body">
                                    <span className="placeholder col-6 mb-2"></span>
                                    <span className="placeholder col-4 d-block" style={{ height: "2rem" }}></span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    <div className="row g-4 mb-4">
                        {tarjetas.map((t) => (
                            <div className="col-lg-3 col-md-6" key={t.key}>
                                <div className={`card shadow-sm border-0 border-start border-4 border-${t.color}`}>
                                    <div className="card-body d-flex align-items-center gap-3">
                                        <div
                                            className={`rounded-circle bg-${t.color} bg-opacity-10 d-flex align-items-center justify-content-center`}
                                            style={{ width: "48px", height: "48px", flexShrink: 0 }}
                                        >
                                            <i className={`${t.icon} text-${t.color} fs-5`}></i>
                                        </div>
                                        <div>
                                            <p className="text-muted small mb-0">{t.label}</p>
                                            <h3 className="fw-bold mb-0">{estadisticas?.[t.key] ?? 0}</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {estadisticas?.total === 0 && (
                        <div className="text-center py-5 text-muted">
                            <i className="bi bi-inbox" style={{ fontSize: "3rem", opacity: 0.4 }}></i>
                            <p className="mt-3 fs-5">Todavía no tienes tareas.</p>
                            <a href="/tasks" className="btn btn-primary">
                                <i className="bi bi-plus-lg me-1"></i>
                                Crear primera tarea
                            </a>
                        </div>
                    )}
                </>
            )}

        </div>
    );
};

export default Dashboard;
