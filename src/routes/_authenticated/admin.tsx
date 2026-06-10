import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { listRsvps } from "@/lib/rsvp-admin.functions";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin · Confirmaciones" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

const INVITATIONS = [
  { slug: "luis-leo", label: "Luis & Leo" },
];

type Rsvp = {
  id: string;
  invitation_slug: string;
  name: string;
  attending: string;
  guests: number;
  message: string | null;
  created_at: string;
};

function AdminPage() {
  const navigate = useNavigate();
  const [slug, setSlug] = useState(INVITATIONS[0].slug);
  const fetchList = useServerFn(listRsvps);

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["rsvps", slug],
    queryFn: () => fetchList({ data: { invitation_slug: slug } }),
  });

  const rows: Rsvp[] = data?.rows ?? [];

  const stats = useMemo(() => {
    const yes = rows.filter((r) => r.attending === "yes");
    const no = rows.filter((r) => r.attending === "no");
    const totalGuests = yes.reduce((acc, r) => acc + (r.guests || 0), 0) + yes.length;
    return { total: rows.length, yes: yes.length, no: no.length, totalGuests };
  }, [rows]);

  const downloadExcel = () => {
    if (!rows.length) {
      toast.info("No hay confirmaciones aún.");
      return;
    }
    const headers = ["Fecha", "Nombre", "Asiste", "Acompañantes", "Mensaje"];
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
    // BOM for Excel UTF-8 compatibility
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
          </div>
          <div className="flex items-center gap-3">
            <select
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="bg-white border border-[#E5DED3] rounded-sm px-3 py-2 text-sm"
            >
              {INVITATIONS.map((i) => (
                <option key={i.slug} value={i.slug}>{i.label}</option>
              ))}
            </select>
            <button
              onClick={() => refetch()}
              className="px-3 py-2 text-xs tracking-[0.2em] uppercase border border-[#E5DED3] rounded-sm hover:bg-white"
            >
              {isFetching ? "..." : "Refrescar"}
            </button>
            <button
              onClick={downloadExcel}
              className="px-4 py-2 text-xs tracking-[0.2em] uppercase bg-[#2D2D2D] text-white rounded-sm hover:opacity-90"
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Stat label="Total" value={stats.total} />
          <Stat label="Sí asisten" value={stats.yes} accent />
          <Stat label="No asisten" value={stats.no} />
          <Stat label="Personas (con +1)" value={stats.totalGuests} accent />
        </div>

        <div className="bg-white border border-[#E5DED3] rounded-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F7F3EE] text-[10px] tracking-[0.2em] uppercase text-[#8A7E72]">
              <tr>
                <th className="text-left px-4 py-3">Fecha</th>
                <th className="text-left px-4 py-3">Nombre</th>
                <th className="text-left px-4 py-3">Asiste</th>
                <th className="text-left px-4 py-3">Acomp.</th>
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
      </div>
    </div>
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
