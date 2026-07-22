import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const submitChangeRequest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        invitation_slug: z.string().min(1).max(64),
        message: z.string().trim().min(3).max(4000),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    // Verify caller is owner OR admin
    const { data: inv } = await context.supabase
      .from("invitations")
      .select("slug, owner_user_id")
      .eq("slug", data.invitation_slug)
      .maybeSingle();
    if (!inv) throw new Error("Invitación no encontrada.");

    const { data: adminRow } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    const isAdmin = !!adminRow;
    const isOwner = inv.owner_user_id === context.userId;
    if (!isAdmin && !isOwner) throw new Error("No autorizado.");

    const { error } = await context.supabase.from("change_requests").insert({
      invitation_slug: data.invitation_slug,
      requester_user_id: context.userId,
      message: data.message,
    });
    if (error) {
      console.error("[submitChangeRequest]", error);
      throw new Error("No se pudo enviar la solicitud.");
    }
    return { ok: true };
  });

export const listMyChangeRequests = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ invitation_slug: z.string().min(1).max(64) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: rows, error } = await context.supabase
      .from("change_requests")
      .select("id, invitation_slug, message, status, admin_note, created_at, updated_at")
      .eq("invitation_slug", data.invitation_slug)
      .order("created_at", { ascending: false });
    if (error) {
      console.error("[listMyChangeRequests]", error);
      throw new Error("No se pudieron cargar las solicitudes.");
    }
    return { rows: rows ?? [] };
  });

export const listAllChangeRequests = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: adminRow } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (!adminRow) throw new Error("Solo el administrador.");

    const { data, error } = await context.supabase
      .from("change_requests")
      .select("id, invitation_slug, message, status, admin_note, created_at, updated_at, requester_user_id")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("[listAllChangeRequests]", error);
      throw new Error("No se pudieron cargar las solicitudes.");
    }
    return { rows: data ?? [] };
  });

export const updateChangeRequest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(["pending", "in_progress", "done", "archived"]).optional(),
        admin_note: z.string().max(4000).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: adminRow } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (!adminRow) throw new Error("Solo el administrador.");

    const patch: Record<string, unknown> = {};
    if (data.status) patch.status = data.status;
    if (data.admin_note !== undefined) patch.admin_note = data.admin_note;
    if (Object.keys(patch).length === 0) return { ok: true };

    const { error } = await context.supabase
      .from("change_requests")
      .update(patch)
      .eq("id", data.id);
    if (error) {
      console.error("[updateChangeRequest]", error);
      throw new Error("No se pudo actualizar la solicitud.");
    }
    return { ok: true };
  });
