import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { submitRsvp } from "@/lib/rsvp.functions";
import { toast } from "sonner";
import p72 from "@/assets/xv-lucia/lucia-72.jpg.asset.json";
import p110 from "@/assets/xv-lucia/lucia-110.jpg.asset.json";
import p159 from "@/assets/xv-lucia/lucia-159.jpg.asset.json";
import p86 from "@/assets/xv-lucia/lucia-86.jpg.asset.json";
import p174 from "@/assets/xv-lucia/lucia-174.jpg.asset.json";
import p74 from "@/assets/xv-lucia/lucia-74.jpg.asset.json";
import floralBg from "@/assets/xv-lucia/floral-bg.jpg.asset.json";
import floralFrame from "@/assets/xv-lucia/lucia-flower-frame.png.asset.json";
import karinaCover from "@/assets/xv-lucia/karina-cover.jpg.asset.json";
import n7262 from "@/assets/xv-lucia/lucia-7262.jpg.asset.json";
import n7263 from "@/assets/xv-lucia/lucia-7263.jpg.asset.json";
import n7264 from "@/assets/xv-lucia/lucia-7264.jpg.asset.json";
import n7265 from "@/assets/xv-lucia/lucia-7265.jpg.asset.json";
import n7266 from "@/assets/xv-lucia/lucia-7266.jpg.asset.json";
import n7267 from "@/assets/xv-lucia/lucia-7267.jpg.asset.json";
import n7268 from "@/assets/xv-lucia/lucia-7268.jpg.asset.json";
import n7269 from "@/assets/xv-lucia/lucia-7269.jpg.asset.json";
import n7270 from "@/assets/xv-lucia/lucia-7270.jpg.asset.json";
import n7271 from "@/assets/xv-lucia/lucia-7271.jpg.asset.json";

const heroCouple = karinaCover.url;
const couple2 = p86.url;
const couple3 = p110.url;
const details = p174.url;
const bouquet = p159.url;
const engagement = p74.url;

export const Route = createFileRoute("/xv-lucia")({
  head: () => ({
    meta: [
      { title: "Lucía · Mis XV Años" },
      { name: "description", content: "Invitación digital de los XV años de Lucía. Acompáñame a celebrar este momento tan especial." },
      { property: "og:title", content: "Lucía · Mis XV Años" },
      { property: "og:description", content: "Acompáñame a celebrar mis XV años." },
      { property: "og:image", content: karinaCover.url },
      { property: "og:url", content: "https://blcksocial.com/xv-lucia" },
    ],
    links: [{ rel: "canonical", href: "https://blcksocial.com/xv-lucia" }],
  }),
  component: WeddingInvitation,
});

const WEDDING_DATE = new Date("2026-10-03T20:00:00");
const HASHTAG = "#LuciaXV2026";
const WHATSAPP_NUMBER = "";
const YOUTUBE_SONG_ID = "gxXo8bWZbWw";
const VENUE_MAPS = "#";
const VENUE_ADDRESS = "Lugar por confirmar";

const GALLERY = [
  { src: p72.url, caption: "Nosotros" },
  { src: p86.url, caption: "Bajo el cielo" },
  { src: p110.url, caption: "Cómplices" },
  { src: p74.url, caption: "Mirada" },
  { src: p174.url, caption: "Juntos" },
  { src: p159.url, caption: "Para siempre" },
  { src: n7262.url, caption: "Entre flores" },
  { src: n7263.url, caption: "Sonrisa" },
  { src: n7264.url, caption: "Mis historias" },
  { src: n7265.url, caption: "Luz de tarde" },
  { src: n7266.url, caption: "Serena" },
  { src: n7267.url, caption: "Atardecer" },
  { src: n7268.url, caption: "Detalles" },
  { src: n7269.url, caption: "Mis libros" },
  { src: n7270.url, caption: "Camino" },
  { src: n7271.url, caption: "Yo" },
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
  const [dark, setDark] = useState(false);
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
    <div
      data-theme="blush"
      className="min-h-screen text-foreground overflow-x-hidden relative"
      style={{
        backgroundColor: "oklch(0.985 0.012 30)",
        backgroundImage: `url(${floralBg.url})`,
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Scroll progress */}
      <div
        className="fixed top-0 left-0 h-[2px] bg-gradient-gold z-50 transition-[width] duration-150"
        style={{ width: `${progress * 100}%` }}
      />

      {/* Floating controls */}
      <FloatingControls dark={dark} setDark={setDark} lang={lang} setLang={setLang} entered={entered} />

      {!entered && <SplashOverlay onEnter={() => setEntered(true)} />}

      <Hero />
      <FloralParallax />
      <OurStory />
      <ParentsSection />
      <Gallery />
      <EventDetails />
      <DressCode />
      <Timeline />
      {/* SpecialMoments removido */}
      <Rsvp />
      <GiftRegistry />
      {/* Hospedaje removido */}
      <Transportation />
      <SocialWall />
      <Faq />
      <ThankYou />
    </div>
  );
}

/* ---------------- FLOATING CONTROLS ---------------- */
function FloatingControls({
  dark,
  setDark,
  lang,
  setLang,
  entered,
}: {
  dark: boolean;
  setDark: (v: boolean) => void;
  lang: "es" | "en";
  setLang: (v: "es" | "en") => void;
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
          className="w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-soft flex items-center justify-center hover:scale-110 transition-transform"
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

/* ---------------- SPLASH OVERLAY ---------------- */
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
      style={{
        backgroundImage: `url(${floralBg.url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* soft cream wash to keep text legible while showing the florals */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, oklch(0.99 0.012 30 / 0.55), oklch(0.96 0.025 25 / 0.75))" }} />
      <div className="relative z-10 max-w-lg">
        <div className="ornament mb-6 text-sm tracking-[0.3em]" style={{ color: "oklch(0.55 0.10 25)" }}>03 · Octubre · 2026</div>
        <h1 className="font-serif italic text-5xl sm:text-6xl md:text-7xl leading-[0.95] mb-4" style={{ color: "oklch(0.32 0.06 25)" }}>
          Lucía
          <span className="font-script block text-3xl sm:text-4xl md:text-5xl my-2 not-italic" style={{ color: "oklch(0.62 0.11 70)" }}>Mis XV Años</span>
        </h1>
        <p className="text-xs tracking-[0.25em] uppercase mb-10" style={{ color: "oklch(0.45 0.06 25)" }}>
          Mis XV Años · Una noche para recordar
        </p>
        <p className="font-serif italic text-2xl sm:text-3xl mb-6" style={{ color: "oklch(0.38 0.06 25)" }}>
          Estás Invitado
        </p>
        <button
          onClick={handleEnter}
          className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-sans text-sm tracking-[0.2em] uppercase transition-all hover:gap-5 shadow-soft"
          style={{ background: "oklch(0.45 0.08 25)", color: "oklch(0.99 0.006 40)" }}
        >
          Ingresa
          <span>→</span>
        </button>
      </div>
    </div>
  );
}

/* ---------------- FLORAL PARALLAX OVERLAY ---------------- */
function FloralParallax() {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY || 0;
        const vh = window.innerHeight || 1;
        setVisible(y > vh * 0.6);
        if (imgRef.current) {
          const offset = (y - vh) * 0.15;
          imgRef.current.style.transform = `translate3d(0, ${offset}px, 0)`;
        }
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[5] overflow-hidden transition-opacity duration-700"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <img
        ref={imgRef}
        src={floralFrame.url}
        alt=""
        className="absolute left-1/2 top-1/2 w-[120vw] max-w-none -translate-x-1/2 -translate-y-1/2 select-none will-change-transform"
        style={{ transform: "translate3d(0,0,0)" }}
      />
    </div>
  );
}

/* ---------------- HERO ---------------- */
function Hero() {
  const slides = [
    { src: heroCouple, position: "center 18%" }, // p72 — face near top
    { src: couple2, position: "center 28%" },    // p86 — face upper third
    { src: couple3, position: "center" },         // p110
  ];
  const [idx, setIdx] = useState(0);
  const { days, hours, minutes, seconds } = useCountdown(WEDDING_DATE);

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
      {slides.map((s, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-[2000ms] ease-out"
          style={{ opacity: i === idx ? 1 : 0 }}
        >
          <img
            src={s.src}
            alt="Lucía"
            className="w-full h-full object-cover object-center md:object-[var(--pos)]"
            style={{
              ["--pos" as any]: s.position,
              transform: i === idx ? "scale(1.06)" : "scale(1)",
              transition: "transform 8s ease-out",
            }}
            fetchPriority={i === 0 ? "high" : "auto"}
          />
        </div>
      ))}
      <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 text-white">
        <Reveal delay={200}>
          <div className="ornament !text-white/90 mb-6">03 · Octubre · 2026</div>
        </Reveal>
        <Reveal delay={400}>
          <h1 className="font-serif italic text-5xl sm:text-6xl md:text-8xl lg:text-9xl leading-[0.95]">
            Lucía
            <span className="font-script text-gold block text-3xl sm:text-4xl md:text-5xl my-2 not-italic">Mis XV Años</span>
          </h1>
        </Reveal>
        <Reveal delay={700}>
          <p className="mt-6 max-w-md font-sans text-xs sm:text-sm tracking-[0.25em] uppercase text-white/85">
            Mis XV Años · Una noche para recordar
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
            className="mt-10 inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-white/95 text-primary font-sans text-sm tracking-[0.2em] uppercase hover:bg-white transition-all hover:gap-5"
          >
            Ver invitación
            <span>→</span>
          </a>
        </Reveal>
      </div>

      {/* Slide dots */}
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
  const milestones = [
    { date: "Capítulo 1", title: "Mi infancia", text: "Los primeros años, llenos de sueños, risas y travesuras." },
    { date: "Capítulo 2", title: "Mi familia", text: "El amor incondicional de quienes me han acompañado siempre." },
    { date: "Capítulo 3", title: "Mis pasiones", text: "Lo que me hace feliz: el baile, la música y mis amigas." },
    { date: "Capítulo 4", title: "Hoy, mis XV", text: "Una nueva etapa que quiero celebrar contigo." },
  ];
  return (
    <section id="historia" className="py-24 md:py-36 px-6 floral-section">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <SectionTitle kicker="Mi historia" title="Mi historia" />
        </Reveal>

        <Reveal delay={150}>
          <div className="mb-16 overflow-hidden rounded-sm shadow-soft">
            <img src={engagement} alt="Lucía" className="w-full aspect-[16/10] object-cover" loading="lazy" />
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

/* ---------------- PARENTS ---------------- */
function ParentsSection() {
  const groups = [
    { title: "Padres de Lucía", names: ["Nombre de la mamá", "Nombre del papá"] },
    { title: "Padrinos", names: ["Nombre de la mamá", "Nombre del papá"] },
  ];

  const padrinos = [
    { role: "Padrino de honor", names: ["Nombre · Nombre"] },
    { role: "Madrina de vals", names: ["Nombre · Nombre"] },
    { role: "Padrino de brindis", names: ["Nombre · Nombre"] },
    { role: "Madrina de ramo", names: ["Nombre · Nombre"] },
  ];

  return (
    <section className="py-24 md:py-32 px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <SectionTitle kicker="Con amor" title="Padres" />
        </Reveal>
        <p className="text-center max-w-2xl mx-auto text-muted-foreground italic font-serif text-lg mb-14">
          "Con la bendición de Dios y el amor de mi familia, quiero compartir contigo este día tan especial."
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
          <SectionTitle kicker="Con amor" title="Mis Padrinos" />
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

/* ---------------- GALLERY ---------------- */
function Gallery() {
  const [lightbox, setLightbox] = useState<number | null>(null);
  return (
    <section className="py-24 md:py-32 px-6 floral-section">
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <SectionTitle kicker="Galería" title="Mis recuerdos" />
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
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6 animate-fade-up"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-5 right-5 w-12 h-12 rounded-full bg-white/10 text-white text-2xl"
            onClick={() => setLightbox(null)}
          >×</button>
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
    {
      label: "Recepción",
      time: "8:00 pm – 2:00 am",
      place: "Salón por confirmar",
      address: VENUE_ADDRESS,
      maps: VENUE_MAPS,
    },
  ];

  const calendarLink = () => {
    // 30 Oct 2026 20:00 → 31 Oct 2026 02:00 (CST = UTC-6)
    const start = "20261004T020000Z";
    const end = "20261004T080000Z";
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=XV+Lucía&dates=${start}/${end}&details=Acompáñame+a+mis+XV.&location=${encodeURIComponent(VENUE_ADDRESS)}`;
  };


  return (
    <section className="py-24 md:py-32 px-6 bg-background">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <SectionTitle kicker="Detalles del evento" title="¿Cuándo y dónde?" />
        </Reveal>
        <div className="grid md:grid-cols-1 gap-6 md:gap-8 max-w-2xl mx-auto">
          {events.map((ev, i) => (
            <Reveal key={ev.label} delay={i * 120}>
              <article className="bg-card border border-border rounded-sm p-8 md:p-10 text-center shadow-card hover:shadow-soft transition-shadow">
                <div className="text-xs tracking-[0.3em] uppercase text-gold mb-4">{ev.label}</div>
                <div className="font-serif text-5xl italic text-primary mb-2">{ev.time}</div>
                <h3 className="font-serif text-2xl text-foreground mb-2">{ev.place}</h3>
                <p className="text-muted-foreground text-sm mb-6">{ev.address}</p>
                <a
                  href={ev.maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-primary text-primary text-xs tracking-[0.2em] uppercase rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  Ubicación próximamente →
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

/* ---------------- DRESS CODE ---------------- */
function DressCode() {
  const palette = ["#000000", "#1a1a1a", "#2b2b2b", "#3d3d3d", "#525252"];
  return (
    <section className="py-24 md:py-32 px-6 bg-gradient-blush">
      <div className="max-w-5xl mx-auto text-center">
        <Reveal>
          <SectionTitle kicker="Código de vestimenta" title="Rosa & Oro · Elegante" />
        </Reveal>
        <Reveal delay={150}>
          <p className="max-w-xl mx-auto text-muted-foreground mb-10">
            Para esta noche tan especial te pedimos vestir <strong>formal</strong> en tonos rosa, dorado, champagne o nude.
          </p>
        </Reveal>
        <Reveal delay={250}>
          <div className="flex justify-center gap-3 mb-10">
            {palette.map((c) => (
              <div key={c} className="text-center">
                <div className="w-14 h-14 md:w-20 md:h-20 rounded-full shadow-card ring-2 ring-background" style={{ backgroundColor: c }} />
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={350}>
          <div className="max-w-md mx-auto bg-card border border-border rounded-sm p-7">
            <div className="text-4xl mb-3">🌹</div>
            <h4 className="font-serif text-xl text-primary mb-1">Dress code</h4>
            <p className="text-sm text-muted-foreground tracking-wider">Formal · evita el blanco y el rosa intenso</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}


/* ---------------- TIMELINE OF DAY ---------------- */
function Timeline() {
  const items = [
    
    { time: "9:00 pm", title: "Vals", icon: "💃" },
    { time: "10:00 pm", title: "Fiesta", icon: "🎶" },
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

/* ---------------- SPECIAL MOMENTS ---------------- */
function SpecialMoments() {
  const moments = [
    { year: "2019", title: "Primera cita", text: "Café y conversación sin fin." },
    { year: "2022", title: "Mudanza juntos", text: "Construyendo un hogar." },
    { year: "2025", title: "Hoy, mis XV", text: "El sí más fácil del mundo." },
    { year: "2026", title: "Nuestra boda", text: "El comienzo de todo." },
  ];
  return (
    <section className="py-24 md:py-32 px-6 bg-cream">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <SectionTitle kicker="Momentos especiales" title="Capítulos de nosotros" />
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {moments.map((m, i) => (
            <Reveal key={m.year} delay={i * 100}>
              <div className="text-center p-6 border border-border bg-card rounded-sm hover:shadow-soft transition-all hover:-translate-y-1">
                <div className="font-serif italic text-5xl text-gold mb-2">{m.year}</div>
                <h4 className="font-serif text-xl text-primary mb-2">{m.title}</h4>
                <p className="text-sm text-muted-foreground">{m.text}</p>
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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      await submit({
        data: {
          invitation_slug: "susana-alan",
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

  const whatsappMsg = useMemo(() => {
    const text = `Hola! Confirmo mi asistencia a la boda de Lucía. Nombre: ${form.name || "(nombre)"}, asistencia: ${form.attending === "yes" ? "Sí" : "No"}`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  }, [form]);

  return (
    <section className="py-24 md:py-32 px-6 floral-section">
      <div className="max-w-2xl mx-auto">
        <Reveal>
          <SectionTitle kicker="Confirmación" title="¿Nos acompañas?" />
        </Reveal>

        {submitted ? (
          <Reveal>
            <div className="text-center bg-card border border-accent/40 rounded-sm p-10 shadow-soft">
              <div className="text-5xl mb-4">💌</div>
              <h3 className="font-serif italic text-3xl text-primary mb-3">¡Gracias, {form.name || "amig@"}!</h3>
              <p className="text-muted-foreground">He recibido tu confirmación. Será un honor celebrar contigo.</p>
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
              <Field label="Mensaje para la quinceañera">
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
  const gifts = [
    { icon: "💌", title: "Lluvia de sobres", text: "Tendremos un buzón especial el día del evento para recibir tu sobre con todo cariño." },
    { icon: "🎁", title: "Regalo sorpresa", text: "Si prefieres consentirnos con un detalle especial, lo recibiré con muchísima ilusión." },
    { icon: "🛍️", title: "Mesa de regalos", text: "Pronto compartiremos los detalles de la mesa de regalos contigo." },
  ];
  return (
    <section className="py-24 md:py-32 px-6 bg-background">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <SectionTitle kicker="Con cariño" title="Opciones de regalo" />
        </Reveal>
        <p className="text-center max-w-xl mx-auto text-muted-foreground italic font-serif mb-12">
          Tu presencia es mi mejor regalo. Si deseas obsequiarme algo más, aquí algunas opciones.
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

        {/* Datos bancarios */}
        <div className="mt-16 max-w-2xl mx-auto bg-gradient-blush border border-border rounded-sm p-8 md:p-10 shadow-soft">
          <div className="text-center mb-6">
            <div className="text-4xl mb-3">🏦</div>
            <h3 className="font-serif italic text-2xl md:text-3xl text-primary mb-2">Datos bancarios</h3>
            <p className="text-sm text-muted-foreground">Si prefieres hacer una transferencia, aquí están los datos.</p>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-border/50 pb-2">
              <span className="text-muted-foreground tracking-wider uppercase text-xs">Beneficiario</span>
              <span className="font-medium text-foreground">Lucía</span>
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

/* ---------------- ACCOMMODATION ---------------- */
function Accommodation() {
  const hotels = [
    { name: "Rosewood San Miguel", dist: "0.8 km del recinto", phone: "+52 415 152 9700", url: "#" },
    { name: "Casa de Sierra Nevada", dist: "1.2 km del recinto", phone: "+52 415 152 7040", url: "#" },
    { name: "Hotel Matilda", dist: "1.5 km del recinto", phone: "+52 415 152 1015", url: "#" },
  ];
  return (
    <section className="py-24 md:py-32 px-6 bg-gradient-blush">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <SectionTitle kicker="Hospedaje" title="Dónde quedarte" />
        </Reveal>
        <div className="grid md:grid-cols-3 gap-5">
          {hotels.map((h, i) => (
            <Reveal key={h.name} delay={i * 100}>
              <div className="bg-card border border-border rounded-sm p-7 shadow-card hover:shadow-soft transition-shadow">
                <h3 className="font-serif text-2xl text-primary mb-2">{h.name}</h3>
                <p className="text-xs tracking-wider uppercase text-gold mb-4">{h.dist}</p>
                <p className="text-sm text-muted-foreground mb-5">{h.phone}</p>
                <a href={h.url} className="text-xs tracking-[0.2em] uppercase text-primary border-b border-primary pb-0.5 hover:opacity-70 transition-opacity">
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

/* ---------------- TRANSPORTATION ---------------- */
function Transportation() {
  return (
    <section className="py-24 md:py-32 px-6 bg-background">
      <div className="max-w-4xl mx-auto">
        <Reveal>
          <SectionTitle kicker="Transporte" title="Ubicación próximamente" />
        </Reveal>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { icon: "🅿️", title: "Estacionamiento", text: "Gratis para invitados." },
            { icon: "🚐", title: "Shuttle", text: "Salidas desde el centro a las 6:30 pm y 7:00 pm." },
            { icon: "🚕", title: "Taxi/Uber", text: "Disponibilidad amplia durante toda la noche." },
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
          <p className="text-muted-foreground mb-8">Etiquétame y usa mi hashtag para verlas todas en un mismo lugar.</p>
          <div className="inline-block bg-gradient-gold text-primary-foreground font-script text-3xl md:text-4xl px-10 py-5 rounded-full shadow-soft">
            {HASHTAG}
          </div>
        </Reveal>
        <Reveal delay={250}>
          <div className="flex justify-center gap-4 mt-10">
            {["Instagram", "Facebook", "WhatsApp"].map((s) => (
              <a
                key={s}
                href="#"
                className="px-5 py-2.5 border border-border rounded-full text-xs tracking-[0.2em] uppercase hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
              >
                {s}
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */
function Faq() {
  const items = [
    { q: "¿Pueden asistir niños?", a: "¡Sí! Los niños son bienvenidos a celebrar con nosotros." },
    { q: "¿Cuál es el código de vestimenta?", a: "Formal — tonos rosa, dorado o nude. Evita el blanco y el rosa fuerte." },
    
    { q: "¿Hay estacionamiento?", a: "Sí, el recinto cuenta con estacionamiento para los invitados." },
    { q: "¿Hasta cuándo puedo confirmar?", a: "Te pedimos confirmar tu asistencia antes del 20 de septiembre de 2026 directamente en esta invitación." },
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

/* ---------------- THANK YOU ---------------- */
function ThankYou() {
  return (
    <section className="relative h-[100svh] min-h-[600px] w-full overflow-hidden">
      <img src={couple3} alt="Lucía" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 text-white">
        <Reveal>
          <div className="ornament !text-white/85 mb-6">Gracias</div>
        </Reveal>
        <Reveal delay={200}>
          <h2 className="font-serif italic text-5xl md:text-7xl max-w-3xl leading-tight">
            Gracias por ser parte de mi historia
          </h2>
        </Reveal>
        <Reveal delay={400}>
          <p className="mt-6 max-w-xl text-white/85 italic font-serif text-lg">
            Tu presencia hará este día aún más inolvidable. Con todo mi cariño,
          </p>
        </Reveal>
        <Reveal delay={600}>
          <div className="mt-8 font-script text-5xl md:text-6xl text-gold">
            Lucía
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
