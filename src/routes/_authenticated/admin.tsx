import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { listRsvps, listMyInvitations, createInvitation, listInvitationRequests, updateInvitationRequestStatus } from "@/lib/rsvp-admin.functions";
import { submitChangeRequest, listMyChangeRequests, listAllChangeRequests, updateChangeRequest } from "@/lib/change-requests.functions";
import { listInvitationSends, createInvitationSend, markInvitationSendSent, deleteInvitationSend } from "@/lib/invitation-sends.functions";
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
  package_tier?: "plata" | "oro" | "diamante";
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

  const invitations: Invitation[] = (invQuery.data?.invitations ?? []) as Invitation[];
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
              disabled={!slug || currentInv?.package_tier === "plata"}
              className="px-3 py-2 text-xs tracking-[0.2em] uppercase border border-[#E5DED3] rounded-sm hover:bg-white disabled:opacity-40"
            >
              {isFetching ? "..." : "Refrescar"}
            </button>
            <button
              onClick={downloadExcel}
              disabled={!slug || currentInv?.package_tier === "plata"}
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

        {showEditor && slug && (
          <div className="mb-6">
            <InvitationEditor slug={slug} />
          </div>
        )}

        {isAdmin && <NewRequestsSection />}
        {isAdmin && <ChangeRequestsAdminSection />}

        {slug && !isAdmin && <OwnerSendInvitationSection slug={slug} />}
        {slug && !isAdmin && <OwnerChangeRequestSection slug={slug} />}




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

            {currentInv?.package_tier === "plata" ? (
              <div className="bg-white border border-[#E5DED3] rounded-sm p-8 text-center text-[#8A7E72]">
                <p className="text-sm">El paquete <span className="text-[#D4AF37] tracking-[0.2em] uppercase">Plata</span> no incluye panel de confirmaciones.</p>
                <p className="text-xs mt-2">Las confirmaciones llegan directo al WhatsApp configurado en la invitación.</p>
              </div>
            ) : (
              <>
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
          </>
        )}
      </div>
    </div>
  );
}

function CreateInvitationForm({
  onCreate,
}: {
  onCreate: (p: { slug: string; couple_names: string; owner_email: string; event_date?: string | null; package_tier: "plata" | "oro" | "diamante" }) => Promise<void>;
}) {
  const [form, setForm] = useState<{ slug: string; couple_names: string; owner_email: string; event_date: string; package_tier: "plata" | "oro" | "diamante" }>({ slug: "", couple_names: "", owner_email: "", event_date: "", package_tier: "oro" });
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
            package_tier: form.package_tier,
          });
          setForm({ slug: "", couple_names: "", owner_email: "", event_date: "", package_tier: "oro" });
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
      <Field label="Paquete">
        <select
          value={form.package_tier}
          onChange={(e) => setForm({ ...form, package_tier: e.target.value as "plata" | "oro" | "diamante" })}
          className="w-full border border-[#E5DED3] rounded-sm px-3 py-2 text-sm bg-white"
        >
          <option value="plata">Plata</option>
          <option value="oro">Oro</option>
          <option value="diamante">Diamante</option>
        </select>
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

type RequestRow = {
  id: string;
  package_tier: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  couple_names: string | null;
  event_date: string | null;
  payload: Record<string, unknown> | null;
  status: string;
  created_at: string;
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente",
  in_progress: "En proceso",
  done: "Lista",
  archived: "Archivada",
};

function NewRequestsSection() {
  const qc = useQueryClient();
  const fetchRequests = useServerFn(listInvitationRequests);
  const updateStatus = useServerFn(updateInvitationRequestStatus);
  const [open, setOpen] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("pending");

  const q = useQuery({
    queryKey: ["invitation-requests"],
    queryFn: () => fetchRequests(),
  });

  const rows: RequestRow[] = (q.data?.rows ?? []) as RequestRow[];
  const filtered = filter === "all" ? rows : rows.filter((r) => r.status === filter);
  const pendingCount = rows.filter((r) => r.status === "pending").length;

  const setStatus = async (id: string, status: "pending" | "in_progress" | "done" | "archived") => {
    try {
      await updateStatus({ data: { id, status } });
      toast.success("Solicitud actualizada.");
      qc.invalidateQueries({ queryKey: ["invitation-requests"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
    }
  };

  return (
    <div className="mb-8 bg-white border border-[#D4AF37]/40 rounded-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 border-b border-[#F0E9DE]"
      >
        <div className="flex items-center gap-3">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37]">Solicitudes nuevas</span>
          {pendingCount > 0 && (
            <span className="text-[10px] tracking-[0.2em] uppercase bg-[#D4AF37] text-white px-2 py-0.5 rounded-sm">
              {pendingCount} pendientes
            </span>
          )}
        </div>
        <span className="text-xs text-[#8A7E72]">{open ? "Ocultar" : "Mostrar"}</span>
      </button>

      {open && (
        <div className="p-5">
          <div className="flex flex-wrap gap-2 mb-4">
            {(["pending", "in_progress", "done", "archived", "all"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 text-[10px] tracking-[0.2em] uppercase rounded-sm border ${
                  filter === s
                    ? "bg-[#2D2D2D] text-white border-[#2D2D2D]"
                    : "bg-white text-[#8A7E72] border-[#E5DED3] hover:border-[#2D2D2D]"
                }`}
              >
                {s === "all" ? "Todas" : STATUS_LABELS[s]}
              </button>
            ))}
          </div>

          {q.isLoading ? (
            <p className="text-sm text-[#8A7E72] text-center py-6">Cargando...</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-[#8A7E72] text-center py-6">Sin solicitudes en este estado.</p>
          ) : (
            <div className="space-y-3">
              {filtered.map((r) => {
                const isOpen = expanded === r.id;
                return (
                  <div key={r.id} className="border border-[#E5DED3] rounded-sm">
                    <div className="flex flex-wrap items-start justify-between gap-3 p-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] tracking-[0.25em] uppercase text-[#D4AF37]">
                            {r.package_tier}
                          </span>
                          <span className="text-[10px] tracking-[0.2em] uppercase text-[#8A7E72]">
                            · {STATUS_LABELS[r.status] ?? r.status}
                          </span>
                        </div>
                        <p className="font-serif text-lg text-[#2D2D2D] mt-1">
                          {r.couple_names || r.contact_name}
                        </p>
                        <p className="text-xs text-[#8A7E72] mt-0.5">
                          {r.contact_name} · {r.contact_email}
                          {r.contact_phone ? ` · ${r.contact_phone}` : ""}
                        </p>
                        <p className="text-[11px] text-[#8A7E72] mt-1">
                          Recibida: {new Date(r.created_at).toLocaleString("es-MX")}
                          {r.event_date ? ` · Evento: ${r.event_date}` : ""}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => setExpanded(isOpen ? null : r.id)}
                          className="px-3 py-1.5 text-[10px] tracking-[0.2em] uppercase border border-[#E5DED3] rounded-sm hover:bg-[#F7F3EE]"
                        >
                          {isOpen ? "Ocultar" : "Ver detalles"}
                        </button>
                        <select
                          value={r.status}
                          onChange={(e) => setStatus(r.id, e.target.value as "pending" | "in_progress" | "done" | "archived")}
                          className="border border-[#E5DED3] rounded-sm px-2 py-1.5 text-xs bg-white"
                        >
                          <option value="pending">Pendiente</option>
                          <option value="in_progress">En proceso</option>
                          <option value="done">Lista</option>
                          <option value="archived">Archivada</option>
                        </select>
                      </div>
                    </div>
                    {isOpen && r.payload && (
                      <div className="border-t border-[#F0E9DE] bg-[#FBF8F3] p-4">
                        <pre className="text-[11px] text-[#2D2D2D] whitespace-pre-wrap break-words font-mono">
                          {JSON.stringify(r.payload, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

type ChangeRequestRow = {
  id: string;
  invitation_slug: string;
  message: string;
  status: string;
  admin_note: string | null;
  created_at: string;
  updated_at: string;
};

function OwnerChangeRequestSection({ slug }: { slug: string }) {
  const qc = useQueryClient();
  const submit = useServerFn(submitChangeRequest);
  const fetchMine = useServerFn(listMyChangeRequests);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const q = useQuery({
    queryKey: ["my-change-requests", slug],
    queryFn: () => fetchMine({ data: { invitation_slug: slug } }),
    enabled: !!slug,
  });
  const rows: ChangeRequestRow[] = (q.data?.rows ?? []) as ChangeRequestRow[];

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim().length < 3) {
      toast.error("Escribe tu solicitud.");
      return;
    }
    setBusy(true);
    try {
      await submit({ data: { invitation_slug: slug, message: message.trim() } });
      toast.success("Solicitud enviada.");
      setMessage("");
      qc.invalidateQueries({ queryKey: ["my-change-requests", slug] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mb-8 bg-white border border-[#E5DED3] rounded-sm p-5">
      <p className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37] mb-3">Solicitar un cambio</p>
      <p className="text-xs text-[#8A7E72] mb-4">
        ¿Quieres ajustar colores, textos o cualquier detalle? Escribe abajo y nuestro equipo lo verá en su panel.
      </p>
      <form onSubmit={onSubmit} className="space-y-3">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          maxLength={4000}
          placeholder="Ej: Cambiar el color rosa por uno más oscuro; corregir el nombre de mi mamá..."
          className="w-full border border-[#E5DED3] rounded-sm px-3 py-2 text-sm bg-white focus:border-[#D4AF37] outline-none"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={busy}
            className="px-5 py-2 text-xs tracking-[0.25em] uppercase bg-[#D4AF37] text-white rounded-sm hover:opacity-90 disabled:opacity-50"
          >
            {busy ? "Enviando..." : "Enviar solicitud"}
          </button>
        </div>
      </form>

      {rows.length > 0 && (
        <div className="mt-6 space-y-2">
          <p className="text-[10px] tracking-[0.25em] uppercase text-[#8A7E72]">Tus solicitudes</p>
          {rows.map((r) => (
            <div key={r.id} className="border border-[#F0E9DE] rounded-sm p-3 text-sm">
              <div className="flex items-center justify-between gap-3 mb-1">
                <span className="text-[10px] tracking-[0.25em] uppercase text-[#8A7E72]">
                  {STATUS_LABELS[r.status] ?? r.status}
                </span>
                <span className="text-[10px] text-[#8A7E72]">
                  {new Date(r.created_at).toLocaleString("es-MX")}
                </span>
              </div>
              <p className="text-[#2D2D2D] whitespace-pre-wrap">{r.message}</p>
              {r.admin_note && (
                <p className="mt-2 text-xs text-[#5a5249] bg-[#FBF8F3] border-l-2 border-[#D4AF37] pl-3 py-1">
                  <span className="text-[10px] tracking-[0.25em] uppercase text-[#8A7E72] block mb-0.5">Respuesta</span>
                  {r.admin_note}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ChangeRequestsAdminSection() {
  const qc = useQueryClient();
  const fetchAll = useServerFn(listAllChangeRequests);
  const update = useServerFn(updateChangeRequest);
  const [open, setOpen] = useState(true);
  const [filter, setFilter] = useState<string>("pending");
  const [notes, setNotes] = useState<Record<string, string>>({});

  const q = useQuery({
    queryKey: ["all-change-requests"],
    queryFn: () => fetchAll(),
  });

  const rows: ChangeRequestRow[] = (q.data?.rows ?? []) as ChangeRequestRow[];
  const filtered = filter === "all" ? rows : rows.filter((r) => r.status === filter);
  const pendingCount = rows.filter((r) => r.status === "pending").length;

  const save = async (id: string, patch: { status?: "pending" | "in_progress" | "done" | "archived"; admin_note?: string }) => {
    try {
      await update({ data: { id, ...patch } });
      toast.success("Solicitud actualizada.");
      qc.invalidateQueries({ queryKey: ["all-change-requests"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
    }
  };

  return (
    <div className="mb-8 bg-white border border-[#D4AF37]/40 rounded-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 border-b border-[#F0E9DE]"
      >
        <div className="flex items-center gap-3">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37]">Ajustes solicitados</span>
          {pendingCount > 0 && (
            <span className="text-[10px] tracking-[0.2em] uppercase bg-[#D4AF37] text-white px-2 py-0.5 rounded-sm">
              {pendingCount} pendientes
            </span>
          )}
        </div>
        <span className="text-xs text-[#8A7E72]">{open ? "Ocultar" : "Mostrar"}</span>
      </button>

      {open && (
        <div className="p-5">
          <div className="flex flex-wrap gap-2 mb-4">
            {(["pending", "in_progress", "done", "archived", "all"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 text-[10px] tracking-[0.2em] uppercase rounded-sm border ${
                  filter === s
                    ? "bg-[#2D2D2D] text-white border-[#2D2D2D]"
                    : "bg-white text-[#8A7E72] border-[#E5DED3] hover:border-[#2D2D2D]"
                }`}
              >
                {s === "all" ? "Todas" : STATUS_LABELS[s]}
              </button>
            ))}
          </div>

          {q.isLoading ? (
            <p className="text-sm text-[#8A7E72] text-center py-6">Cargando...</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-[#8A7E72] text-center py-6">Sin solicitudes en este estado.</p>
          ) : (
            <div className="space-y-3">
              {filtered.map((r) => (
                <div key={r.id} className="border border-[#E5DED3] rounded-sm p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                    <div>
                      <p className="text-[10px] tracking-[0.25em] uppercase text-[#D4AF37]">
                        {r.invitation_slug}
                      </p>
                      <p className="text-[11px] text-[#8A7E72] mt-0.5">
                        {new Date(r.created_at).toLocaleString("es-MX")} · {STATUS_LABELS[r.status] ?? r.status}
                      </p>
                    </div>
                    <select
                      value={r.status}
                      onChange={(e) => save(r.id, { status: e.target.value as "pending" | "in_progress" | "done" | "archived" })}
                      className="border border-[#E5DED3] rounded-sm px-2 py-1.5 text-xs bg-white"
                    >
                      <option value="pending">Pendiente</option>
                      <option value="in_progress">En proceso</option>
                      <option value="done">Lista</option>
                      <option value="archived">Archivada</option>
                    </select>
                  </div>
                  <p className="text-sm text-[#2D2D2D] whitespace-pre-wrap mb-3">{r.message}</p>
                  <div className="border-t border-[#F0E9DE] pt-3">
                    <p className="text-[10px] tracking-[0.25em] uppercase text-[#8A7E72] mb-1">Nota interna / respuesta</p>
                    <textarea
                      value={notes[r.id] ?? r.admin_note ?? ""}
                      onChange={(e) => setNotes((n) => ({ ...n, [r.id]: e.target.value }))}
                      rows={2}
                      className="w-full border border-[#E5DED3] rounded-sm px-3 py-2 text-sm bg-white focus:border-[#D4AF37] outline-none"
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={() => save(r.id, { admin_note: notes[r.id] ?? r.admin_note ?? "" })}
                        className="px-3 py-1.5 text-[10px] tracking-[0.25em] uppercase border border-[#2D2D2D] text-[#2D2D2D] rounded-sm hover:bg-[#2D2D2D] hover:text-white transition-colors"
                      >
                        Guardar nota
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

type SendRow = {
  id: string;
  invitation_slug: string;
  phone: string;
  guest_name: string | null;
  guests_allowed: number;
  token: string;
  sent_at: string | null;
  created_at: string;
};

function OwnerSendInvitationSection({ slug }: { slug: string }) {
  const qc = useQueryClient();
  const list = useServerFn(listInvitationSends);
  const create = useServerFn(createInvitationSend);
  const markSent = useServerFn(markInvitationSendSent);
  const remove = useServerFn(deleteInvitationSend);

  const [phone, setPhone] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guests, setGuests] = useState<number>(2);
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const q = useQuery({
    queryKey: ["invitation-sends", slug],
    queryFn: () => list({ data: { invitation_slug: slug } }),
    enabled: !!slug,
  });
  const rows: SendRow[] = (q.data?.rows ?? []) as SendRow[];

  const normalizePhone = (raw: string) => raw.replace(/[^\d]/g, "");

  const addEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    const p = normalizePhone(phone);
    if (p.length < 10) {
      toast.error("Ingresa un número válido con lada.");
      return;
    }
    setBusy(true);
    try {
      await create({
        data: {
          invitation_slug: slug,
          phone: p,
          guest_name: guestName.trim() || null,
          guests_allowed: guests,
        },
      });
      setPhone("");
      setGuestName("");
      setGuests(2);
      qc.invalidateQueries({ queryKey: ["invitation-sends", slug] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setBusy(false);
    }
  };

  const removeEntry = async (id: string) => {
    try {
      await remove({ data: { id } });
      qc.invalidateQueries({ queryKey: ["invitation-sends", slug] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
    }
  };

  const buildMessage = (row: SendRow) => {
    const url = `${window.location.origin}/${slug}?i=${row.token}`;
    const saludo = row.guest_name ? `¡Hola, ${row.guest_name}!` : "¡Hola!";
    const lugares = row.guests_allowed === 1 ? "1 lugar reservado" : `${row.guests_allowed} lugares reservados`;
    return `${saludo} Te comparto nuestra invitación. Tienes ${lugares} a tu nombre. Confírmanos tu asistencia por favor 💌\n\n${url}`;
  };

  const sendEntry = async (row: SendRow) => {
    const url = `https://wa.me/${row.phone}?text=${encodeURIComponent(buildMessage(row))}`;
    window.open(url, "_blank", "noopener,noreferrer");
    try {
      await markSent({ data: { id: row.id } });
      qc.invalidateQueries({ queryKey: ["invitation-sends", slug] });
    } catch {
      // best effort
    }
    setConfirmation(`Tu invitación ha sido enviada a +${row.phone}.`);
    window.setTimeout(() => setConfirmation(null), 4000);
  };

  const totalGuests = rows.reduce((acc, r) => acc + (r.guests_allowed || 0), 0);

  return (
    <div className="mb-8 bg-white border border-[#E5DED3] rounded-sm p-5">
      <p className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37] mb-3">Enviar invitación por WhatsApp</p>
      <p className="text-xs text-[#8A7E72] mb-4">
        Agrega los números a los que quieres enviar la invitación y la cantidad de invitados autorizados para cada uno. Cada envío genera un enlace único que valida automáticamente el máximo de personas al confirmar.
      </p>

      <form onSubmit={addEntry} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto_auto] gap-2 mb-4">
        <input
          type="text"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          placeholder="Nombre (opcional)"
          className="border border-[#E5DED3] rounded-sm px-3 py-2 text-sm bg-white focus:border-[#D4AF37] outline-none"
        />
        <input
          type="tel"
          inputMode="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Ej: 526561234567 (con lada)"
          className="border border-[#E5DED3] rounded-sm px-3 py-2 text-sm bg-white focus:border-[#D4AF37] outline-none"
        />
        <select
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="border border-[#E5DED3] rounded-sm px-3 py-2 text-sm bg-white focus:border-[#D4AF37] outline-none"
          aria-label="Cantidad de invitados autorizados"
        >
          {Array.from({ length: 15 }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? "invitado" : "invitados"}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={busy}
          className="px-5 py-2 text-xs tracking-[0.25em] uppercase bg-[#2D2D2D] text-white rounded-sm hover:opacity-90 disabled:opacity-50"
        >
          {busy ? "..." : "Agregar"}
        </button>
      </form>

      {confirmation && (
        <div className="mb-4 border border-[#D4AF37] bg-[#FBF6E7] text-[#8A6D1A] rounded-sm px-4 py-3 text-sm">
          ✓ {confirmation}
        </div>
      )}

      {q.isLoading ? (
        <p className="text-sm text-[#8A7E72] text-center py-6">Cargando...</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-[#8A7E72] text-center py-6 border border-dashed border-[#E5DED3] rounded-sm">
          Aún no has agregado números.
        </p>
      ) : (
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] tracking-[0.25em] uppercase text-[#8A7E72] px-1">
            <span>{rows.length} {rows.length === 1 ? "envío" : "envíos"}</span>
            <span>{totalGuests} invitados totales</span>
          </div>
          {rows.map((r) => (
            <div key={r.id} className="flex flex-wrap items-center gap-3 border border-[#E5DED3] rounded-sm px-3 py-2">
              <div className="flex-1 min-w-[160px]">
                <p className="text-sm text-[#2D2D2D]">
                  {r.guest_name ? <span className="font-medium">{r.guest_name} · </span> : null}
                  +{r.phone}
                </p>
                <p className="text-[11px] text-[#8A7E72]">
                  {r.guests_allowed} {r.guests_allowed === 1 ? "invitado" : "invitados"}
                  {r.sent_at && ` · enviado ${new Date(r.sent_at).toLocaleString("es-MX")}`}
                </p>
              </div>
              <button
                onClick={() => sendEntry(r)}
                className="px-4 py-1.5 text-[10px] tracking-[0.25em] uppercase bg-[#25D366] text-white rounded-sm hover:opacity-90"
              >
                {r.sent_at ? "Reenviar" : "Enviar"}
              </button>
              <button
                onClick={() => removeEntry(r.id)}
                className="px-3 py-1.5 text-[10px] tracking-[0.25em] uppercase border border-[#E5DED3] text-[#8A7E72] rounded-sm hover:border-[#2D2D2D] hover:text-[#2D2D2D]"
              >
                Quitar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
