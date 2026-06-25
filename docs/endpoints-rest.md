# Endpoints REST TaskFlow

## Autenticación

| Método | Endpoint             | Descripción                  | Protegido |
| ------ | -------------------- | ----------------------------- | --------- |
| POST   | /api/auth/registro    | Registrar un nuevo usuario     | No        |
| POST   | /api/auth/login       | Iniciar sesión                 | No        |
| POST   | /api/auth/logout      | Cerrar sesión                  | Sí        |

## Usuarios

| Método | Endpoint           | Descripción                      | Protegido |
| ------ | ------------------- | ---------------------------------- | --------- |
| GET    | /api/usuarios/perfil | Obtener perfil del usuario actual   | Sí        |
| PUT    | /api/usuarios/perfil | Editar información personal         | Sí        |
| PUT    | /api/usuarios/correo | Actualizar correo electrónico       | Sí        |
| PUT    | /api/usuarios/password | Cambiar contraseña               | Sí        |
| PUT    | /api/usuarios/foto    | Cambiar foto de perfil           | Sí        |

## Tareas

| Método | Endpoint           | Descripción                | Protegido |
| ------ | ------------------- | ----------------------------- | --------- |
| GET    | /api/tareas          | Listar tareas del usuario      | Sí        |
| GET    | /api/tareas/{id}     | Consultar una tarea            | Sí        |
| POST   | /api/tareas          | Crear tarea                    | Sí        |
| PUT    | /api/tareas/{id}     | Editar tarea                   | Sí        |
| DELETE | /api/tareas/{id}     | Eliminar tarea                 | Sí        |
| PATCH  | /api/tareas/{id}/estado | Cambiar estado de la tarea  | Sí        |

Parámetros de consulta soportados en `GET /api/tareas`: `estado`, `categoriaId`, `busqueda`, `ordenarPor`.

## Categorías

| Método | Endpoint              | Descripción              | Protegido |
| ------ | ---------------------- | --------------------------- | --------- |
| GET    | /api/categorias         | Listar categorías del usuario | Sí        |
| POST   | /api/categorias         | Crear categoría             | Sí        |
| PUT    | /api/categorias/{id}    | Editar categoría            | Sí        |
| DELETE | /api/categorias/{id}    | Eliminar categoría          | Sí        |

## Dashboard

| Método | Endpoint              | Descripción                  | Protegido |
| ------ | ---------------------- | ------------------------------ | --------- |
| GET    | /api/dashboard/resumen   | Resumen y estadísticas generales | Sí        |
| GET    | /api/dashboard/recientes | Tareas recientes del usuario    | Sí        |

## Administración

| Método | Endpoint           | Descripción              | Protegido |
| ------ | ------------------- | --------------------------- | --------- |
| GET    | /api/admin/usuarios   | Listar usuarios del sistema  | Sí (Admin) |
| PUT    | /api/admin/usuarios/{id}/rol | Cambiar rol de un usuario | Sí (Admin) |
