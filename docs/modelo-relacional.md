# Modelo Relacional TaskFlow

## Tabla usuarios

| Campo          | Tipo         | Restricción       |
| -------------- | ------------ | ----------------- |
| id             | BIGINT       | PK AUTO_INCREMENT |
| nombre         | VARCHAR(100) | NOT NULL          |
| correo         | VARCHAR(150) | UNIQUE NOT NULL   |
| contraseña     | VARCHAR(255) | NOT NULL          |
| foto_perfil    | VARCHAR(255) | NULL              |
| fecha_registro | DATETIME     | NOT NULL          |

## Tabla categorias

| Campo      | Tipo         | Restricción       |
| ---------- | ------------ | ----------------- |
| id         | BIGINT       | PK AUTO_INCREMENT |
| nombre     | VARCHAR(100) | NOT NULL          |
| color      | VARCHAR(20)  | NOT NULL          |
| usuario_id | BIGINT       | FK NOT NULL       |

## Tabla tareas

| Campo             | Tipo         | Restricción       |
| ----------------- | ------------ | ----------------- |
| id                | BIGINT       | PK AUTO_INCREMENT |
| titulo            | VARCHAR(150) | NOT NULL          |
| descripcion       | TEXT         | NULL              |
| estado            | VARCHAR(50)  | NOT NULL          |
| prioridad         | VARCHAR(50)  | NOT NULL          |
| fecha_creacion    | DATETIME     | NOT NULL          |
| fecha_vencimiento | DATETIME     | NULL              |
| usuario_id        | BIGINT       | FK NOT NULL       |
| categoria_id      | BIGINT       | FK NULL           |

## Relaciones

usuarios.id → categorias.usuario_id

usuarios.id → tareas.usuario_id

categorias.id → tareas.categoria_id
