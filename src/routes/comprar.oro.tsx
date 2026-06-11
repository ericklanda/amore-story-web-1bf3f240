import { createFileRoute } from "@tanstack/react-router";
import PurchaseForm, { type FieldDef } from "@/components/comprar/PurchaseForm";

const FIELDS: FieldDef[] = [
  { name: "hashtag", label: "Hashtag del evento", placeholder: "#SofiaYDaniel2026" },
  { name: "welcome_message", label: "Mensaje de los novios", type: "textarea" },
  { name: "youtube_song_id", label: "Canción de fondo (link de YouTube)", type: "url", placeholder: "https://youtube.com/watch?v=..." },
  { name: "story_text", label: "Nuestra historia", type: "textarea", help: "Cómo se conocieron, momentos clave, propuesta..." },
  { name: "parents", label: "Padres y padrinos", type: "textarea", help: "Nombres de los padres del novio y la novia." },
  { name: "venue_name", label: "Nombre del lugar", placeholder: "Hacienda San Miguel" },
  { name: "venue_address", label: "Dirección del lugar", type: "textarea" },
  { name: "venue_maps_url", label: "Link de Google Maps", type: "url" },
  { name: "dress_code", label: "Código de vestimenta", placeholder: "Formal, Cocktail..." },
  { name: "dress_code_note", label: "Notas del código de vestimenta", type: "textarea" },
  { name: "timeline", label: "Itinerario del evento", type: "textarea", help: "Ej: 17:00 Ceremonia · 18:00 Cocktail · 20:00 Cena..." },
  { name: "gift_registry", label: "Mesa de regalos / sobre", type: "textarea", help: "Links de Amazon, Liverpool, datos bancarios, etc." },
  { name: "whatsapp_number", label: "WhatsApp para confirmaciones", type: "tel", placeholder: "+52..." },
  { name: "gallery_note", label: "📷 Galería de fotos", type: "notice", notice: "Al enviar este formulario serás redirigido a WhatsApp para enviarnos tus fotos (hasta 10 imágenes para la galería)." },
];

export const Route = createFileRoute("/comprar/oro")({
  head: () => ({
    meta: [
      { title: "Comprar invitación · Paquete Oro · BLCK Social" },
      { name: "description", content: "Solicita tu invitación digital paquete Oro." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => (
    <PurchaseForm
      tier="oro"
      tierLabel="Oro"
      tagline="Invitación completa: historia, galería, itinerario, mesa de regalos y panel de confirmaciones."
      fields={FIELDS}
    />
  ),
});
