import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Acceso · BLCK Social" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Cuenta creada. Ya puedes iniciar sesión.");
        setMode("login");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/admin" });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error de autenticación";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F3EE] px-6">
      <div className="w-full max-w-sm">
        <Link to="/" className="block text-center text-xs tracking-[0.3em] uppercase text-[#8A7E72] mb-8">
          BLCK Social
        </Link>
        <div className="bg-white border border-[#E5DED3] rounded-sm p-8 shadow-sm">
          <h1 className="font-serif text-2xl text-center mb-1 text-[#2D2D2D]">
            {mode === "login" ? "Acceso admin" : "Crear cuenta"}
          </h1>
          <p className="text-center text-xs tracking-[0.2em] uppercase text-[#8A7E72] mb-6">
            Solo para los novios
          </p>
          <form onSubmit={onSubmit} className="space-y-4">
            <label className="block">
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#8A7E72]">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full bg-transparent border-b border-[#E5DED3] focus:border-[#D4AF37] outline-none py-2"
              />
            </label>
            <label className="block">
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#8A7E72]">Contraseña</span>
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
              {loading ? "Espera..." : mode === "login" ? "Entrar" : "Crear cuenta"}
            </button>
          </form>
          <button
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="mt-4 w-full text-xs tracking-[0.2em] uppercase text-[#8A7E72] hover:text-[#D4AF37] transition-colors"
          >
            {mode === "login" ? "¿Primera vez? Crear cuenta" : "Ya tengo cuenta · Entrar"}
          </button>
          {mode === "login" && (
            <button
              onClick={async () => {
                if (!email) {
                  toast.error("Escribe tu email primero");
                  return;
                }
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                  redirectTo: `${window.location.origin}/reset-password`,
                });
                if (error) toast.error(error.message);
                else toast.success("Te enviamos un enlace para restablecer tu contraseña");
              }}
              className="mt-2 w-full text-xs tracking-[0.2em] uppercase text-[#8A7E72] hover:text-[#D4AF37] transition-colors"
            >
              Olvidé mi contraseña
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
