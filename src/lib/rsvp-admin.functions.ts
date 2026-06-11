import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const listMyInvitations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    // RLS lets admins see everything; owners only see their own.
    // We filter explicitly so non-admin owners see only theirs.
    const { data: roleRow } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();

    const isAdmin = !!roleRow;

    let query = context.supabase
      .from("invitations")
      .select("id, slug, couple_names, owner_email, event_date, owner_user_id, package_tier")
      .order("created_at", { ascending: false });

    if (!isAdmin) {
      query = query.eq("owner_user_id", context.userId);
    }

    const { data, error } = await query;
    if (error) {
      console.error("[listMyInvitations]", error);
      throw new Error("No se pudieron cargar las invitaciones.");
    }
    return { invitations: data ?? [], isAdmin };
  });

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

export const createInvitation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        slug: z
          .string()
          .min(2)
          .max(64)
          .regex(/^[a-z0-9-]+$/, "Solo minúsculas, números y guiones."),
        couple_names: z.string().min(2).max(120),
        owner_email: z.string().email().max(255),
        event_date: z.string().optional().nullable(),
        package_tier: z.enum(["plata", "oro", "diamante"]).default("oro"),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: roleRow } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleRow) {
      throw new Error("Solo el administrador puede crear invitaciones.");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: existing } = await supabaseAdmin
      .from("invitations")
      .select("id")
      .eq("slug", data.slug)
      .maybeSingle();
    if (existing) throw new Error("Ese slug ya existe.");

    const { error } = await supabaseAdmin.from("invitations").insert({
      slug: data.slug,
      couple_names: data.couple_names,
      owner_email: data.owner_email,
      event_date: data.event_date || null,
      package_tier: data.package_tier,
    });
    if (error) {
      console.error("[createInvitation]", error);
      throw new Error("No se pudo crear la invitación.");
    }
    return { ok: true };
  });
