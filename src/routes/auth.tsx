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

// El sitio público siempre debe recibir los enlaces de acceso.
// Los dominios de vista previa de Lovable exigen cuenta propia y muestran "Acceso denegado".
const PUBLIC_SITE = "https://invitaciones.blcksocial.com";

function publicOrigin(): string {
  if (typeof window === "undefined") return PUBLIC_SITE;
  const host = window.location.hostname;
  const isPreview = host.includes("lovable.app") || host.includes("lovableproject.com");
  return isPreview ? PUBLIC_SITE : window.location.origin;
}

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"magic" | "login" | "signup">("magic");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  // Aviso claro cuando el enlace del correo ya venció o fue usado
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.hash.replace(/^#/, "") || window.location.search);
    const err = params.get("error") || params.get("error_code");
    if (!err) return;
    const expired = /otp_expired|access_denied/i.test(err);
    toast.error(
      expired
        ? "El enlace de acceso ya venció o fue usado. Pide uno nuevo con tu correo."
        : params.get("error_description") || "No pudimos validar el enlace de acceso.",
    );
    window.history.replaceState({}, "", window.location.pathname);
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "magic") {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: { emailRedirectTo: `${publicOrigin()}/admin` },
        });
        if (error) throw error;
        setSent(true);
        toast.success("Te enviamos un enlace de acceso a tu correo.");
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${publicOrigin()}/admin` },
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
            {mode === "magic" ? "Acceso" : mode === "login" ? "Acceso con contraseña" : "Crear cuenta"}
          </h1>
          <p className="text-center text-xs tracking-[0.2em] uppercase text-[#8A7E72] mb-6">
            {mode === "magic" ? "Sin contraseña" : "Solo para los novios"}
          </p>

          {mode === "magic" && sent ? (
            <div className="text-center space-y-4">
              <p className="text-sm text-[#5a5249]">
                Revisa tu correo <span className="text-[#2D2D2D]">{email}</span> y abre el enlace para entrar.
              </p>
              <button
                onClick={() => setSent(false)}
                className="text-xs tracking-[0.2em] uppercase text-[#8A7E72] hover:text-[#D4AF37] transition-colors"
              >
                Usar otro correo
              </button>
            </div>
          ) : (
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
              {mode !== "magic" && (
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
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#2D2D2D] text-white tracking-[0.2em] uppercase text-xs rounded-full hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {loading
                  ? "Espera..."
                  : mode === "magic"
                    ? "Enviarme enlace de acceso"
                    : mode === "login"
                      ? "Entrar"
                      : "Crear cuenta"}
              </button>
            </form>
          )}

          <div className="mt-4 space-y-2">
            {mode !== "magic" && (
              <button
                onClick={() => { setMode("magic"); setSent(false); }}
                className="w-full text-xs tracking-[0.2em] uppercase text-[#8A7E72] hover:text-[#D4AF37] transition-colors"
              >
                Entrar sin contraseña
              </button>
            )}
            {mode === "magic" && (
              <button
                onClick={() => setMode("login")}
                className="w-full text-xs tracking-[0.2em] uppercase text-[#8A7E72] hover:text-[#D4AF37] transition-colors"
              >
                Prefiero usar contraseña
              </button>
            )}
            {mode === "login" && (
              <button
                onClick={() => setMode("signup")}
                className="w-full text-xs tracking-[0.2em] uppercase text-[#8A7E72] hover:text-[#D4AF37] transition-colors"
              >
                ¿Primera vez? Crear cuenta
              </button>
            )}
            {mode === "signup" && (
              <button
                onClick={() => setMode("login")}
                className="w-full text-xs tracking-[0.2em] uppercase text-[#8A7E72] hover:text-[#D4AF37] transition-colors"
              >
                Ya tengo cuenta · Entrar
              </button>
            )}
            {mode === "login" && (
              <button
                onClick={async () => {
                  if (!email) {
                    toast.error("Escribe tu email primero");
                    return;
                  }
                  const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${publicOrigin()}/reset-password`,
                  });
                  if (error) toast.error(error.message);
                  else toast.success("Te enviamos un enlace para restablecer tu contraseña");
                }}
                className="w-full text-xs tracking-[0.2em] uppercase text-[#8A7E72] hover:text-[#D4AF37] transition-colors"
              >
                Olvidé mi contraseña
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

