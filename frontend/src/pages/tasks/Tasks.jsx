import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import { listarCategorias } from "../../services/categoriaService";
import { actualizarEstadoTarea, actualizarTarea, crearTarea, eliminarTarea, listarTareas } from "../../services/tareaService";

const ESTADOS = ["PENDIENTE", "EN_PROGRESO", "FINALIZADA"];
const PRIORIDADES = ["BAJA", "MEDIA", "ALTA"];

const ESTADO_META = {
    PENDIENTE:   { label: "Pendiente",   badge: "tf-badge-yellow", color: "#ecc94b" },
    EN_PROGRESO: { label: "En progreso", badge: "tf-badge-cyan",   color: "#58d6f5" },
    FINALIZADA:  { label: "Finalizada",  badge: "tf-badge-green",  color: "#48bb78" },
};

const PRIORIDAD_META = {
    BAJA:  { badge: "tf-badge-gray", label: "Baja"  },
    MEDIA: { badge: "tf-badge-blue", label: "Media" },
    ALTA:  { badge: "tf-badge-red",  label: "Alta"  },
};

const swalConfig = { background: "#0d1426", color: "#e2e8f0", confirmButtonColor: "#388bfd" };

const formularioVacio = { titulo: "", descripcion: "", estado: "PENDIENTE", prioridad: "MEDIA", categoriaId: "" };

const Tasks = () => {
    const [tareas, setTareas] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [filtroEstado, setFiltroEstado] = useState("");
    const [filtroCategoria, setFiltroCategoria] = useState("");
    const [cargando, setCargando] = useState(false);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [tareaEditando, setTareaEditando] = useState(null);
    const [form, setForm] = useState(formularioVacio);
    const [errores, setErrores] = useState({});
    const [cambiandoEstado, setCambiandoEstado] = useState(null);

    const cargarTareas = async () => {
        setCargando(true);
        try {
            const filtros = {};
            if (filtroEstado) filtros.estado = filtroEstado;
            if (filtroCategoria) filtros.categoriaId = filtroCategoria;
            const r = await listarTareas(filtros);
            setTareas(r.data.datos);
        } catch {
            Swal.fire({ icon: "error", title: "Error", text: "No se pudieron cargar las tareas", ...swalConfig });
        } finally {
            setCargando(false);
        }
    };

    const cargarCategorias = async () => {
        try {
            const r = await listarCategorias();
            setCategorias(r.data.datos);
        } catch { /* silencioso */ }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        cargarCategorias();
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        cargarTareas();
    }, [filtroEstado, filtroCategoria]); // eslint-disable-line react-hooks/exhaustive-deps

    const abrirCrear = () => {
        setTareaEditando(null);
        setForm(formularioVacio);
        setErrores({});
        setMostrarFormulario(true);
    };

    const abrirEditar = (t) => {
        setTareaEditando(t);
        setForm({ titulo: t.titulo, descripcion: t.descripcion || "", estado: t.estado, prioridad: t.prioridad, categoriaId: t.categoriaId || "" });
        setErrores({});
        setMostrarFormulario(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((p) => ({ ...p, [name]: value }));
    };

    const validar = () => {
        const e = {};
        if (!form.titulo.trim()) e.titulo = "El título es obligatorio";
        setErrores(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validar()) return;
        const datos = {
            titulo: form.titulo,
            descripcion: form.descripcion,
            estado: form.estado,
            prioridad: form.prioridad,
            categoriaId: form.categoriaId ? Number(form.categoriaId) : null,
        };
        try {
            if (tareaEditando) await actualizarTarea(tareaEditando.id, datos);
            else await crearTarea(datos);
            setMostrarFormulario(false);
            cargarTareas();
        } catch (error) {
            Swal.fire({ icon: "error", title: "Error", text: error.response?.data?.mensaje || "No se pudo guardar", ...swalConfig });
        }
    };

    const handleCambiarEstado = async (tarea, nuevoEstado) => {
        setCambiandoEstado(tarea.id);
        try {
            await actualizarEstadoTarea(tarea.id, nuevoEstado);
            cargarTareas();
        } catch {
            Swal.fire({ icon: "error", title: "Error", text: "No se pudo actualizar el estado", ...swalConfig });
        } finally {
            setCambiandoEstado(null);
        }
    };

    const handleEliminar = async (tarea) => {
        const r = await Swal.fire({
            title: "Eliminar tarea",
            text: tarea.titulo,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#e53e3e",
            ...swalConfig,
        });
        if (!r.isConfirmed) return;
        try {
            await eliminarTarea(tarea.id);
            cargarTareas();
        } catch {
            Swal.fire({ icon: "error", title: "Error", text: "No se pudo eliminar", ...swalConfig });
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="animate-fadeIn" style={s.header}>
                <div>
                    <h2 className="tf-page-title">Mis <span className="tf-glow-text">tareas</span></h2>
                    <p className="tf-page-subtitle">{tareas.length} tarea{tareas.length !== 1 ? "s" : ""} encontrada{tareas.length !== 1 ? "s" : ""}</p>
                </div>
                <button className="tf-btn tf-btn-primary" onClick={abrirCrear}>
                    <i className="bi bi-plus-lg"></i>
                    Nueva tarea
                </button>
            </div>

            {/* Filtros */}
            <div className="animate-slideLeft mb-4" style={s.filtros}>
                <select className="tf-select" value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} style={s.filtroSelect}>
                    <option value="">Todos los estados</option>
                    {ESTADOS.map((e) => <option key={e} value={e}>{ESTADO_META[e].label}</option>)}
                </select>
                <select className="tf-select" value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)} style={s.filtroSelect}>
                    <option value="">Todas las categorías</option>
                    {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
            </div>

            {/* Grid de tareas */}
            {cargando ? (
                <div className="row g-3">
                    {[1, 2, 3].map((i) => (
                        <div className="col-md-6 col-lg-4" key={i}>
                            <div className="tf-task-card" style={s.skeletonCard}>
                                <div style={s.skeletonRow1}></div>
                                <div style={s.skeletonRow2}></div>
                                <div style={s.skeletonRow3}></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : tareas.length === 0 ? (
                <div className="tf-card animate-fadeIn text-center" style={s.emptyCard}>
                    <i className="bi bi-clipboard-x animate-float" style={s.emptyIcon}></i>
                    <h5 style={s.emptyTitle}>
                        {filtroEstado || filtroCategoria ? "Sin resultados" : "Sin tareas aún"}
                    </h5>
                    <p style={s.emptyText}>
                        {filtroEstado || filtroCategoria ? "Prueba con otros filtros." : "Crea tu primera tarea para empezar."}
                    </p>
                    {!filtroEstado && !filtroCategoria && (
                        <button className="tf-btn tf-btn-primary" onClick={abrirCrear}>
                            <i className="bi bi-plus-lg"></i>
                            Crear primera tarea
                        </button>
                    )}
                </div>
            ) : (
                <div className="row g-3">
                    {tareas.map((tarea, i) => (
                        <div className={`col-md-6 col-lg-4 animate-slideUp delay-${Math.min(i + 1, 4)}`} key={tarea.id}>
                            <div className="tf-task-card">
                                {/* Badges de estado y prioridad */}
                                <div style={s.cardBadgeRow}>
                                    <span className={`tf-badge ${ESTADO_META[tarea.estado].badge}`}>
                                        {ESTADO_META[tarea.estado].label}
                                    </span>
                                    <span className={`tf-badge ${PRIORIDAD_META[tarea.prioridad].badge}`}>
                                        {PRIORIDAD_META[tarea.prioridad].label}
                                    </span>
                                </div>

                                <h6 style={s.cardTitulo}>{tarea.titulo}</h6>

                                {tarea.descripcion && (
                                    <p style={s.cardDescripcion}>{tarea.descripcion}</p>
                                )}

                                {tarea.categoriaNombre && (
                                    <span className="tf-badge tf-badge-gray" style={s.cardCategoria}>
                                        <i className="bi bi-folder me-1"></i>
                                        {tarea.categoriaNombre}
                                    </span>
                                )}

                                <div style={s.cardFooter}>
                                    {/* El select empuja el estado directamente sin submit */}
                                    <select
                                        className="tf-select"
                                        style={s.selectEstado}
                                        value={tarea.estado}
                                        disabled={cambiandoEstado === tarea.id}
                                        onChange={(e) => handleCambiarEstado(tarea, e.target.value)}
                                    >
                                        {ESTADOS.map((e) => <option key={e} value={e}>{ESTADO_META[e].label}</option>)}
                                    </select>

                                    <div style={s.acciones}>
                                        <button
                                            className="tf-btn tf-btn-ghost"
                                            style={s.btnEditar}
                                            onClick={() => abrirEditar(tarea)}
                                        >
                                            <i className="bi bi-pencil"></i>
                                            Editar
                                        </button>
                                        <button
                                            className="tf-btn"
                                            style={s.btnEliminar}
                                            onClick={() => handleEliminar(tarea)}
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal crear/editar */}
            {mostrarFormulario && (
                <div className="tf-modal-backdrop">
                    <div className="tf-modal">
                        <form onSubmit={handleSubmit}>
                            <div className="tf-modal-header">
                                <span className="tf-modal-title">
                                    <i className={`bi ${tareaEditando ? "bi-pencil" : "bi-plus-circle"} me-2`} style={s.modalIcono}></i>
                                    {tareaEditando ? "Editar tarea" : "Nueva tarea"}
                                </span>
                                <button type="button" onClick={() => setMostrarFormulario(false)} style={s.btnCerrar}>
                                    <i className="bi bi-x-lg"></i>
                                </button>
                            </div>

                            <div className="tf-modal-body">
                                <div className="mb-3">
                                    <label className="tf-label">Título</label>
                                    <input
                                        type="text" name="titulo" className="tf-input"
                                        style={s.inputFull} value={form.titulo}
                                        onChange={handleChange} autoFocus placeholder="Nombre de la tarea"
                                    />
                                    {errores.titulo && <div className="tf-error">{errores.titulo}</div>}
                                </div>

                                <div className="mb-3">
                                    <label className="tf-label">Descripción</label>
                                    <textarea
                                        name="descripcion" className="tf-input"
                                        style={s.textarea}
                                        value={form.descripcion} onChange={handleChange}
                                        placeholder="Descripción opcional..."
                                    />
                                </div>

                                <div style={s.gridDosCol} className="mb-3">
                                    <div>
                                        <label className="tf-label">Estado</label>
                                        <select name="estado" className="tf-select" style={s.inputFull} value={form.estado} onChange={handleChange}>
                                            {ESTADOS.map((e) => <option key={e} value={e}>{ESTADO_META[e].label}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="tf-label">Prioridad</label>
                                        <select name="prioridad" className="tf-select" style={s.inputFull} value={form.prioridad} onChange={handleChange}>
                                            {PRIORIDADES.map((p) => <option key={p} value={p}>{PRIORIDAD_META[p].label}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="mb-2">
                                    <label className="tf-label">Categoría</label>
                                    <select name="categoriaId" className="tf-select" style={s.inputFull} value={form.categoriaId} onChange={handleChange}>
                                        <option value="">Sin categoría</option>
                                        {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="tf-modal-footer">
                                <button type="button" className="tf-btn tf-btn-ghost" onClick={() => setMostrarFormulario(false)}>
                                    Cancelar
                                </button>
                                <button type="submit" className="tf-btn tf-btn-primary">
                                    <i className="bi bi-check-lg"></i>
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const s = {
    // Layout header
    header:        { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" },
    filtros:       { display: "flex", flexWrap: "wrap", gap: "0.75rem" },
    filtroSelect:  { minWidth: "160px" },

    // Skeleton loading
    skeletonCard:  { opacity: 0.4 },
    skeletonRow1:  { height: "12px", background: "rgba(255,255,255,0.06)", borderRadius: "4px", width: "60%" },
    skeletonRow2:  { height: "10px", background: "rgba(255,255,255,0.04)", borderRadius: "4px", width: "40%" },
    skeletonRow3:  { height: "32px", background: "rgba(255,255,255,0.04)", borderRadius: "8px" },

    // Estado vacío
    emptyCard:     { padding: "3rem" },
    emptyIcon:     { fontSize: "3rem", color: "var(--tf-muted)", display: "block", marginBottom: "1rem" },
    emptyTitle:    { color: "var(--tf-text)", marginBottom: "0.5rem" },
    emptyText:     { color: "var(--tf-muted)", fontSize: "0.85rem", marginBottom: "1.5rem" },

    // Tarjeta de tarea
    cardBadgeRow:  { display: "flex", justifyContent: "space-between", alignItems: "center" },
    cardTitulo:    { color: "var(--tf-text)", fontWeight: 600, margin: "0.25rem 0 0" },
    cardDescripcion: { color: "var(--tf-muted)", fontSize: "0.8rem", margin: 0, lineHeight: "1.5" },
    cardCategoria: { alignSelf: "flex-start" },
    cardFooter:    { marginTop: "auto" },
    selectEstado:  { width: "100%", marginBottom: "0.6rem", fontSize: "0.8rem" },
    acciones:      { display: "flex", gap: "0.5rem" },
    btnEditar:     { flexGrow: 1, fontSize: "0.82rem", padding: "0.4rem 0.75rem" },
    btnEliminar:   { background: "rgba(252,129,129,0.08)", border: "1px solid rgba(252,129,129,0.25)", color: "var(--tf-danger)", padding: "0.4rem 0.7rem", fontSize: "0.85rem" },

    // Modal
    modalIcono:    { color: "var(--tf-primary)" },
    btnCerrar:     { background: "none", border: "none", color: "var(--tf-muted)", cursor: "pointer", fontSize: "1.1rem" },
    inputFull:     { width: "100%" },
    textarea:      { width: "100%", minHeight: "80px", resize: "vertical" },
    gridDosCol:    { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" },
};

export default Tasks;
