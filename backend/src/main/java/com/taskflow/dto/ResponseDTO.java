package com.taskflow.dto;

import java.util.List;

public class ResponseDTO<T> {

    private boolean exito;
    private T datos;
    private String mensaje;
    private List<String> errores;

    public ResponseDTO() {
    }

    public ResponseDTO(boolean exito, T datos, String mensaje, List<String> errores) {
        this.exito = exito;
        this.datos = datos;
        this.mensaje = mensaje;
        this.errores = errores;
    }

    public static <T> ResponseDTO<T> exito(T datos, String mensaje) {
        return new ResponseDTO<>(true, datos, mensaje, null);
    }

    public static <T> ResponseDTO<T> error(String mensaje) {
        return new ResponseDTO<>(false, null, mensaje, null);
    }

    public static <T> ResponseDTO<T> error(String mensaje, List<String> errores) {
        return new ResponseDTO<>(false, null, mensaje, errores);
    }

    public boolean isExito() {
        return exito;
    }

    public void setExito(boolean exito) {
        this.exito = exito;
    }

    public T getDatos() {
        return datos;
    }

    public void setDatos(T datos) {
        this.datos = datos;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }

    public List<String> getErrores() {
        return errores;
    }

    public void setErrores(List<String> errores) {
        this.errores = errores;
    }
}
