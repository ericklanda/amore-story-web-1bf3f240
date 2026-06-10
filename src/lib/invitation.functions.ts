import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";


export type Milestone = { date: string; title: string; text: string };
export type ParentGroup = { title: string; names: string[] };
export type GalleryItem = { url: string; caption?: string };
export type TimelineItem = { time: string; title: string; icon?: string };
export type GiftItem = { icon?: string; title: string; text: string; url?: string };
export type FaqItem = { question: string; answer: string };

export type InvitationDTO = {
  id: string;
  slug: string;
  couple_names: string;
  groom_name: string | null;
  bride_name: string | null;
  event_datetime: string | null;
  event_date: string | null;
  city: string | null;
  hashtag: string | null;
  hero_image_url: string | null;
  story_image_url: string | null;
  youtube_song_id: string | null;
  story_milestones: Milestone[];
  parents: ParentGroup[];
  gallery: GalleryItem[];
  venue_name: string | null;
  venue_address: string | null;
  venue_maps_url: string | null;
  dress_code: string | null;
  dress_code_note: string | null;
  timeline: TimelineItem[];
  gift_registry: GiftItem[];
  transportation_note: string | null;
  whatsapp_number: string | null;
  faq: FaqItem[];
  welcome_message: string | null;
  thank_you_message: string | null;
  published: boolean;
  owner_email: string;
  owner_user_id: string | null;
};

const SIGNED_URL_TTL = 60 * 60 * 24 * 365; // 1 year

function looksLikeUrl(v: string): boolean {
  return /^https?:\/\//i.test(v) || v.startsWith("/");
}

async function signMaybe(
  admin: { storage: { from: (b: string) => { createSignedUrl: (p: string, exp: number) => Promise<{ data: { signedUrl: string } | null }> } } },
  value: string | null,
): Promise<string | null> {
  if (!value) return null;
  if (looksLikeUrl(value)) return value;
  // treat as storage path inside invitation-photos
  const { data } = await admin.storage.from("invitation-photos").createSignedUrl(value, SIGNED_URL_TTL);
  return data?.signedUrl ?? null;
}

async function resolveImages(
  admin: Parameters<typeof signMaybe>[0],
  row: Record<string, unknown>,
): Promise<{ hero: string | null; story: string | null; gallery: GalleryItem[] }> {
  const hero = await signMaybe(admin, (row.hero_image_url as string | null) ?? null);
  const story = await signMaybe(admin, (row.story_image_url as string | null) ?? null);
  const gallery = Array.isArray(row.gallery) ? (row.gallery as GalleryItem[]) : [];
  const resolvedGallery = await Promise.all(
    gallery.map(async (g) => ({ url: (await signMaybe(admin, g.url)) ?? "", caption: g.caption })),
  );
  return { hero, story, gallery: resolvedGallery.filter((g) => g.url) };
}

function rowToDTO(row: Record<string, unknown>, hero: string | null, story: string | null, gallery: GalleryItem[]): InvitationDTO {
  return {
    id: row.id as string,
    slug: row.slug as string,
    couple_names: row.couple_names as string,
    groom_name: (row.groom_name as string | null) ?? null,
    bride_name: (row.bride_name as string | null) ?? null,
    event_datetime: (row.event_datetime as string | null) ?? null,
    event_date: (row.event_date as string | null) ?? null,
    city: (row.city as string | null) ?? null,
    hashtag: (row.hashtag as string | null) ?? null,
    hero_image_url: hero,
    story_image_url: story,
    youtube_song_id: (row.youtube_song_id as string | null) ?? null,
    story_milestones: (row.story_milestones as Milestone[] | null) ?? [],
    parents: (row.parents as ParentGroup[] | null) ?? [],
    gallery,
    venue_name: (row.venue_name as string | null) ?? null,
    venue_address: (row.venue_address as string | null) ?? null,
    venue_maps_url: (row.venue_maps_url as string | null) ?? null,
    dress_code: (row.dress_code as string | null) ?? null,
    dress_code_note: (row.dress_code_note as string | null) ?? null,
    timeline: (row.timeline as TimelineItem[] | null) ?? [],
    gift_registry: (row.gift_registry as GiftItem[] | null) ?? [],
    transportation_note: (row.transportation_note as string | null) ?? null,
    whatsapp_number: (row.whatsapp_number as string | null) ?? null,
    faq: (row.faq as FaqItem[] | null) ?? [],
    welcome_message: (row.welcome_message as string | null) ?? null,
    thank_you_message: (row.thank_you_message as string | null) ?? null,
    published: (row.published as boolean) ?? false,
    owner_email: row.owner_email as string,
    owner_user_id: (row.owner_user_id as string | null) ?? null,
  };
}

const SlugSchema = z.object({ slug: z.string().min(1).max(64).regex(/^[a-z0-9-]+$/) });

export const getPublicInvitation = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => SlugSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("invitations")
      .select("*")
      .eq("slug", data.slug)
      .eq("published", true)
      .maybeSingle();
    if (error) {
      console.error("[getPublicInvitation]", error);
      throw new Error("No se pudo cargar la invitación.");
    }
    if (!row) throw notFound();
    const { hero, story, gallery } = await resolveImages(supabaseAdmin, row as Record<string, unknown>);
    return rowToDTO(row as Record<string, unknown>, hero, story, gallery);
  });

export const getInvitationForEdit = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => SlugSchema.parse(input))
  .handler(async ({ data, context }) => {
    // verify admin or owner
    const { data: roleRow } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    const isAdmin = !!roleRow;

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("invitations")
      .select("*")
      .eq("slug", data.slug)
      .maybeSingle();
    if (error || !row) throw new Error("Invitación no encontrada.");
    if (!isAdmin && row.owner_user_id !== context.userId) {
      throw new Error("No tienes permiso para editar esta invitación.");
    }
    const { hero, story, gallery } = await resolveImages(supabaseAdmin, row as Record<string, unknown>);
    return rowToDTO(row as Record<string, unknown>, hero, story, gallery);
  });

const MilestoneSchema = z.object({ date: z.string().max(60), title: z.string().max(120), text: z.string().max(500) });
const ParentSchema = z.object({ title: z.string().max(120), names: z.array(z.string().max(160)).max(10) });
const GallerySchema = z.object({ url: z.string().max(1000), caption: z.string().max(120).optional() });
const TimelineSchema = z.object({ time: z.string().max(40), title: z.string().max(120), icon: z.string().max(8).optional() });
const GiftSchema = z.object({ icon: z.string().max(8).optional(), title: z.string().max(120), text: z.string().max(500), url: z.string().max(1000).optional() });
const FaqSchema = z.object({ question: z.string().max(200), answer: z.string().max(1000) });

const UpdateSchema = z.object({
  slug: z.string().min(1).max(64).regex(/^[a-z0-9-]+$/),
  patch: z.object({
    couple_names: z.string().min(2).max(120).optional(),
    groom_name: z.string().max(80).nullable().optional(),
    bride_name: z.string().max(80).nullable().optional(),
    event_datetime: z.string().nullable().optional(),
    city: z.string().max(120).nullable().optional(),
    hashtag: z.string().max(60).nullable().optional(),
    hero_image_url: z.string().max(1000).nullable().optional(),
    story_image_url: z.string().max(1000).nullable().optional(),
    youtube_song_id: z.string().max(40).nullable().optional(),
    story_milestones: z.array(MilestoneSchema).max(20).optional(),
    parents: z.array(ParentSchema).max(10).optional(),
    gallery: z.array(GallerySchema).max(50).optional(),
    venue_name: z.string().max(200).nullable().optional(),
    venue_address: z.string().max(400).nullable().optional(),
    venue_maps_url: z.string().max(1000).nullable().optional(),
    dress_code: z.string().max(80).nullable().optional(),
    dress_code_note: z.string().max(500).nullable().optional(),
    timeline: z.array(TimelineSchema).max(20).optional(),
    gift_registry: z.array(GiftSchema).max(10).optional(),
    transportation_note: z.string().max(1000).nullable().optional(),
    whatsapp_number: z.string().max(20).nullable().optional(),
    faq: z.array(FaqSchema).max(20).optional(),
    welcome_message: z.string().max(500).nullable().optional(),
    thank_you_message: z.string().max(500).nullable().optional(),
    published: z.boolean().optional(),
  }),
});

export const updateInvitation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => UpdateSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { data: roleRow } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    const isAdmin = !!roleRow;

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: existing, error: fetchErr } = await supabaseAdmin
      .from("invitations")
      .select("id, owner_user_id")
      .eq("slug", data.slug)
      .maybeSingle();
    if (fetchErr || !existing) throw new Error("Invitación no encontrada.");
    if (!isAdmin && existing.owner_user_id !== context.userId) {
      throw new Error("No tienes permiso para editar esta invitación.");
    }

    const { error } = await supabaseAdmin
      .from("invitations")
      .update(data.patch)
      .eq("slug", data.slug);
    if (error) {
      console.error("[updateInvitation]", error);
      throw new Error("No se pudo guardar.");
    }
    return { ok: true };
  });
