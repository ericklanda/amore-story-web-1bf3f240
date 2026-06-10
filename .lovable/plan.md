# Plantilla dinámica de invitaciones

Objetivo: convertir el diseño de `luis-leo` en una plantilla reutilizable, que se renderiza en `invitaciones.blcksocial.com/{slug}` leyendo los datos de la BD. El admin (y el dueño) pueden llenar/editar todos los campos desde un formulario con el mismo estilo que `/auth`.

## 1. Base de datos

Ampliar la tabla `invitations` con todos los campos editables:

- **Cabecera**: `groom_name`, `bride_name`, `event_datetime` (timestamptz, reemplaza `event_date`), `city`, `hashtag`
- **Multimedia**: `hero_image_url`, `story_image_url`, `youtube_song_id`
- **Historia**: `story_milestones` (jsonb) — array de `{date, title, text}`
- **Padres**: `parents` (jsonb) — array de `{title, names: string[]}`
- **Galería**: `gallery` (jsonb) — array de `{url, caption}`
- **Evento**: `venue_name`, `venue_address`, `venue_maps_url`, `dress_code`, `dress_code_note`
- **Itinerario**: `timeline` (jsonb) — array de `{time, title, description}`
- **Mesa de regalos**: `gift_registry` (jsonb) — array de `{store, url}`
- **Transporte**: `transportation_note`
- **WhatsApp confirmación**: `whatsapp_number`
- **FAQ**: `faq` (jsonb) — array de `{question, answer}`
- **Estado**: `published` (boolean, default false)

Crear bucket público `invitation-photos` para subir fotos (hero, historia, galería).

Política nueva: lectura **pública** (anon) de invitaciones donde `published = true`, para que la URL pública funcione sin login.

## 2. Server functions nuevas (`src/lib/invitation.functions.ts`)

- `getPublicInvitation({ slug })` — sin auth, sólo retorna si `published = true`
- `getInvitationForEdit({ slug })` — auth: admin o dueño
- `updateInvitation({ slug, patch })` — auth: admin o dueño, valida con Zod
- `uploadInvitationPhoto({ slug, file })` — sube al bucket y devuelve URL pública

## 3. Ruta dinámica `src/routes/$slug.tsx`

- Carga `getPublicInvitation` en el loader (con `errorComponent` y `notFoundComponent`)
- Renderiza el mismo layout de `luis-leo` (Hero, OurStory, Parents, Gallery, EventDetails, DressCode, Timeline, RSVP, GiftRegistry, Transportation, SocialWall, Faq, ThankYou) pero leyendo datos del loader
- Mantiene música de YouTube, countdown, splash, modo oscuro, controles flotantes
- Si una sección no tiene datos (ej. timeline vacío), se oculta

`luis-leo.tsx` se mantiene como está (cliente actual) para no romper su URL.

## 4. Editor en `/admin`

Botón **"Editar invitación"** junto al selector, abre un panel con el mismo estilo del `/auth` (fondo `#F7F3EE`, tarjeta blanca con bordes `#E5DED3`, tipografía serif, dorado `#D4AF37`):

- Pestañas o secciones colapsables: General · Historia · Padres · Galería · Evento · Itinerario · Regalos · FAQ
- Inputs simples para texto, `<input type="datetime-local">` para fecha, sube-fotos para hero/galería
- Botón "Publicar" para activar `published`
- Botón "Ver invitación" que abre `/{slug}` en nueva pestaña

## 5. Detalles técnicos

- Server fn `getPublicInvitation` retorna DTO plano (todos los jsonb tipados)
- Loader del slug usa TanStack Query (`ensureQueryData` + `useSuspenseQuery`)
- `notFoundComponent` para slugs inexistentes / no publicados
- El `luis-leo` actual se queda intacto como fallback. Más adelante se puede migrar sus datos a la BD y borrar el archivo.

## Resultado

- `invitaciones.blcksocial.com/ana-pedro` muestra una boda real, con datos de la BD, con el mismo diseño elegante.
- El admin crea la invitación (ya funciona) y después llena el contenido en el editor.
- El dueño (cuando se registra con su email) puede editar su propia invitación.

¿Apruebas? Si sí, empiezo con la migración de BD.
