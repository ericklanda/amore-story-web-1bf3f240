import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function assertOwnerOrAdmin(context: any, slug: string) {
  const { data: inv } = await context.supabase
    .from("invitations")
    .select("slug, owner_user_id")
    .eq("slug", slug)
    .maybeSingle();
  if (!inv) throw new Error("Invitación no encontrada.");
  const { data: adminRow } = await context.supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", context.userId)
    .eq("role", "admin")
    .maybeSingle();
  const isOwner = inv.owner_user_id === context.userId;
  if (!adminRow && !isOwner) throw new Error("No autorizado.");
  return { ownerUserId: inv.owner_user_id as string };
}

export const listInvitationSends = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ invitation_slug: z.string().min(1).max(64) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertOwnerOrAdmin(context, data.invitation_slug);
    const { data: rows, error } = await context.supabase
      .from("invitation_sends")
      .select("*")
      .eq("invitation_slug", data.invitation_slug)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { rows: rows ?? [] };
  });

export const createInvitationSend = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        invitation_slug: z.string().min(1).max(64),
        phone: z
          .string()
          .trim()
          .regex(/^\d{10,15}$/u, "Número inválido"),
        guest_name: z.string().trim().max(120).optional().nullable(),
        guests_allowed: z.number().int().min(1).max(30),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { ownerUserId } = await assertOwnerOrAdmin(context, data.invitation_slug);
    const { data: row, error } = await context.supabase
      .from("invitation_sends")
      .insert({
        invitation_slug: data.invitation_slug,
        owner_user_id: ownerUserId,
        phone: data.phone,
        guest_name: data.guest_name ?? null,
        guests_allowed: data.guests_allowed,
      })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return { row };
  });

export const markInvitationSendSent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ id: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("invitation_sends")
      .update({ sent_at: new Date().toISOString() })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteInvitationSend = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ id: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("invitation_sends").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// Public lookup by token: uses admin client, returns only safe fields.
export const lookupInvitationSendByToken = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) =>
    z.object({ token: z.string().min(6).max(64) }).parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("invitation_sends")
      .select("invitation_slug, guest_name, guests_allowed")
      .eq("token", data.token)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return { row: row ?? null };
  });
