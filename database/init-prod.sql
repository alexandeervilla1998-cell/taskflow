-- Script de inicializacion para produccion
-- Ejecutar como usuario con privilegios de administrador

CREATE DATABASE IF NOT EXISTS taskflow
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE taskflow;

-- ===================== TABLAS =====================

CREATE TABLE IF NOT EXISTS roles (
    id     BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS usuarios (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre         VARCHAR(100) NOT NULL,
    correo         VARCHAR(150) NOT NULL UNIQUE,
    contrasena     VARCHAR(255) NOT NULL,
    foto_perfil    VARCHAR(255),
    fecha_registro DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    rol_id         BIGINT      NOT NULL,
    CONSTRAINT fk_usuario_rol FOREIGN KEY (rol_id) REFERENCES roles (id)
);

CREATE TABLE IF NOT EXISTS categorias (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre     VARCHAR(100) NOT NULL,
    color      VARCHAR(20),
    usuario_id BIGINT       NOT NULL,
    CONSTRAINT fk_categoria_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tareas (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    titulo           VARCHAR(150) NOT NULL,
    descripcion      TEXT,
    estado           VARCHAR(50)  NOT NULL,
    prioridad        VARCHAR(50)  NOT NULL,
    fecha_creacion   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_vencimiento DATETIME,
    usuario_id       BIGINT       NOT NULL,
    categoria_id     BIGINT,
    CONSTRAINT fk_tarea_usuario   FOREIGN KEY (usuario_id)   REFERENCES usuarios (id) ON DELETE CASCADE,
    CONSTRAINT fk_tarea_categoria FOREIGN KEY (categoria_id) REFERENCES categorias (id) ON DELETE SET NULL
);

-- ===================== INDICES =====================

CREATE INDEX IF NOT EXISTS idx_tareas_usuario_estado
    ON tareas (usuario_id, estado);

CREATE INDEX IF NOT EXISTS idx_tareas_usuario_categoria
    ON tareas (usuario_id, categoria_id);

CREATE INDEX IF NOT EXISTS idx_categorias_usuario
    ON categorias (usuario_id);

-- ===================== DATOS INICIALES =====================

INSERT IGNORE INTO roles (nombre) VALUES ('ADMIN'), ('USER');
