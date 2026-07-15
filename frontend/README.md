# TaskFlow — Frontend

Interfaz web de TaskFlow construida con React 19 y Vite. Diseño futurista con glassmorphism, animaciones de entrada y fondo animado de universo en las páginas de autenticación.

## Stack

| | Tecnología |
|---|---|
| Framework | React 19 + Vite |
| Estilos | Bootstrap 5 + CSS custom (variables, glassmorphism, animaciones) |
| Routing | React Router v7 |
| HTTP | Axios |
| Alertas | SweetAlert2 |
| Iconos | Bootstrap Icons |

## Correr en local

```bash
npm install
npm run dev
```

La app queda en `http://localhost:5173`. Requiere el backend corriendo en `http://localhost:8080`.

## Estructura

```
src/
├── components/
│   ├── layout/       # Navbar, Sidebar, Footer
│   └── ui/           # UniverseCanvas (fondo animado compartido)
├── context/          # AuthContext, AuthProvider
├── hooks/            # useAuth
├── layouts/          # MainLayout, AuthLayout
├── pages/
│   ├── auth/         # Login, Register
│   ├── dashboard/    # Dashboard con estadísticas
│   ├── tasks/        # CRUD de tareas
│   ├── categories/   # CRUD de categorías
│   └── profile/      # Perfil de usuario
├── routes/           # AppRouter, ProtectedRoute, PublicRoute
├── services/         # api.js, tareaService, categoriaService, usuarioService
└── styles/           # global.css
```

## Convenciones de código

- Estilos en `const s = {}` al final de cada componente
- Comentarios cortos en español, solo cuando el motivo no es obvio
- CSS organizado en secciones: Variables → Layout → Componentes → Decorativo → Animaciones
