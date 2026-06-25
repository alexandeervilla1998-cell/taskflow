CREATE DATABASE IF NOT EXISTS taskflow;

USE taskflow;

CREATE TABLE roles (

    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    nombre VARCHAR(50) NOT NULL UNIQUE

);

INSERT INTO roles (nombre) VALUES ('ADMIN'), ('USER');


CREATE TABLE usuarios (


    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    nombre VARCHAR(100) NOT NULL,

    correo VARCHAR(150) NOT NULL UNIQUE,

    contrasena VARCHAR(255) NOT NULL,

    foto_perfil VARCHAR(255),

    fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    rol_id BIGINT NOT NULL,

    FOREIGN KEY (rol_id)
        REFERENCES roles(id)

);


CREATE TABLE categorias (

    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    nombre VARCHAR(100) NOT NULL,

    color VARCHAR(20),

    usuario_id BIGINT NOT NULL,

    FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)

);


CREATE TABLE tareas (

    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    titulo VARCHAR(150) NOT NULL,

    descripcion TEXT,

    estado VARCHAR(50) NOT NULL,

    prioridad VARCHAR(50) NOT NULL,

    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    fecha_vencimiento DATETIME,

    usuario_id BIGINT NOT NULL,

    categoria_id BIGINT,

    FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id),

    FOREIGN KEY (categoria_id)
        REFERENCES categorias(id)

);