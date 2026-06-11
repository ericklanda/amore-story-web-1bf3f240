import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const PayloadSchema = z.record(z.string().max(64), z.string().max(2000)).default({});

const RequestSchema = z.object({
  package_tier: z.enum(["plata", "oro", "diamante"]),
  contact_name: z.string().trim().min(2).max(120),
  contact_email: z.string().trim().email().max(255),
  contact_phone: z.string().trim().min(7).max(30),
  couple_names: z.string().trim().min(2).max(160),
  event_date: z.string().max(10).optional().nullable(),
  payload: PayloadSchema,
});

export const submitInvitationRequest = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => RequestSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("invitation_requests").insert({
      package_tier: data.package_tier,
      contact_name: data.contact_name,
      contact_email: data.contact_email,
      contact_phone: data.contact_phone,
      couple_names: data.couple_names,
      event_date: data.event_date || null,
      payload: data.payload,
    });
    if (error) {
      console.error("[submitInvitationRequest]", error);
      throw new Error("No pudimos enviar tu solicitud. Intenta de nuevo.");
    }
    return { ok: true };
  });
