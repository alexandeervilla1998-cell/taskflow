import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import { listarCategorias } from "../../services/categoriaService";
import {
    actualizarEstadoTarea,
    actualizarTarea,
    crearTarea,
    eliminarTarea,
    listarTareas
} from "../../services/tareaService";

const ESTADOS = ["PENDIENTE", "EN_PROGRESO", "FINALIZADA"];
const PRIORIDADES = ["BAJA", "MEDIA", "ALTA"];

const formularioVacio = {
    titulo: "",
    descripcion: "",
    estado: "PENDIENTE",
    prioridad: "MEDIA",
    categoriaId: ""
};

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

    const cargarTareas = async () => {
        setCargando(true);

        try {
            const filtros = {};
            if (filtroEstado) filtros.estado = filtroEstado;
            if (filtroCategoria) filtros.categoriaId = filtroCategoria;

            const respuesta = await listarTareas(filtros);
            setTareas(respuesta.data.datos);
        } catch {
            Swal.fire("Error", "No se pudieron cargar las tareas", "error");
        } finally {
            setCargando(false);
        }
    };

    const cargarCategorias = async () => {
        try {
            const respuesta = await listarCategorias();
            setCategorias(respuesta.data.datos);
        } catch {
            Swal.fire("Error", "No se pudieron cargar las categorías", "error");
        }
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

    const abrirEditar = (tarea) => {
        setTareaEditando(tarea);
        setForm({
            titulo: tarea.titulo,
            descripcion: tarea.descripcion || "",
            estado: tarea.estado,
            prioridad: tarea.prioridad,
            categoriaId: tarea.categoriaId || ""
        });
        setErrores({});
        setMostrarFormulario(true);
    };

    const cerrarFormulario = () => {
        setMostrarFormulario(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const validar = () => {
        const nuevosErrores = {};

        if (!form.titulo.trim()) {
            nuevosErrores.titulo = "El título es obligatorio";
        }

        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validar()) {
            return;
        }

        const datos = {
            titulo: form.titulo,
            descripcion: form.descripcion,
            estado: form.estado,
            prioridad: form.prioridad,
            categoriaId: form.categoriaId ? Number(form.categoriaId) : null
        };

        try {
            if (tareaEditando) {
                await actualizarTarea(tareaEditando.id, datos);
            } else {
                await crearTarea(datos);
            }

            setMostrarFormulario(false);
            cargarTareas();
        } catch (error) {
            const mensaje = error.response?.data?.mensaje || "No se pudo guardar la tarea";
            Swal.fire("Error", mensaje, "error");
        }
    };

    const handleCambiarEstado = async (tarea, nuevoEstado) => {
        try {
            await actualizarEstadoTarea(tarea.id, nuevoEstado);
            cargarTareas();
        } catch {
            Swal.fire("Error", "No se pudo actualizar el estado", "error");
        }
    };

    const handleEliminar = async (tarea) => {
        const resultado = await Swal.fire({
            title: "¿Eliminar tarea?",
            text: tarea.titulo,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar"
        });

        if (!resultado.isConfirmed) {
            return;
        }

        try {
            await eliminarTarea(tarea.id);
            cargarTareas();
        } catch {
            Swal.fire("Error", "No se pudo eliminar la tarea", "error");
        }
    };

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold">Mis tareas</h2>
                <button className="btn btn-primary" onClick={abrirCrear}>
                    <i className="bi bi-plus-lg me-1"></i>
                    Nueva tarea
                </button>
            </div>

            <div className="row g-2 mb-4">
                <div className="col-auto">
                    <select className="form-select" value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
                        <option value="">Todos los estados</option>
                        {ESTADOS.map((estado) => (
                            <option key={estado} value={estado}>{estado}</option>
                        ))}
                    </select>
                </div>

                <div className="col-auto">
                    <select className="form-select" value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
                        <option value="">Todas las categorías</option>
                        {categorias.map((categoria) => (
                            <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
                        ))}
                    </select>
                </div>
            </div>

            {cargando ? (
                <p>Cargando...</p>
            ) : tareas.length === 0 ? (
                <p className="text-muted">No tienes tareas registradas.</p>
            ) : (
                <div className="row g-3">
                    {tareas.map((tarea) => (
                        <div className="col-md-6 col-lg-4" key={tarea.id}>
                            <div className="card shadow-sm border-0 h-100">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <h5 className="card-title">{tarea.titulo}</h5>
                                        <span className="badge bg-secondary">{tarea.prioridad}</span>
                                    </div>

                                    <p className="card-text text-muted">{tarea.descripcion}</p>

                                    {tarea.categoriaNombre && (
                                        <span className="badge bg-light text-dark border mb-2">{tarea.categoriaNombre}</span>
                                    )}

                                    <select
                                        className="form-select form-select-sm mb-2"
                                        value={tarea.estado}
                                        onChange={(e) => handleCambiarEstado(tarea, e.target.value)}
                                    >
                                        {ESTADOS.map((estado) => (
                                            <option key={estado} value={estado}>{estado}</option>
                                        ))}
                                    </select>

                                    <div className="d-flex gap-2">
                                        <button className="btn btn-sm btn-outline-primary" onClick={() => abrirEditar(tarea)}>
                                            Editar
                                        </button>
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleEliminar(tarea)}>
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
                                    <h5 className="modal-title">{tareaEditando ? "Editar tarea" : "Nueva tarea"}</h5>
                                    <button type="button" className="btn-close" onClick={cerrarFormulario}></button>
                                </div>

                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Título</label>
                                        <input
                                            type="text"
                                            name="titulo"
                                            className={`form-control ${errores.titulo ? "is-invalid" : ""}`}
                                            value={form.titulo}
                                            onChange={handleChange}
                                        />
                                        {errores.titulo && <div className="invalid-feedback">{errores.titulo}</div>}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Descripción</label>
                                        <textarea
                                            name="descripcion"
                                            className="form-control"
                                            value={form.descripcion}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Estado</label>
                                        <select name="estado" className="form-select" value={form.estado} onChange={handleChange}>
                                            {ESTADOS.map((estado) => (
                                                <option key={estado} value={estado}>{estado}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Prioridad</label>
                                        <select name="prioridad" className="form-select" value={form.prioridad} onChange={handleChange}>
                                            {PRIORIDADES.map((prioridad) => (
                                                <option key={prioridad} value={prioridad}>{prioridad}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Categoría</label>
                                        <select name="categoriaId" className="form-select" value={form.categoriaId} onChange={handleChange}>
                                            <option value="">Sin categoría</option>
                                            {categorias.map((categoria) => (
                                                <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="modal-footer">
                                    <button type="button" className="btn btn-light" onClick={cerrarFormulario}>
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

export default Tasks;
