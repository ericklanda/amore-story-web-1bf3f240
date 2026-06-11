import { createFileRoute } from "@tanstack/react-router";
import PurchaseForm, { type FieldDef } from "@/components/comprar/PurchaseForm";

const FIELDS: FieldDef[] = [
  { name: "welcome_message", label: "Mensaje de los novios", type: "textarea", help: "Texto de bienvenida que verán tus invitados." },
  { name: "venue_maps_url", label: "Ubicación (link de Google Maps)", type: "url", placeholder: "https://maps.google.com/..." },
  { name: "dress_code", label: "Código de vestimenta", placeholder: "Formal, Cocktail, Casual elegante..." },
  { name: "whatsapp_number", label: "WhatsApp para confirmaciones", type: "tel", placeholder: "+52...", help: "Tus invitados confirmarán directo por WhatsApp." },
  { name: "hero_image_note", label: "Foto principal", type: "textarea", help: "Después de enviar este formulario te pediremos la foto por WhatsApp." },
];

export const Route = createFileRoute("/comprar/plata")({
  head: () => ({
    meta: [
      { title: "Comprar invitación · Paquete Plata · BLCK Social" },
      { name: "description", content: "Solicita tu invitación digital paquete Plata." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => (
    <PurchaseForm
      tier="plata"
      tierLabel="Plata"
      tagline="Invitación esencial: una foto, ubicación, cuenta regresiva y confirmaciones por WhatsApp."
      fields={FIELDS}
    />
  ),
});
