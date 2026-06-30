import { useEffect, useState } from "react";

import { useAuth } from "../../hooks/useAuth";
import { obtenerEstadisticas } from "../../services/tareaService";

const tarjetas = [
    { key: "total",      label: "Total tareas",   icon: "bi-list-check",        color: "#388bfd", bg: "rgba(56,139,253,0.12)"  },
    { key: "pendientes", label: "Pendientes",      icon: "bi-hourglass-split",   color: "#ecc94b", bg: "rgba(236,201,75,0.12)"  },
    { key: "enProgreso", label: "En progreso",     icon: "bi-arrow-repeat",      color: "#58d6f5", bg: "rgba(88,214,245,0.12)"  },
    { key: "finalizadas",label: "Finalizadas",     icon: "bi-check-circle-fill", color: "#48bb78", bg: "rgba(72,187,120,0.12)"  },
];

const Dashboard = () => {
    const { usuario } = useAuth();
    const [estadisticas, setEstadisticas] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const cargar = async () => {
            try {
                const r = await obtenerEstadisticas();
                setEstadisticas(r.data.datos);
            } catch {
                setEstadisticas({ total: 0, pendientes: 0, enProgreso: 0, finalizadas: 0 });
            } finally {
                setCargando(false);
            }
        };
        cargar();
    }, []);

    return (
        <div>
            {/* Header */}
            <div className="animate-fadeIn mb-4">
                <h2 className="tf-page-title">
                    Bienvenido, <span className="tf-glow-text">{usuario?.nombre?.split(" ")[0] || "usuario"}</span>
                </h2>
                <p className="tf-page-subtitle">Organiza y administra tus tareas desde un solo lugar.</p>
            </div>

            {/* Stats */}
            {cargando ? (
                <div className="row g-3">
                    {tarjetas.map((t) => (
                        <div className="col-lg-3 col-md-6" key={t.key}>
                            <div className="tf-stat-card" style={{ opacity: 0.5 }}>
                                <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: t.bg }}></div>
                                <div>
                                    <div style={{ width: "60px", height: "10px", background: "rgba(255,255,255,0.08)", borderRadius: "4px", marginBottom: "8px" }}></div>
                                    <div style={{ width: "40px", height: "28px", background: "rgba(255,255,255,0.06)", borderRadius: "4px" }}></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    <div className="row g-3 mb-4">
                        {tarjetas.map((t, i) => (
                            <div className={`col-lg-3 col-md-6 animate-slideUp delay-${i + 1}`} key={t.key}>
                                <div className="tf-stat-card">
                                    <div
                                        className="tf-stat-icon"
                                        style={{ background: t.bg }}
                                    >
                                        <i className={`bi ${t.icon}`} style={{ color: t.color }}></i>
                                    </div>
                                    <div>
                                        <div className="tf-stat-label">{t.label}</div>
                                        <div className="tf-stat-value animate-countUp">{estadisticas?.[t.key] ?? 0}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {estadisticas?.total === 0 && (
                        <div
                            className="tf-card animate-fadeIn text-center"
                            style={{ padding: "3rem", marginTop: "2rem" }}
                        >
                            <i className="bi bi-inbox animate-float" style={{ fontSize: "3rem", color: "var(--tf-muted)", display: "block", marginBottom: "1rem" }}></i>
                            <h5 style={{ color: "var(--tf-text)", marginBottom: "0.5rem" }}>Sin tareas aún</h5>
                            <p style={{ color: "var(--tf-muted)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
                                Crea tu primera tarea para empezar a organizar tu trabajo.
                            </p>
                            <a href="/tasks" className="tf-btn tf-btn-primary" style={{ textDecoration: "none" }}>
                                <i className="bi bi-plus-lg"></i>
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
