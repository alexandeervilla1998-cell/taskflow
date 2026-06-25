import api from "./api";

export const listarTareas = (filtros = {}) => api.get("/tareas", { params: filtros });

export const crearTarea = (datos) => api.post("/tareas", datos);

export const actualizarTarea = (id, datos) => api.put(`/tareas/${id}`, datos);

export const actualizarEstadoTarea = (id, estado) => api.patch(`/tareas/${id}/estado`, { estado });

export const eliminarTarea = (id) => api.delete(`/tareas/${id}`);
