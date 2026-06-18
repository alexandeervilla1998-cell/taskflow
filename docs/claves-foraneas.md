# Claves Foráneas de TaskFlow

## Tabla usuarios

No posee claves foráneas.

## Tabla categorias

### usuario_id

Referencia:

usuarios(id)

Tipo de relación:

Uno a muchos (1:N)

Descripción:

Cada categoría pertenece a un usuario.

## Tabla tareas

### usuario_id

Referencia:

usuarios(id)

Tipo de relación:

Uno a muchos (1:N)

Descripción:

Cada tarea pertenece a un usuario.

### categoria_id

Referencia:

categorias(id)

Tipo de relación:

Uno a muchos (1:N)

Descripción:

Cada tarea puede pertenecer a una categoría.

## Resumen

| Tabla      | Clave foránea | Referencia     |
| ---------- | ------------- | -------------- |
| categorias | usuario_id    | usuarios(id)   |
| tareas     | usuario_id    | usuarios(id)   |
| tareas     | categoria_id  | categorias(id) |

Total de claves foráneas: 3
