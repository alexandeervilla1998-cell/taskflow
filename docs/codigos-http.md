# Códigos HTTP TaskFlow

## Códigos de éxito

| Código | Nombre     | Uso                                              |
| ------ | ---------- | ------------------------------------------------- |
| 200    | OK         | Consulta o actualización exitosa                  |
| 201    | Created    | Creación de un recurso (usuario, tarea, categoría) |
| 204    | No Content | Eliminación exitosa, sin contenido en la respuesta |

## Códigos de error del cliente

| Código | Nombre        | Uso                                                  |
| ------ | ------------- | ------------------------------------------------------ |
| 400    | Bad Request    | Datos inválidos o error de validación                  |
| 401    | Unauthorized   | Token ausente, inválido o expirado                      |
| 403    | Forbidden      | Usuario autenticado sin permisos sobre el recurso        |
| 404    | Not Found      | Recurso no encontrado (tarea, categoría, usuario)        |
| 409    | Conflict       | Conflicto de datos (correo o nombre de categoría duplicado) |

## Códigos de error del servidor

| Código | Nombre                | Uso                                  |
| ------ | ---------------------- | --------------------------------------- |
| 500    | Internal Server Error   | Error inesperado en el backend          |

## Relación con reglas de negocio

* 401 se usa cuando el JWT no es válido, según [reglas-negocio.md](reglas-negocio.md).
* 403 se usa cuando un usuario intenta acceder a tareas o categorías que no le pertenecen.
* 409 se usa para correo duplicado en registro o nombre de categoría duplicado por usuario.
* 400 se usa para validaciones como título obligatorio en tareas o contraseña con menos de 8 caracteres.
