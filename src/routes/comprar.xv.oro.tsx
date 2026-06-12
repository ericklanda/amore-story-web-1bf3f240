import { createFileRoute } from "@tanstack/react-router";
import PurchaseForm, { type FieldDef } from "@/components/comprar/PurchaseForm";

const FIELDS: FieldDef[] = [
  { name: "quinceanera_name", label: "Nombre de la quinceañera", required: true, placeholder: "Valentina" },
  { name: "hashtag", label: "Hashtag del evento", placeholder: "#ValentinaXV2026" },
  { name: "welcome_message", label: "Mensaje de bienvenida", type: "textarea" },
  { name: "youtube_song_id", label: "Canción de fondo (link de YouTube)", type: "url", placeholder: "https://youtube.com/watch?v=..." },
  { name: "story_text", label: "Mi historia", type: "textarea", help: "Una breve reseña sobre la quinceañera: sueños, pasiones, momentos especiales..." },
  { name: "parents", label: "Padres y padrinos", type: "textarea", help: "Nombres de los padres y padrinos de la quinceañera." },
  { name: "court_of_honor", label: "Corte de honor / Chambelanes y damas", type: "textarea", help: "Nombres de chambelán principal, damas y chambelanes." },
  { name: "venue_name", label: "Nombre del lugar", placeholder: "Salón Jardín Real" },
  { name: "venue_address", label: "Dirección del lugar", type: "textarea" },
  { name: "venue_maps_url", label: "Link de Google Maps", type: "url" },
  { name: "ceremony_info", label: "Misa de acción de gracias", type: "textarea", help: "Iglesia, dirección y hora (si aplica)." },
  { name: "dress_code", label: "Código de vestimenta", placeholder: "Formal, Cocktail..." },
  { name: "dress_code_note", label: "Notas del código de vestimenta", type: "textarea" },
  { name: "timeline", label: "Itinerario del evento", type: "textarea", help: "Ej: 17:00 Misa · 19:00 Recepción · 20:00 Vals..." },
  { name: "gift_registry", label: "Mesa de regalos / sobre", type: "textarea", help: "Links de Amazon, Liverpool, datos bancarios, etc." },
  { name: "whatsapp_number", label: "WhatsApp para confirmaciones", type: "tel", placeholder: "+52..." },
  { name: "gallery_note", label: "📷 Galería de fotos", type: "notice", notice: "Al enviar este formulario serás redirigida a WhatsApp para enviarnos tus fotos (hasta 10 imágenes para la galería)." },
];

export const Route = createFileRoute("/comprar/xv/oro")({
  head: () => ({
    meta: [
      { title: "Comprar invitación XV · Paquete Oro · BLCK Social" },
      { name: "description", content: "Solicita tu invitación digital de XV años paquete Oro." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => (
    <PurchaseForm
      tier="oro"
      tierLabel="Oro · XV Años"
      tagline="Invitación completa para tus XV: historia, galería, corte de honor, itinerario y panel de confirmaciones."
      fields={FIELDS}
    />
  ),
});
