import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BLCK Social — Invitaciones digitales" },
      {
        name: "description",
        content:
          "Acceso privado a invitaciones digitales BLCK Social. Ingresa con el enlace que recibiste.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: InvitationsIndex,
});

function InvitationsIndex() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F3EE] text-[#2D2D2D] px-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#D4AF37]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#C4A77D]/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center animate-fade-up max-w-lg">
        <div className="ornament mb-8">BLCK Social</div>

        <h1 className="font-serif text-4xl sm:text-6xl tracking-tight leading-[0.95] mb-6">
          Invitaciones
          <br />
          <span className="text-gold">privadas</span>
        </h1>

        <p className="font-sans text-sm sm:text-base tracking-[0.2em] uppercase text-[#8A7E72] leading-relaxed">
          Este espacio es de acceso exclusivo.
          <br />
          Ingresa con el enlace personal que recibiste.
        </p>

        <div className="mt-10 w-16 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

        <a
          href="https://blcksocial.com"
          className="mt-10 text-xs tracking-[0.25em] uppercase text-[#8A7E72] hover:text-[#D4AF37] transition-colors"
        >
          Visitar blcksocial.com →
        </a>
      </div>
    </div>
  );
}
