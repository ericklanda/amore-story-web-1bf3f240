import { createFileRoute } from "@tanstack/react-router";
import PurchaseForm, { type FieldDef } from "@/components/comprar/PurchaseForm";

const BASE_FIELDS: FieldDef[] = [
  { name: "contact_name", label: "Tu nombre completo", required: true },
  { name: "contact_email", label: "Correo electrónico", type: "email", required: true },
  { name: "contact_phone", label: "WhatsApp de contacto", type: "tel", required: true, placeholder: "+52..." },
  { name: "couple_names", label: "Nombre Mamá/Papá", required: true, placeholder: "María & Carlos" },
  { name: "event_date", label: "Fecha del evento", type: "date", required: true },
];

const FIELDS: FieldDef[] = [
  { name: "quinceanera_name", label: "Nombre de la quinceañera", required: true, placeholder: "Valentina" },
  { name: "welcome_message", label: "Mensaje de bienvenida", type: "textarea" },
  { name: "youtube_song_id", label: "Canción de fondo (link de YouTube)", type: "url" },
  { name: "story_text", label: "Mi historia", type: "textarea" },
  { name: "story_milestones", label: "Momentos clave (línea de tiempo)", type: "textarea", help: "Ej: 2010 Primer día de escuela · 2020 Mi pasión por la danza..." },
  { name: "parents", label: "Padres y padrinos", type: "textarea" },
  { name: "court_of_honor", label: "Corte de honor / Chambelanes y damas *opcional", type: "textarea", help: "Chambelán principal, damas, chambelanes y roles especiales." },
  { name: "venue_name", label: "Nombre del lugar" },
  { name: "venue_address", label: "Dirección del lugar", type: "textarea" },
  { name: "venue_maps_url", label: "Link de Google Maps", type: "url" },
  { name: "ceremony_info", label: "Misa de acción de gracias", type: "textarea", help: "Iglesia, dirección y hora (si aplica)." },
  { name: "dress_code", label: "Código de vestimenta" },
  { name: "dress_code_note", label: "Notas del código de vestimenta", type: "textarea" },
  { name: "timeline", label: "Itinerario completo", type: "textarea", help: "Misa, recepción, vals, baile sorpresa, brindis, pastel..." },
  { name: "gift_registry", label: "Mesa de regalos / sobre", type: "textarea" },
  { name: "hashtag", label: "Hashtag del evento *opcional", placeholder: "#ValentinaXV2026" },
  { name: "transportation_note", label: "Transporte y hospedaje", type: "textarea", help: "Hoteles recomendados, transporte para invitados, valet parking..." },
  { name: "faq", label: "Preguntas frecuentes", type: "textarea", help: "Una pregunta y respuesta por línea." },
  { name: "thank_you_message", label: "Mensaje de agradecimiento final", type: "textarea" },
  { name: "whatsapp_number", label: "WhatsApp para confirmaciones", type: "tel", placeholder: "+52..." },
  { name: "gallery_note", label: "📷 Galería de fotos", type: "notice", notice: "Al enviar este formulario serás redirigida a WhatsApp para compartirnos todas tus fotos (galería ilimitada y foto principal en alta resolución)." },
  { name: "custom_requests", label: "Personalizaciones adicionales", type: "textarea", help: "Cualquier detalle especial: tipografía, paleta de colores, animaciones, etc." },
];

export const Route = createFileRoute("/comprar/xv/diamante")({
  head: () => ({
    meta: [
      { title: "Comprar invitación XV · Paquete Diamante · BLCK Social" },
      { name: "description", content: "Solicita tu invitación digital de XV años paquete Diamante." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => (
    <PurchaseForm
      tier="diamante"
      tierLabel="Diamante · XV Años"
      tagline="Experiencia premium para tus XV: todo Oro + historia extendida, transporte, FAQ y personalizaciones a medida."
      fields={FIELDS}
      baseFields={BASE_FIELDS}
    />
  ),
});
