import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import { actualizarCategoria, crearCategoria, eliminarCategoria, listarCategorias } from "../../services/categoriaService";

const formularioVacio = { nombre: "", color: "#388bfd" };
const swalConfig = { background: "#0d1426", color: "#e2e8f0", confirmButtonColor: "#388bfd" };

const Categories = () => {
    const [categorias, setCategorias] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [categoriaEditando, setCategoriaEditando] = useState(null);
    const [form, setForm] = useState(formularioVacio);
    const [errores, setErrores] = useState({});

    const cargarCategorias = async () => {
        setCargando(true);
        try {
            const r = await listarCategorias();
            setCategorias(r.data.datos);
        } catch {
            Swal.fire({ icon: "error", title: "Error", text: "No se pudieron cargar las categorías", ...swalConfig });
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        cargarCategorias();
    }, []);

    const abrirCrear = () => {
        setCategoriaEditando(null);
        setForm(formularioVacio);
        setErrores({});
        setMostrarFormulario(true);
    };

    const abrirEditar = (c) => {
        setCategoriaEditando(c);
        setForm({ nombre: c.nombre, color: c.color || "#388bfd" });
        setErrores({});
        setMostrarFormulario(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((p) => ({ ...p, [name]: value }));
    };

    const validar = () => {
        const e = {};
        if (!form.nombre.trim()) e.nombre = "El nombre es obligatorio";
        setErrores(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validar()) return;
        try {
            if (categoriaEditando) await actualizarCategoria(categoriaEditando.id, form);
            else await crearCategoria(form);
            setMostrarFormulario(false);
            cargarCategorias();
        } catch (error) {
            Swal.fire({ icon: "error", title: "Error", text: error.response?.data?.mensaje || "No se pudo guardar", ...swalConfig });
        }
    };

    const handleEliminar = async (c) => {
        const r = await Swal.fire({
            title: "Eliminar categoría",
            text: c.nombre,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#e53e3e",
            ...swalConfig,
        });
        if (!r.isConfirmed) return;
        try {
            await eliminarCategoria(c.id);
            cargarCategorias();
        } catch {
            Swal.fire({ icon: "error", title: "Error", text: "No se pudo eliminar", ...swalConfig });
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="animate-fadeIn" style={s.header}>
                <div>
                    <h2 className="tf-page-title"><span className="tf-glow-text">Categorías</span></h2>
                    <p className="tf-page-subtitle">{categorias.length} categoría{categorias.length !== 1 ? "s" : ""}</p>
                </div>
                <button className="tf-btn tf-btn-primary" onClick={abrirCrear}>
                    <i className="bi bi-plus-lg"></i>
                    Nueva categoría
                </button>
            </div>

            {cargando ? (
                <div className="row g-3">
                    {[1, 2, 3].map((i) => (
                        <div className="col-md-4 col-lg-3" key={i}>
                            <div className="tf-card" style={s.skeletonCard}>
                                <div style={s.skeletonBar}></div>
                                <div style={s.skeletonLabel}></div>
                                <div style={s.skeletonBtn}></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : categorias.length === 0 ? (
                <div className="tf-card animate-fadeIn text-center" style={s.emptyCard}>
                    <i className="bi bi-folder-plus animate-float" style={s.emptyIcon}></i>
                    <h5 style={s.emptyTitle}>Sin categorías</h5>
                    <p style={s.emptyText}>
                        Crea categorías para organizar mejor tus tareas.
                    </p>
                    <button className="tf-btn tf-btn-primary" onClick={abrirCrear}>
                        <i className="bi bi-plus-lg"></i>
                        Crear categoría
                    </button>
                </div>
            ) : (
                <div className="row g-3">
                    {categorias.map((cat, i) => (
                        <div className={`col-md-4 col-lg-3 animate-slideUp delay-${Math.min(i + 1, 4)}`} key={cat.id}>
                            <div className="tf-card" style={s.catCard}>
                                {/* Franja de color con glow para identificar la categoría visualmente */}
                                <div style={{ ...s.catBarra, background: cat.color || "#388bfd", boxShadow: `0 0 12px ${cat.color || "#388bfd"}60` }}></div>
                                <div style={s.catNombreRow}>
                                    <span style={{ ...s.catDot, background: cat.color || "#388bfd", boxShadow: `0 0 8px ${cat.color || "#388bfd"}80` }}></span>
                                    <h6 style={s.catNombre}>{cat.nombre}</h6>
                                </div>
                                <div style={s.acciones}>
                                    <button className="tf-btn tf-btn-ghost" style={s.btnEditar} onClick={() => abrirEditar(cat)}>
                                        <i className="bi bi-pencil"></i> Editar
                                    </button>
                                    <button className="tf-btn" style={s.btnEliminar} onClick={() => handleEliminar(cat)}>
                                        <i className="bi bi-trash"></i>
                                    </button>
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
                                    <i className={`bi ${categoriaEditando ? "bi-pencil" : "bi-folder-plus"} me-2`} style={s.modalIcono}></i>
                                    {categoriaEditando ? "Editar categoría" : "Nueva categoría"}
                                </span>
                                <button type="button" onClick={() => setMostrarFormulario(false)} style={s.btnCerrar}>
                                    <i className="bi bi-x-lg"></i>
                                </button>
                            </div>
                            <div className="tf-modal-body">
                                <div className="mb-3">
                                    <label className="tf-label">Nombre</label>
                                    <input
                                        type="text" name="nombre" className="tf-input"
                                        style={s.inputFull} value={form.nombre}
                                        onChange={handleChange} autoFocus placeholder="Nombre de la categoría"
                                    />
                                    {errores.nombre && <div className="tf-error">{errores.nombre}</div>}
                                </div>
                                <div>
                                    <label className="tf-label">Color</label>
                                    <div style={s.colorRow}>
                                        <input
                                            type="color" name="color" value={form.color}
                                            onChange={handleChange} style={s.colorPicker}
                                        />
                                        <span style={s.colorHex}>{form.color}</span>
                                        {/* Preview del color elegido */}
                                        <span style={{ ...s.colorDotPreview, background: form.color, boxShadow: `0 0 10px ${form.color}60` }}></span>
                                    </div>
                                </div>
                            </div>
                            <div className="tf-modal-footer">
                                <button type="button" className="tf-btn tf-btn-ghost" onClick={() => setMostrarFormulario(false)}>Cancelar</button>
                                <button type="submit" className="tf-btn tf-btn-primary"><i className="bi bi-check-lg"></i> Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const s = {
    // Layout
    header:          { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" },

    // Skeleton loading
    skeletonCard:    { padding: "1.25rem", opacity: 0.4 },
    skeletonBar:     { height: "4px",  background: "rgba(255,255,255,0.08)", borderRadius: "4px", marginBottom: "1rem" },
    skeletonLabel:   { height: "14px", background: "rgba(255,255,255,0.06)", borderRadius: "4px", width: "60%", marginBottom: "1rem" },
    skeletonBtn:     { height: "28px", background: "rgba(255,255,255,0.04)", borderRadius: "8px" },

    // Estado vacío
    emptyCard:       { padding: "3rem" },
    emptyIcon:       { fontSize: "3rem", color: "var(--tf-muted)", display: "block", marginBottom: "1rem" },
    emptyTitle:      { color: "var(--tf-text)", marginBottom: "0.5rem" },
    emptyText:       { color: "var(--tf-muted)", fontSize: "0.85rem", marginBottom: "1.5rem" },

    // Tarjeta de categoría (los valores dinámicos de color se mezclan con spread en el JSX)
    catCard:         { padding: "1.25rem" },
    catBarra:        { height: "4px", borderRadius: "4px", marginBottom: "1rem" },
    catNombreRow:    { display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" },
    catDot:          { width: "12px", height: "12px", borderRadius: "50%", flexShrink: 0 },
    catNombre:       { color: "var(--tf-text)", fontWeight: 600, margin: 0 },
    acciones:        { display: "flex", gap: "0.5rem" },
    btnEditar:       { flexGrow: 1, fontSize: "0.8rem", padding: "0.35rem 0.6rem" },
    btnEliminar:     { background: "rgba(252,129,129,0.08)", border: "1px solid rgba(252,129,129,0.2)", color: "var(--tf-danger)", padding: "0.35rem 0.6rem" },

    // Modal
    modalIcono:      { color: "var(--tf-primary)" },
    btnCerrar:       { background: "none", border: "none", color: "var(--tf-muted)", cursor: "pointer", fontSize: "1.1rem" },
    inputFull:       { width: "100%" },
    colorRow:        { display: "flex", alignItems: "center", gap: "0.75rem" },
    colorPicker:     { width: "48px", height: "40px", padding: "2px", background: "rgba(255,255,255,0.04)", border: "1px solid var(--tf-border)", borderRadius: "8px", cursor: "pointer" },
    colorHex:        { fontSize: "0.82rem", color: "var(--tf-muted)" },
    colorDotPreview: { display: "inline-block", width: "20px", height: "20px", borderRadius: "50%" },
};

export default Categories;
