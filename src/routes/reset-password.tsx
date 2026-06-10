import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Restablecer contraseña · BLCK Social" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase handles the recovery token from the URL hash automatically
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
      else {
        // give it a moment for the recovery event to fire
        const t = setTimeout(() => setReady(true), 600);
        return () => clearTimeout(t);
      }
    });
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Contraseña actualizada. Ya puedes entrar.");
      await supabase.auth.signOut();
      navigate({ to: "/auth" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al actualizar";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F3EE] px-6">
      <div className="w-full max-w-sm">
        <div className="bg-white border border-[#E5DED3] rounded-sm p-8 shadow-sm">
          <h1 className="font-serif text-2xl text-center mb-1 text-[#2D2D2D]">
            Nueva contraseña
          </h1>
          <p className="text-center text-xs tracking-[0.2em] uppercase text-[#8A7E72] mb-6">
            Define tu nueva clave
          </p>
          {!ready ? (
            <p className="text-center text-xs text-[#8A7E72]">Cargando...</p>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <label className="block">
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#8A7E72]">
                  Nueva contraseña
                </span>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1.5 w-full bg-transparent border-b border-[#E5DED3] focus:border-[#D4AF37] outline-none py-2"
                />
              </label>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#2D2D2D] text-white tracking-[0.2em] uppercase text-xs rounded-full hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {loading ? "Guardando..." : "Guardar"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
