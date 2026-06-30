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

    const abrirCrear = () => { setCategoriaEditando(null); setForm(formularioVacio); setErrores({}); setMostrarFormulario(true); };
    const abrirEditar = (c) => { setCategoriaEditando(c); setForm({ nombre: c.nombre, color: c.color || "#388bfd" }); setErrores({}); setMostrarFormulario(true); };

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
            title: "Eliminar categoría", text: c.nombre, icon: "warning",
            showCancelButton: true, confirmButtonText: "Eliminar", cancelButtonText: "Cancelar",
            confirmButtonColor: "#e53e3e", ...swalConfig
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
            <div className="animate-fadeIn" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
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
                            <div className="tf-card" style={{ padding: "1.25rem", opacity: 0.4 }}>
                                <div style={{ height: "4px", background: "rgba(255,255,255,0.08)", borderRadius: "4px", marginBottom: "1rem" }}></div>
                                <div style={{ height: "14px", background: "rgba(255,255,255,0.06)", borderRadius: "4px", width: "60%", marginBottom: "1rem" }}></div>
                                <div style={{ height: "28px", background: "rgba(255,255,255,0.04)", borderRadius: "8px" }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : categorias.length === 0 ? (
                <div className="tf-card animate-fadeIn text-center" style={{ padding: "3rem" }}>
                    <i className="bi bi-folder-plus animate-float" style={{ fontSize: "3rem", color: "var(--tf-muted)", display: "block", marginBottom: "1rem" }}></i>
                    <h5 style={{ color: "var(--tf-text)", marginBottom: "0.5rem" }}>Sin categorías</h5>
                    <p style={{ color: "var(--tf-muted)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
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
                            <div className="tf-card" style={{ padding: "1.25rem" }}>
                                <div style={{ height: "4px", background: cat.color || "#388bfd", borderRadius: "4px", marginBottom: "1rem", boxShadow: `0 0 12px ${cat.color || "#388bfd"}60` }}></div>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
                                    <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: cat.color || "#388bfd", boxShadow: `0 0 8px ${cat.color || "#388bfd"}80`, flexShrink: 0 }}></span>
                                    <h6 style={{ color: "var(--tf-text)", fontWeight: 600, margin: 0 }}>{cat.nombre}</h6>
                                </div>
                                <div style={{ display: "flex", gap: "0.5rem" }}>
                                    <button className="tf-btn tf-btn-ghost" style={{ flexGrow: 1, fontSize: "0.8rem", padding: "0.35rem 0.6rem" }} onClick={() => abrirEditar(cat)}>
                                        <i className="bi bi-pencil"></i> Editar
                                    </button>
                                    <button className="tf-btn" style={{ background: "rgba(252,129,129,0.08)", border: "1px solid rgba(252,129,129,0.2)", color: "var(--tf-danger)", padding: "0.35rem 0.6rem" }} onClick={() => handleEliminar(cat)}>
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {mostrarFormulario && (
                <div className="tf-modal-backdrop">
                    <div className="tf-modal">
                        <form onSubmit={handleSubmit}>
                            <div className="tf-modal-header">
                                <span className="tf-modal-title">
                                    <i className={`bi ${categoriaEditando ? "bi-pencil" : "bi-folder-plus"} me-2`} style={{ color: "var(--tf-primary)" }}></i>
                                    {categoriaEditando ? "Editar categoría" : "Nueva categoría"}
                                </span>
                                <button type="button" onClick={() => setMostrarFormulario(false)} style={{ background: "none", border: "none", color: "var(--tf-muted)", cursor: "pointer", fontSize: "1.1rem" }}>
                                    <i className="bi bi-x-lg"></i>
                                </button>
                            </div>
                            <div className="tf-modal-body">
                                <div className="mb-3">
                                    <label className="tf-label">Nombre</label>
                                    <input type="text" name="nombre" className="tf-input" style={{ width: "100%" }} value={form.nombre} onChange={handleChange} autoFocus placeholder="Nombre de la categoría" />
                                    {errores.nombre && <div className="tf-error">{errores.nombre}</div>}
                                </div>
                                <div>
                                    <label className="tf-label">Color</label>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                        <input type="color" name="color" value={form.color} onChange={handleChange}
                                            style={{ width: "48px", height: "40px", padding: "2px", background: "rgba(255,255,255,0.04)", border: "1px solid var(--tf-border)", borderRadius: "8px", cursor: "pointer" }} />
                                        <span style={{ fontSize: "0.82rem", color: "var(--tf-muted)" }}>{form.color}</span>
                                        <span style={{ display: "inline-block", width: "20px", height: "20px", borderRadius: "50%", background: form.color, boxShadow: `0 0 10px ${form.color}60` }}></span>
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

export default Categories;
