import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { submitRsvp } from "@/lib/rsvp.functions";
import { toast } from "sonner";
import gf10 from "@/assets/gisel-fernando/gf-10.jpg.asset.json";
import gf20 from "@/assets/gisel-fernando/gf-20.jpg.asset.json";
import gf82 from "@/assets/gisel-fernando/gf-82.jpg.asset.json";
import gf109 from "@/assets/gisel-fernando/gf-109.jpg.asset.json";
import gf144 from "@/assets/gisel-fernando/gf-144.jpg.asset.json";
import gf198 from "@/assets/gisel-fernando/gf-198.jpg.asset.json";
import gf91 from "@/assets/gisel-fernando/gf-91.jpg.asset.json";
import gf65 from "@/assets/gisel-fernando/gf-65.jpg.asset.json";
import gf121 from "@/assets/gisel-fernando/gf-121.jpg.asset.json";
import previewImg from "@/assets/gisel-fernando/gisel-fernando-preview.jpg.asset.json";
import lumiereImg from "@/assets/gisel-fernando/lumiere.png.asset.json";
import parroquiaImg from "@/assets/gisel-fernando/parroquia.png.asset.json";

const heroA = gf20.url;
const heroB = gf82.url;
const heroC = gf109.url;
const detail = gf10.url;
const SITE_URL = "https://luis-leo.lovable.app";
const PREVIEW_IMG = `${SITE_URL}${previewImg.url}`;

export const Route = createFileRoute("/gisel-fernando")({
  head: () => ({
    meta: [
      { title: "Gisel & Fernando · Nuestra Boda" },
      { name: "description", content: "Invitación de boda de Gisel y Fernando · 21 de Agosto de 2026, Ciudad Juárez." },
      { property: "og:title", content: "Gisel & Fernando · Nuestra Boda" },
      { property: "og:description", content: "Acompáñanos a celebrar nuestro gran día." },
      { property: "og:image", content: PREVIEW_IMG },
      { property: "og:url", content: `${SITE_URL}/gisel-fernando` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Gisel & Fernando · Nuestra Boda" },
      { name: "twitter:description", content: "Acompáñanos a celebrar nuestro gran día." },
      { name: "twitter:image", content: PREVIEW_IMG },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/gisel-fernando` }],
  }),
  component: WeddingInvitation,
});

const WEDDING_DATE = new Date("2026-08-21T18:00:00");
const HASHTAG = "#GiselYFernando2026";
const WHATSAPP_NUMBER = "5216565833566";
const YOUTUBE_SONG_ID = "iZpZDivj6SU";

const CEREMONY = {
  place: "Parroquia Santísima Trinidad",
  time: "6:00 pm",
  address: "Chihuahua 712, Melchor Ocampo, 32380 Juárez, Chih.",
  maps: "https://maps.app.goo.gl/6NBQDYJT79nXGKzC6",
  image: parroquiaImg.url,
};
const RECEPTION = {
  place: "Lumière Salón de Eventos",
  time: "9:00 pm",
  address: "Av. Benjamín Franklin 3320, Zona Pronaf Condominio La Plata, 32315 Juárez, Chih.",
  maps: "https://maps.app.goo.gl/XXXqfCcpwbHUKmJA7",
  image: lumiereImg.url,
};

const GALLERY = [
  { src: gf20.url, caption: "Nosotros" },
  { src: gf65.url, caption: "Sonrisas" },
  { src: gf144.url, caption: "Complicidad" },
  { src: gf82.url, caption: "Juntos" },
  { src: gf121.url, caption: "En el camino" },
  { src: gf198.url, caption: "Nuestro camino" },
  { src: gf91.url, caption: "Al atardecer" },
  { src: gf109.url, caption: "Cómplices" },
  { src: gf10.url, caption: "Miradas" },
];

/* palette: sage #8ea083 · soft sage #a8b89c · dusty rose #d69aac · blush #eec6cf · cream #f4efe6 */
const THEME_BG = "linear-gradient(180deg, oklch(0.55 0.06 145) 0%, oklch(0.72 0.09 15) 100%)";

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
      {kicker && <div className="ornament mb-4">{kicker}</div>}
      <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl italic text-primary">{title}</h2>
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
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <div
        className="fixed top-0 left-0 h-[2px] z-50 transition-[width] duration-150"
        style={{ width: `${progress * 100}%`, background: "linear-gradient(90deg, oklch(0.55 0.06 145), oklch(0.72 0.09 15))" }}
      />
      <FloatingControls entered={entered} />
      {!entered && <SplashOverlay onEnter={() => setEntered(true)} />}

      <Hero />
      <OurStory />
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
          className="w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-soft flex items-center justify-center hover:scale-110 transition-transform"
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
        <div className="text-white/85 mb-6 text-xs tracking-[0.35em] uppercase">21 · Agosto · 2026</div>
        <h1 className="font-serif italic text-5xl sm:text-6xl md:text-7xl text-white leading-[0.95] mb-4">
          Gisel
          <span className="font-script block text-4xl sm:text-5xl md:text-6xl my-2 not-italic" style={{ color: "oklch(0.9 0.05 15)" }}>&</span>
          Fernando
        </h1>
        <p className="text-white/75 text-xs tracking-[0.25em] uppercase mb-10">
          Nos casamos · Ciudad Juárez, Chihuahua
        </p>
        <p className="font-serif italic text-2xl sm:text-3xl text-white/95 mb-6">
          Estás invitado
        </p>
        <button
          onClick={handleEnter}
          className="inline-flex items-center gap-3 px-10 py-4 rounded-full bg-white/95 text-primary font-sans text-sm tracking-[0.25em] uppercase hover:bg-white transition-all hover:gap-5"
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
            alt="Gisel y Fernando"
            className="w-full h-full object-cover"
            style={{
              objectPosition: "center 30%",
              transform: i === idx ? "scale(1.06)" : "scale(1)",
              transition: "transform 8s ease-out",
            }}
            fetchPriority={i === 0 ? "high" : "auto"}
          />
        </div>
      ))}
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.15), rgba(0,0,0,0.55))" }} />

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 text-white">
        <Reveal delay={200}>
          <div className="text-white/90 text-xs tracking-[0.35em] uppercase mb-6">21 · Agosto · 2026</div>
        </Reveal>
        <Reveal delay={400}>
          <h1 className="font-serif italic text-5xl sm:text-6xl md:text-8xl lg:text-9xl leading-[0.95]">
            Gisel
            <span className="font-script block text-4xl sm:text-5xl md:text-6xl my-2 not-italic" style={{ color: "oklch(0.9 0.05 15)" }}>&</span>
            Fernando
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
            href="#historia"
            className="mt-10 inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-white/95 text-primary font-sans text-sm tracking-[0.2em] uppercase hover:bg-white transition-all hover:gap-5"
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

/* ---------------- OUR STORY ---------------- */
function OurStory() {
  return (
    <section id="historia" className="py-24 md:py-32 px-6 bg-gradient-blush">
      <div className="max-w-3xl mx-auto text-center">
        <Reveal>
          <SectionTitle kicker="Nuestra historia" title="Hoy decimos sí" />
        </Reveal>
        <Reveal delay={120}>
          <p className="font-serif italic text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            "Todo comenzó con un "hola" que, sin imaginarnos, cambiaría nuestras vidas para siempre. Entre risas, aventuras y muchos momentos inolvidables, descubrimos que el mejor lugar para estar siempre sería el uno al lado del otro."
          </p>
        </Reveal>
        <Reveal delay={240}>
          <div className="mt-12 overflow-hidden rounded-sm shadow-soft">
            <img src={detail} alt="Gisel y Fernando" className="w-full aspect-[16/10] object-cover" loading="lazy" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- PARENTS ---------------- */
function ParentsSection() {
  const groups = [
    { title: "Padres de la novia", names: ["Flor Loera Hernández", "Eugenio Ávila Armendáriz"] },
    { title: "Madre del novio", names: ["Yolanda Sotelo Cano"] },
  ];

  return (
    <section className="py-24 md:py-32 px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <SectionTitle kicker="Con amor" title="Nuestros padres" />
        </Reveal>
        <p className="text-center max-w-2xl mx-auto text-muted-foreground italic font-serif text-lg mb-14">
          "Con la bendición de Dios y de nuestros padres, queremos compartir contigo este día tan especial."
        </p>
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {groups.map((g, i) => (
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
function Gallery() {
  const [lightbox, setLightbox] = useState<number | null>(null);
  return (
    <section className="py-24 md:py-32 px-6 bg-gradient-blush">
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <SectionTitle kicker="Galería" title="Momentos juntos" />
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {GALLERY.map((g, i) => (
            <Reveal key={i} delay={(i % 4) * 100}>
              <button
                onClick={() => setLightbox(i)}
                className="group block w-full overflow-hidden rounded-sm shadow-card"
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
    // 21 Aug 2026 18:00 CST → 22 Aug 2026 02:00 CST (UTC-6)
    const start = "20260822T000000Z";
    const end = "20260822T080000Z";
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Boda+Gisel+%26+Fernando&dates=${start}/${end}&details=Acompáñanos+a+celebrar+nuestro+día.&location=${encodeURIComponent(CEREMONY.address)}`;
  };

  return (
    <section className="py-24 md:py-32 px-6 bg-background">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <SectionTitle kicker="Detalles del evento" title="¿Cuándo y dónde?" />
        </Reveal>
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {events.map((ev, i) => (
            <Reveal key={ev.label} delay={i * 120}>
              <article className="bg-card border border-border rounded-sm overflow-hidden shadow-card hover:shadow-soft transition-shadow h-full flex flex-col">
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <img src={ev.image} alt={ev.place} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="p-8 md:p-10 text-center flex flex-col flex-1">
                  <div className="text-3xl mb-3">{ev.icon}</div>
                  <div className="text-xs tracking-[0.3em] uppercase text-gold mb-4">{ev.label}</div>
                  <div className="font-serif text-4xl italic text-primary mb-2">{ev.time}</div>
                  <h3 className="font-serif text-2xl text-foreground mb-2">{ev.place}</h3>
                  <p className="text-muted-foreground text-sm mb-6 flex-1">{ev.address}</p>
                  <a
                    href={ev.maps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 border border-primary text-primary text-xs tracking-[0.2em] uppercase rounded-full hover:bg-primary hover:text-primary-foreground transition-colors self-center"
                  >
                    Cómo llegar →
                  </a>
                </div>
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
              className="inline-flex items-center gap-2 text-sm tracking-[0.2em] uppercase text-gold hover:text-primary transition-colors"
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
    <section className="py-24 md:py-32 px-6 bg-gradient-blush">
      <div className="max-w-5xl mx-auto text-center">
        <Reveal>
          <SectionTitle kicker="Código de vestimenta" title="Formal" />
        </Reveal>
        <Reveal delay={150}>
          <p className="max-w-xl mx-auto text-muted-foreground mb-10">
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
          <div className="max-w-md mx-auto bg-card border border-border rounded-sm p-7">
            <div className="text-4xl mb-3">🌿</div>
            <h4 className="font-serif text-xl text-primary mb-1">Dress code</h4>
            <p className="text-sm text-muted-foreground tracking-wider">Formal · elegante</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- TIMELINE ---------------- */
function Timeline() {
  const items = [
    { time: "6:00 pm", title: "Ceremonia religiosa", icon: "⛪" },
    { time: "9:00 pm", title: "Recepción", icon: "🥂" },
    { time: "10:30 pm", title: "Primer baile", icon: "❤️" },
    { time: "11:00 pm", title: "Fiesta", icon: "🎶" },
  ];

  return (
    <section className="py-24 md:py-32 px-6 bg-background">
      <div className="max-w-3xl mx-auto">
        <Reveal>
          <SectionTitle kicker="Itinerario" title="Programa del evento" />
        </Reveal>
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-accent via-accent/50 to-transparent" />
          {items.map((it, i) => (
            <Reveal key={it.title} delay={i * 100}>
              <div className="relative flex items-center gap-6 mb-8 pl-2">
                <div className="relative z-10 w-14 h-14 rounded-full bg-gradient-gold flex items-center justify-center text-xl shadow-soft shrink-0">
                  {it.icon}
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
function Rsvp() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", attending: "yes", message: "" });
  const submit = useServerFn(submitRsvp);

  const buildWhatsappUrl = (name: string, attending: string, message: string) => {
    const attendText = attending === "yes" ? "Sí" : "No";
    let text = `Hola! Confirmo mi asistencia a la boda de Gisel y Fernando.\nNombre: ${name}\nAsistencia: ${attendText}`;
    if (message.trim()) text += `\nMensaje: ${message.trim()}`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    // Abrir WhatsApp de inmediato dentro del gesto del usuario para evitar bloqueo de popups
    const waUrl = buildWhatsappUrl(form.name.trim(), form.attending, form.message);
    const waWindow = window.open(waUrl, "_blank", "noopener,noreferrer");
    if (!waWindow) window.location.href = waUrl;
    try {
      await submit({
        data: {
          invitation_slug: "gisel-fernando",
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
              <p className="text-muted-foreground mb-6">Hemos recibido tu confirmación. Será un honor celebrar contigo.</p>
              <a
                href={whatsappMsg}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground text-xs tracking-[0.2em] uppercase hover:opacity-90"
              >
                Avisar por WhatsApp
              </a>
            </div>
          </Reveal>
        ) : (
          <Reveal>
            <form onSubmit={onSubmit} className="bg-card border border-border rounded-sm p-7 md:p-10 shadow-soft space-y-5">
              <Field label="Nombre completo">
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-transparent border-b border-border focus:border-primary outline-none py-2"
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
              </Field>
              <Field label="Mensaje para los novios">
                <textarea
                  rows={3}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-transparent border border-border focus:border-primary outline-none p-3 rounded-sm resize-none"
                />
              </Field>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3.5 bg-primary text-primary-foreground tracking-[0.2em] uppercase text-xs rounded-full hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {submitting ? "Enviando..." : "Enviar confirmación"}
                </button>
              </div>
              <p className="text-center text-xs text-muted-foreground pt-2">
                Confirmaciones también por WhatsApp al 656 583 3566
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
      <span className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

/* ---------------- GIFT REGISTRY ---------------- */
function GiftRegistry() {
  return (
    <section className="py-24 md:py-32 px-6 bg-background">
      <div className="max-w-3xl mx-auto text-center">
        <Reveal>
          <SectionTitle kicker="Con cariño" title="Lluvia de sobres" />
        </Reveal>
        <Reveal delay={120}>
          <p className="max-w-xl mx-auto text-muted-foreground italic font-serif mb-10">
            Tu presencia es nuestro mejor regalo. Si deseas obsequiarnos algo más, hemos elegido la
            tradición de la <strong>lluvia de sobres</strong>.
          </p>
        </Reveal>
        <Reveal delay={240}>
          <div className="bg-card border border-border rounded-sm p-10 shadow-soft max-w-md mx-auto">
            <div className="text-6xl mb-5">💌</div>
            <h3 className="font-serif italic text-2xl text-primary mb-3">Lluvia de sobres</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
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
    <section className="py-24 md:py-32 px-6 bg-cream text-center">
      <div className="max-w-3xl mx-auto">
        <Reveal>
          <div className="ornament mb-4">Comparte</div>
          <h2 className="font-serif italic text-4xl md:text-5xl text-primary mb-6">Comparte tus fotos</h2>
        </Reveal>
        <Reveal delay={150}>
          <p className="text-muted-foreground mb-8">Etiquétanos y usa nuestro hashtag para verlas todas en un mismo lugar.</p>
          <div className="inline-block bg-gradient-gold text-primary-foreground font-script text-3xl md:text-4xl px-10 py-5 rounded-full shadow-soft">
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
    { q: "¿Cuál es el código de vestimenta?", a: "Formal · elegante. La paleta de la boda es sage green y tonos rosa suaves, pero cualquier color formal es bienvenido." },
    { q: "¿Dónde es la ceremonia?", a: "En la Parroquia Santísima Trinidad, Chihuahua 712, Melchor Ocampo, Ciudad Juárez, a las 6:00 pm." },
    { q: "¿Dónde es la recepción?", a: "En Lumière Salón de Eventos, Av. Benjamín Franklin 3320, Zona Pronaf, Ciudad Juárez, a las 9:00 pm." },
    { q: "¿Hasta cuándo puedo confirmar?", a: "Te pedimos confirmar tu asistencia antes del 21 de julio de 2026 por WhatsApp al 656 583 3566." },
  ];

  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="py-24 md:py-32 px-6 bg-background">
      <div className="max-w-3xl mx-auto">
        <Reveal>
          <SectionTitle kicker="FAQ" title="Preguntas frecuentes" />
        </Reveal>
        <div className="space-y-3">
          {items.map((it, i) => (
            <Reveal key={i} delay={i * 60}>
              <div className="border border-border bg-card rounded-sm overflow-hidden">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-serif text-lg text-primary pr-4">{it.q}</span>
                  <span className="text-gold text-2xl shrink-0">{open === i ? "−" : "+"}</span>
                </button>
                <div
                  className="px-5 text-muted-foreground text-sm leading-relaxed transition-all"
                  style={{
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
      <img src={heroC} alt="Gisel y Fernando" className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: "center 30%" }} loading="lazy" />
      <div className="absolute inset-0 bg-black/55" />
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
          <div className="mt-8 font-script text-5xl md:text-6xl" style={{ color: "oklch(0.9 0.05 15)" }}>
            Gisel & Fernando
          </div>
        </Reveal>
        <Reveal delay={800}>
          <div className="mt-6 text-xs tracking-[0.4em] uppercase text-white/70">
            21 · 08 · 2026
          </div>
        </Reveal>
      </div>
    </section>
  );
}
