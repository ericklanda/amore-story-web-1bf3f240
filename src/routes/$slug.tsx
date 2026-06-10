import { createFileRoute, notFound, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { submitRsvp } from "@/lib/rsvp.functions";
import { getPublicInvitation, type InvitationDTO } from "@/lib/invitation.functions";

const invitationQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["public-invitation", slug],
    queryFn: () => getPublicInvitation({ data: { slug } }),
    staleTime: 60_000,
  });

export const Route = createFileRoute("/$slug")({
  // ssr off — uses runtime client navigation, simpler interactions w/ animations
  loader: async ({ params, context }) => {
    if (params.slug === "luis-leo" || params.slug === "auth" || params.slug === "admin" || params.slug === "reset-password") {
      // these are owned by other routes; should not match this dynamic in practice,
      // but guard anyway.
      throw notFound();
    }
    await context.queryClient.ensureQueryData(invitationQueryOptions(params.slug));
  },
  head: ({ params }) => ({
    meta: [
      { title: `Invitación · ${params.slug}` },
      { property: "og:title", content: `Invitación · ${params.slug}` },
    ],
  }),
  component: PublicInvitationPage,
  notFoundComponent: NotFoundInvitation,
  errorComponent: ErrorInvitation,
});

function NotFoundInvitation() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F3EE] px-6 text-center">
      <div>
        <p className="text-xs tracking-[0.3em] uppercase text-[#8A7E72] mb-3">BLCK Social</p>
        <h1 className="font-serif text-3xl text-[#2D2D2D] mb-2">Invitación no encontrada</h1>
        <p className="text-[#8A7E72]">Verifica el enlace o pídeselo a los novios.</p>
      </div>
    </div>
  );
}

function ErrorInvitation({ error }: { error: Error }) {
  const router = useRouter();
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F3EE] px-6 text-center">
      <div>
        <h1 className="font-serif text-2xl text-[#2D2D2D] mb-2">No se pudo cargar</h1>
        <p className="text-[#8A7E72] mb-4">{error.message}</p>
        <button onClick={() => router.invalidate()} className="px-4 py-2 bg-[#2D2D2D] text-white text-xs tracking-[0.2em] uppercase rounded-full">
          Reintentar
        </button>
      </div>
    </div>
  );
}

function PublicInvitationPage() {
  const { slug } = Route.useParams();
  const { data: inv } = useSuspenseQuery(invitationQueryOptions(slug));
  return <Template inv={inv} />;
}

/* ============================================================
   The same elegant layout as luis-leo, fully data-driven.
   ============================================================ */

function useCountdown(target: Date | null) {
  const [now, setNow] = useState(() => new Date());
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  if (!target) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const diff = mounted ? Math.max(0, target.getTime() - now.getTime()) : 0;
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 1s ${delay}ms cubic-bezier(.22,1,.36,1), transform 1.1s ${delay}ms cubic-bezier(.22,1,.36,1)`,
      }}
    >
      {children}
    </div>
  );
}

function SectionTitle({ kicker, title }: { kicker?: string; title: string }) {
  return (
    <div className="text-center mb-12">
      {kicker && <div className="ornament mb-4">{kicker}</div>}
      <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl italic text-primary">{title}</h2>
    </div>
  );
}

function formatDatePretty(iso: string | null): string {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" });
  } catch {
    return "";
  }
}
function formatDateShort(iso: string | null): string {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    const day = String(d.getDate()).padStart(2, "0");
    const months = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
    return `${day} · ${months[d.getMonth()]} · ${d.getFullYear()}`;
  } catch {
    return "";
  }
}
function formatTime(iso: string | null): string {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString("es-MX", { hour: "numeric", minute: "2-digit" });
  } catch {
    return "";
  }
}

function Template({ inv }: { inv: InvitationDTO }) {
  const [dark, setDark] = useState(false);
  const [progress, setProgress] = useState(0);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const p = h.scrollTop / (h.scrollHeight - h.clientHeight);
      setProgress(Math.min(1, Math.max(0, p)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const eventDate = inv.event_datetime ? new Date(inv.event_datetime) : inv.event_date ? new Date(inv.event_date) : null;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <div
        className="fixed top-0 left-0 h-[2px] bg-gradient-gold z-50 transition-[width] duration-150"
        style={{ width: `${progress * 100}%` }}
      />

      <FloatingControls dark={dark} setDark={setDark} entered={entered} youtubeId={inv.youtube_song_id} />

      {!entered && <SplashOverlay inv={inv} eventDate={eventDate} onEnter={() => setEntered(true)} />}

      <Hero inv={inv} eventDate={eventDate} />
      {inv.story_milestones.length > 0 && <OurStory inv={inv} />}
      {inv.parents.length > 0 && <ParentsSection inv={inv} />}
      {inv.gallery.length > 0 && <Gallery inv={inv} />}
      {(inv.venue_name || inv.venue_address) && <EventDetails inv={inv} eventDate={eventDate} />}
      {inv.dress_code && <DressCode inv={inv} />}
      {inv.timeline.length > 0 && <Timeline inv={inv} />}
      <Rsvp inv={inv} />
      {inv.gift_registry.length > 0 && <GiftRegistry inv={inv} />}
      {inv.transportation_note && <Transportation inv={inv} />}
      {inv.hashtag && <SocialWall inv={inv} />}
      {inv.faq.length > 0 && <Faq inv={inv} />}
      <ThankYou inv={inv} eventDate={eventDate} />
    </div>
  );
}

/* ---------------- FLOATING CONTROLS ---------------- */
function FloatingControls({
  dark,
  setDark,
  entered,
  youtubeId,
}: {
  dark: boolean;
  setDark: (v: boolean) => void;
  entered: boolean;
  youtubeId: string | null;
}) {
  const [playing, setPlaying] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const sendCommand = (action: string) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func: action, args: [] }),
      "*",
    );
  };

  const toggleMusic = () => {
    const action = playing ? "pauseVideo" : "playVideo";
    sendCommand(action);
    setPlaying(!playing);
  };

  useEffect(() => {
    if (entered && youtubeId) {
      sendCommand("playVideo");
      setPlaying(true);
    }
  }, [entered, youtubeId]);

  return (
    <>
      {youtubeId && (
        <iframe
          ref={iframeRef}
          title="background-music"
          src={`https://www.youtube.com/embed/${youtubeId}?enablejsapi=1&autoplay=1&loop=1&playlist=${youtubeId}&controls=0&modestbranding=1`}
          allow="autoplay"
          style={{ position: "fixed", width: 1, height: 1, opacity: 0, pointerEvents: "none", border: 0 }}
        />
      )}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-2.5">
        {youtubeId && (
          <button
            onClick={toggleMusic}
            aria-label="Reproducir música"
            className="w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-soft flex items-center justify-center hover:scale-110 transition-transform"
          >
            {playing ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            )}
          </button>
        )}
        <button
          onClick={() => setDark(!dark)}
          aria-label="Cambiar tema"
          className="w-12 h-12 rounded-full bg-card border border-border text-foreground shadow-card flex items-center justify-center hover:scale-110 transition-transform"
        >
          {dark ? "☀" : "☾"}
        </button>
      </div>
    </>
  );
}

/* ---------------- SPLASH OVERLAY ---------------- */
function SplashOverlay({ inv, eventDate, onEnter }: { inv: InvitationDTO; eventDate: Date | null; onEnter: () => void }) {
  const [fading, setFading] = useState(false);
  const handleEnter = () => {
    setFading(true);
    setTimeout(onEnter, 800);
  };
  return (
    <div
      className={`fixed inset-0 z-[60] flex flex-col items-center justify-center text-center px-6 transition-opacity duration-700 ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{ background: "linear-gradient(180deg, oklch(0.32 0.05 150), oklch(0.42 0.06 145))" }}
    >
      <div className="absolute inset-0 bg-primary/20" />
      <div className="relative z-10 max-w-lg">
        {eventDate && (
          <div className="ornament !text-white/80 mb-6 text-sm tracking-[0.3em]">{formatDateShort(eventDate.toISOString())}</div>
        )}
        <h1 className="font-serif italic text-5xl sm:text-6xl md:text-7xl text-white leading-[0.95] mb-4">
          {inv.groom_name ?? inv.couple_names.split(/[&y]/i)[0]?.trim()}
          <span className="font-script text-gold block text-4xl sm:text-5xl md:text-6xl my-2 not-italic">&</span>
          {inv.bride_name ?? inv.couple_names.split(/[&y]/i)[1]?.trim() ?? ""}
        </h1>
        <p className="text-white/70 text-xs tracking-[0.25em] uppercase mb-10">
          {inv.welcome_message ?? `Nos casamos${inv.city ? ` · ${inv.city}` : ""}`}
        </p>
        <p className="font-serif italic text-2xl sm:text-3xl text-white/90 mb-6">Estás invitado</p>
        <button
          onClick={handleEnter}
          className="inline-flex items-center gap-3 px-10 py-4 rounded-full bg-white/95 text-primary font-sans text-sm tracking-[0.2em] uppercase hover:bg-white transition-all hover:gap-5"
        >
          Ingresa <span>→</span>
        </button>
      </div>
    </div>
  );
}

/* ---------------- HERO ---------------- */
function Hero({ inv, eventDate }: { inv: InvitationDTO; eventDate: Date | null }) {
  const slides = useMemo(() => {
    const arr = [inv.hero_image_url, ...inv.gallery.slice(0, 2).map((g) => g.url)].filter(Boolean) as string[];
    return arr.length ? arr : [];
  }, [inv]);
  const [idx, setIdx] = useState(0);
  const { days, hours, minutes, seconds } = useCountdown(eventDate);

  useEffect(() => {
    if (slides.length < 2) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
      {slides.length === 0 && <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/60" />}
      {slides.map((src, i) => (
        <div key={i} className="absolute inset-0 transition-opacity duration-[2000ms] ease-out" style={{ opacity: i === idx ? 1 : 0 }}>
          <img
            src={src}
            alt={inv.couple_names}
            className="w-full h-full object-cover"
            style={{ transform: i === idx ? "scale(1.06)" : "scale(1)", transition: "transform 8s ease-out" }}
            fetchPriority={i === 0 ? "high" : "auto"}
          />
        </div>
      ))}
      <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 text-white">
        {eventDate && (
          <Reveal delay={200}>
            <div className="ornament !text-white/90 mb-6">{formatDateShort(eventDate.toISOString())}</div>
          </Reveal>
        )}
        <Reveal delay={400}>
          <h1 className="font-serif italic text-5xl sm:text-6xl md:text-8xl lg:text-9xl leading-[0.95]">
            {inv.groom_name ?? inv.couple_names.split(/[&y]/i)[0]?.trim()}
            <span className="font-script text-gold block text-4xl sm:text-5xl md:text-6xl my-2 not-italic">&</span>
            {inv.bride_name ?? inv.couple_names.split(/[&y]/i)[1]?.trim() ?? ""}
          </h1>
        </Reveal>
        <Reveal delay={700}>
          <p className="mt-6 max-w-md font-sans text-xs sm:text-sm tracking-[0.25em] uppercase text-white/85">
            Nos casamos{inv.city ? ` · ${inv.city}` : ""}
          </p>
        </Reveal>

        {eventDate && (
          <Reveal delay={900}>
            <div className="mt-10 grid grid-cols-4 gap-3 sm:gap-5">
              {[
                { label: "Días", v: days },
                { label: "Hrs", v: hours },
                { label: "Min", v: minutes },
                { label: "Seg", v: seconds },
              ].map((t) => (
                <div key={t.label} className="text-center">
                  <div className="font-serif text-3xl sm:text-5xl text-white tabular-nums">
                    {String(t.v).padStart(2, "0")}
                  </div>
                  <div className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-white/70 mt-1">{t.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        <Reveal delay={1100}>
          <a
            href="#historia"
            className="mt-10 inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-white/95 text-primary font-sans text-sm tracking-[0.2em] uppercase hover:bg-white transition-all hover:gap-5"
          >
            Ver invitación <span>→</span>
          </a>
        </Reveal>
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Foto ${i + 1}`}
              className="w-8 h-[2px] transition-all"
              style={{ backgroundColor: i === idx ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.35)" }}
            />
          ))}
        </div>
      )}
    </section>
  );
}

/* ---------------- OUR STORY ---------------- */
function OurStory({ inv }: { inv: InvitationDTO }) {
  return (
    <section id="historia" className="py-24 md:py-36 px-6 bg-gradient-blush">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <SectionTitle kicker="Nuestra historia" title="El camino que nos trajo aquí" />
        </Reveal>

        {inv.story_image_url && (
          <Reveal delay={150}>
            <div className="mb-16 overflow-hidden rounded-sm shadow-soft">
              <img src={inv.story_image_url} alt={inv.couple_names} className="w-full aspect-[16/10] object-cover" loading="lazy" />
            </div>
          </Reveal>
        )}

        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-accent to-transparent" />
          {inv.story_milestones.map((m, i) => (
            <Reveal key={i} delay={i * 100}>
              <div className={`relative flex flex-col md:flex-row items-start gap-6 mb-14 ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}>
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 mt-2 w-3 h-3 rounded-full bg-accent ring-4 ring-background" />
                <div className="md:w-1/2 pl-12 md:pl-0 md:px-10">
                  <div className="text-xs tracking-[0.3em] uppercase text-gold mb-2">{m.date}</div>
                  <h3 className="font-serif italic text-2xl md:text-3xl text-primary mb-3">{m.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{m.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- PARENTS ---------------- */
function ParentsSection({ inv }: { inv: InvitationDTO }) {
  return (
    <section className="py-24 md:py-32 px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <SectionTitle kicker="Con amor" title="Padres y Padrinos" />
        </Reveal>
        <p className="text-center max-w-2xl mx-auto text-muted-foreground italic font-serif text-lg mb-14">
          "Con la bendición de Dios y de nuestros padres, queremos compartir contigo este día tan especial."
        </p>
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {inv.parents.map((g, i) => (
            <Reveal key={g.title} delay={i * 120}>
              <div className="bg-card border border-border rounded-sm p-8 text-center shadow-card hover:shadow-soft transition-shadow">
                <div className="ornament mb-5 !text-sm">{g.title}</div>
                {g.names.map((n) => (
                  <p key={n} className="font-serif text-xl text-primary leading-relaxed">{n}</p>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- GALLERY ---------------- */
function Gallery({ inv }: { inv: InvitationDTO }) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const items = inv.gallery;
  return (
    <section className="py-24 md:py-32 px-6 bg-gradient-blush">
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <SectionTitle kicker="Galería" title="Momentos juntos" />
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {items.map((g, i) => (
            <Reveal key={i} delay={(i % 3) * 100}>
              <button
                onClick={() => setLightbox(i)}
                className={`group block w-full overflow-hidden rounded-sm shadow-card ${i === 0 ? "md:col-span-2 md:row-span-2" : ""}`}
              >
                <img
                  src={g.url}
                  alt={g.caption ?? `Foto ${i + 1}`}
                  className="w-full h-full aspect-square object-cover group-hover:scale-105 transition-transform duration-[1200ms]"
                  loading="lazy"
                />
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {lightbox !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6 animate-fade-up" onClick={() => setLightbox(null)}>
          <button className="absolute top-5 right-5 w-12 h-12 rounded-full bg-white/10 text-white text-2xl" onClick={() => setLightbox(null)}>×</button>
          <button
            className="absolute left-3 md:left-8 w-12 h-12 rounded-full bg-white/10 text-white text-2xl"
            onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + items.length) % items.length); }}
          >‹</button>
          <img src={items[lightbox].url} alt={items[lightbox].caption ?? ""} className="max-w-full max-h-[85vh] object-contain" />
          <button
            className="absolute right-3 md:right-8 w-12 h-12 rounded-full bg-white/10 text-white text-2xl"
            onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % items.length); }}
          >›</button>
          {items[lightbox].caption && (
            <div className="absolute bottom-6 left-0 right-0 text-center text-white/80 text-sm tracking-widest uppercase">
              {items[lightbox].caption}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

/* ---------------- EVENT DETAILS ---------------- */
function EventDetails({ inv, eventDate }: { inv: InvitationDTO; eventDate: Date | null }) {
  const calendarLink = () => {
    if (!eventDate) return "#";
    const startMs = eventDate.getTime();
    const endMs = startMs + 6 * 60 * 60 * 1000;
    const fmt = (ms: number) =>
      new Date(ms).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Boda ${inv.couple_names}`)}&dates=${fmt(startMs)}/${fmt(endMs)}&location=${encodeURIComponent(inv.venue_address ?? "")}`;
  };

  return (
    <section className="py-24 md:py-32 px-6 bg-background">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <SectionTitle kicker="Detalles del evento" title="¿Cuándo y dónde?" />
        </Reveal>
        <div className="grid md:grid-cols-1 gap-6 md:gap-8 max-w-2xl mx-auto">
          <Reveal>
            <article className="bg-card border border-border rounded-sm p-8 md:p-10 text-center shadow-card">
              <div className="text-xs tracking-[0.3em] uppercase text-gold mb-4">Ceremonia y recepción</div>
              {eventDate && <div className="font-serif text-5xl italic text-primary mb-2">{formatTime(eventDate.toISOString())}</div>}
              <h3 className="font-serif text-2xl text-foreground mb-2">{inv.venue_name ?? ""}</h3>
              <p className="text-muted-foreground text-sm mb-2">{formatDatePretty(eventDate?.toISOString() ?? null)}</p>
              <p className="text-muted-foreground text-sm mb-6">{inv.venue_address ?? ""}</p>
              {inv.venue_maps_url && (
                <a
                  href={inv.venue_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-primary text-primary text-xs tracking-[0.2em] uppercase rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  Cómo llegar →
                </a>
              )}
            </article>
          </Reveal>
        </div>
        {eventDate && (
          <Reveal delay={200}>
            <div className="text-center mt-10">
              <a
                href={calendarLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm tracking-[0.2em] uppercase text-gold hover:text-primary transition-colors"
              >
                + Añadir al calendario
              </a>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

/* ---------------- DRESS CODE ---------------- */
function DressCode({ inv }: { inv: InvitationDTO }) {
  return (
    <section className="py-24 md:py-32 px-6 bg-gradient-blush">
      <div className="max-w-5xl mx-auto text-center">
        <Reveal>
          <SectionTitle kicker="Código de vestimenta" title={inv.dress_code ?? ""} />
        </Reveal>
        {inv.dress_code_note && (
          <Reveal delay={150}>
            <p className="max-w-xl mx-auto text-muted-foreground mb-10">{inv.dress_code_note}</p>
          </Reveal>
        )}
        <Reveal delay={350}>
          <div className="max-w-md mx-auto bg-card border border-border rounded-sm p-7">
            <div className="text-4xl mb-3">✨</div>
            <h4 className="font-serif text-xl text-primary mb-1">Dress code</h4>
            <p className="text-sm text-muted-foreground tracking-wider">{inv.dress_code}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- TIMELINE ---------------- */
function Timeline({ inv }: { inv: InvitationDTO }) {
  return (
    <section className="py-24 md:py-32 px-6 bg-background">
      <div className="max-w-3xl mx-auto">
        <Reveal>
          <SectionTitle kicker="Itinerario" title="Programa del evento" />
        </Reveal>
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-accent via-accent/50 to-transparent" />
          {inv.timeline.map((it, i) => (
            <Reveal key={it.title + i} delay={i * 100}>
              <div className="relative flex items-center gap-6 mb-8 pl-2">
                <div className="relative z-10 w-14 h-14 rounded-full bg-gradient-gold flex items-center justify-center text-xl shadow-soft shrink-0">
                  {it.icon ?? "✦"}
                </div>
                <div className="flex-1 bg-card border border-border rounded-sm p-5 shadow-card">
                  <div className="text-xs tracking-[0.3em] uppercase text-gold">{it.time}</div>
                  <h3 className="font-serif text-2xl italic text-primary">{it.title}</h3>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- RSVP ---------------- */
function Rsvp({ inv }: { inv: InvitationDTO }) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", attending: "yes", guests: "1", message: "" });
  const submit = useServerFn(submitRsvp);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      await submit({
        data: {
          invitation_slug: inv.slug,
          name: form.name.trim(),
          attending: form.attending as "yes" | "no",
          guests: Number(form.guests) || 0,
          message: form.message || null,
        },
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      toast.error("No pudimos guardar tu confirmación. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-24 md:py-32 px-6 bg-gradient-blush">
      <div className="max-w-2xl mx-auto">
        <Reveal>
          <SectionTitle kicker="Confirmación" title="¿Nos acompañas?" />
        </Reveal>

        {submitted ? (
          <Reveal>
            <div className="text-center bg-card border border-accent/40 rounded-sm p-10 shadow-soft">
              <div className="text-5xl mb-4">💌</div>
              <h3 className="font-serif italic text-3xl text-primary mb-3">¡Gracias, {form.name || "amig@"}!</h3>
              <p className="text-muted-foreground">Hemos recibido tu confirmación. Será un honor celebrar contigo.</p>
            </div>
          </Reveal>
        ) : (
          <Reveal>
            <form onSubmit={onSubmit} className="bg-card border border-border rounded-sm p-7 md:p-10 shadow-soft space-y-5">
              <RsvpField label="Nombre completo">
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-transparent border-b border-border focus:border-primary outline-none py-2"
                />
              </RsvpField>
              <RsvpField label="¿Asistirás?">
                <div className="flex gap-3">
                  {[{ v: "yes", l: "Sí, asistiré" }, { v: "no", l: "No puedo" }].map((o) => (
                    <button
                      type="button"
                      key={o.v}
                      onClick={() => setForm({ ...form, attending: o.v })}
                      className={`flex-1 py-3 rounded-sm text-sm tracking-wider uppercase border transition-colors ${
                        form.attending === o.v
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border text-muted-foreground hover:border-primary"
                      }`}
                    >
                      {o.l}
                    </button>
                  ))}
                </div>
              </RsvpField>
              <RsvpField label="Acompañantes">
                <select
                  value={form.guests}
                  onChange={(e) => setForm({ ...form, guests: e.target.value })}
                  className="w-full bg-transparent border-b border-border focus:border-primary outline-none py-2"
                >
                  {[0, 1, 2, 3, 4].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </RsvpField>
              <RsvpField label="Mensaje para los novios">
                <textarea
                  rows={3}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-transparent border border-border focus:border-primary outline-none p-3 rounded-sm resize-none"
                />
              </RsvpField>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-primary text-primary-foreground tracking-[0.2em] uppercase text-xs rounded-full hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {submitting ? "Enviando..." : "Enviar confirmación"}
              </button>
            </form>
          </Reveal>
        )}
      </div>
    </section>
  );
}

function RsvpField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

/* ---------------- GIFT REGISTRY ---------------- */
function GiftRegistry({ inv }: { inv: InvitationDTO }) {
  return (
    <section className="py-24 md:py-32 px-6 bg-background">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <SectionTitle kicker="Con cariño" title="Opciones de regalo" />
        </Reveal>
        <p className="text-center max-w-xl mx-auto text-muted-foreground italic font-serif mb-12">
          Tu presencia es nuestro mejor regalo. Si deseas obsequiarnos algo más, aquí algunas opciones.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {inv.gift_registry.map((g, i) => (
            <Reveal key={g.title + i} delay={i * 100}>
              <div className="bg-card border border-border rounded-sm p-7 text-center shadow-card hover:shadow-soft hover:-translate-y-1 transition-all h-full flex flex-col">
                <div className="text-4xl mb-4">{g.icon ?? "🎁"}</div>
                <h3 className="font-serif text-xl text-primary mb-2">{g.title}</h3>
                <p className="text-sm text-muted-foreground flex-1">{g.text}</p>
                {g.url && (
                  <a href={g.url} target="_blank" rel="noopener noreferrer" className="mt-4 text-xs tracking-[0.2em] uppercase text-primary border-b border-primary self-center pb-0.5">
                    Ver →
                  </a>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- TRANSPORTATION ---------------- */
function Transportation({ inv }: { inv: InvitationDTO }) {
  return (
    <section className="py-24 md:py-32 px-6 bg-background">
      <div className="max-w-3xl mx-auto text-center">
        <Reveal>
          <SectionTitle kicker="Transporte" title="Cómo llegar" />
        </Reveal>
        <Reveal delay={150}>
          <p className="text-muted-foreground whitespace-pre-line">{inv.transportation_note}</p>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- SOCIAL WALL ---------------- */
function SocialWall({ inv }: { inv: InvitationDTO }) {
  return (
    <section className="py-24 md:py-32 px-6 bg-cream text-center">
      <div className="max-w-3xl mx-auto">
        <Reveal>
          <div className="ornament mb-4">Comparte</div>
          <h2 className="font-serif italic text-4xl md:text-5xl text-primary mb-6">Comparte tus fotos</h2>
        </Reveal>
        <Reveal delay={150}>
          <p className="text-muted-foreground mb-8">Etiquétanos y usa nuestro hashtag para verlas todas en un mismo lugar.</p>
          <div className="inline-block bg-gradient-gold text-primary-foreground font-script text-3xl md:text-4xl px-10 py-5 rounded-full shadow-soft">
            {inv.hashtag}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */
function Faq({ inv }: { inv: InvitationDTO }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="py-24 md:py-32 px-6 bg-background">
      <div className="max-w-3xl mx-auto">
        <Reveal>
          <SectionTitle kicker="FAQ" title="Preguntas frecuentes" />
        </Reveal>
        <div className="space-y-3">
          {inv.faq.map((it, i) => (
            <Reveal key={i} delay={i * 60}>
              <div className="border border-border bg-card rounded-sm overflow-hidden">
                <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
                  <span className="font-serif text-lg text-primary pr-4">{it.question}</span>
                  <span className="text-gold text-2xl shrink-0">{open === i ? "−" : "+"}</span>
                </button>
                <div
                  className="px-5 text-muted-foreground text-sm leading-relaxed transition-all"
                  style={{
                    maxHeight: open === i ? "400px" : "0",
                    paddingBottom: open === i ? "1.25rem" : "0",
                    overflow: "hidden",
                  }}
                >
                  {it.answer}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- THANK YOU ---------------- */
function ThankYou({ inv, eventDate }: { inv: InvitationDTO; eventDate: Date | null }) {
  const bg = inv.gallery[inv.gallery.length - 1]?.url ?? inv.hero_image_url ?? "";
  return (
    <section className="relative h-[100svh] min-h-[600px] w-full overflow-hidden">
      {bg ? (
        <img src={bg} alt={inv.couple_names} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
      ) : (
        <div className="absolute inset-0 bg-primary" />
      )}
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 text-white">
        <Reveal>
          <div className="ornament !text-white/85 mb-6">Gracias</div>
        </Reveal>
        <Reveal delay={200}>
          <h2 className="font-serif italic text-5xl md:text-7xl max-w-3xl leading-tight">
            {inv.thank_you_message ?? "Gracias por ser parte de nuestra historia"}
          </h2>
        </Reveal>
        <Reveal delay={600}>
          <div className="mt-8 font-script text-5xl md:text-6xl text-gold">{inv.couple_names}</div>
        </Reveal>
        {eventDate && (
          <Reveal delay={800}>
            <div className="mt-6 text-xs tracking-[0.4em] uppercase text-white/70">
              {String(eventDate.getDate()).padStart(2, "0")} · {String(eventDate.getMonth() + 1).padStart(2, "0")} · {eventDate.getFullYear()}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
