import { useState } from "react";

import api from "../services/api";
import { AuthContext } from "./authContextBase";

const obtenerToken = () => localStorage.getItem("token") || sessionStorage.getItem("token");
const obtenerUsuario = () => {
    const datos = localStorage.getItem("usuario") || sessionStorage.getItem("usuario");
    return datos ? JSON.parse(datos) : null;
};

export const AuthProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(obtenerUsuario);
    const [token, setToken] = useState(obtenerToken);
    const [cargando, setCargando] = useState(false);

    const guardarSesion = (datos, recordar) => {
        const storage = recordar ? localStorage : sessionStorage;
        const otroStorage = recordar ? sessionStorage : localStorage;

        storage.setItem("token", datos.token);
        storage.setItem("usuario", JSON.stringify(datos.usuario));
        otroStorage.removeItem("token");
        otroStorage.removeItem("usuario");

        setToken(datos.token);
        setUsuario(datos.usuario);
    };

    const login = async (correo, contrasena, recordar = false) => {
        setCargando(true);

        try {
            const respuesta = await api.post("/auth/login", { correo, contrasena });
            guardarSesion(respuesta.data.datos, recordar);
            return respuesta.data;
        } finally {
            setCargando(false);
        }
    };

    const registrar = async (nombre, correo, contrasena) => {
        setCargando(true);

        try {
            const respuesta = await api.post("/auth/registro", { nombre, correo, contrasena });
            guardarSesion(respuesta.data.datos, false);
            return respuesta.data;
        } finally {
            setCargando(false);
        }
    };

    const cerrarSesion = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("usuario");
        setToken(null);
        setUsuario(null);
    };

    const value = {
        usuario,
        token,
        cargando,
        isAuthenticated: Boolean(token),
        login,
        registrar,
        cerrarSesion
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
