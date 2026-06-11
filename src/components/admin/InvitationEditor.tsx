import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getInvitationForEdit,
  updateInvitation,
  type InvitationDTO,
  type Milestone,
  type ParentGroup,
  type GalleryItem,
  type TimelineItem,
  type GiftItem,
  type FaqItem,
} from "@/lib/invitation.functions";
import { supabase } from "@/integrations/supabase/client";

type Patch = Partial<{
  couple_names: string;
  groom_name: string | null;
  bride_name: string | null;
  event_datetime: string | null;
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
  theme_colors: string[] | null;
}>;

const SECTIONS = [
  { id: "general", label: "General" },
  { id: "colores", label: "Colores" },
  { id: "historia", label: "Historia" },
  { id: "padres", label: "Padres" },
  { id: "galeria", label: "Galería" },
  { id: "evento", label: "Evento" },
  { id: "itinerario", label: "Itinerario" },
  { id: "regalos", label: "Regalos" },
  { id: "faq", label: "FAQ" },
] as const;
type SectionId = (typeof SECTIONS)[number]["id"];

export function InvitationEditor({ slug }: { slug: string }) {
  const fetchEdit = useServerFn(getInvitationForEdit);
  const save = useServerFn(updateInvitation);
  const qc = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["edit-invitation", slug],
    queryFn: () => fetchEdit({ data: { slug } }),
  });

  const [state, setState] = useState<InvitationDTO | null>(null);
  const [section, setSection] = useState<SectionId>("general");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) setState(data);
  }, [data]);

  if (isLoading || !state) {
    return (
      <div className="bg-white border border-[#E5DED3] rounded-sm p-8 text-center text-[#8A7E72]">
        Cargando editor…
      </div>
    );
  }

  const update = <K extends keyof InvitationDTO>(key: K, value: InvitationDTO[K]) => {
    setState((s) => (s ? { ...s, [key]: value } : s));
  };

  const onSave = async () => {
    if (!state) return;
    setSaving(true);
    try {
      const patch: Patch = {
        couple_names: state.couple_names,
        groom_name: state.groom_name,
        bride_name: state.bride_name,
        event_datetime: state.event_datetime,
        city: state.city,
        hashtag: state.hashtag,
        hero_image_url: state.hero_image_url,
        story_image_url: state.story_image_url,
        youtube_song_id: state.youtube_song_id,
        story_milestones: state.story_milestones,
        parents: state.parents,
        gallery: state.gallery,
        venue_name: state.venue_name,
        venue_address: state.venue_address,
        venue_maps_url: state.venue_maps_url,
        dress_code: state.dress_code,
        dress_code_note: state.dress_code_note,
        timeline: state.timeline,
        gift_registry: state.gift_registry,
        transportation_note: state.transportation_note,
        whatsapp_number: state.whatsapp_number,
        faq: state.faq,
        welcome_message: state.welcome_message,
        thank_you_message: state.thank_you_message,
        theme_colors: state.theme_colors,
      };
      await save({ data: { slug, patch } });
      toast.success("Cambios guardados.");
      qc.invalidateQueries({ queryKey: ["public-invitation", slug] });
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async () => {
    if (!state) return;
    setSaving(true);
    try {
      const next = !state.published;
      await save({ data: { slug, patch: { published: next } } });
      update("published", next);
      toast.success(next ? "Invitación publicada." : "Invitación despublicada.");
      qc.invalidateQueries({ queryKey: ["public-invitation", slug] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white border border-[#E5DED3] rounded-sm shadow-sm">
      <div className="px-6 py-5 border-b border-[#E5DED3] flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#8A7E72]">Editor</p>
          <h2 className="font-serif text-2xl text-[#2D2D2D]">{state.couple_names}</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] tracking-[0.2em] uppercase px-2 py-1 rounded-full ${state.published ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
            {state.published ? "Publicada" : "Borrador"}
          </span>
          <a
            href={`/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] tracking-[0.2em] uppercase text-[#8A7E72] hover:text-[#D4AF37] border-b border-transparent hover:border-[#D4AF37]"
          >
            Ver →
          </a>
        </div>
      </div>

      {state.package_tier === "plata" ? (
        <div className="p-6">
          <PlataSection state={state} update={update} slug={slug} />
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-1 px-4 pt-4 border-b border-[#E5DED3]">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => setSection(s.id)}
                className={`px-3 py-2 text-[11px] tracking-[0.2em] uppercase border-b-2 -mb-px transition-colors ${
                  section === s.id
                    ? "border-[#D4AF37] text-[#2D2D2D]"
                    : "border-transparent text-[#8A7E72] hover:text-[#2D2D2D]"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="p-6 space-y-4">
            {section === "general" && <GeneralSection state={state} update={update} slug={slug} />}
            {section === "colores" && <ColorsSection state={state} update={update} />}
            {section === "historia" && <HistorySection state={state} update={update} slug={slug} />}
            {section === "padres" && <ParentsSection state={state} update={update} />}
            {section === "galeria" && <GallerySection state={state} update={update} slug={slug} />}
            {section === "evento" && <EventSection state={state} update={update} />}
            {section === "itinerario" && <TimelineSection state={state} update={update} />}
            {section === "regalos" && <GiftsSection state={state} update={update} />}
            {section === "faq" && <FaqSection state={state} update={update} />}
          </div>
        </>
      )}

      <div className="px-6 py-5 border-t border-[#E5DED3] flex flex-wrap items-center justify-end gap-3">
        <button
          onClick={togglePublish}
          disabled={saving}
          className={`px-4 py-2 text-xs tracking-[0.25em] uppercase rounded-sm border transition-colors ${
            state.published
              ? "border-[#E5DED3] text-[#8A7E72] hover:bg-[#F7F3EE]"
              : "border-[#D4AF37] text-[#8a6e1a] hover:bg-[#D4AF37]/10"
          }`}
        >
          {state.published ? "Despublicar" : "Publicar"}
        </button>
        <button
          onClick={onSave}
          disabled={saving}
          className="px-5 py-2 text-xs tracking-[0.25em] uppercase bg-[#2D2D2D] text-white rounded-sm hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </div>
  );
}

/* ------------------ shared inputs ------------------ */

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] tracking-[0.25em] uppercase text-[#8A7E72]">{label}</span>
      <div className="mt-1.5">{children}</div>
      {hint && <span className="block text-[11px] text-[#8A7E72] mt-1">{hint}</span>}
    </label>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full bg-white border border-[#E5DED3] rounded-sm px-3 py-2 text-sm focus:border-[#D4AF37] outline-none ${props.className ?? ""}`}
    />
  );
}

function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full bg-white border border-[#E5DED3] rounded-sm px-3 py-2 text-sm focus:border-[#D4AF37] outline-none resize-none ${props.className ?? ""}`}
    />
  );
}

function SectionCard({ title, children, onAdd, addLabel }: { title?: string; children: React.ReactNode; onAdd?: () => void; addLabel?: string }) {
  return (
    <div className="space-y-3">
      {title && <h3 className="text-[11px] tracking-[0.3em] uppercase text-[#8A7E72]">{title}</h3>}
      {children}
      {onAdd && (
        <button
          type="button"
          onClick={onAdd}
          className="px-3 py-2 text-[11px] tracking-[0.2em] uppercase border border-dashed border-[#D4AF37] text-[#8a6e1a] rounded-sm hover:bg-[#D4AF37]/10"
        >
          + {addLabel ?? "Agregar"}
        </button>
      )}
    </div>
  );
}

function RowActions({ onRemove, onUp, onDown }: { onRemove: () => void; onUp?: () => void; onDown?: () => void }) {
  return (
    <div className="flex items-center gap-1">
      {onUp && <button type="button" onClick={onUp} className="text-[#8A7E72] hover:text-[#2D2D2D] px-1.5">↑</button>}
      {onDown && <button type="button" onClick={onDown} className="text-[#8A7E72] hover:text-[#2D2D2D] px-1.5">↓</button>}
      <button type="button" onClick={onRemove} className="text-rose-600 hover:text-rose-700 px-1.5">✕</button>
    </div>
  );
}

/* ------------------ photo upload ------------------ */

async function uploadPhoto(slug: string, file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${slug}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("invitation-photos").upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) throw new Error(error.message);
  return path; // we store the path; server signs it on load
}

function PhotoUpload({
  slug,
  current,
  onChange,
  label,
}: {
  slug: string;
  current: string | null;
  onChange: (path: string | null) => void;
  label: string;
}) {
  const [busy, setBusy] = useState(false);
  return (
    <div>
      <div className="text-[10px] tracking-[0.25em] uppercase text-[#8A7E72] mb-1.5">{label}</div>
      <div className="flex items-center gap-3">
        {current && (
          <img
            src={/^https?:/.test(current) ? current : `https://placehold.co/80?text=foto`}
            alt=""
            className="w-16 h-16 object-cover border border-[#E5DED3] rounded-sm bg-[#F7F3EE]"
          />
        )}
        <label className="px-3 py-2 text-[11px] tracking-[0.2em] uppercase border border-[#E5DED3] rounded-sm cursor-pointer hover:bg-[#F7F3EE]">
          {busy ? "Subiendo..." : current ? "Reemplazar" : "Subir foto"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              setBusy(true);
              try {
                const path = await uploadPhoto(slug, f);
                onChange(path);
                toast.success("Foto subida. Guarda los cambios para aplicar.");
              } catch (err) {
                toast.error(err instanceof Error ? err.message : "Error al subir");
              } finally {
                setBusy(false);
                e.target.value = "";
              }
            }}
          />
        </label>
        {current && (
          <button type="button" onClick={() => onChange(null)} className="text-[11px] text-rose-600 hover:text-rose-700">
            Quitar
          </button>
        )}
      </div>
      {current && (
        <p className="text-[10px] text-[#8A7E72] mt-1 break-all">
          {/^https?:/.test(current) ? current : `Archivo: ${current}`}
        </p>
      )}
    </div>
  );
}

/* ------------------ sections ------------------ */

type UpdateFn = <K extends keyof InvitationDTO>(key: K, value: InvitationDTO[K]) => void;

function PlataSection({ state, update, slug }: { state: InvitationDTO; update: UpdateFn; slug: string }) {
  const dt = state.event_datetime ? state.event_datetime.slice(0, 16) : "";
  return (
    <div className="space-y-5">
      <div className="bg-[#F7F3EE] border border-[#E5DED3] rounded-sm p-3 text-[11px] text-[#8A7E72] tracking-[0.1em]">
        Paquete Plata · Edita los campos básicos de tu invitación.
      </div>
      <PhotoUpload slug={slug} label="Foto principal" current={state.hero_image_url} onChange={(v) => update("hero_image_url", v)} />
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Fecha y hora del evento" hint="Se usa para la cuenta regresiva">
          <TextInput
            type="datetime-local"
            value={dt}
            onChange={(e) => update("event_datetime", e.target.value ? new Date(e.target.value).toISOString() : null)}
          />
        </Field>
        <Field label="WhatsApp para confirmación" hint="Con código de país. Ej: 5216568637484">
          <TextInput value={state.whatsapp_number ?? ""} onChange={(e) => update("whatsapp_number", e.target.value || null)} />
        </Field>
        <Field label="Código de vestimenta" hint="Ej: Formal · Black tie">
          <TextInput value={state.dress_code ?? ""} onChange={(e) => update("dress_code", e.target.value || null)} />
        </Field>
        <Field label="Ubicación (link de Google Maps)" hint="Pega el link de Google Maps del lugar">
          <TextInput placeholder="https://maps.app.goo.gl/..." value={state.venue_maps_url ?? ""} onChange={(e) => update("venue_maps_url", e.target.value || null)} />
        </Field>
        <div className="md:col-span-2">
          <Field label="Mensaje de los novios">
            <TextArea rows={3} value={state.welcome_message ?? ""} onChange={(e) => update("welcome_message", e.target.value || null)} />
          </Field>
        </div>
      </div>
    </div>
  );
}

function GeneralSection({ state, update, slug }: { state: InvitationDTO; update: UpdateFn; slug: string }) {
  const dt = state.event_datetime ? state.event_datetime.slice(0, 16) : "";
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Field label="Nombres de la pareja (display)" hint="Ej: Luis Carlos & Leonardo">
        <TextInput value={state.couple_names} onChange={(e) => update("couple_names", e.target.value)} />
      </Field>
      <Field label="Nombre 1">
        <TextInput value={state.groom_name ?? ""} onChange={(e) => update("groom_name", e.target.value || null)} />
      </Field>
      <Field label="Nombre 2">
        <TextInput value={state.bride_name ?? ""} onChange={(e) => update("bride_name", e.target.value || null)} />
      </Field>
      <Field label="Fecha y hora del evento">
        <TextInput
          type="datetime-local"
          value={dt}
          onChange={(e) => update("event_datetime", e.target.value ? new Date(e.target.value).toISOString() : null)}
        />
      </Field>
      <Field label="Ciudad">
        <TextInput value={state.city ?? ""} onChange={(e) => update("city", e.target.value || null)} />
      </Field>
      <Field label="Hashtag" hint="Ej: #AnaYJuan2026">
        <TextInput value={state.hashtag ?? ""} onChange={(e) => update("hashtag", e.target.value || null)} />
      </Field>
      <Field label="YouTube ID de música" hint="Ej: gxXo8bWZbWw (el código después de v=)">
        <TextInput value={state.youtube_song_id ?? ""} onChange={(e) => update("youtube_song_id", e.target.value || null)} />
      </Field>
      <Field label="WhatsApp (con código de país)" hint="Ej: 5216568637484">
        <TextInput value={state.whatsapp_number ?? ""} onChange={(e) => update("whatsapp_number", e.target.value || null)} />
      </Field>
      <div className="md:col-span-2">
        <Field label="Mensaje de bienvenida (splash)">
          <TextInput value={state.welcome_message ?? ""} onChange={(e) => update("welcome_message", e.target.value || null)} />
        </Field>
      </div>
      <div className="md:col-span-2">
        <Field label="Mensaje de agradecimiento (final)">
          <TextArea rows={2} value={state.thank_you_message ?? ""} onChange={(e) => update("thank_you_message", e.target.value || null)} />
        </Field>
      </div>
      <div className="md:col-span-2">
        <PhotoUpload slug={slug} label="Foto principal (Hero)" current={state.hero_image_url} onChange={(v) => update("hero_image_url", v)} />
      </div>
    </div>
  );
}

function HistorySection({ state, update, slug }: { state: InvitationDTO; update: UpdateFn; slug: string }) {
  const items = state.story_milestones;
  const set = (next: Milestone[]) => update("story_milestones", next);
  return (
    <div className="space-y-5">
      <PhotoUpload slug={slug} label="Foto de la historia" current={state.story_image_url} onChange={(v) => update("story_image_url", v)} />
      <SectionCard
        title="Hitos"
        onAdd={() => set([...items, { date: "", title: "", text: "" }])}
        addLabel="Agregar hito"
      >
        {items.map((m, i) => (
          <div key={i} className="border border-[#E5DED3] rounded-sm p-3 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#8A7E72]">Hito {i + 1}</span>
              <RowActions
                onRemove={() => set(items.filter((_, j) => j !== i))}
                onUp={i > 0 ? () => { const a = [...items]; [a[i - 1], a[i]] = [a[i], a[i - 1]]; set(a); } : undefined}
                onDown={i < items.length - 1 ? () => { const a = [...items]; [a[i + 1], a[i]] = [a[i], a[i + 1]]; set(a); } : undefined}
              />
            </div>
            <TextInput placeholder="Fecha (Ej: Marzo 2025)" value={m.date} onChange={(e) => { const a = [...items]; a[i] = { ...m, date: e.target.value }; set(a); }} />
            <TextInput placeholder="Título" value={m.title} onChange={(e) => { const a = [...items]; a[i] = { ...m, title: e.target.value }; set(a); }} />
            <TextArea rows={2} placeholder="Descripción" value={m.text} onChange={(e) => { const a = [...items]; a[i] = { ...m, text: e.target.value }; set(a); }} />
          </div>
        ))}
      </SectionCard>
    </div>
  );
}

function ParentsSection({ state, update }: { state: InvitationDTO; update: UpdateFn }) {
  const items = state.parents;
  const set = (next: ParentGroup[]) => update("parents", next);
  return (
    <SectionCard onAdd={() => set([...items, { title: "", names: [""] }])} addLabel="Agregar grupo">
      {items.map((g, i) => (
        <div key={i} className="border border-[#E5DED3] rounded-sm p-3 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#8A7E72]">Grupo {i + 1}</span>
            <RowActions onRemove={() => set(items.filter((_, j) => j !== i))} />
          </div>
          <TextInput placeholder="Título (Ej: Padres del novio)" value={g.title} onChange={(e) => { const a = [...items]; a[i] = { ...g, title: e.target.value }; set(a); }} />
          {g.names.map((n, ni) => (
            <div key={ni} className="flex gap-2">
              <TextInput placeholder="Nombre" value={n} onChange={(e) => { const a = [...items]; const names = [...g.names]; names[ni] = e.target.value; a[i] = { ...g, names }; set(a); }} />
              <button type="button" onClick={() => { const a = [...items]; a[i] = { ...g, names: g.names.filter((_, k) => k !== ni) }; set(a); }} className="text-rose-600 px-2">✕</button>
            </div>
          ))}
          <button type="button" onClick={() => { const a = [...items]; a[i] = { ...g, names: [...g.names, ""] }; set(a); }} className="text-[11px] tracking-[0.2em] uppercase text-[#8a6e1a]">+ Nombre</button>
        </div>
      ))}
    </SectionCard>
  );
}

function GallerySection({ state, update, slug }: { state: InvitationDTO; update: UpdateFn; slug: string }) {
  const items = state.gallery;
  const set = (next: GalleryItem[]) => update("gallery", next);
  const [busy, setBusy] = useState(false);

  return (
    <div className="space-y-3">
      <label className="inline-block px-3 py-2 text-[11px] tracking-[0.2em] uppercase border border-dashed border-[#D4AF37] text-[#8a6e1a] rounded-sm cursor-pointer hover:bg-[#D4AF37]/10">
        {busy ? "Subiendo..." : "+ Subir fotos"}
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={async (e) => {
            const files = Array.from(e.target.files ?? []);
            if (!files.length) return;
            setBusy(true);
            try {
              const uploaded: GalleryItem[] = [];
              for (const f of files) {
                const path = await uploadPhoto(slug, f);
                uploaded.push({ url: path, caption: "" });
              }
              set([...items, ...uploaded]);
              toast.success(`${uploaded.length} foto(s) subida(s). Guarda para aplicar.`);
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "Error");
            } finally {
              setBusy(false);
              e.target.value = "";
            }
          }}
        />
      </label>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {items.map((g, i) => (
          <div key={i} className="border border-[#E5DED3] rounded-sm p-2 space-y-2">
            <div className="aspect-square bg-[#F7F3EE] rounded-sm overflow-hidden flex items-center justify-center text-[10px] text-[#8A7E72] text-center px-2">
              {/^https?:/.test(g.url) ? <img src={g.url} alt="" className="w-full h-full object-cover" /> : g.url}
            </div>
            <TextInput placeholder="Pie de foto (opcional)" value={g.caption ?? ""} onChange={(e) => { const a = [...items]; a[i] = { ...g, caption: e.target.value }; set(a); }} />
            <div className="flex justify-between">
              <div className="flex gap-1">
                {i > 0 && <button type="button" onClick={() => { const a = [...items]; [a[i - 1], a[i]] = [a[i], a[i - 1]]; set(a); }} className="text-[#8A7E72] px-1">↑</button>}
                {i < items.length - 1 && <button type="button" onClick={() => { const a = [...items]; [a[i + 1], a[i]] = [a[i], a[i + 1]]; set(a); }} className="text-[#8A7E72] px-1">↓</button>}
              </div>
              <button type="button" onClick={() => set(items.filter((_, j) => j !== i))} className="text-rose-600 text-xs">Quitar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EventSection({ state, update }: { state: InvitationDTO; update: UpdateFn }) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Field label="Nombre del lugar">
        <TextInput value={state.venue_name ?? ""} onChange={(e) => update("venue_name", e.target.value || null)} />
      </Field>
      <Field label="Link de Google Maps">
        <TextInput placeholder="https://maps.app.goo.gl/..." value={state.venue_maps_url ?? ""} onChange={(e) => update("venue_maps_url", e.target.value || null)} />
      </Field>
      <div className="md:col-span-2">
        <Field label="Dirección completa">
          <TextInput value={state.venue_address ?? ""} onChange={(e) => update("venue_address", e.target.value || null)} />
        </Field>
      </div>
      <Field label="Código de vestimenta (título)" hint="Ej: Black · Todos de negro">
        <TextInput value={state.dress_code ?? ""} onChange={(e) => update("dress_code", e.target.value || null)} />
      </Field>
      <Field label="Nota del dress code">
        <TextArea rows={2} value={state.dress_code_note ?? ""} onChange={(e) => update("dress_code_note", e.target.value || null)} />
      </Field>
      <div className="md:col-span-2">
        <Field label="Indicaciones de transporte">
          <TextArea rows={3} value={state.transportation_note ?? ""} onChange={(e) => update("transportation_note", e.target.value || null)} />
        </Field>
      </div>
    </div>
  );
}

function TimelineSection({ state, update }: { state: InvitationDTO; update: UpdateFn }) {
  const items = state.timeline;
  const set = (next: TimelineItem[]) => update("timeline", next);
  return (
    <SectionCard onAdd={() => set([...items, { time: "", title: "", icon: "✨" }])} addLabel="Agregar momento">
      {items.map((it, i) => (
        <div key={i} className="border border-[#E5DED3] rounded-sm p-3 grid grid-cols-12 gap-2 items-end">
          <div className="col-span-3">
            <Field label="Hora"><TextInput placeholder="8:00 pm" value={it.time} onChange={(e) => { const a = [...items]; a[i] = { ...it, time: e.target.value }; set(a); }} /></Field>
          </div>
          <div className="col-span-2">
            <Field label="Icono"><TextInput placeholder="💍" value={it.icon ?? ""} onChange={(e) => { const a = [...items]; a[i] = { ...it, icon: e.target.value }; set(a); }} /></Field>
          </div>
          <div className="col-span-6">
            <Field label="Título"><TextInput placeholder="Ceremonia" value={it.title} onChange={(e) => { const a = [...items]; a[i] = { ...it, title: e.target.value }; set(a); }} /></Field>
          </div>
          <div className="col-span-1 flex justify-end">
            <RowActions onRemove={() => set(items.filter((_, j) => j !== i))} />
          </div>
        </div>
      ))}
    </SectionCard>
  );
}

function GiftsSection({ state, update }: { state: InvitationDTO; update: UpdateFn }) {
  const items = state.gift_registry;
  const set = (next: GiftItem[]) => update("gift_registry", next);
  return (
    <SectionCard onAdd={() => set([...items, { icon: "🎁", title: "", text: "" }])} addLabel="Agregar opción">
      {items.map((g, i) => (
        <div key={i} className="border border-[#E5DED3] rounded-sm p-3 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#8A7E72]">Opción {i + 1}</span>
            <RowActions onRemove={() => set(items.filter((_, j) => j !== i))} />
          </div>
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-2"><TextInput placeholder="🎁" value={g.icon ?? ""} onChange={(e) => { const a = [...items]; a[i] = { ...g, icon: e.target.value }; set(a); }} /></div>
            <div className="col-span-10"><TextInput placeholder="Título" value={g.title} onChange={(e) => { const a = [...items]; a[i] = { ...g, title: e.target.value }; set(a); }} /></div>
          </div>
          <TextArea rows={2} placeholder="Descripción" value={g.text} onChange={(e) => { const a = [...items]; a[i] = { ...g, text: e.target.value }; set(a); }} />
          <TextInput placeholder="URL (opcional)" value={g.url ?? ""} onChange={(e) => { const a = [...items]; a[i] = { ...g, url: e.target.value }; set(a); }} />
        </div>
      ))}
    </SectionCard>
  );
}

function FaqSection({ state, update }: { state: InvitationDTO; update: UpdateFn }) {
  const items = state.faq;
  const set = (next: FaqItem[]) => update("faq", next);
  return (
    <SectionCard onAdd={() => set([...items, { question: "", answer: "" }])} addLabel="Agregar pregunta">
      {items.map((f, i) => (
        <div key={i} className="border border-[#E5DED3] rounded-sm p-3 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#8A7E72]">Pregunta {i + 1}</span>
            <RowActions onRemove={() => set(items.filter((_, j) => j !== i))} />
          </div>
          <TextInput placeholder="Pregunta" value={f.question} onChange={(e) => { const a = [...items]; a[i] = { ...f, question: e.target.value }; set(a); }} />
          <TextArea rows={2} placeholder="Respuesta" value={f.answer} onChange={(e) => { const a = [...items]; a[i] = { ...f, answer: e.target.value }; set(a); }} />
        </div>
      ))}
    </SectionCard>
  );
}

/* ------------------ colors ------------------ */

const COLOR_PRESETS: { name: string; colors: [string, string, string] }[] = [
  { name: "Eucalipto & Oro",     colors: ["#3D5240", "#C8A96A", "#F5F1E8"] },
  { name: "Borgoña Clásico",     colors: ["#5C1A1B", "#C9A227", "#F7EFE5"] },
  { name: "Marino & Champaña",   colors: ["#1F2A44", "#D4B483", "#F4ECDD"] },
  { name: "Rosa Polvo",          colors: ["#7A4A4D", "#D8A7A0", "#F8EDEB"] },
  { name: "Verde Bosque",        colors: ["#2C3E2D", "#B59B6A", "#EFEAE0"] },
  { name: "Negro & Oro",         colors: ["#1A1A1A", "#D4AF37", "#F2EFE7"] },
  { name: "Terracota Otoñal",    colors: ["#8B3A1F", "#D9A066", "#F6EBDA"] },
  { name: "Lavanda Suave",       colors: ["#4A3F66", "#B8A2C8", "#F2EDF5"] },
  { name: "Salvia & Crema",      colors: ["#7A8B6A", "#C9B58A", "#F4F1E8"] },
  { name: "Mostaza Vintage",     colors: ["#5A4A1F", "#D4A93B", "#F5EFDC"] },
  { name: "Azul Polvo",          colors: ["#3C5A7A", "#C8B68A", "#EEF1F4"] },
  { name: "Cobre & Marfil",      colors: ["#7C3A1F", "#C58B5C", "#F6EFE3"] },
  { name: "Vino & Rosa",         colors: ["#5C2B3A", "#D4A5A0", "#F8EEEC"] },
  { name: "Esmeralda Profundo",  colors: ["#1F4D3F", "#C8A96A", "#EFEDDF"] },
  { name: "Coral & Arena",       colors: ["#B5523B", "#E8B492", "#F8EFE2"] },
  { name: "Carbón & Plata",      colors: ["#2D2D2D", "#B5B5B5", "#EFEFEC"] },
  { name: "Mocha & Crema",       colors: ["#3E2A20", "#B68863", "#F4ECDD"] },
  { name: "Lila & Oro Rosa",     colors: ["#564166", "#D4A574", "#F3ECF1"] },
  { name: "Menta Suave",         colors: ["#3B6B5C", "#C9B68A", "#EAF1ED"] },
  { name: "Berenjena & Oro",     colors: ["#3A2238", "#C9A35E", "#F2ECEB"] },
];

function ColorsSection({ state, update }: { state: InvitationDTO; update: UpdateFn }) {
  const current = state.theme_colors && state.theme_colors.length === 3 ? state.theme_colors : null;
  const setColors = (next: [string, string, string] | null) => update("theme_colors", next);
  const isActive = (c: [string, string, string]) =>
    !!current && current[0].toLowerCase() === c[0].toLowerCase() && current[1].toLowerCase() === c[1].toLowerCase() && current[2].toLowerCase() === c[2].toLowerCase();

  const updateAt = (idx: 0 | 1 | 2, value: string) => {
    const base = current ?? ["#2D2D2D", "#D4AF37", "#F7F3EE"];
    const next: [string, string, string] = [base[0], base[1], base[2]];
    next[idx] = value;
    setColors(next);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[11px] tracking-[0.3em] uppercase text-[#8A7E72] mb-1">Paleta de la invitación</h3>
        <p className="text-[12px] text-[#8A7E72]">
          Elige una combinación lista o ajusta los 3 colores a tu gusto. El primer color es el principal (títulos y botones), el segundo es el acento dorado, y el tercero es el fondo suave.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {COLOR_PRESETS.map((p) => {
          const active = isActive(p.colors);
          return (
            <button
              key={p.name}
              type="button"
              onClick={() => setColors(p.colors)}
              className={`group text-left border rounded-sm p-3 transition-all ${
                active ? "border-[#2D2D2D] ring-2 ring-[#D4AF37]" : "border-[#E5DED3] hover:border-[#D4AF37]"
              }`}
            >
              <div className="flex h-10 rounded-sm overflow-hidden border border-[#E5DED3]">
                {p.colors.map((c) => (
                  <div key={c} style={{ backgroundColor: c }} className="flex-1" />
                ))}
              </div>
              <div className="mt-2 text-[11px] tracking-[0.15em] uppercase text-[#2D2D2D]">{p.name}</div>
              <div className="text-[10px] text-[#8A7E72] font-mono">{p.colors.join(" · ")}</div>
            </button>
          );
        })}
      </div>

      <div className="border-t border-[#E5DED3] pt-5 space-y-3">
        <h3 className="text-[11px] tracking-[0.3em] uppercase text-[#8A7E72]">Personalizar (opcional)</h3>
        <div className="grid grid-cols-3 gap-3">
          {(["Principal", "Acento", "Fondo"] as const).map((label, i) => {
            const val = current ? current[i] : ["#2D2D2D", "#D4AF37", "#F7F3EE"][i];
            return (
              <div key={label}>
                <div className="text-[10px] tracking-[0.25em] uppercase text-[#8A7E72] mb-1.5">{label}</div>
                <div className="flex items-center gap-2 border border-[#E5DED3] rounded-sm px-2 py-1.5">
                  <input
                    type="color"
                    value={val}
                    onChange={(e) => updateAt(i as 0 | 1 | 2, e.target.value)}
                    className="w-8 h-8 border-0 bg-transparent cursor-pointer"
                  />
                  <span className="text-xs font-mono text-[#2D2D2D] uppercase">{val}</span>
                </div>
              </div>
            );
          })}
        </div>
        {current && (
          <button
            type="button"
            onClick={() => setColors(null)}
            className="text-[11px] tracking-[0.2em] uppercase text-rose-600 hover:text-rose-700"
          >
            Quitar paleta (usar predeterminada)
          </button>
        )}
      </div>
    </div>
  );
}
