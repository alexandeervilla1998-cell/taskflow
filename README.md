# TaskFlow

Sistema de gestión de tareas personal con autenticación JWT, CRUD completo de tareas y categorías, perfil de usuario y dashboard con estadísticas en tiempo real.

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 19, Vite, Bootstrap 5, React Router v7, Axios, SweetAlert2 |
| Backend | Java 17, Spring Boot 3.5, Spring Security, JPA/Hibernate |
| Base de datos | MySQL 8 |
| Autenticación | JWT (jjwt 0.12.6), BCrypt |

## Funcionalidades

- Registro e inicio de sesión con JWT
- "Recordar sesión" (localStorage) o sesión temporal (sessionStorage)
- Dashboard con estadísticas de tareas en tiempo real
- CRUD completo de tareas con filtros por estado y categoría
- CRUD completo de categorías con selector de color
- Perfil de usuario: editar nombre y foto, cambiar contraseña
- Diseño futurista con glassmorphism, animaciones de entrada y efectos glow
- Fondo animado con universo (estrellas, nebulosas, partículas) en Login y Registro
- Avatar con live preview al escribir la URL de la foto
- Diseño responsivo (sidebar colapsable en móvil)
- Estados de carga con skeleton loaders
- Estados vacíos con mensajes amigables

---

## Correr el proyecto en local

### Requisitos previos

- Java 17+
- Node.js 20+
- MySQL 8 (XAMPP o instalación directa)

### 1. Base de datos

```sql
-- En MySQL, ejecutar el script de inicialización:
source database/taskflow.sql
```

### 2. Backend

```bash
cd backend

# Modo desarrollo (usa application-dev.properties):
./mvnw spring-boot:run

# La API queda disponible en: http://localhost:8080
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev

# La app queda disponible en: http://localhost:5173
```

---

## Variables de entorno (producción)

Copiar `.env.example` a `.env` y completar los valores:

| Variable | Descripción |
|----------|-------------|
| `DB_URL` | URL JDBC de MySQL (ej: `jdbc:mysql://host:3306/taskflow`) |
| `DB_USERNAME` | Usuario de la base de datos |
| `DB_PASSWORD` | Contraseña de la base de datos |
| `JWT_SECRET` | Clave secreta para firmar JWT (mínimo 32 caracteres) |
| `FRONTEND_URL` | URL del frontend para CORS (ej: `https://mi-app.com`) |

Para producción, activar el perfil con:
```bash
SPRING_PROFILES_ACTIVE=prod ./mvnw spring-boot:run
```

---

## Endpoints de la API

Base URL: `http://localhost:8080/api`

Todas las respuestas tienen el formato:
```json
{
  "exito": true,
  "datos": { ... },
  "mensaje": "...",
  "errores": null
}
```

### Autenticación (público)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/auth/registro` | Crear cuenta nueva |
| POST | `/auth/login` | Iniciar sesión, retorna JWT |

Cuerpo de registro:
```json
{ "nombre": "Juan", "correo": "juan@mail.com", "contrasena": "password123" }
```

Cuerpo de login:
```json
{ "correo": "juan@mail.com", "contrasena": "password123" }
```

Los endpoints protegidos requieren el header:
```
Authorization: Bearer <token>
```

### Perfil de usuario (🔒 requiere JWT)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/usuarios/perfil` | Obtener perfil del usuario autenticado |
| PUT | `/usuarios/perfil` | Actualizar nombre y foto de perfil |
| PUT | `/usuarios/contrasena` | Cambiar contraseña |

### Tareas (🔒 requiere JWT)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/tareas` | Listar tareas (filtros: `?estado=` `?categoriaId=`) |
| GET | `/tareas/estadisticas` | Conteo por estado |
| POST | `/tareas` | Crear tarea |
| PUT | `/tareas/{id}` | Actualizar tarea completa |
| PATCH | `/tareas/{id}/estado` | Cambiar solo el estado |
| DELETE | `/tareas/{id}` | Eliminar tarea |

Estados válidos: `PENDIENTE`, `EN_PROGRESO`, `FINALIZADA`  
Prioridades válidas: `BAJA`, `MEDIA`, `ALTA`

### Categorías (🔒 requiere JWT)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/categorias` | Listar categorías del usuario |
| POST | `/categorias` | Crear categoría |
| PUT | `/categorias/{id}` | Actualizar categoría |
| DELETE | `/categorias/{id}` | Eliminar categoría |

---

## Estructura del proyecto

```
TaskFlow/
├── backend/
│   └── src/main/java/com/taskflow/
│       ├── config/         # SecurityConfig, CORS
│       ├── controller/     # AuthController, TareaController, CategoriaController, UsuarioController
│       ├── dto/            # Request/Response DTOs
│       ├── entity/         # Usuario, Rol, Tarea, Categoria
│       ├── exception/      # GlobalExceptionHandler, ResourceNotFoundException
│       ├── repository/     # JPA Repositories
│       ├── security/       # JwtService, JwtAuthenticationFilter
│       └── service/        # UsuarioService, TareaService, CategoriaService
├── database/
│   ├── taskflow.sql        # Schema para desarrollo
│   └── init-prod.sql       # Schema para producción (con índices)
├── docs/                   # Documentación de análisis y diseño
├── frontend/
│   └── src/
│       ├── components/     # Navbar, Sidebar, Footer, ui/UniverseCanvas
│       ├── context/        # AuthContext, AuthProvider
│       ├── hooks/          # useAuth
│       ├── layouts/        # MainLayout, AuthLayout
│       ├── pages/          # Dashboard, Tasks, Categories, Profile, Login, Register
│       ├── routes/         # AppRouter, ProtectedRoute, PublicRoute
│       └── services/       # api.js, tareaService, categoriaService, usuarioService
└── .env.example            # Plantilla de variables de entorno
```

---

## Documentación adicional

### Análisis y diseño
- [Módulos del sistema](docs/modulos-sistema.md)
- [Reglas de negocio](docs/reglas-negocio.md)
- [Navegación del sistema](docs/navegacion-sistema.md)

### Base de datos
- [Modelo entidad relación](docs/modelo-entidad-relacion.md)
- [Tablas](docs/tablas.md)
- [Relaciones](docs/relaciones.md)

### API
- [Endpoints REST](docs/endpoints-rest.md)
- [Respuestas JSON](docs/respuestas-json.md)
- [Códigos HTTP](docs/codigos-http.md)

---

## Estado del proyecto

- ✅ Sprint 1: Configuración del proyecto
- ✅ Sprint 2: Análisis y diseño
- ✅ Sprint 3: Backend base con Spring Boot
- ✅ Sprint 4: Autenticación JWT (registro, login, rutas protegidas)
- ✅ Sprint 5: CRUD de tareas y categorías
- ✅ Sprint 6: Dashboard con estadísticas y página de categorías
- ✅ Sprint 7: Perfil de usuario (editar datos, cambiar contraseña)
- ✅ Sprint 8: Mejoras de UX (responsivo, spinners, estados vacíos, badges)
- ✅ Sprint 9: Configuración para producción (CORS, perfil prod, script SQL)
- ✅ Sprint 10: Documentación final
- ✅ Sprint 11: Rediseño UI futurista (glassmorphism, animaciones, fondo universo, dark theme)
- ✅ Sprint 12: Refactor de código (estilos en `const s = {}`, CSS organizado por secciones, comentarios en español)
