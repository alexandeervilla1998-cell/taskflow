# Relaciones de la Base de Datos TaskFlow

## Usuarios - Tareas

Tipo de relación:

Uno a muchos (1:N)

Descripción:

Un usuario puede crear muchas tareas.

Cada tarea pertenece a un único usuario.

Campo relacionado:

* tareas.usuario_id → usuarios.id

## Usuarios - Categorías

Tipo de relación:

Uno a muchos (1:N)

Descripción:

Un usuario puede crear muchas categorías.

Cada categoría pertenece a un único usuario.

Campo relacionado:

* categorias.usuario_id → usuarios.id

## Categorías - Tareas

Tipo de relación:

Uno a muchos (1:N)

Descripción:

Una categoría puede agrupar muchas tareas.

Cada tarea puede pertenecer a una categoría.

Campo relacionado:

* tareas.categoria_id → categorias.id

## Resumen

Relaciones totales: 3

Todas las relaciones mantienen la integridad referencial mediante claves foráneas.
