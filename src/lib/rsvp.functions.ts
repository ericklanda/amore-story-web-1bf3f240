import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const RsvpSchema = z.object({
  invitation_slug: z.string().min(1).max(64).regex(/^[a-z0-9-]+$/),
  name: z.string().trim().min(1).max(120),
  attending: z.enum(["yes", "no"]),
  guests: z.number().int().min(0).max(10).optional().default(1),
  message: z.string().max(500).optional().nullable(),
});

export const submitRsvp = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => RsvpSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("rsvps").insert({
      invitation_slug: data.invitation_slug,
      name: data.name,
      attending: data.attending,
      guests: data.guests,
      message: data.message ?? null,
    });
    if (error) {
      console.error("[submitRsvp]", error);
      throw new Error("No pudimos guardar tu confirmación. Intenta de nuevo.");
    }
    return { ok: true };
  });
