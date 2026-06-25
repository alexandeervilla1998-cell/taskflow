package com.taskflow.dto;

import java.time.LocalDateTime;

public class UsuarioDTO {

    private Long id;
    private String nombre;
    private String correo;
    private String fotoPerfil;
    private LocalDateTime fechaRegistro;
    private String rol;

    public UsuarioDTO() {
    }

    public UsuarioDTO(Long id, String nombre, String correo, String fotoPerfil, LocalDateTime fechaRegistro,
            String rol) {
        this.id = id;
        this.nombre = nombre;
        this.correo = correo;
        this.fotoPerfil = fotoPerfil;
        this.fechaRegistro = fechaRegistro;
        this.rol = rol;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getFotoPerfil() {
        return fotoPerfil;
    }

    public void setFotoPerfil(String fotoPerfil) {
        this.fotoPerfil = fotoPerfil;
    }

    public LocalDateTime getFechaRegistro() {
        return fechaRegistro;
    }

    public void setFechaRegistro(LocalDateTime fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }
}
