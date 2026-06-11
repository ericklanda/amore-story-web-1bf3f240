import { createFileRoute } from "@tanstack/react-router";
import PurchaseForm, { type FieldDef } from "@/components/comprar/PurchaseForm";

const FIELDS: FieldDef[] = [
  { name: "hashtag", label: "Hashtag del evento", placeholder: "#SofiaYDaniel2026" },
  { name: "welcome_message", label: "Mensaje de los novios", type: "textarea" },
  { name: "youtube_song_id", label: "Canción de fondo (link de YouTube)", type: "url" },
  { name: "story_text", label: "Nuestra historia", type: "textarea" },
  { name: "story_milestones", label: "Momentos clave (línea de tiempo)", type: "textarea", help: "Ej: 2018 Nos conocimos · 2022 Compromiso..." },
  { name: "parents", label: "Padres y padrinos", type: "textarea" },
  { name: "venue_name", label: "Nombre del lugar" },
  { name: "venue_address", label: "Dirección del lugar", type: "textarea" },
  { name: "venue_maps_url", label: "Link de Google Maps", type: "url" },
  { name: "dress_code", label: "Código de vestimenta" },
  { name: "dress_code_note", label: "Notas del código de vestimenta", type: "textarea" },
  { name: "timeline", label: "Itinerario completo", type: "textarea" },
  { name: "gift_registry", label: "Mesa de regalos / sobre", type: "textarea" },
  { name: "transportation_note", label: "Transporte y hospedaje", type: "textarea", help: "Hoteles recomendados, transporte para invitados, valet parking..." },
  { name: "faq", label: "Preguntas frecuentes", type: "textarea", help: "Una pregunta y respuesta por línea." },
  { name: "thank_you_message", label: "Mensaje de agradecimiento final", type: "textarea" },
  { name: "whatsapp_number", label: "WhatsApp para confirmaciones", type: "tel", placeholder: "+52..." },
  { name: "gallery_note", label: "Galería de fotos", type: "textarea", help: "Indícanos cuántas fotos quieres incluir (te las pediremos por WhatsApp)." },
  { name: "custom_requests", label: "Personalizaciones adicionales", type: "textarea", help: "Cualquier detalle especial: tipografía, paleta de colores, animaciones, etc." },
];

export const Route = createFileRoute("/comprar/diamante")({
  head: () => ({
    meta: [
      { title: "Comprar invitación · Paquete Diamante · BLCK Social" },
      { name: "description", content: "Solicita tu invitación digital paquete Diamante." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => (
    <PurchaseForm
      tier="diamante"
      tierLabel="Diamante"
      tagline="Experiencia premium: todo Oro + historia extendida, transporte, FAQ y personalizaciones a medida."
      fields={FIELDS}
    />
  ),
});
