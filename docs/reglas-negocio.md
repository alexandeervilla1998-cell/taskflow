# Reglas de negocio TaskFlow

## Usuarios

1. Cada usuario debe registrarse con un correo electrónico único.

2. La contraseña debe tener un mínimo de 8 caracteres.

3. Un usuario debe iniciar sesión para acceder al sistema.

4. Un usuario solo puede editar su propio perfil.

## Autenticación

1. El acceso al sistema se realizará mediante JWT.

2. Las rutas protegidas requerirán un token válido.

3. Un usuario autenticado no podrá acceder a las páginas de inicio de sesión o registro.

## Tareas

1. Cada tarea pertenece a un único usuario.

2. El título de la tarea es obligatorio.

3. La descripción es opcional.

4. Toda tarea debe tener un estado.

5. Toda tarea puede tener una categoría.

6. Un usuario solo puede ver, editar o eliminar sus propias tareas.

## Categorías

1. Una categoría puede estar asociada a varias tareas.

2. Una categoría no podrá eliminarse si tiene tareas asociadas.

3. El nombre de la categoría debe ser único para cada usuario.

## Dashboard

1. El dashboard mostrará únicamente información del usuario autenticado.

2. Las estadísticas se actualizarán según las tareas registradas.

## Seguridad

1. Las contraseñas se almacenarán en forma encriptada.

2. Ninguna operación protegida podrá ejecutarse sin autenticación.

3. Todas las solicitudes al backend deberán validar el token JWT.

## Base de datos

1. Cada tabla tendrá una clave primaria.

2. Las relaciones utilizarán claves foráneas.

3. No se permitirán registros huérfanos entre las entidades relacionadas.
