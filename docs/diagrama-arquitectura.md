# Diagrama de Arquitectura TaskFlow

## Arquitectura general

```
┌─────────────────────┐       HTTP / JSON       ┌──────────────────────────┐
│       Frontend       │ ───────────────────────▶ │         Backend           │
│  React + Router       │ ◀─────────────────────── │ Spring Boot + Security    │
│  Axios + Bootstrap    │       JWT en headers      │ + JWT + Spring Data JPA   │
└─────────────────────┘                           └─────────────┬────────────┘
                                                                  │ JDBC
                                                                  ▼
                                                        ┌───────────────────┐
                                                        │      MySQL          │
                                                        │   Base: taskflow     │
                                                        └───────────────────┘
```

## Capas del backend

```
Controller   → Recibe peticiones HTTP, valida entrada, devuelve JSON
Service      → Contiene la lógica de negocio
Repository   → Acceso a datos mediante Spring Data JPA
Entity       → Mapeo de tablas (Usuario, Tarea, Categoria)
```

## Flujo de una petición autenticada

```
1. Cliente envía petición con header Authorization: Bearer <token>
2. Filtro JWT valida el token
3. Controller recibe la petición ya autenticada
4. Service aplica las reglas de negocio
5. Repository consulta o modifica MySQL
6. Controller responde en formato JSON estándar
```

## Despliegue

```
Frontend  → Azure App Service (estático / Node)
Backend   → Azure App Service (Spring Boot)
Base de datos → Azure Database for MySQL
```

Referencia de módulos: [modulos-sistema.md](modulos-sistema.md). Referencia de tablas: [tablas.md](tablas.md).
