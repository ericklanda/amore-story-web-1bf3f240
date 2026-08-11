import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { submitRsvp } from "@/lib/rsvp.functions";
import { toast } from "sonner";
import aa62 from "@/assets/ale-aaron/aa-62.jpg.asset.json";
import aa75 from "@/assets/ale-aaron/aa-75.jpg.asset.json";
import aa112 from "@/assets/ale-aaron/aa-112.jpg.asset.json";
import aa120 from "@/assets/ale-aaron/aa-120.jpg.asset.json";
import aa140 from "@/assets/ale-aaron/aa-140.jpg.asset.json";
import aa173 from "@/assets/ale-aaron/aa-173.jpg.asset.json";
import aa318 from "@/assets/ale-aaron/aa-318.jpg.asset.json";
import aa340 from "@/assets/ale-aaron/aa-340.jpg.asset.json";
import aa356 from "@/assets/ale-aaron/aa-356.jpg.asset.json";
import aa384 from "@/assets/ale-aaron/aa-384.jpg.asset.json";
import iglesiaImg from "@/assets/ale-aaron/iglesia.png.asset.json";
import recepcionImg from "@/assets/ale-aaron/recepcion.png.asset.json";

const heroA = aa173.url;
const heroB = aa62.url;
const heroC = aa384.url;
const SITE_URL = "https://luis-leo.lovable.app";
const PREVIEW_IMG = `${SITE_URL}${aa112.url}`;

export const Route = createFileRoute("/alejandra-aaron")({
  head: () => ({
    meta: [
      { title: "Alejandra & Aarón · Nuestra Boda" },
      { name: "description", content: "Invitación de boda de Alejandra y Aarón · 3 de Octubre de 2026, Ciudad Juárez." },
      { property: "og:title", content: "Alejandra & Aarón · Nuestra Boda" },
      { property: "og:description", content: "Acompáñanos a celebrar nuestro gran día." },
      { property: "og:image", content: PREVIEW_IMG },
      { property: "og:url", content: `${SITE_URL}/alejandra-aaron` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Alejandra & Aarón · Nuestra Boda" },
      { name: "twitter:description", content: "Acompáñanos a celebrar nuestro gran día." },
      { name: "twitter:image", content: PREVIEW_IMG },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/alejandra-aaron` }],
  }),
  component: WeddingInvitation,
});

const WEDDING_DATE = new Date("2026-10-03T17:00:00");
const HASHTAG = "#AleYAaron2026";
const WHATSAPP_NUMBER = "5216563078286";
const YOUTUBE_SONG_ID = "yP_dhALIuFc";

/* Palette (terracota / burgundy / peach / cream / dusty rose)
   burgundy #6c2f2c · terracotta #b97a6a · dusty rose #a06b64 · peach #e6b89e · cream #f4ead9 */
const C_BURGUNDY = "oklch(0.35 0.08 25)";
const C_TERRACOTTA = "oklch(0.6 0.09 30)";
const C_PEACH = "oklch(0.85 0.06 55)";
const C_CREAM = "oklch(0.96 0.02 80)";
const C_DUSTY = "oklch(0.65 0.06 25)";
const THEME_BG = `linear-gradient(180deg, ${C_BURGUNDY} 0%, ${C_TERRACOTTA} 100%)`;
const BG_CREAM = "#f7ede0";
const BG_BLUSH = "linear-gradient(180deg, #f7ede0 0%, #efd9c9 100%)";

const CEREMONY = {
  place: "Parroquia Natividad del Señor",
  time: "5:00 pm",
  address: "Av. Plutarco Elías Calles 821, Progresista, 32310 Juárez, Chih.",
  maps: "https://maps.app.goo.gl/HtsTZVZZnnhiSFmx8",
  image: iglesiaImg.url,
};
const RECEPTION = {
  place: "Recepción",
  time: "9:00 pm",
  address: "Pedro Meneses Hoyos #6754, Partido Iglesias, 32528 Ciudad Juárez.",
  maps: "https://maps.app.goo.gl/h36nByxfemYscpfM7",
  image: recepcionImg.url,
};

const GALLERY = [
  { src: aa112.url, caption: "Nosotros" },
  { src: aa62.url, caption: "Complicidad" },
  { src: aa75.url, caption: "El anillo" },
  { src: aa120.url, caption: "Miradas" },
  { src: aa173.url, caption: "Volar contigo" },
  { src: aa140.url, caption: "Nuestro camino" },
  { src: aa318.url, caption: "En un instante" },
  { src: aa384.url, caption: "Al atardecer" },
  { src: aa340.url, caption: "Siluetas" },
  { src: aa356.url, caption: "Bajo la luna" },
];

function useCountdown(target: Date) {
  const [now, setNow] = useState(() => new Date());
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
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
      ([e]) => { if (e.isIntersecting) { setShow(true); io.disconnect(); } },
      { threshold: 0.15 }
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
      {kicker && (
        <div className="text-xs tracking-[0.35em] uppercase mb-4" style={{ color: C_TERRACOTTA }}>
          — {kicker} —
        </div>
      )}
      <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl italic" style={{ color: C_BURGUNDY }}>{title}</h2>
    </div>
  );
}

function WeddingInvitation() {
  const [entered, setEntered] = useState(false);
  const [progress, setProgress] = useState(0);

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

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: BG_CREAM, color: C_BURGUNDY }}>
      <div
        className="fixed top-0 left-0 h-[2px] z-50 transition-[width] duration-150"
        style={{ width: `${progress * 100}%`, background: `linear-gradient(90deg, ${C_BURGUNDY}, ${C_TERRACOTTA})` }}
      />
      <FloatingControls entered={entered} />
      {!entered && <SplashOverlay onEnter={() => setEntered(true)} />}

      <Hero />
      <ParentsSection />
      <Gallery />
      <EventDetails />
      <DressCode />
      <Timeline />
      <Rsvp />
      <GiftRegistry />
      <SocialWall />
      <Faq />
      <ThankYou />
    </div>
  );
}

/* ---------------- FLOATING CONTROLS ---------------- */
function FloatingControls({ entered }: { entered: boolean }) {
  const [playing, setPlaying] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const sendCommand = (action: string) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func: action, args: [] }),
      "*"
    );
  };

  const toggleMusic = () => {
    const action = playing ? "pauseVideo" : "playVideo";
    sendCommand(action);
    setPlaying(!playing);
  };

  useEffect(() => {
    if (entered) {
      sendCommand("playVideo");
      setPlaying(true);
    }
  }, [entered]);

  return (
    <>
      <iframe
        ref={iframeRef}
        title="background-music"
        src={`https://www.youtube.com/embed/${YOUTUBE_SONG_ID}?enablejsapi=1&autoplay=1&loop=1&playlist=${YOUTUBE_SONG_ID}&controls=0&modestbranding=1`}
        allow="autoplay"
        style={{ position: "fixed", width: 1, height: 1, opacity: 0, pointerEvents: "none", border: 0 }}
      />
      <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-2.5">
        <button
          onClick={toggleMusic}
          aria-label="Reproducir música"
          className="w-12 h-12 rounded-full text-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
          style={{ background: C_BURGUNDY }}
        >
          {playing ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          )}
        </button>
      </div>
    </>
  );
}

/* ---------------- SPLASH ---------------- */
function SplashOverlay({ onEnter }: { onEnter: () => void }) {
  const [fading, setFading] = useState(false);
  const handleEnter = () => { setFading(true); setTimeout(onEnter, 800); };

  return (
    <div
      className={`fixed inset-0 z-[60] flex flex-col items-center justify-center text-center px-6 transition-opacity duration-700 ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{ background: THEME_BG }}
    >
      <div className="absolute inset-0 bg-black/25" />
      <div className="relative z-10 max-w-lg">
        <div className="text-white/85 mb-6 text-xs tracking-[0.35em] uppercase">03 · Octubre · 2026</div>
        <h1 className="font-serif italic text-5xl sm:text-6xl md:text-7xl text-white leading-[0.95] mb-4">
          Alejandra
          <span className="block text-4xl sm:text-5xl md:text-6xl my-2 not-italic" style={{ color: C_PEACH }}>&</span>
          Aarón
        </h1>
        <p className="text-white/75 text-xs tracking-[0.25em] uppercase mb-10">
          Nos casamos · Ciudad Juárez, Chihuahua
        </p>
        <p className="font-serif italic text-2xl sm:text-3xl text-white/95 mb-6">
          Estás invitado
        </p>
        <button
          onClick={handleEnter}
          className="inline-flex items-center gap-3 px-10 py-4 rounded-full bg-white/95 font-sans text-sm tracking-[0.25em] uppercase hover:bg-white transition-all hover:gap-5"
          style={{ color: C_BURGUNDY }}
        >
          Ingresa
          <span>→</span>
        </button>
      </div>
    </div>
  );
}

/* ---------------- HERO ---------------- */
function Hero() {
  const slides = [heroA, heroB, heroC];
  const [idx, setIdx] = useState(0);
  const { days, hours, minutes, seconds } = useCountdown(WEDDING_DATE);

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
      {slides.map((src, i) => (
        <div key={i} className="absolute inset-0 transition-opacity duration-[2000ms] ease-out" style={{ opacity: i === idx ? 1 : 0 }}>
          <img
            src={src}
            alt="Alejandra y Aarón"
            className="w-full h-full object-cover"
            style={{
              objectPosition: "center 35%",
              transform: i === idx ? "scale(1.06)" : "scale(1)",
              transition: "transform 8s ease-out",
            }}
            fetchPriority={i === 0 ? "high" : "auto"}
          />
        </div>
      ))}
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.15), rgba(60,20,20,0.55))" }} />

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 text-white">
        <Reveal delay={200}>
          <div className="text-white/90 text-xs tracking-[0.35em] uppercase mb-6">03 · Octubre · 2026</div>
        </Reveal>
        <Reveal delay={400}>
          <h1 className="font-serif italic text-5xl sm:text-6xl md:text-8xl lg:text-9xl leading-[0.95]">
            Alejandra
            <span className="block text-4xl sm:text-5xl md:text-6xl my-2 not-italic" style={{ color: C_PEACH }}>&</span>
            Aarón
          </h1>
        </Reveal>
        <Reveal delay={700}>
          <p className="mt-6 max-w-md font-sans text-xs sm:text-sm tracking-[0.25em] uppercase text-white/85">
            Nos casamos · Ciudad Juárez, Chihuahua
          </p>
        </Reveal>

        <Reveal delay={900}>
          <div className="mt-10 grid grid-cols-4 gap-3 sm:gap-5">
            {[
              { label: "Días", v: days },
              { label: "Hrs", v: hours },
              { label: "Min", v: minutes },
              { label: "Seg", v: seconds },
            ].map((t) => (
              <div key={t.label} className="text-center">
                <div className="font-serif text-3xl sm:text-5xl text-white tabular-nums">{String(t.v).padStart(2, "0")}</div>
                <div className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-white/70 mt-1">{t.label}</div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={1100}>
          <a
            href="#padres"
            className="mt-10 inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-white/95 font-sans text-sm tracking-[0.2em] uppercase hover:bg-white transition-all hover:gap-5"
            style={{ color: C_BURGUNDY }}
          >
            Ver invitación
            <span>→</span>
          </a>
        </Reveal>
      </div>

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
    </section>
  );
}

/* ---------------- PARENTS ---------------- */
function ParentsSection() {
  const groups = [
    { title: "Padres de la novia", names: ["Elvia Oropeza", "Ricardo Félix"] },
    { title: "Padres del novio", names: ["Rosa Rueda", "Tomás Rueda"] },
  ];

  return (
    <section id="padres" className="py-24 md:py-32 px-6" style={{ background: BG_BLUSH }}>
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <SectionTitle kicker="Con amor" title="Nuestros padres" />
        </Reveal>
        <p className="text-center max-w-2xl mx-auto italic font-serif text-lg mb-14" style={{ color: C_DUSTY }}>
          "Con la bendición de Dios y de nuestros padres, queremos compartir contigo este día tan especial."
        </p>
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {groups.map((g, i) => (
            <Reveal key={g.title} delay={i * 120}>
              <div className="rounded-sm p-8 text-center shadow-md hover:shadow-lg transition-shadow" style={{ background: "#fff8ef", border: `1px solid ${C_PEACH}` }}>
                <div className="text-xs tracking-[0.3em] uppercase mb-5" style={{ color: C_TERRACOTTA }}>{g.title}</div>
                {g.names.map((n) => (
                  <p key={n} className="font-serif text-xl leading-relaxed" style={{ color: C_BURGUNDY }}>{n}</p>
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
function Gallery() {
  const [lightbox, setLightbox] = useState<number | null>(null);
  return (
    <section className="py-24 md:py-32 px-6" style={{ background: BG_CREAM }}>
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <SectionTitle kicker="Galería" title="Momentos juntos" />
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {GALLERY.map((g, i) => (
            <Reveal key={i} delay={(i % 4) * 100}>
              <button
                onClick={() => setLightbox(i)}
                className="group block w-full overflow-hidden rounded-sm shadow-md"
              >
                <img
                  src={g.src}
                  alt={g.caption}
                  className="w-full h-full aspect-square object-cover group-hover:scale-105 transition-transform duration-[1200ms]"
                  loading="lazy"
                />
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {lightbox !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6" onClick={() => setLightbox(null)}>
          <button className="absolute top-5 right-5 w-12 h-12 rounded-full bg-white/10 text-white text-2xl" onClick={() => setLightbox(null)}>×</button>
          <button
            className="absolute left-3 md:left-8 w-12 h-12 rounded-full bg-white/10 text-white text-2xl"
            onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + GALLERY.length) % GALLERY.length); }}
          >‹</button>
          <img src={GALLERY[lightbox].src} alt={GALLERY[lightbox].caption} className="max-w-full max-h-[85vh] object-contain" />
          <button
            className="absolute right-3 md:right-8 w-12 h-12 rounded-full bg-white/10 text-white text-2xl"
            onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % GALLERY.length); }}
          >›</button>
          <div className="absolute bottom-6 left-0 right-0 text-center text-white/80 text-sm tracking-widest uppercase">
            {GALLERY[lightbox].caption}
          </div>
        </div>
      )}
    </section>
  );
}

/* ---------------- EVENT DETAILS ---------------- */
function EventDetails() {
  const events = [
    { label: "Ceremonia Religiosa", ...CEREMONY, icon: "⛪" },
    { label: "Recepción", ...RECEPTION, icon: "🥂" },
  ];

  const calendarLink = () => {
    // 3 Oct 2026 17:00 CST → 4 Oct 2026 02:00 CST (UTC-6)
    const start = "20261003T230000Z";
    const end = "20261004T080000Z";
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Boda+Alejandra+%26+Aar%C3%B3n&dates=${start}/${end}&details=Acompáñanos+a+celebrar+nuestro+día.&location=${encodeURIComponent(CEREMONY.address)}`;
  };

  return (
    <section className="py-24 md:py-32 px-6" style={{ background: BG_BLUSH }}>
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <SectionTitle kicker="Detalles del evento" title="¿Cuándo y dónde?" />
        </Reveal>
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {events.map((ev, i) => (
            <Reveal key={ev.label} delay={i * 120}>
              <article className="rounded-sm overflow-hidden shadow-md hover:shadow-lg transition-shadow h-full flex flex-col text-center" style={{ background: "#fff8ef", border: `1px solid ${C_PEACH}` }}>
                <img src={ev.image} alt={`${ev.label} — ${ev.place}`} loading="lazy" className="w-full h-52 md:h-60 object-cover" />
                <div className="p-8 md:p-10 flex flex-col flex-1">
                <div className="text-3xl mb-3">{ev.icon}</div>
                <div className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: C_TERRACOTTA }}>{ev.label}</div>
                <div className="font-serif text-4xl italic mb-2" style={{ color: C_BURGUNDY }}>{ev.time}</div>
                <h3 className="font-serif text-2xl mb-2" style={{ color: C_BURGUNDY }}>{ev.place}</h3>
                <p className="text-sm mb-6 flex-1" style={{ color: C_DUSTY }}>{ev.address}</p>
                <a
                  href={ev.maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 text-xs tracking-[0.2em] uppercase rounded-full transition-colors self-center"
                  style={{ border: `1px solid ${C_BURGUNDY}`, color: C_BURGUNDY }}
                >
                  Cómo llegar →
                </a>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal delay={200}>
          <div className="text-center mt-10">
            <a
              href={calendarLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm tracking-[0.2em] uppercase transition-colors"
              style={{ color: C_TERRACOTTA }}
            >
              + Añadir al calendario
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- DRESS CODE ---------------- */
function DressCode() {
  return (
    <section className="py-24 md:py-32 px-6" style={{ background: BG_CREAM }}>
      <div className="max-w-5xl mx-auto text-center">
        <Reveal>
          <SectionTitle kicker="Código de vestimenta" title="Formal" />
        </Reveal>
        <Reveal delay={150}>
          <p className="max-w-xl mx-auto mb-8" style={{ color: C_DUSTY }}>
            Queremos una celebración elegante. Te pedimos vestir <strong>formal</strong>.
          </p>
        </Reveal>
        <Reveal delay={250}>
          <div className="flex justify-center flex-wrap gap-4 mb-10 text-5xl md:text-6xl">
            <span>👗</span>
            <span>🤵</span>
          </div>
        </Reveal>
        <Reveal delay={350}>
          <div className="max-w-md mx-auto rounded-sm p-7" style={{ background: "#fff8ef", border: `1px solid ${C_PEACH}` }}>
            <h4 className="font-serif text-xl mb-3" style={{ color: C_BURGUNDY }}>Por favor evita</h4>
            <div className="flex justify-center gap-4 mb-3">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm" style={{ background: "#fff", border: `1px solid ${C_BURGUNDY}`, color: C_BURGUNDY }}>
                <span className="inline-block w-3 h-3 rounded-full bg-white border" /> Blanco
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm" style={{ background: "#fff", border: `1px solid ${C_BURGUNDY}`, color: C_BURGUNDY }}>
                <span className="inline-block w-3 h-3 rounded-full" style={{ background: "#c62828" }} /> Rojo
              </span>
            </div>
            <p className="text-xs tracking-wider" style={{ color: C_DUSTY }}>Colores reservados para la novia y la celebración.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- TIMELINE ---------------- */
function Timeline() {
  const items = [
    { time: "5:00 pm", title: "Ceremonia religiosa", icon: "⛪" },
    { time: "9:00 pm", title: "Recepción", icon: "🥂" },
    { time: "10:30 pm", title: "Primer baile", icon: "❤️" },
    { time: "11:00 pm", title: "Fiesta", icon: "🎶" },
    { time: "2:00 am", title: "Cierre", icon: "✨" },
  ];

  return (
    <section className="py-24 md:py-32 px-6" style={{ background: BG_BLUSH }}>
      <div className="max-w-3xl mx-auto">
        <Reveal>
          <SectionTitle kicker="Itinerario" title="Programa del evento" />
        </Reveal>
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-px" style={{ background: `linear-gradient(to bottom, ${C_TERRACOTTA}, transparent)` }} />
          {items.map((it, i) => (
            <Reveal key={it.title} delay={i * 100}>
              <div className="relative flex items-center gap-6 mb-8 pl-2">
                <div className="relative z-10 w-14 h-14 rounded-full flex items-center justify-center text-xl shadow-md shrink-0 text-white" style={{ background: `linear-gradient(135deg, ${C_BURGUNDY}, ${C_TERRACOTTA})` }}>
                  {it.icon}
                </div>
                <div className="flex-1 rounded-sm p-5 shadow-md" style={{ background: "#fff8ef", border: `1px solid ${C_PEACH}` }}>
                  <div className="text-xs tracking-[0.3em] uppercase" style={{ color: C_TERRACOTTA }}>{it.time}</div>
                  <h3 className="font-serif text-2xl italic" style={{ color: C_BURGUNDY }}>{it.title}</h3>
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
function Rsvp() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", attending: "yes", message: "" });
  const submit = useServerFn(submitRsvp);

  const buildWhatsappUrl = (name: string, attending: string, message: string) => {
    const attendText = attending === "yes" ? "Sí" : "No";
    let text = `Hola! Confirmo mi asistencia a la boda de Alejandra y Aarón.\nNombre: ${name}\nAsistencia: ${attendText}`;
    if (message.trim()) text += `\nMensaje: ${message.trim()}`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    const waUrl = buildWhatsappUrl(form.name.trim(), form.attending, form.message);
    const waWindow = window.open(waUrl, "_blank", "noopener,noreferrer");
    if (!waWindow) window.location.href = waUrl;
    try {
      await submit({
        data: {
          invitation_slug: "alejandra-aaron",
          name: form.name.trim(),
          attending: form.attending as "yes" | "no",
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

  const whatsappMsg = buildWhatsappUrl(form.name || "(nombre)", form.attending, form.message);

  return (
    <section className="py-24 md:py-32 px-6" style={{ background: BG_CREAM }}>
      <div className="max-w-2xl mx-auto">
        <Reveal>
          <SectionTitle kicker="Confirmación" title="¿Nos acompañas?" />
        </Reveal>

        {submitted ? (
          <Reveal>
            <div className="text-center rounded-sm p-10 shadow-md" style={{ background: "#fff8ef", border: `1px solid ${C_PEACH}` }}>
              <div className="text-5xl mb-4">💌</div>
              <h3 className="font-serif italic text-3xl mb-3" style={{ color: C_BURGUNDY }}>¡Gracias, {form.name || "amig@"}!</h3>
              <p className="mb-6" style={{ color: C_DUSTY }}>Hemos recibido tu confirmación. Será un honor celebrar contigo.</p>
              <a
                href={whatsappMsg}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white text-xs tracking-[0.2em] uppercase hover:opacity-90"
                style={{ background: C_BURGUNDY }}
              >
                Avisar por WhatsApp
              </a>
            </div>
          </Reveal>
        ) : (
          <Reveal>
            <form onSubmit={onSubmit} className="rounded-sm p-7 md:p-10 shadow-md space-y-5" style={{ background: "#fff8ef", border: `1px solid ${C_PEACH}` }}>
              <Field label="Nombre completo">
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-transparent border-b outline-none py-2"
                  style={{ borderColor: C_TERRACOTTA, color: C_BURGUNDY }}
                />
              </Field>
              <Field label="¿Asistirás?">
                <div className="flex gap-3">
                  {[
                    { v: "yes", l: "Sí, asistiré" },
                    { v: "no", l: "No puedo" },
                  ].map((o) => (
                    <button
                      type="button"
                      key={o.v}
                      onClick={() => setForm({ ...form, attending: o.v })}
                      className="flex-1 py-3 rounded-sm text-sm tracking-wider uppercase border transition-colors"
                      style={
                        form.attending === o.v
                          ? { background: C_BURGUNDY, color: "#fff", borderColor: C_BURGUNDY }
                          : { borderColor: C_PEACH, color: C_DUSTY }
                      }
                    >
                      {o.l}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Mensaje para los novios">
                <textarea
                  rows={3}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-transparent outline-none p-3 rounded-sm resize-none"
                  style={{ border: `1px solid ${C_PEACH}`, color: C_BURGUNDY }}
                />
              </Field>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3.5 text-white tracking-[0.2em] uppercase text-xs rounded-full hover:opacity-90 transition-opacity disabled:opacity-60"
                  style={{ background: C_BURGUNDY }}
                >
                  {submitting ? "Enviando..." : "Enviar confirmación"}
                </button>
              </div>
              <p className="text-center text-xs pt-2" style={{ color: C_DUSTY }}>
                Confirmaciones también por WhatsApp al 656 307 8286
              </p>
            </form>
          </Reveal>
        )}
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: C_TERRACOTTA }}>{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

/* ---------------- GIFT REGISTRY ---------------- */
function GiftRegistry() {
  return (
    <section className="py-24 md:py-32 px-6" style={{ background: BG_BLUSH }}>
      <div className="max-w-3xl mx-auto text-center">
        <Reveal>
          <SectionTitle kicker="Con cariño" title="Lluvia de sobres" />
        </Reveal>
        <Reveal delay={120}>
          <p className="max-w-xl mx-auto italic font-serif mb-10" style={{ color: C_DUSTY }}>
            Tu presencia es nuestro mejor regalo. Si deseas obsequiarnos algo más, hemos elegido la
            tradición de la <strong>lluvia de sobres</strong>.
          </p>
        </Reveal>
        <Reveal delay={240}>
          <div className="rounded-sm p-10 shadow-md max-w-md mx-auto" style={{ background: "#fff8ef", border: `1px solid ${C_PEACH}` }}>
            <div className="text-6xl mb-5">💌</div>
            <h3 className="font-serif italic text-2xl mb-3" style={{ color: C_BURGUNDY }}>Lluvia de sobres</h3>
            <p className="text-sm leading-relaxed" style={{ color: C_DUSTY }}>
              Tendremos un buzón especial el día del evento para recibir tu sobre con todo nuestro cariño.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- SOCIAL WALL ---------------- */
function SocialWall() {
  return (
    <section className="py-24 md:py-32 px-6 text-center" style={{ background: BG_CREAM }}>
      <div className="max-w-3xl mx-auto">
        <Reveal>
          <div className="text-xs tracking-[0.35em] uppercase mb-4" style={{ color: C_TERRACOTTA }}>— Comparte —</div>
          <h2 className="font-serif italic text-4xl md:text-5xl mb-6" style={{ color: C_BURGUNDY }}>Comparte tus fotos</h2>
        </Reveal>
        <Reveal delay={150}>
          <p className="mb-8" style={{ color: C_DUSTY }}>Etiquétanos y usa nuestro hashtag para verlas todas en un mismo lugar.</p>
          <div className="inline-block text-white text-3xl md:text-4xl px-10 py-5 rounded-full shadow-md italic font-serif" style={{ background: `linear-gradient(135deg, ${C_BURGUNDY}, ${C_TERRACOTTA})` }}>
            {HASHTAG}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */
function Faq() {
  const items = [
    { q: "¿Puedo llevar niños?", a: "Con mucho cariño, este evento es solo para adultos. Agradecemos tu comprensión." },
    { q: "¿Cuál es el código de vestimenta?", a: "Formal. Por favor evita usar blanco y rojo, colores reservados para la novia y la celebración." },
    { q: "¿Dónde es la ceremonia?", a: "En la Parroquia Natividad del Señor, Av. Plutarco Elías Calles 821, Progresista, Cd. Juárez, a las 5:00 pm." },
    { q: "¿Dónde es la recepción?", a: "En Pedro Meneses Hoyos #6754, Partido Iglesias, Cd. Juárez, a partir de las 9:00 pm." },
    { q: "¿Hasta cuándo confirmar?", a: "Te pedimos confirmar tu asistencia antes del 3 de septiembre de 2026 por WhatsApp al 656 307 8286." },
  ];

  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="py-24 md:py-32 px-6" style={{ background: BG_BLUSH }}>
      <div className="max-w-3xl mx-auto">
        <Reveal>
          <SectionTitle kicker="FAQ" title="Preguntas frecuentes" />
        </Reveal>
        <div className="space-y-3">
          {items.map((it, i) => (
            <Reveal key={i} delay={i * 60}>
              <div className="rounded-sm overflow-hidden" style={{ background: "#fff8ef", border: `1px solid ${C_PEACH}` }}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-serif text-lg pr-4" style={{ color: C_BURGUNDY }}>{it.q}</span>
                  <span className="text-2xl shrink-0" style={{ color: C_TERRACOTTA }}>{open === i ? "−" : "+"}</span>
                </button>
                <div
                  className="px-5 text-sm leading-relaxed transition-all"
                  style={{
                    color: C_DUSTY,
                    maxHeight: open === i ? "300px" : "0",
                    paddingBottom: open === i ? "1.25rem" : "0",
                    overflow: "hidden",
                  }}
                >
                  {it.a}
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
function ThankYou() {
  return (
    <section className="relative h-[100svh] min-h-[600px] w-full overflow-hidden">
      <img src={heroC} alt="Alejandra y Aarón" className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: "center 40%" }} loading="lazy" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.35), rgba(60,20,20,0.7))" }} />
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 text-white">
        <Reveal>
          <div className="text-white/85 text-xs tracking-[0.35em] uppercase mb-6">Gracias</div>
        </Reveal>
        <Reveal delay={200}>
          <h2 className="font-serif italic text-5xl md:text-7xl max-w-3xl leading-tight">
            Gracias por ser parte de nuestra historia
          </h2>
        </Reveal>
        <Reveal delay={400}>
          <p className="mt-6 max-w-xl text-white/85 italic font-serif text-lg">
            Tu presencia hará este día aún más inolvidable. Con todo nuestro amor,
          </p>
        </Reveal>
        <Reveal delay={600}>
          <div className="mt-8 font-serif italic text-5xl md:text-6xl" style={{ color: C_PEACH }}>
            Alejandra & Aarón
          </div>
        </Reveal>
        <Reveal delay={800}>
          <div className="mt-6 text-xs tracking-[0.4em] uppercase text-white/70">
            03 · 10 · 2026
          </div>
        </Reveal>
      </div>
    </section>
  );
}
