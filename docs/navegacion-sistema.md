# Navegación del sistema TaskFlow

## Rutas públicas

### Inicio de sesión

URL: /login

Función:

* Permitir el acceso al sistema.

### Registro

URL: /register

Función:

* Crear una nueva cuenta.

## Rutas protegidas

### Dashboard

URL: /

Función:

* Mostrar resumen de tareas.
* Mostrar estadísticas.
* Mostrar accesos rápidos.

### Tareas

URL: /tasks

Función:

* Listar tareas.
* Buscar tareas.
* Filtrar tareas.

### Nueva tarea

URL: /tasks/create

Función:

* Registrar una nueva tarea.

### Editar tarea

URL: /tasks/edit/:id

Función:

* Modificar una tarea existente.

### Categorías

URL: /categories

Función:

* Administrar categorías.

### Perfil

URL: /profile

Función:

* Consultar información del usuario.
* Actualizar datos personales.

### Administración

URL: /admin

Función:

* Gestionar usuarios.
* Gestionar roles.

## Flujo de navegación

Login
↓
Dashboard
├── Tareas
│   ├── Nueva tarea
│   └── Editar tarea
├── Categorías
├── Perfil
└── Administración

## Layout

Todas las rutas protegidas compartirán:

* Navbar superior
* Sidebar lateral
* Área principal de contenido
* Footer
