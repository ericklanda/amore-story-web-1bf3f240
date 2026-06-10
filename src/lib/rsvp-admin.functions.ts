import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const listRsvps = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ invitation_slug: z.string().min(1).max(64) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: rows, error } = await context.supabase
      .from("rsvps")
      .select("id, invitation_slug, name, attending, guests, message, created_at")
      .eq("invitation_slug", data.invitation_slug)
      .order("created_at", { ascending: false });
    if (error) {
      console.error("[listRsvps]", error);
      throw new Error("No se pudieron cargar las confirmaciones.");
    }
    return { rows: rows ?? [] };
  });
