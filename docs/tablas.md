# Definición de Tablas TaskFlow

## Tabla: usuarios

Descripción

Almacena la información de los usuarios registrados.

| Campo          | Tipo         |
| -------------- | ------------ |
| id             | BIGINT       |
| nombre         | VARCHAR(100) |
| correo         | VARCHAR(150) |
| contraseña     | VARCHAR(255) |
| foto_perfil    | VARCHAR(255) |
| fecha_registro | DATETIME     |

## Tabla: categorias

Descripción

Almacena las categorías creadas por cada usuario.

| Campo      | Tipo         |
| ---------- | ------------ |
| id         | BIGINT       |
| nombre     | VARCHAR(100) |
| color      | VARCHAR(20)  |
| usuario_id | BIGINT       |

## Tabla: tareas

Descripción

Almacena las tareas del sistema.

| Campo             | Tipo         |
| ----------------- | ------------ |
| id                | BIGINT       |
| titulo            | VARCHAR(150) |
| descripcion       | TEXT         |
| estado            | VARCHAR(50)  |
| prioridad         | VARCHAR(50)  |
| fecha_creacion    | DATETIME     |
| fecha_vencimiento | DATETIME     |
| usuario_id        | BIGINT       |
| categoria_id      | BIGINT       |

## Resumen

Base de datos: taskflow

Número de tablas: 3

Número de relaciones: 3
