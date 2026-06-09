import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BLCK Social — Coming Soon" },
      { name: "description", content: "Invitaciones digitales de lujo para bodas inolvidables. Muy pronto." },
    ],
  }),
  component: ComingSoonPage,
});

function ComingSoonPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F3EE] text-[#2D2D2D] px-6 relative overflow-hidden">
      {/* Decorative blurred gold orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#D4AF37]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#C4A77D]/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center animate-fade-up">
        <div className="ornament mb-8">BLCK Social</div>

        <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl tracking-tight leading-[0.95] mb-6">
          Coming
          <br />
          <span className="text-gold">Soon</span>
        </h1>

        <p className="font-sans text-sm sm:text-base tracking-[0.25em] uppercase text-[#8A7E72] max-w-md leading-relaxed">
          Invitaciones digitales de lujo
          <br />
          para momentos inolvidables
        </p>

        <div className="mt-10 w-16 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
      </div>
    </div>
  );
}
