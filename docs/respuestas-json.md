# Estructura de Respuestas JSON TaskFlow

## Formato general

Toda respuesta del backend sigue una misma estructura base.

### Respuesta exitosa

```json
{
  "exito": true,
  "datos": { },
  "mensaje": "Operación realizada correctamente"
}
```

### Respuesta de error

```json
{
  "exito": false,
  "datos": null,
  "mensaje": "Descripción del error",
  "errores": [
    "Detalle específico del campo o la validación"
  ]
}
```

## Ejemplos por módulo

### Login (POST /api/auth/login)

```json
{
  "exito": true,
  "datos": {
    "token": "jwt.token.aqui",
    "usuario": {
      "id": 1,
      "nombre": "Alexander Villalobos",
      "correo": "alex@correo.com"
    }
  },
  "mensaje": "Inicio de sesión exitoso"
}
```

### Listar tareas (GET /api/tareas)

```json
{
  "exito": true,
  "datos": [
    {
      "id": 10,
      "titulo": "Diseñar endpoints",
      "estado": "PENDIENTE",
      "prioridad": "ALTA",
      "fechaVencimiento": "2026-06-30T00:00:00",
      "categoria": {
        "id": 2,
        "nombre": "Backend"
      }
    }
  ],
  "mensaje": "Tareas obtenidas correctamente"
}
```

### Error de validación (POST /api/tareas)

```json
{
  "exito": false,
  "datos": null,
  "mensaje": "Error de validación",
  "errores": [
    "El título es obligatorio"
  ]
}
```

## Convenciones

1. Los campos usan camelCase.
2. Las fechas se envían en formato ISO 8601.
3. Las listas vacías se representan como `[]`, nunca como `null`.
4. El campo `errores` solo aparece cuando `exito` es `false`.
