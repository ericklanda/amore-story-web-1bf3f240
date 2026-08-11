import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useServerFn } from "@tanstack/react-start";
import { submitRsvp } from "@/lib/rsvp.functions";
import { lookupInvitationSendByToken } from "@/lib/invitation-sends.functions";
import { toast } from "sonner";
import marble from "@/assets/krystel/marble.jpg.asset.json";
import marbleInterior from "@/assets/krystel/marble-interior.png.asset.json";

import k1 from "@/assets/xv-krystel/k1.jpg.asset.json";
import k2 from "@/assets/xv-krystel/k2.jpg.asset.json";
import k3 from "@/assets/xv-krystel/k3.jpg.asset.json";
import k4 from "@/assets/xv-krystel/k4.jpg.asset.json";
import k5 from "@/assets/xv-krystel/k5.jpg.asset.json";
import k6 from "@/assets/xv-krystel/k6.jpg.asset.json";
import k7 from "@/assets/xv-krystel/k7.jpg.asset.json";
import k8 from "@/assets/xv-krystel/k8.jpg.asset.json";
import k9 from "@/assets/xv-krystel/k9.jpg.asset.json";
import k10 from "@/assets/xv-krystel/k10.jpg.asset.json";

export const Route = createFileRoute("/xv-krystel")({
  head: () => ({
    meta: [
      { title: "Tania Krystel · Mis XV Años" },
      { name: "description", content: "Invitación digital a los XV años de Tania Krystel. 17 de octubre de 2026, Ejido Benito Juárez." },
      { property: "og:title", content: "Tania Krystel · Mis XV Años" },
      { property: "og:description", content: "Acompáñame a celebrar mis XV años el 17 de octubre de 2026." },
      { property: "og:image", content: k2.url },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: k2.url },
    ],
  }),
  component: KrystelXV,
});

/* -------- Paleta Azul Rey & Oro -------- */
const C = {
  bg: "#F6F2E8",
  bgAlt: "#E7ECF6",
  primary: "#1B3FA0",
  primaryDark: "#122A6B",
  navy: "#1B2A44",
  accent: "#2F5BD0",
  gold: "#C9A24A",
  goldLight: "#E8D5A6",
  text: "#25314A",
  textMuted: "#6B7692",
  card: "#FBFAF5",
  border: "#DCE2F0",
};

/* -------- Datos del evento -------- */
const EVENT_DATE = new Date("2026-10-17T18:00:00-06:00");
const HASHTAG = "#Krystel2026";
const WHATSAPP_NUMBER = "526361121663";

const CEREMONY = {
  name: "Parroquia Cristo Rey",
  address: "Misa de acción de gracias",
  time: "6:00 pm",
  icon: "⛪",
  maps: "https://maps.app.goo.gl/Y7WYK7yXngdGv1rN9?g_st=ac",
};

const VENUE = {
  name: "Gimnasio Municipal Óscar Acosta",
  address: "Ejido Benito Juárez · 8:00 pm a 2:00 am",
  time: "8:00 pm",
  icon: "🥂",
  maps: "https://maps.app.goo.gl/EAGLpzJF63Ctrbku6?g_st=ac",
};

const LUNCH = {
  name: "Salón Marlo",
  address: "Domingo 18 de octubre de 2026",
  time: "Comida",
  icon: "🍽️",
  maps: "https://maps.app.goo.gl/yoUvx2n7QrvYA6mZ8",
};

const WELCOME = [
  "Con inmensa alegría y gratitud a Dios los invitamos a compartir la celebración de los XV años de nuestra hija.",
  "Acompáñenos en este día tan especial.",
];

const STORY_PARAGRAPHS = [
  "Hoy llego a una etapa muy especial de mi vida, rodeada del amor de mi familia y de las personas que más quiero.",
  "Entre la cancha, las risas y los sueños por cumplir, he aprendido que lo más bonito es compartir cada logro con ustedes.",
  "Gracias por acompañarme en el inicio de esta nueva historia. ✨",
];

const PARENTS = [
  { title: "Mis papás", names: ["Luz María Urrutia Acosta", "Rubén Rueda Quezada"] },
  { title: "Padrino de bautismo", names: ["Juan Carlos Urrutia Acosta"] },
  { title: "Madrina de confirmación", names: ["Alejandra Urrutia Acosta"] },
];

const DRESS_CODE_NOTES = [
  "Damas: vestido largo o cocktail",
  "Caballeros: pantalón de vestir, camisa y saco",
  "Colores sugeridos: azules, marino y tonos sobrios",
  "Se recomienda evitar el color blanco, reservado para la quinceañera",
];

const GALLERY = [
  { src: k1.url, caption: "Salón de los murales" },
  { src: k2.url, caption: "Elegancia" },
  { src: k3.url, caption: "Luz de tarde" },
  { src: k4.url, caption: "Con el corazón" },
  { src: k5.url, caption: "Girando" },
  { src: k6.url, caption: "Jardín" },
  { src: k7.url, caption: "Mi pasión" },
  { src: k8.url, caption: "Número 15" },
  { src: k9.url, caption: "En la cancha" },
  { src: k10.url, caption: "Corona y balón" },
];

/* Fondos de mármol azul rey */
const MARBLE_BG = (a1: string, a2: string, fixed = true) => ({
  backgroundImage: `linear-gradient(180deg, ${a1}, ${a2}), url(${marbleInterior.url})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  ...(fixed ? { backgroundAttachment: "fixed" as const } : {}),
});

const SPLASH_BG = (a1: string, a2: string) => ({
  backgroundImage: `linear-gradient(180deg, ${a1}, ${a2}), url(${marble.url})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
});

const SOFT_BG = (tint = "rgba(246,242,232,0.92)") => MARBLE_BG(tint, tint, false);

/* Parallax por scroll */
function useParallax(speed = 0.25) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2 - window.innerHeight / 2;
        setOffset(-center * speed);
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
  }, [speed]);
  return { ref, offset };
}

function ParallaxImage({
  src,
  className = "",
  speed = 0.18,
  overlay,
  position = "center",
  children,
}: {
  src: string;
  className?: string;
  speed?: number;
  overlay?: string;
  position?: string;
  children?: React.ReactNode;
}) {
  const { ref, offset } = useParallax(speed);
  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <div
        className="absolute inset-x-0 -top-[15%] h-[130%] will-change-transform"
        style={{
          backgroundImage: `url(${src})`,
          backgroundSize: "cover",
          backgroundPosition: position,
          transform: `translate3d(0, ${offset}px, 0)`,
        }}
      />
      {overlay && <div className="absolute inset-0" style={{ background: overlay }} />}
      {children && <div className="relative z-10 h-full">{children}</div>}
    </div>
  );
}

/* ---------------- HOOKS ---------------- */
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

function SectionTitle({ kicker, title, light = false }: { kicker?: string; title: string; light?: boolean }) {
  return (
    <div className="text-center mb-12">
      {kicker && (
        <div className="text-xs tracking-[0.35em] uppercase mb-3" style={{ color: light ? C.goldLight : C.gold }}>
          — {kicker} —
        </div>
      )}
      <h2 className="font-serif italic text-4xl md:text-5xl lg:text-6xl" style={{ color: light ? "#fff" : C.primary }}>
        {title}
      </h2>
    </div>
  );
}

/* ---------------- ROOT ---------------- */
function KrystelXV() {
  const [entered, setEntered] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden relative" style={{ backgroundColor: C.bg, color: C.text }}>
      {!entered && <Splash onEnter={() => setEntered(true)} />}
      <MusicPlayer entered={entered} />

      <Hero />
      <Welcome />
      <Countdown />
      <Story />
      <Parents />
      <Gallery />
      <EventDetails />
      <DressCode />
      <Rsvp />
      <GiftRegistry />
      <SocialWall />
      <Faq />
      <ThankYou />
    </div>
  );
}

/* ---------------- MÚSICA ---------------- */
const YOUTUBE_SONG_ID = "DCYmJDO2_IE";

function MusicPlayer({ entered }: { entered: boolean }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [playing, setPlaying] = useState(false);

  const sendCommand = (func: string) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func, args: [] }),
      "*"
    );
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
        title="Música de fondo"
        src={`https://www.youtube.com/embed/${YOUTUBE_SONG_ID}?enablejsapi=1&autoplay=1&loop=1&playlist=${YOUTUBE_SONG_ID}&controls=0&modestbranding=1`}
        allow="autoplay"
        style={{ position: "fixed", width: 1, height: 1, opacity: 0, pointerEvents: "none", border: 0 }}
      />
      <button
        onClick={() => { sendCommand(playing ? "pauseVideo" : "playVideo"); setPlaying(!playing); }}
        aria-label="Reproducir música"
        className="fixed bottom-5 right-5 z-40 w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
        style={{ backgroundColor: C.primary, color: "#fff" }}
      >
        {playing ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" /><rect x="14" y="5" width="4" height="14" /></svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
        )}
      </button>
    </>
  );
}

/* ---------------- SPLASH ---------------- */
function Splash({ onEnter }: { onEnter: () => void }) {
  const [fading, setFading] = useState(false);
  return (
    <div
      className={`fixed inset-0 z-[60] overflow-hidden transition-opacity duration-700 ${fading ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      style={SPLASH_BG("rgba(18,42,107,0.55)", "rgba(11,24,64,0.72)")}
    >
      <div className="absolute inset-0 flex items-center justify-center px-8">
        <div
          className="relative z-10 text-center px-8 py-12 md:px-14 md:py-16 rounded-full max-w-[20rem] md:max-w-md"
          style={{ backgroundColor: "rgba(251,250,245,0.94)", border: `1px solid ${C.goldLight}`, boxShadow: "0 30px 80px -30px rgba(9,20,54,0.7)" }}
        >
          <div className="text-[10px] md:text-xs tracking-[0.35em] uppercase mb-3" style={{ color: C.gold }}>
            17 · Octubre · 2026
          </div>
          <h1 className="font-serif italic text-3xl md:text-5xl leading-tight" style={{ color: C.primaryDark }}>
            Tania Krystel
          </h1>
          <p className="font-script text-2xl md:text-3xl mt-1 mb-4" style={{ color: C.accent }}>
            Mis XV Años
          </p>
          <p className="text-[10px] tracking-[0.3em] uppercase mb-5" style={{ color: C.textMuted }}>
            Estás Invitad@
          </p>
          <button
            onClick={() => {
              setFading(true);
              setTimeout(onEnter, 700);
            }}
            className="inline-flex items-center gap-3 px-7 py-3 rounded-full text-[11px] tracking-[0.2em] uppercase transition-all hover:gap-5 shadow-lg"
            style={{ backgroundColor: C.primary, color: "#fff" }}
          >
            Ingresa <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- HERO ---------------- */
function Hero() {
  return (
    <section className="relative h-[100svh] min-h-[620px] w-full overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(180deg, rgb(18 42 107 / 45%), rgb(6 14 38 / 72%)), url(${k2.url})`,
          backgroundSize: "cover",
          backgroundPosition: "center 25%",
        }}
      />
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 text-white">
        <Reveal delay={200}>
          <div className="text-xs md:text-sm tracking-[0.35em] uppercase mb-6 text-white/90">17 · Octubre · 2026</div>
        </Reveal>
        <Reveal delay={400}>
          <h1 className="font-serif italic text-5xl sm:text-6xl md:text-8xl leading-[0.95]">Tania Krystel</h1>
        </Reveal>
        <Reveal delay={600}>
          <p className="font-script text-6xl md:text-[4rem] mt-3 drop-shadow-lg" style={{ color: C.goldLight }}>
            Mis XV Años
          </p>
        </Reveal>
        <Reveal delay={800}>
          <p className="mt-8 max-w-md text-xs md:text-sm tracking-[0.25em] uppercase text-white/85">
            Una noche para celebrar juntos
          </p>
        </Reveal>
        <Reveal delay={1000}>
          <a
            href="#detalles"
            className="mt-10 inline-flex items-center gap-3 px-8 py-3.5 rounded-full text-sm tracking-[0.2em] uppercase transition-all hover:gap-5"
            style={{ backgroundColor: "#fff", color: C.primaryDark }}
          >
            Ver invitación <span>→</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- WELCOME ---------------- */
function Welcome() {
  return (
    <section className="py-20 md:py-28 px-6" style={SOFT_BG("rgba(231,236,246,0.90)")}>
      <div className="max-w-2xl mx-auto text-center space-y-5">
        <Reveal>
          <div className="text-xs tracking-[0.35em] uppercase mb-2" style={{ color: C.gold }}>— Bienvenid@ —</div>
        </Reveal>
        {WELCOME.map((p, i) => (
          <Reveal key={i} delay={100 + i * 80}>
            <p className="font-serif italic text-base md:text-xl leading-relaxed" style={{ color: C.primaryDark }}>
              {p}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- COUNTDOWN ---------------- */
function Countdown() {
  const { days, hours, minutes, seconds } = useCountdown(EVENT_DATE);
  const items = [
    { label: "Días", v: days },
    { label: "Hrs", v: hours },
    { label: "Min", v: minutes },
    { label: "Seg", v: seconds },
  ];
  return (
    <section className="py-16 md:py-24 px-6" style={MARBLE_BG("rgba(15,33,84,0.62)", "rgba(9,20,54,0.72)")}>
      <div className="max-w-3xl mx-auto text-center">
        <SectionTitle kicker="Cuenta regresiva" title="Falta poco" light />
        <div className="grid grid-cols-4 gap-3 md:gap-6">
          {items.map((t) => (
            <div key={t.label} className="p-5 rounded-sm" style={{ backgroundColor: "rgba(251,250,245,0.94)", border: `1px solid ${C.goldLight}` }}>
              <div className="font-serif text-4xl md:text-5xl tabular-nums" style={{ color: C.primary }}>
                {String(t.v).padStart(2, "0")}
              </div>
              <div className="text-[10px] md:text-xs tracking-[0.3em] uppercase mt-1" style={{ color: C.textMuted }}>
                {t.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- STORY ---------------- */
function Story() {
  return (
    <section id="historia" className="py-24 md:py-32 px-6" style={SOFT_BG("rgba(246,242,232,0.93)")}>
      <div className="max-w-3xl mx-auto">
        <Reveal><SectionTitle kicker="Mi historia" title="Sobre mí" /></Reveal>
        <Reveal delay={100}>
          <div className="mb-12 overflow-hidden rounded-sm shadow-lg">
            <img src={k4.url} alt="Tania Krystel" className="w-full aspect-[16/10] object-cover" style={{ objectPosition: "center 30%" }} loading="lazy" />
          </div>
        </Reveal>
        <div className="space-y-6">
          {STORY_PARAGRAPHS.map((p, i) => (
            <Reveal key={i} delay={i * 100}>
              <p className="font-serif italic text-base md:text-lg leading-relaxed text-center" style={{ color: C.text }}>
                {p}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- PARENTS ---------------- */
function Parents() {
  return (
    <section className="py-24 md:py-32 px-6" style={SOFT_BG("rgba(231,236,246,0.90)")}>
      <div className="max-w-5xl mx-auto">
        <Reveal><SectionTitle kicker="Con amor" title="Mi familia" /></Reveal>
        <p className="text-center max-w-2xl mx-auto font-serif italic text-lg mb-14" style={{ color: C.textMuted }}>
          "Con la bendición de Dios y el amor de mi familia, quiero compartir contigo este día tan especial."
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {PARENTS.map((g) => (
            <Reveal key={g.title}>
              <div className="rounded-sm p-8 text-center shadow-md h-full" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
                <div className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: C.gold }}>{g.title}</div>
                {g.names.map((n) => (
                  <p key={n} className="font-serif text-xl leading-relaxed" style={{ color: C.primary }}>{n}</p>
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
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center", skipSnaps: false });
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi]);

  return (
    <section className="py-24 md:py-32 px-6 overflow-hidden" style={MARBLE_BG("rgba(15,33,84,0.66)", "rgba(9,20,54,0.76)")}>
      <div className="max-w-6xl mx-auto">
        <Reveal><SectionTitle kicker="Galería" title="Mis recuerdos" light /></Reveal>

        <Reveal delay={100}>
          <div className="relative">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex touch-pan-y -ml-4 md:-ml-6 py-2">
                {GALLERY.map((g, i) => (
                  <div key={i} className="pl-4 md:pl-6 shrink-0 grow-0 basis-[78%] sm:basis-[55%] md:basis-[42%] lg:basis-[34%]">
                    <button
                      onClick={() => setLightbox(i)}
                      className="group block w-full overflow-hidden rounded-sm shadow-xl transition-all duration-500"
                      style={{ transform: selected === i ? "scale(1)" : "scale(0.9)", opacity: selected === i ? 1 : 0.6 }}
                    >
                      <img
                        src={g.src}
                        alt={g.caption}
                        className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-[1200ms]"
                        loading="lazy"
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              aria-label="Anterior"
              onClick={() => emblaApi?.scrollPrev()}
              className="absolute left-1 md:-left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full shadow-lg backdrop-blur flex items-center justify-center text-2xl"
              style={{ backgroundColor: C.card, color: C.primary, border: `1px solid ${C.border}` }}
            >
              ‹
            </button>
            <button
              aria-label="Siguiente"
              onClick={() => emblaApi?.scrollNext()}
              className="absolute right-1 md:-right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full shadow-lg backdrop-blur flex items-center justify-center text-2xl"
              style={{ backgroundColor: C.card, color: C.primary, border: `1px solid ${C.border}` }}
            >
              ›
            </button>
          </div>
        </Reveal>

        <p className="text-center mt-6 text-xs tracking-[0.3em] uppercase text-white/80">
          {GALLERY[selected]?.caption}
        </p>

        <div className="flex justify-center gap-2 mt-5">
          {GALLERY.map((_, i) => (
            <button
              key={i}
              aria-label={`Ir a la foto ${i + 1}`}
              onClick={() => emblaApi?.scrollTo(i)}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{ width: selected === i ? "1.75rem" : "0.375rem", backgroundColor: selected === i ? C.gold : "rgba(255,255,255,0.4)" }}
            />
          ))}
        </div>
      </div>

      {lightbox !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6" onClick={() => setLightbox(null)}>
          <button className="absolute top-5 right-5 w-12 h-12 rounded-full bg-white/10 text-white text-2xl" onClick={() => setLightbox(null)}>×</button>
          <button className="absolute left-3 md:left-8 w-12 h-12 rounded-full bg-white/10 text-white text-2xl" onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + GALLERY.length) % GALLERY.length); }}>‹</button>
          <img src={GALLERY[lightbox].src} alt={GALLERY[lightbox].caption} className="max-w-full max-h-[85vh] object-contain" />
          <button className="absolute right-3 md:right-8 w-12 h-12 rounded-full bg-white/10 text-white text-2xl" onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % GALLERY.length); }}>›</button>
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
  const cards = [
    { label: "Misa", ...CEREMONY },
    { label: "Recepción", ...VENUE },
    { label: "Comida", ...LUNCH },
  ];
  const cal = () => {
    const start = "20261018T000000Z";
    const end = "20261018T080000Z";
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=XV+Tania+Krystel&dates=${start}/${end}&details=Acomp%C3%A1%C3%B1ame+a+celebrar+mis+XV+a%C3%B1os&location=${encodeURIComponent(VENUE.name)}`;
  };
  return (
    <section id="detalles" className="py-24 md:py-32 px-6" style={SOFT_BG("rgba(246,242,232,0.93)")}>
      <div className="max-w-5xl mx-auto">
        <Reveal><SectionTitle kicker="Detalles del evento" title="¿Cuándo y dónde?" /></Reveal>
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {cards.map((ev, i) => (
            <Reveal key={ev.label} delay={i * 120}>
              <article className="rounded-sm overflow-hidden shadow-md h-full flex flex-col text-center" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
                <div className="p-8 md:p-10 flex flex-col flex-1">
                  <div className="text-4xl mb-3">{ev.icon}</div>
                  <div className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: C.gold }}>{ev.label}</div>
                  <div className="font-serif italic text-3xl mb-3" style={{ color: C.primary }}>{ev.time}</div>
                  <h3 className="font-serif text-xl mb-2" style={{ color: C.text }}>{ev.name}</h3>
                  <p className="text-sm mb-6 flex-1" style={{ color: C.textMuted }}>{ev.address}</p>
                  <a
                    href={ev.maps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 text-xs tracking-[0.2em] uppercase rounded-full"
                    style={{ backgroundColor: C.primary, color: "#fff" }}
                  >
                    Ver ubicación →
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal delay={200}>
          <div className="text-center mt-10">
            <a href={cal()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm tracking-[0.2em] uppercase" style={{ color: C.primaryDark }}>
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
    <section className="relative py-24 md:py-32 px-6" style={MARBLE_BG("rgba(15,33,84,0.62)", "rgba(9,20,54,0.74)")}>
      <div className="max-w-3xl mx-auto text-center">
        <Reveal><SectionTitle kicker="Código de vestimenta" title="Semiformal" light /></Reveal>
        <Reveal delay={150}>
          <div className="flex justify-center gap-10 my-8 text-5xl">
            <span title="Damas">👗</span>
            <span title="Caballeros">🤵</span>
          </div>
        </Reveal>
        <Reveal delay={250}>
          <div className="max-w-md mx-auto rounded-sm p-7 text-left shadow-xl" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
            <p className="text-sm mb-4" style={{ color: C.text }}>
              Para que esta celebración sea aún más especial, les pedimos amablemente asistir con vestimenta semiformal:
            </p>
            <ul className="space-y-2 text-sm" style={{ color: C.text }}>
              {DRESS_CODE_NOTES.map((n) => (
                <li key={n} className="flex gap-3">
                  <span style={{ color: C.accent }}>•</span>
                  <span>{n}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- RSVP ---------------- */
function Rsvp() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", attending: "yes", message: "" });
  const [guests, setGuests] = useState(1);
  const [invite, setInvite] = useState<{ guest_name: string | null; guests_allowed: number } | null>(null);
  const submit = useServerFn(submitRsvp);
  const lookup = useServerFn(lookupInvitationSendByToken);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const token = params.get("i");
    if (!token) return;
    lookup({ data: { token } })
      .then((res) => {
        if (res?.row) {
          setInvite({ guest_name: res.row.guest_name, guests_allowed: res.row.guests_allowed });
          setGuests(res.row.guests_allowed);
          if (res.row.guest_name) {
            setForm((f) => (f.name ? f : { ...f, name: res.row!.guest_name! }));
          }
        }
      })
      .catch(() => {});
  }, [lookup]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    const text =
      `Hola! Confirmo asistencia a los XV de Tania Krystel.\n` +
      `Nombre: ${form.name}\n` +
      `Asistencia: ${form.attending === "yes" ? "Sí" : "No"}` +
      `\nPersonas: ${form.attending === "yes" ? guests : 0}` +
      (invite ? `\nLugares reservados: ${invite.guests_allowed}` : "") +
      (form.message ? `\nMensaje: ${form.message}` : "");
    const wa = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    const w = window.open(wa, "_blank", "noopener,noreferrer");
    if (!w) window.location.href = wa;

    try {
      await submit({
        data: {
          invitation_slug: "xv-krystel",
          name: form.name.trim(),
          attending: form.attending as "yes" | "no",
          guests: form.attending === "yes" ? guests : 0,
          message: form.message || null,
        },
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      toast.error("No pudimos guardar tu confirmación, pero WhatsApp ya se abrió.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative py-24 md:py-32 px-6" style={SOFT_BG("rgba(231,236,246,0.90)")}>
      <div className="max-w-2xl mx-auto">
        <Reveal><SectionTitle kicker="Confirmación" title="¿Me acompañas?" /></Reveal>
        {submitted ? (
          <div className="text-center rounded-sm p-10 shadow-md" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
            <div className="text-5xl mb-4">💌</div>
            <h3 className="font-serif italic text-3xl mb-3" style={{ color: C.primary }}>¡Gracias, {form.name || "amig@"}!</h3>
            <p style={{ color: C.textMuted }}>He recibido tu confirmación. Nos vemos el 17 de octubre.</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="rounded-sm p-7 md:p-10 shadow-md space-y-5" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
            {invite && (
              <div className="text-center rounded-sm px-4 py-3 text-sm" style={{ backgroundColor: C.bg, border: `1px solid ${C.border}`, color: C.textMuted }}>
                {invite.guest_name ? <span className="font-medium" style={{ color: C.primary }}>{invite.guest_name}</span> : "Invitación personal"}
                {" · "}
                <span>{invite.guests_allowed} {invite.guests_allowed === 1 ? "lugar reservado" : "lugares reservados"}</span>
              </div>
            )}
            <Field label="Nombre completo">
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-transparent border-b outline-none py-2" style={{ borderColor: C.border }} />
            </Field>
            <Field label="¿Asistirás?">
              <div className="flex gap-3">
                {[{ v: "yes", l: "Sí, asistiré" }, { v: "no", l: "No puedo" }].map((o) => (
                  <button
                    key={o.v}
                    type="button"
                    onClick={() => setForm({ ...form, attending: o.v })}
                    className="flex-1 py-3 rounded-sm text-sm tracking-wider uppercase border transition-colors"
                    style={
                      form.attending === o.v
                        ? { backgroundColor: C.primary, color: "#fff", borderColor: C.primary }
                        : { borderColor: C.border, color: C.textMuted }
                    }
                  >
                    {o.l}
                  </button>
                ))}
              </div>
            </Field>
            {form.attending === "yes" && (
              <Field label="Número de personas">
                <input
                  type="number"
                  min={1}
                  max={invite?.guests_allowed ?? 10}
                  value={guests}
                  onChange={(e) => setGuests(Math.max(1, Number(e.target.value) || 1))}
                  className="w-full bg-transparent border-b outline-none py-2"
                  style={{ borderColor: C.border }}
                />
              </Field>
            )}
            <Field label="Mensaje para Krystel (opcional)">
              <textarea rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full bg-transparent border outline-none p-3 rounded-sm resize-none" style={{ borderColor: C.border }} />
            </Field>
            <p className="text-xs text-center leading-relaxed rounded-sm px-4 py-3" style={{ backgroundColor: C.bgAlt, border: `1px solid ${C.border}`, color: C.text }}>
              Esta invitación es <strong>personal e intransferible</strong> y válida únicamente para el número de personas indicado.
            </p>
            <button
              type="submit"
              disabled={submitting || !form.name.trim()}
              className="w-full py-3.5 tracking-[0.2em] uppercase text-xs rounded-full transition-opacity disabled:opacity-60"
              style={{ backgroundColor: C.primary, color: "#fff" }}
            >
              {submitting ? "Enviando..." : "Enviar confirmación por WhatsApp"}
            </button>
            <p className="text-[11px] text-center italic" style={{ color: C.textMuted }}>
              Al enviar, se abrirá WhatsApp con tu mensaje listo para enviar.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: C.textMuted }}>{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

/* ---------------- GIFT REGISTRY ---------------- */
function GiftRegistry() {
  return (
    <section className="py-24 md:py-32 px-6" style={SOFT_BG("rgba(246,242,232,0.93)")}>
      <div className="max-w-3xl mx-auto text-center">
        <Reveal><SectionTitle kicker="Con cariño" title="Mesa de regalos" /></Reveal>
        <Reveal delay={150}>
          <p className="font-serif italic text-lg mb-10" style={{ color: C.textMuted }}>
            El mejor regalo será compartir contigo este día tan especial.
          </p>
        </Reveal>
        <Reveal delay={250}>
          <div className="max-w-md mx-auto rounded-sm p-10 shadow-md" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
            <div className="text-5xl mb-4">💌</div>
            <h3 className="font-serif italic text-2xl mb-2" style={{ color: C.primary }}>Buzón de dinero</h3>
            <p className="text-sm" style={{ color: C.textMuted }}>
              Para quienes deseen tener un detalle conmigo, habrá un buzón destinado a sobres.
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
    <section className="py-24 md:py-32 px-6 text-center" style={SOFT_BG("rgba(231,236,246,0.90)")}>
      <div className="max-w-3xl mx-auto">
        <Reveal>
          <div className="text-xs tracking-[0.35em] uppercase mb-3" style={{ color: C.gold }}>— Comparte —</div>
          <h2 className="font-serif italic text-4xl md:text-5xl mb-6" style={{ color: C.primary }}>Comparte tus fotos</h2>
        </Reveal>
        <Reveal delay={150}>
          <p className="mb-8" style={{ color: C.textMuted }}>Etiquétame y usa mi hashtag para verlas todas en un mismo lugar.</p>
          <div className="inline-block font-script text-2xl md:text-4xl px-10 py-5 rounded-full shadow-md" style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.gold})`, color: "#fff" }}>
            {HASHTAG}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */
function Faq() {
  const items = useMemo(
    () => [
      { q: "¿Cuál es el código de vestimenta?", a: "Semiformal. Se recomienda evitar el color blanco, reservado para la quinceañera." },
      { q: "¿Puedo llevar acompañante?", a: "Los lugares son los indicados en tu invitación personal. Confírmalos en la sección de confirmación." },
      { q: "¿Dónde será la celebración?", a: "La misa en la Parroquia Cristo Rey a las 6:00 pm y la recepción en el Gimnasio Municipal Óscar Acosta, Ejido Benito Juárez, de 8:00 pm a 2:00 am." },
      { q: "¿Habrá comida al día siguiente?", a: "Sí, el domingo 18 de octubre de 2026 en el Salón Marlo." },
      { q: "¿Hasta cuándo puedo confirmar?", a: "Te pedimos confirmar antes del 1 de octubre de 2026 directamente en esta invitación." },
    ],
    []
  );
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="py-24 md:py-32 px-6" style={SOFT_BG("rgba(246,242,232,0.93)")}>
      <div className="max-w-3xl mx-auto">
        <Reveal><SectionTitle kicker="FAQ" title="Preguntas frecuentes" /></Reveal>
        <div className="space-y-3">
          {items.map((it, i) => (
            <Reveal key={i} delay={i * 60}>
              <div className="rounded-sm overflow-hidden" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
                <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
                  <span className="font-serif text-lg pr-4" style={{ color: C.primary }}>{it.q}</span>
                  <span className="text-2xl shrink-0" style={{ color: C.gold }}>{open === i ? "−" : "+"}</span>
                </button>
                <div
                  className="px-5 text-sm leading-relaxed transition-all"
                  style={{ color: C.textMuted, maxHeight: open === i ? "260px" : 0, paddingBottom: open === i ? "1.25rem" : 0, overflow: "hidden" }}
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
    <section
      className="relative h-[100svh] min-h-[600px] w-full overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(9,20,54,0.55), rgba(9,20,54,0.68)), url(${k5.url})`,
        backgroundSize: "cover",
        backgroundPosition: "center 25%",
      }}
    >
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 text-white">
        <div className="text-xs tracking-[0.4em] uppercase mb-6 text-white/85">Gracias</div>
        <h2 className="font-serif italic text-4xl md:text-7xl max-w-3xl leading-tight">Gracias por ser parte de mi historia</h2>
        <p className="mt-6 max-w-xl italic font-serif text-lg text-white/85">
          Tu presencia hará este día aún más inolvidable. Con todo mi cariño,
        </p>
        <div className="mt-8 font-script text-4xl md:text-6xl" style={{ color: C.goldLight }}>
          Tania Krystel
        </div>
        <div className="mt-6 text-xs tracking-[0.4em] uppercase text-white/70">17 · 10 · 2026</div>
      </div>
    </section>
  );
}
