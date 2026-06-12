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
  { name: "welcome_message", label: "Mensaje de bienvenida", type: "textarea", help: "Texto que verán tus invitados al abrir la invitación." },
  { name: "venue_maps_url", label: "Ubicación (link de Google Maps)", type: "url", placeholder: "https://maps.google.com/..." },
  { name: "dress_code", label: "Código de vestimenta", placeholder: "Formal, Cocktail, Etiqueta rigurosa..." },
  { name: "whatsapp_number", label: "WhatsApp para confirmaciones", type: "tel", placeholder: "+52...", help: "Tus invitados confirmarán directo por WhatsApp." },
  { name: "hero_image_note", label: "📷 Foto principal", type: "notice", notice: "Al enviar este formulario serás redirigida a WhatsApp. Ahí te pediremos la foto que usaremos como imagen principal de tu invitación." },
];

export const Route = createFileRoute("/comprar/xv/plata")({
  head: () => ({
    meta: [
      { title: "Comprar invitación XV · Paquete Plata · BLCK Social" },
      { name: "description", content: "Solicita tu invitación digital de XV años paquete Plata." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => (
    <PurchaseForm
      tier="plata"
      tierLabel="Plata · XV Años"
      tagline="Invitación esencial para tus XV: una foto, ubicación, cuenta regresiva y confirmaciones por WhatsApp."
      fields={FIELDS}
      baseFields={BASE_FIELDS}
    />
  ),
});
