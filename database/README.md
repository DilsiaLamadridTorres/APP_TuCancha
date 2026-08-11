# Base de datos de TuCancha

La opción recomendada para esta primera etapa es **Supabase**: entrega PostgreSQL administrado y autenticación, de modo que el navegador nunca guarda contraseñas en la tabla `usuarios`.

## Alternativas gratuitas evaluadas

| Servicio | Motor | Cuándo elegirlo |
| --- | --- | --- |
| Supabase | PostgreSQL | Recomendado: base relacional, autenticación y API en el mismo servicio. El plan gratuito incluye 500 MB y hasta 50.000 usuarios activos mensuales. |
| Neon | PostgreSQL | Buena opción si habrá un backend propio en Spring Boot y solo se necesita la base de datos. El plan gratuito incluye 0,5 GB por proyecto. |
| Firebase | Firestore (NoSQL) | Útil si se prefiere un modelo documental y autenticación de Firebase; no es la opción más natural para las relaciones de reservas, canchas y pagos. |

Fuentes: [Supabase Pricing](https://supabase.com/pricing), [Neon Pricing](https://neon.com/pricing), [Firebase pricing plans](https://firebase.google.com/docs/projects/billing/firebase-pricing-plans).

## Configuración de Supabase

1. Crea un proyecto gratuito en Supabase.
2. En **SQL Editor**, ejecuta [`001_usuarios.sql`](001_usuarios.sql).
3. En **Authentication → Providers → Email**, deja habilitado el acceso por correo. Para pruebas rápidas puedes desactivar temporalmente *Confirm email*; en producción debe permanecer activo.
4. En **Project Settings → API**, copia el *Project URL* y la **anon public key**.
5. Edita [`../JS/services/config.js`](../JS/services/config.js): cambia `provider` a `"supabase"` y agrega esos dos valores. Nunca uses ni publiques la clave `service_role`.
6. Abre `html/registro.html`. La banda superior del formulario debe indicar “Conexión exitosa con Supabase”. Luego crea una cuenta y verifica la fila en **Table Editor → usuarios**.

## Capa intercambiable

La página no depende de consultas SQL directas. [`../JS/services/api.js`](../JS/services/api.js) expone `authService.register`, `authService.login` y `authService.checkConnection`.

- `DemoAuthProvider`: permite demostrar el formulario sin servidor; guarda datos mediante hash en el navegador únicamente para desarrollo.
- `SupabaseAuthProvider`: usa Supabase Auth y el trigger de SQL crea el perfil en `usuarios`.

Si más adelante se construye el backend en Spring Boot, se puede añadir otro proveedor con los mismos tres métodos, sin modificar los formularios.
