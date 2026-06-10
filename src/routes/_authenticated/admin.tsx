import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { listRsvps, listMyInvitations, createInvitation } from "@/lib/rsvp-admin.functions";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { InvitationEditor } from "@/components/admin/InvitationEditor";


export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin · Confirmaciones" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type Rsvp = {
  id: string;
  invitation_slug: string;
  name: string;
  attending: string;
  guests: number;
  message: string | null;
  created_at: string;
};

type Invitation = {
  id: string;
  slug: string;
  couple_names: string;
  owner_email: string;
  event_date: string | null;
  owner_user_id: string | null;
};

function AdminPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const fetchInvitations = useServerFn(listMyInvitations);
  const fetchList = useServerFn(listRsvps);
  const createInv = useServerFn(createInvitation);

  const [slug, setSlug] = useState<string>("");
  const [showCreate, setShowCreate] = useState(false);
  const [showEditor, setShowEditor] = useState(false);


  const invQuery = useQuery({
    queryKey: ["my-invitations"],
    queryFn: () => fetchInvitations(),
  });

  const invitations: Invitation[] = invQuery.data?.invitations ?? [];
  const isAdmin = !!invQuery.data?.isAdmin;

  useEffect(() => {
    if (!slug && invitations.length) setSlug(invitations[0].slug);
  }, [invitations, slug]);

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["rsvps", slug],
    queryFn: () => fetchList({ data: { invitation_slug: slug } }),
    enabled: !!slug,
  });

  const rows: Rsvp[] = data?.rows ?? [];
  const currentInv = invitations.find((i) => i.slug === slug);

  const stats = useMemo(() => {
    const yes = rows.filter((r) => r.attending === "yes");
    const no = rows.filter((r) => r.attending === "no");
    const totalGuests = yes.reduce((acc, r) => acc + (r.guests || 0), 0);
    return { total: rows.length, yes: yes.length, no: no.length, totalGuests };
  }, [rows]);

  const downloadExcel = () => {
    if (!rows.length) {
      toast.info("No hay confirmaciones aún.");
      return;
    }
    const headers = ["Fecha", "Nombre", "Asiste", "Personas", "Mensaje"];
    const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const lines = [
      headers.map(escape).join(","),
      ...rows.map((r) =>
        [
          new Date(r.created_at).toLocaleString("es-MX"),
          r.name,
          r.attending === "yes" ? "Sí" : "No",
          String(r.guests),
          r.message ?? "",
        ]
          .map(escape)
          .join(","),
      ),
    ];
    const csv = "\uFEFF" + lines.join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `confirmaciones-${slug}-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  return (
    <div className="min-h-screen bg-[#F7F3EE] px-4 sm:px-8 py-10">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#8A7E72]">BLCK Social · Admin</p>
            <h1 className="font-serif text-3xl text-[#2D2D2D]">Confirmaciones</h1>
            {isAdmin && (
              <p className="text-[11px] mt-1 text-[#D4AF37] tracking-[0.2em] uppercase">Super admin</p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {invitations.length > 0 && (
              <select
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="bg-white border border-[#E5DED3] rounded-sm px-3 py-2 text-sm"
              >
                {invitations.map((i) => (
                  <option key={i.slug} value={i.slug}>{i.couple_names}</option>
                ))}
              </select>
            )}
            {isAdmin && (
              <button
                onClick={() => setShowCreate((v) => !v)}
                className="px-3 py-2 text-xs tracking-[0.2em] uppercase border border-[#D4AF37] text-[#8a6e1a] rounded-sm hover:bg-[#D4AF37]/10"
              >
                {showCreate ? "Cerrar" : "+ Nueva"}
              </button>
            )}
            {slug && (
              <button
                onClick={() => setShowEditor((v) => !v)}
                className="px-3 py-2 text-xs tracking-[0.2em] uppercase border border-[#2D2D2D] text-[#2D2D2D] rounded-sm hover:bg-[#2D2D2D] hover:text-white transition-colors"
              >
                {showEditor ? "Cerrar editor" : "Editar invitación"}
              </button>
            )}

            <button
              onClick={() => refetch()}
              disabled={!slug}
              className="px-3 py-2 text-xs tracking-[0.2em] uppercase border border-[#E5DED3] rounded-sm hover:bg-white disabled:opacity-40"
            >
              {isFetching ? "..." : "Refrescar"}
            </button>
            <button
              onClick={downloadExcel}
              disabled={!slug}
              className="px-4 py-2 text-xs tracking-[0.2em] uppercase bg-[#2D2D2D] text-white rounded-sm hover:opacity-90 disabled:opacity-40"
            >
              Descargar Excel
            </button>
            <button
              onClick={signOut}
              className="px-3 py-2 text-xs tracking-[0.2em] uppercase text-[#8A7E72] hover:text-[#2D2D2D]"
            >
              Salir
            </button>
          </div>
        </header>

        {showCreate && isAdmin && (
          <CreateInvitationForm
            onCreate={async (payload) => {
              await createInv({ data: payload });
              toast.success("Invitación creada.");
              setShowCreate(false);
              qc.invalidateQueries({ queryKey: ["my-invitations"] });
            }}
          />
        )}

        {invitations.length === 0 && !invQuery.isLoading ? (
          <div className="bg-white border border-[#E5DED3] rounded-sm p-8 text-center text-[#8A7E72]">
            <p>No tienes invitaciones asignadas a tu cuenta.</p>
            <p className="text-xs mt-2">Si esperabas ver una, contacta al administrador.</p>
          </div>
        ) : (
          <>
            {currentInv && (
              <div className="mb-4 text-xs text-[#8A7E72]">
                Dueño: <span className="text-[#2D2D2D]">{currentInv.owner_email}</span>
                {!currentInv.owner_user_id && (
                  <span className="ml-2 text-amber-700">· (sin reclamar — el dueño aún no se registra)</span>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <Stat label="Total respuestas" value={stats.total} />
              <Stat label="Sí asisten" value={stats.yes} accent />
              <Stat label="No asisten" value={stats.no} />
              <Stat label="Personas confirmadas" value={stats.totalGuests} accent />
            </div>

            <div className="bg-white border border-[#E5DED3] rounded-sm overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#F7F3EE] text-[10px] tracking-[0.2em] uppercase text-[#8A7E72]">
                  <tr>
                    <th className="text-left px-4 py-3">Fecha</th>
                    <th className="text-left px-4 py-3">Nombre</th>
                    <th className="text-left px-4 py-3">Asiste</th>
                    <th className="text-left px-4 py-3">Personas</th>
                    <th className="text-left px-4 py-3">Mensaje</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan={5} className="px-4 py-8 text-center text-[#8A7E72]">Cargando...</td></tr>
                  ) : rows.length === 0 ? (
                    <tr><td colSpan={5} className="px-4 py-8 text-center text-[#8A7E72]">Sin confirmaciones todavía.</td></tr>
                  ) : (
                    rows.map((r) => (
                      <tr key={r.id} className="border-t border-[#F0E9DE]">
                        <td className="px-4 py-3 whitespace-nowrap text-[#8A7E72]">
                          {new Date(r.created_at).toLocaleString("es-MX")}
                        </td>
                        <td className="px-4 py-3 font-medium text-[#2D2D2D]">{r.name}</td>
                        <td className="px-4 py-3">
                          <span className={r.attending === "yes" ? "text-emerald-700" : "text-rose-700"}>
                            {r.attending === "yes" ? "Sí" : "No"}
                          </span>
                        </td>
                        <td className="px-4 py-3">{r.guests}</td>
                        <td className="px-4 py-3 text-[#5a5249] max-w-md">{r.message}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function CreateInvitationForm({
  onCreate,
}: {
  onCreate: (p: { slug: string; couple_names: string; owner_email: string; event_date?: string | null }) => Promise<void>;
}) {
  const [form, setForm] = useState({ slug: "", couple_names: "", owner_email: "", event_date: "" });
  const [busy, setBusy] = useState(false);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        try {
          await onCreate({
            slug: form.slug.trim().toLowerCase(),
            couple_names: form.couple_names.trim(),
            owner_email: form.owner_email.trim().toLowerCase(),
            event_date: form.event_date || null,
          });
          setForm({ slug: "", couple_names: "", owner_email: "", event_date: "" });
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Error");
        } finally {
          setBusy(false);
        }
      }}
      className="bg-white border border-[#D4AF37]/40 rounded-sm p-5 mb-6 grid sm:grid-cols-2 gap-3"
    >
      <div className="sm:col-span-2">
        <p className="text-xs tracking-[0.25em] uppercase text-[#8A7E72] mb-3">Nueva invitación</p>
      </div>
      <Field label="Slug (URL)" hint="ej: ana-juan">
        <input
          required
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          pattern="[a-z0-9-]+"
          className="w-full border border-[#E5DED3] rounded-sm px-3 py-2 text-sm"
          placeholder="ana-juan"
        />
      </Field>
      <Field label="Nombres de la pareja">
        <input
          required
          value={form.couple_names}
          onChange={(e) => setForm({ ...form, couple_names: e.target.value })}
          className="w-full border border-[#E5DED3] rounded-sm px-3 py-2 text-sm"
          placeholder="Ana & Juan"
        />
      </Field>
      <Field label="Correo del dueño" hint="Con este correo deberán registrarse en /auth">
        <input
          required
          type="email"
          value={form.owner_email}
          onChange={(e) => setForm({ ...form, owner_email: e.target.value })}
          className="w-full border border-[#E5DED3] rounded-sm px-3 py-2 text-sm"
          placeholder="cliente@correo.com"
        />
      </Field>
      <Field label="Fecha del evento (opcional)">
        <input
          type="date"
          value={form.event_date}
          onChange={(e) => setForm({ ...form, event_date: e.target.value })}
          className="w-full border border-[#E5DED3] rounded-sm px-3 py-2 text-sm"
        />
      </Field>
      <div className="sm:col-span-2 flex justify-end">
        <button
          type="submit"
          disabled={busy}
          className="px-5 py-2 text-xs tracking-[0.25em] uppercase bg-[#D4AF37] text-white rounded-sm hover:opacity-90 disabled:opacity-50"
        >
          {busy ? "Creando..." : "Crear invitación"}
        </button>
      </div>
    </form>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] tracking-[0.25em] uppercase text-[#8A7E72]">{label}</span>
      {children}
      {hint && <span className="block text-[11px] text-[#8A7E72] mt-1">{hint}</span>}
    </label>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className={`rounded-sm p-4 border ${accent ? "bg-[#D4AF37]/10 border-[#D4AF37]/30" : "bg-white border-[#E5DED3]"}`}>
      <p className="text-[10px] tracking-[0.25em] uppercase text-[#8A7E72]">{label}</p>
      <p className="font-serif text-3xl text-[#2D2D2D] mt-1">{value}</p>
    </div>
  );
}
