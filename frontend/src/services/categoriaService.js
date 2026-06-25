import api from "./api";

export const listarCategorias = () => api.get("/categorias");

export const crearCategoria = (datos) => api.post("/categorias", datos);

export const actualizarCategoria = (id, datos) => api.put(`/categorias/${id}`, datos);

export const eliminarCategoria = (id) => api.delete(`/categorias/${id}`);
