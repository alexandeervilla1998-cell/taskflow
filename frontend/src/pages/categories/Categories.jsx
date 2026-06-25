import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import {
    actualizarCategoria,
    crearCategoria,
    eliminarCategoria,
    listarCategorias
} from "../../services/categoriaService";

const formularioVacio = { nombre: "", color: "#0d6efd" };

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
            const respuesta = await listarCategorias();
            setCategorias(respuesta.data.datos);
        } catch {
            Swal.fire("Error", "No se pudieron cargar las categorías", "error");
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

    const abrirEditar = (categoria) => {
        setCategoriaEditando(categoria);
        setForm({ nombre: categoria.nombre, color: categoria.color || "#0d6efd" });
        setErrores({});
        setMostrarFormulario(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const validar = () => {
        const nuevosErrores = {};

        if (!form.nombre.trim()) {
            nuevosErrores.nombre = "El nombre es obligatorio";
        }

        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validar()) {
            return;
        }

        try {
            if (categoriaEditando) {
                await actualizarCategoria(categoriaEditando.id, form);
            } else {
                await crearCategoria(form);
            }

            setMostrarFormulario(false);
            cargarCategorias();
        } catch (error) {
            const mensaje = error.response?.data?.mensaje || "No se pudo guardar la categoría";
            Swal.fire("Error", mensaje, "error");
        }
    };

    const handleEliminar = async (categoria) => {
        const resultado = await Swal.fire({
            title: "¿Eliminar categoría?",
            text: categoria.nombre,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar"
        });

        if (!resultado.isConfirmed) {
            return;
        }

        try {
            await eliminarCategoria(categoria.id);
            cargarCategorias();
        } catch {
            Swal.fire("Error", "No se pudo eliminar la categoría", "error");
        }
    };

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold">Categorías</h2>
                <button className="btn btn-primary" onClick={abrirCrear}>
                    <i className="bi bi-plus-lg me-1"></i>
                    Nueva categoría
                </button>
            </div>

            {cargando ? (
                <p>Cargando...</p>
            ) : categorias.length === 0 ? (
                <p className="text-muted">No tienes categorías registradas.</p>
            ) : (
                <div className="row g-3">
                    {categorias.map((categoria) => (
                        <div className="col-md-4 col-lg-3" key={categoria.id}>
                            <div className="card shadow-sm border-0 h-100">
                                <div className="card-body">
                                    <div className="d-flex align-items-center gap-2 mb-2">
                                        <span
                                            className="rounded-circle"
                                            style={{
                                                width: "16px",
                                                height: "16px",
                                                backgroundColor: categoria.color || "#0d6efd",
                                                display: "inline-block"
                                            }}
                                        ></span>
                                        <h5 className="card-title mb-0">{categoria.nombre}</h5>
                                    </div>

                                    <div className="d-flex gap-2">
                                        <button className="btn btn-sm btn-outline-primary" onClick={() => abrirEditar(categoria)}>
                                            Editar
                                        </button>
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleEliminar(categoria)}>
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {mostrarFormulario && (
                <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <form onSubmit={handleSubmit}>
                                <div className="modal-header">
                                    <h5 className="modal-title">
                                        {categoriaEditando ? "Editar categoría" : "Nueva categoría"}
                                    </h5>
                                    <button type="button" className="btn-close" onClick={() => setMostrarFormulario(false)}></button>
                                </div>

                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Nombre</label>
                                        <input
                                            type="text"
                                            name="nombre"
                                            className={`form-control ${errores.nombre ? "is-invalid" : ""}`}
                                            value={form.nombre}
                                            onChange={handleChange}
                                        />
                                        {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Color</label>
                                        <input
                                            type="color"
                                            name="color"
                                            className="form-control form-control-color"
                                            value={form.color}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="modal-footer">
                                    <button type="button" className="btn btn-light" onClick={() => setMostrarFormulario(false)}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Guardar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Categories;
