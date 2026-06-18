# Modelo Entidad Relación

## Entidad Usuario

Atributos

- id
- nombre
- correo
- contraseña
- fotoPerfil
- fechaRegistro

## Entidad Categoría

Atributos

- id
- nombre
- color

## Entidad Tarea

Atributos

- id
- titulo
- descripcion
- estado
- prioridad
- fechaCreacion
- fechaVencimiento

## Relaciones

### Usuario 1:N Tarea

Un usuario puede tener muchas tareas.

Cada tarea pertenece a un único usuario.

### Usuario 1:N Categoría

Un usuario puede crear muchas categorías.

Cada categoría pertenece a un único usuario.

### Categoría 1:N Tarea

Una categoría puede contener muchas tareas.

Cada tarea pertenece a una categoría.

## Diagrama lógico

Usuario
│
├─────< Categoría
│
└─────< Tarea
              │
              └──────── pertenece a Categoría