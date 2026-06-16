import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { submitRsvp } from "@/lib/rsvp.functions";
import { toast } from "sonner";
import po17 from "@/assets/priscila-oscar/po-17.jpg.asset.json";
import po19 from "@/assets/priscila-oscar/po-19.jpg.asset.json";
import po23 from "@/assets/priscila-oscar/po-23.jpg.asset.json";
import po28 from "@/assets/priscila-oscar/po-28.jpg.asset.json";
import po29 from "@/assets/priscila-oscar/po-29.jpg.asset.json";

const heroCouple = po23.url;
const couple2 = po17.url;
const couple3 = po19.url;
const engagement = po29.url;
const detail1 = po28.url;

export const Route = createFileRoute("/priscila-oscar")({
  head: () => ({
    meta: [
      { title: "Priscila & Oscar · Nuestra Boda" },
      { name: "description", content: "Invitación de boda de Priscila y Oscar. Una celebración íntima, elegante y atemporal. Confirma tu asistencia." },
      { property: "og:title", content: "Priscila & Oscar · Nuestra Boda" },
      { property: "og:description", content: "Acompáñanos a celebrar nuestro gran día." },
      { property: "og:image", content: po23.url },
      { property: "og:url", content: "https://blcksocial.com/priscila-oscar" },
    ],
    links: [{ rel: "canonical", href: "https://blcksocial.com/priscila-oscar" }],
  }),
  component: WeddingInvitation,
});

const WEDDING_DATE = new Date("2026-11-14T19:00:00");
const HASHTAG = "#PriscilaYOscar2026";
const WHATSAPP_NUMBER = "5216568637484";
const YOUTUBE_SONG_ID = "ks_qOI0lzho";
const VENUE_MAPS = "https://maps.app.goo.gl/fb6ZCWdXrxMd9wwu7";
const VENUE_ADDRESS = "Por confirmar · Ciudad sede del evento";

const GALLERY = [
  { src: po23.url, caption: "Nosotros" },
  { src: po17.url, caption: "Cómplices" },
  { src: po19.url, caption: "Risas" },
  { src: po29.url, caption: "Cerca" },
  { src: po28.url, caption: "Atardecer" },
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
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff / 3600000) % 24);
  const minutes = Math.floor((diff / 60000) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
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
  const [dark, setDark] = useState(true);
  const [lang, setLang] = useState<"es" | "en">("es");
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

  return (
    <div data-theme="luxe" className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <div
        className="fixed top-0 left-0 h-[2px] bg-gradient-gold z-50 transition-[width] duration-150"
        style={{ width: `${progress * 100}%` }}
      />

      <FloatingControls dark={dark} setDark={setDark} lang={lang} setLang={setLang} entered={entered} />

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
      <Transportation />
      <Accommodation />
      <SocialWall />
      <Faq />
      <ThankYou />
    </div>
  );
}

function FloatingControls({
  dark, setDark, lang, setLang, entered,
}: {
  dark: boolean; setDark: (v: boolean) => void;
  lang: "es" | "en"; setLang: (v: "es" | "en") => void;
  entered: boolean;
}) {
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
          className="w-12 h-12 rounded-full bg-gradient-gold text-primary-foreground shadow-soft flex items-center justify-center hover:scale-110 transition-transform"
        >
          {playing ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          )}
        </button>
        <button
          onClick={() => setDark(!dark)}
          aria-label="Cambiar tema"
          className="w-12 h-12 rounded-full bg-card border border-border text-foreground shadow-card flex items-center justify-center hover:scale-110 transition-transform"
        >
          {dark ? "☀" : "☾"}
        </button>
        <button
          onClick={() => setLang(lang === "es" ? "en" : "es")}
          aria-label="Idioma"
          className="w-12 h-12 rounded-full bg-card border border-border text-foreground text-xs font-medium tracking-wider shadow-card flex items-center justify-center hover:scale-110 transition-transform"
        >
          {lang.toUpperCase()}
        </button>
      </div>
    </>
  );
}

function SplashOverlay({ onEnter }: { onEnter: () => void }) {
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
      style={{ background: "linear-gradient(180deg, #0a0a0a, #1a1410)" }}
    >
      <div className="absolute inset-0" style={{ background: "radial-gradient(circle at center, oklch(0.78 0.13 85 / 0.12), transparent 60%)" }} />
      <div className="relative z-10 max-w-lg">
        <div className="ornament mb-6 text-sm tracking-[0.3em]" style={{ color: "oklch(0.82 0.14 85)" }}>14 · Noviembre · 2026</div>
        <h1 className="font-serif italic text-5xl sm:text-6xl md:text-7xl text-white leading-[0.95] mb-4">
          Priscila
          <span className="font-script block text-4xl sm:text-5xl md:text-6xl my-2 not-italic" style={{ color: "oklch(0.82 0.14 85)" }}>&</span>
          Oscar
        </h1>
        <p className="text-white/70 text-xs tracking-[0.25em] uppercase mb-10">
          Nos casamos · Ciudad Juárez, Chihuahua
        </p>
        <p className="font-serif italic text-2xl sm:text-3xl text-white/90 mb-6">
          Estás Invitado
        </p>
        <button
          onClick={handleEnter}
          className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-sans text-sm tracking-[0.2em] uppercase transition-all hover:gap-5"
          style={{ background: "linear-gradient(135deg, oklch(0.82 0.14 85), oklch(0.62 0.12 70))", color: "#0a0a0a" }}
        >
          Ingresa
          <span>→</span>
        </button>
      </div>
    </div>
  );
}

function Hero() {
  const slides = [heroCouple, couple2, couple3];
  const [idx, setIdx] = useState(0);
  const { days, hours, minutes, seconds } = useCountdown(WEDDING_DATE);

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
      {slides.map((src, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-[2000ms] ease-out"
          style={{ opacity: i === idx ? 1 : 0 }}
        >
          <img
            src={src}
            alt="Priscila y Oscar"
            className="w-full h-full object-cover"
            style={{
              transform: i === idx ? "scale(1.06)" : "scale(1)",
              transition: "transform 8s ease-out",
            }}
            fetchPriority={i === 0 ? "high" : "auto"}
          />
        </div>
      ))}
      <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 text-white">
        <Reveal delay={200}>
          <div className="ornament mb-6" style={{ color: "oklch(0.82 0.14 85)" }}>14 · Noviembre · 2026</div>
        </Reveal>
        <Reveal delay={400}>
          <h1 className="font-serif italic text-5xl sm:text-6xl md:text-8xl lg:text-9xl leading-[0.95]">
            Priscila
            <span className="font-script block text-4xl sm:text-5xl md:text-6xl my-2 not-italic" style={{ color: "oklch(0.82 0.14 85)" }}>&</span>
            Oscar
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
                <div className="font-serif text-3xl sm:text-5xl text-white tabular-nums">
                  {String(t.v).padStart(2, "0")}
                </div>
                <div className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-white/70 mt-1">
                  {t.label}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={1100}>
          <a
            href="#historia"
            className="mt-10 inline-flex items-center gap-3 px-8 py-3.5 rounded-full font-sans text-sm tracking-[0.2em] uppercase transition-all hover:gap-5"
            style={{ background: "linear-gradient(135deg, oklch(0.82 0.14 85), oklch(0.62 0.12 70))", color: "#0a0a0a" }}
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
            style={{ backgroundColor: i === idx ? "oklch(0.82 0.14 85)" : "rgba(255,255,255,0.35)" }}
          />
        ))}
      </div>
    </section>
  );
}

function OurStory() {
  const milestones = [
    { date: "Capítulo 1", title: "Cómo nos conocimos", text: "El día en que nuestras miradas se cruzaron por primera vez y todo cambió." },
    { date: "Capítulo 2", title: "El primer 'sí'", text: "Decidimos caminar juntos, sin prisa, descubriendo lo que significaba estar en pareja." },
    { date: "Capítulo 3", title: "Aventuras juntos", text: "Viajes, risas y planes compartidos que fueron construyendo nuestra historia." },
    { date: "Capítulo 4", title: "La propuesta", text: "Una pregunta, una respuesta inmediata y la certeza de que esto era para siempre." },
    { date: "Capítulo 5", title: "El gran día", text: "Hoy queremos celebrarlo contigo, las personas que más amamos." },
  ];
  return (
    <section id="historia" className="py-24 md:py-36 px-6 bg-gradient-blush">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <SectionTitle kicker="Nuestra historia" title="El camino que nos trajo aquí" />
        </Reveal>

        <Reveal delay={150}>
          <div className="mb-16 overflow-hidden rounded-sm shadow-soft">
            <img src={engagement} alt="Priscila y Oscar" className="w-full aspect-[16/10] object-cover" loading="lazy" />
          </div>
        </Reveal>

        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-accent to-transparent" />
          {milestones.map((m, i) => (
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

function ParentsSection() {
  const groups = [
    { title: "Padres de Priscila", names: ["Nombre de la mamá", "Nombre del papá"] },
    { title: "Padres de Oscar", names: ["Nombre de la mamá", "Nombre del papá"] },
  ];
  const padrinos = [
    { role: "Padrinos de velación", names: ["Nombre & Nombre"] },
    { role: "Padrinos de anillos", names: ["Nombre & Nombre"] },
    { role: "Padrinos de arras", names: ["Nombre & Nombre"] },
    { role: "Padrinos de lazo", names: ["Nombre & Nombre"] },
  ];

  return (
    <section className="py-24 md:py-32 px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <SectionTitle kicker="Con amor" title="Padres" />
        </Reveal>
        <p className="text-center max-w-2xl mx-auto text-muted-foreground italic font-serif text-lg mb-14">
          "Con la bendición de Dios y de nuestros padres, queremos compartir contigo este día tan especial."
        </p>
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-20">
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

        <Reveal>
          <SectionTitle kicker="Acompañándonos" title="Nuestros Padrinos" />
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
          {padrinos.map((p, i) => (
            <Reveal key={p.role} delay={i * 100}>
              <div className="bg-card border border-border rounded-sm p-6 text-center shadow-card hover:shadow-soft transition-shadow h-full">
                <div className="text-xs tracking-[0.3em] uppercase text-gold mb-3">{p.role}</div>
                {p.names.map((n) => (
                  <p key={n} className="font-serif text-lg text-primary leading-relaxed">{n}</p>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  const [lightbox, setLightbox] = useState<number | null>(null);
  return (
    <section className="py-24 md:py-32 px-6 bg-gradient-blush">
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <SectionTitle kicker="Galería" title="Momentos juntos" />
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 justify-items-center">
          {GALLERY.map((g, i) => (
            <Reveal key={i} delay={(i % 3) * 100}>
              <button
                onClick={() => setLightbox(i)}
                className={`group block w-full overflow-hidden rounded-sm shadow-card ${i === 0 ? "md:col-span-2 md:row-span-2" : ""}`}
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
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-6 animate-fade-up"
          onClick={() => setLightbox(null)}
        >
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

function EventDetails() {
  const events = [
    { label: "Ceremonia", time: "7:00 pm", place: "Por confirmar", address: VENUE_ADDRESS, maps: VENUE_MAPS },
    { label: "Recepción", time: "9:00 pm – 2:00 am", place: "Por confirmar", address: VENUE_ADDRESS, maps: VENUE_MAPS },
  ];

  const calendarLink = () => {
    const start = "20261115T010000Z";
    const end = "20261115T080000Z";
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Boda+Priscila+%26+Oscar&dates=${start}/${end}&details=Acompáñanos+a+celebrar+nuestro+día.&location=${encodeURIComponent(VENUE_ADDRESS)}`;
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
              <article className="bg-card border border-border rounded-sm p-8 md:p-10 text-center shadow-card hover:shadow-soft transition-shadow h-full">
                <div className="text-xs tracking-[0.3em] uppercase text-gold mb-4">{ev.label}</div>
                <div className="font-serif text-4xl italic text-primary mb-2">{ev.time}</div>
                <h3 className="font-serif text-2xl text-foreground mb-2">{ev.place}</h3>
                <p className="text-muted-foreground text-sm mb-6">{ev.address}</p>
                <a
                  href={ev.maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-primary text-primary text-xs tracking-[0.2em] uppercase rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
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

function DressCode() {
  const palette = ["#0a0a0a", "#1a1a1a", "#f5f0e6", "#d4af37", "#8a6f2a"];
  return (
    <section className="py-24 md:py-32 px-6 bg-gradient-blush">
      <div className="max-w-5xl mx-auto text-center">
        <Reveal>
          <SectionTitle kicker="Código de vestimenta" title="Black Tie · Elegante" />
        </Reveal>
        <Reveal delay={150}>
          <p className="max-w-xl mx-auto text-muted-foreground mb-10">
            Una noche de gala. Te pedimos vestir <strong>formal</strong>: smoking, traje oscuro o vestido largo. Los acentos dorados son bienvenidos.
          </p>
        </Reveal>
        <Reveal delay={250}>
          <div className="flex justify-center gap-3 mb-10 flex-wrap">
            {palette.map((c) => (
              <div key={c} className="w-14 h-14 md:w-20 md:h-20 rounded-full shadow-card ring-2 ring-background" style={{ backgroundColor: c }} />
            ))}
          </div>
        </Reveal>
        <Reveal delay={350}>
          <div className="max-w-md mx-auto bg-card border border-border rounded-sm p-7">
            <div className="text-4xl mb-3">🥂</div>
            <h4 className="font-serif text-xl text-primary mb-1">Dress code</h4>
            <p className="text-sm text-muted-foreground tracking-wider">Black Tie · Negro, blanco y dorado</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Timeline() {
  const items = [
    { time: "7:00 pm", title: "Ceremonia", icon: "💍" },
    { time: "8:00 pm", title: "Coctel de bienvenida", icon: "🥂" },
    { time: "9:00 pm", title: "Cena de gala", icon: "🍽️" },
    { time: "10:30 pm", title: "Primer baile", icon: "💃" },
    { time: "11:00 pm", title: "Fiesta", icon: "🎶" },
    { time: "2:00 am", title: "Despedida", icon: "✨" },
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
            <Reveal key={it.title} delay={i * 80}>
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

function Rsvp() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", attending: "yes", message: "" });
  const submit = useServerFn(submitRsvp);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      await submit({
        data: {
          invitation_slug: "priscila-oscar",
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
              <Field label="Nombre completo">
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-transparent border-b border-border focus:border-accent outline-none py-2"
                />
              </Field>
              <Field label="¿Asistirás?">
                <div className="flex gap-3">
                  {[{ v: "yes", l: "Sí, asistiré" }, { v: "no", l: "No puedo" }].map((o) => (
                    <button
                      type="button"
                      key={o.v}
                      onClick={() => setForm({ ...form, attending: o.v })}
                      className={`flex-1 py-3 rounded-sm text-sm tracking-wider uppercase border transition-colors ${
                        form.attending === o.v
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border text-muted-foreground hover:border-accent"
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
                  className="w-full bg-transparent border border-border focus:border-accent outline-none p-3 rounded-sm resize-none"
                />
              </Field>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-gradient-gold text-primary-foreground tracking-[0.2em] uppercase text-xs rounded-full hover:opacity-90 transition-opacity disabled:opacity-60"
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function GiftRegistry() {
  const gifts = [
    { icon: "💌", title: "Lluvia de sobres", text: "Tendremos un buzón especial el día del evento para recibir tu sobre con todo nuestro cariño." },
    { icon: "🎁", title: "Regalo sorpresa", text: "Si prefieres consentirnos con un detalle especial, lo recibiremos con muchísima ilusión." },
    { icon: "🛍️", title: "Mesa de regalos", text: "Pronto compartiremos los detalles de nuestra mesa de regalos contigo." },
  ];
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
          {gifts.map((g, i) => (
            <Reveal key={g.title} delay={i * 100}>
              <div className="bg-card border border-border rounded-sm p-7 text-center shadow-card hover:shadow-soft hover:-translate-y-1 transition-all h-full flex flex-col">
                <div className="text-4xl mb-4">{g.icon}</div>
                <h3 className="font-serif text-xl text-primary mb-2">{g.title}</h3>
                <p className="text-sm text-muted-foreground flex-1">{g.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 max-w-2xl mx-auto bg-gradient-blush border border-border rounded-sm p-8 md:p-10 shadow-soft">
          <div className="text-center mb-6">
            <div className="text-4xl mb-3">🏦</div>
            <h3 className="font-serif italic text-2xl md:text-3xl text-primary mb-2">Datos bancarios</h3>
            <p className="text-sm text-muted-foreground">Si prefieres hacer una transferencia, aquí tienes nuestros datos.</p>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-border/50 pb-2">
              <span className="text-muted-foreground tracking-wider uppercase text-xs">Beneficiario</span>
              <span className="font-medium text-foreground">Priscila / Oscar</span>
            </div>
            <div className="flex justify-between border-b border-border/50 pb-2">
              <span className="text-muted-foreground tracking-wider uppercase text-xs">Banco</span>
              <span className="font-medium text-foreground">Por confirmar</span>
            </div>
            <div className="flex justify-between border-b border-border/50 pb-2">
              <span className="text-muted-foreground tracking-wider uppercase text-xs">CLABE</span>
              <span className="font-mono text-foreground">000 000 00000000 0000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground tracking-wider uppercase text-xs">Tarjeta</span>
              <span className="font-mono text-foreground">0000 0000 0000 0000</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Transportation() {
  return (
    <section className="py-24 md:py-32 px-6 bg-gradient-blush">
      <div className="max-w-4xl mx-auto">
        <Reveal>
          <SectionTitle kicker="Transporte" title="Cómo llegar" />
        </Reveal>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { icon: "🅿️", title: "Valet Parking", text: "Servicio de valet incluido para todos los invitados." },
            { icon: "🚐", title: "Shuttle privado", text: "Salidas desde los hoteles aliados a las 6:15 pm y 6:45 pm." },
            { icon: "🚕", title: "Taxi/Uber", text: "Disponibilidad amplia en la zona durante toda la noche." },
          ].map((t, i) => (
            <Reveal key={t.title} delay={i * 100}>
              <div className="text-center p-7 bg-card border border-border rounded-sm shadow-card">
                <div className="text-4xl mb-3">{t.icon}</div>
                <h3 className="font-serif text-xl text-primary mb-2">{t.title}</h3>
                <p className="text-sm text-muted-foreground">{t.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Accommodation() {
  const hotels = [
    { name: "Hotel Lucerna", dist: "Zona PRONAF · 10 min del recinto", phone: "+52 656 629 9900", url: "#" },
    { name: "Camino Real Cd. Juárez", dist: "Av. Abraham Lincoln · 15 min", phone: "+52 656 257 6500", url: "#" },
    { name: "City Express Plus", dist: "Consulado · 8 min del recinto", phone: "+52 656 257 6900", url: "#" },
  ];
  return (
    <section className="py-24 md:py-32 px-6 bg-background">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <SectionTitle kicker="Hospedaje" title="Dónde quedarte" />
        </Reveal>
        <p className="text-center max-w-xl mx-auto text-muted-foreground italic font-serif mb-12">
          Hemos seleccionado estas opciones para que tu estancia sea cómoda y cercana al evento.
        </p>
        <div className="grid md:grid-cols-3 gap-5">
          {hotels.map((h, i) => (
            <Reveal key={h.name} delay={i * 100}>
              <div className="bg-card border border-border rounded-sm p-7 shadow-card hover:shadow-soft transition-shadow">
                <h3 className="font-serif text-2xl text-primary mb-2">{h.name}</h3>
                <p className="text-xs tracking-wider uppercase text-gold mb-4">{h.dist}</p>
                <p className="text-sm text-muted-foreground mb-5">{h.phone}</p>
                <a href={h.url} className="text-xs tracking-[0.2em] uppercase text-primary border-b border-accent pb-0.5 hover:opacity-70 transition-opacity">
                  Reservar →
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

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

function Faq() {
  const items = [
    { q: "¿Pueden asistir niños?", a: "Será una celebración para adultos. Agradecemos tu comprensión." },
    { q: "¿Cuál es el código de vestimenta?", a: "Black Tie. Formal y elegante: smoking, traje oscuro o vestido largo." },
    { q: "¿Hay estacionamiento?", a: "Sí, contamos con servicio de valet parking sin costo para los invitados." },
    { q: "¿Habrá transporte desde los hoteles?", a: "Sí, ofrecemos shuttle privado desde los hoteles aliados." },
    { q: "¿Hasta cuándo puedo confirmar?", a: "Te pedimos confirmar tu asistencia antes del 14 de octubre de 2026." },
    { q: "¿Puedo llevar acompañante?", a: "Tu invitación indicará el número de lugares reservados a tu nombre." },
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
                    maxHeight: open === i ? "200px" : "0",
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

function ThankYou() {
  return (
    <section className="relative h-[100svh] min-h-[600px] w-full overflow-hidden">
      <img src={detail1} alt="Priscila y Oscar" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
      <div className="absolute inset-0 bg-black/65" />
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 text-white">
        <Reveal>
          <div className="ornament mb-6" style={{ color: "oklch(0.82 0.14 85)" }}>Gracias</div>
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
          <div className="mt-8 font-script text-5xl md:text-6xl" style={{ color: "oklch(0.82 0.14 85)" }}>
            Priscila & Oscar
          </div>
        </Reveal>
        <Reveal delay={800}>
          <div className="mt-6 text-xs tracking-[0.4em] uppercase text-white/70">
            14 · 11 · 2026
          </div>
        </Reveal>
      </div>
    </section>
  );
}
