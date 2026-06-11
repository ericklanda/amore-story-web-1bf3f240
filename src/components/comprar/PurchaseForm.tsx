import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { submitInvitationRequest } from "@/lib/invitation-requests.functions";

export type FieldDef = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "url" | "date" | "tel" | "email";
  placeholder?: string;
  required?: boolean;
  help?: string;
};

type Props = {
  tier: "plata" | "oro" | "diamante";
  tierLabel: string;
  tagline: string;
  fields: FieldDef[];
};

const BASE_FIELDS: FieldDef[] = [
  { name: "contact_name", label: "Tu nombre completo", required: true },
  { name: "contact_email", label: "Correo electrónico", type: "email", required: true },
  { name: "contact_phone", label: "WhatsApp de contacto", type: "tel", required: true, placeholder: "+52..." },
  { name: "couple_names", label: "Nombres de la pareja", required: true, placeholder: "Sofía & Daniel" },
  { name: "event_date", label: "Fecha del evento", type: "date", required: true },
];

export default function PurchaseForm({ tier, tierLabel, tagline, fields }: Props) {
  const submit = useServerFn(submitInvitationRequest);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const contact_name = String(fd.get("contact_name") ?? "").trim();
    const contact_email = String(fd.get("contact_email") ?? "").trim();
    const contact_phone = String(fd.get("contact_phone") ?? "").trim();
    const couple_names = String(fd.get("couple_names") ?? "").trim();
    const event_date = String(fd.get("event_date") ?? "").trim();

    const payload: Record<string, string> = {};
    for (const f of fields) {
      const v = String(fd.get(f.name) ?? "").trim();
      if (v) payload[f.name] = v;
    }

    setLoading(true);
    try {
      await submit({
        data: {
          package_tier: tier,
          contact_name,
          contact_email,
          contact_phone,
          couple_names,
          event_date: event_date || null,
          payload,
        },
      });
      setDone(true);
      toast.success("¡Solicitud enviada! Te contactamos pronto.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al enviar");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-[#F7F3EE] flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-[#8A7E72] mb-3">BLCK Social</p>
          <h1 className="font-serif text-3xl text-[#2D2D2D] mb-3">¡Gracias!</h1>
          <p className="text-[#5C5347]">
            Recibimos tu solicitud del paquete <strong>{tierLabel}</strong>. Te contactaremos por
            WhatsApp en las próximas horas para coordinar el pago y la entrega.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F3EE] text-[#2D2D2D] py-16 px-5">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs tracking-[0.3em] uppercase text-[#8A7E72] mb-3">BLCK Social</p>
          <h1 className="font-serif text-4xl sm:text-5xl mb-3">Paquete {tierLabel}</h1>
          <p className="text-[#5C5347]">{tagline}</p>
          <div className="mt-6 mx-auto w-16 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
        </div>

        <form onSubmit={onSubmit} className="space-y-8">
          <section className="space-y-4">
            <h2 className="font-serif text-xl text-[#2D2D2D]">Datos de contacto</h2>
            {BASE_FIELDS.map((f) => (
              <FieldRow key={f.name} field={f} />
            ))}
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-xl text-[#2D2D2D]">Contenido de tu invitación</h2>
            <p className="text-sm text-[#8A7E72]">
              Completa lo que ya tengas listo. Si algo te falta, puedes dejarlo en blanco y lo
              afinamos por WhatsApp.
            </p>
            {fields.map((f) => (
              <FieldRow key={f.name} field={f} />
            ))}
          </section>

          <Button type="submit" disabled={loading} className="w-full bg-[#D4AF37] hover:bg-[#C4A77D] text-[#1a1a1a] tracking-[0.2em] uppercase text-xs py-6">
            {loading ? "Enviando..." : "Enviar solicitud"}
          </Button>
        </form>
      </div>
    </div>
  );
}

function FieldRow({ field }: { field: FieldDef }) {
  const common = {
    id: field.name,
    name: field.name,
    required: field.required,
    placeholder: field.placeholder,
  };
  return (
    <div className="space-y-1.5">
      <Label htmlFor={field.name} className="text-[#2D2D2D]">
        {field.label}
        {field.required ? <span className="text-[#D4AF37]"> *</span> : null}
      </Label>
      {field.type === "textarea" ? (
        <Textarea {...common} rows={4} className="bg-white" maxLength={2000} />
      ) : (
        <Input {...common} type={field.type ?? "text"} className="bg-white" maxLength={500} />
      )}
      {field.help ? <p className="text-xs text-[#8A7E72]">{field.help}</p> : null}
    </div>
  );
}
