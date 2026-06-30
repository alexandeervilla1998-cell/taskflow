import api from "./api";

export const obtenerPerfil = () => api.get("/usuarios/perfil");

export const actualizarPerfil = (datos) => api.put("/usuarios/perfil", datos);

export const cambiarContrasena = (datos) => api.put("/usuarios/contrasena", datos);
