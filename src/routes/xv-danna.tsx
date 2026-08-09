import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useServerFn } from "@tanstack/react-start";
import { submitRsvp } from "@/lib/rsvp.functions";
import { lookupInvitationSendByToken } from "@/lib/invitation-sends.functions";
import { toast } from "sonner";
import silk from "@/assets/xv-danna/silk.jpg.asset.json";
import splashBg from "@/assets/xv-danna/splash-bg.jpg.asset.json";
import floralSoft from "@/assets/xv-danna/floral-soft.jpg.asset.json";
import iglesiaImg from "@/assets/xv-danna/iglesia.png.asset.json";
import recepcionImg from "@/assets/xv-danna/recepcion.png.asset.json";

import d5 from "@/assets/xv-danna/d5.jpg.asset.json";
import d18 from "@/assets/xv-danna/d18.jpg.asset.json";
import d46 from "@/assets/xv-danna/d46.jpg.asset.json";
import d58 from "@/assets/xv-danna/d58.jpg.asset.json";
import d65 from "@/assets/xv-danna/d65.jpg.asset.json";
import d92 from "@/assets/xv-danna/d92.jpg.asset.json";
import d141 from "@/assets/xv-danna/d141.jpg.asset.json";
import d154 from "@/assets/xv-danna/d154.jpg.asset.json";
import d174 from "@/assets/xv-danna/d174.jpg.asset.json";
import d176 from "@/assets/xv-danna/d176.jpg.asset.json";

export const Route = createFileRoute("/xv-danna")({
  head: () => ({
    meta: [
      { title: "Danna Joaquina · Mis XV Años" },
      { name: "description", content: "Invitación digital a los XV años de Danna Joaquina. 16 de octubre de 2026, Quinta El Vergel." },
      { property: "og:title", content: "Danna Joaquina · Mis XV Años" },
      { property: "og:description", content: "Acompáñame a celebrar mis XV años el 16 de octubre de 2026." },
      { property: "og:image", content: d18.url },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: d18.url },
    ],
  }),
  component: DannaXV,
});

/* -------- Paleta Sage & Rosa -------- */
const C = {
  bg: "#F5EDE4",
  bgAlt: "#EED8CC",
  sage: "#A9B49B",
  sageDark: "#7A8A6E",
  rose: "#D9B8AE",
  primary: "#7A8A6E",
  primaryDark: "#5C6B52",
  accent: "#C79A8C",
  gold: "#B99461",
  text: "#4A443E",
  textMuted: "#8B8279",
  card: "#FBF7F2",
  border: "#E2D6C9",
};

/* -------- Datos del evento -------- */
const EVENT_DATE = new Date("2026-10-16T19:00:00-06:00");
const HASHTAG = "#Dannasquince26";
const WHATSAPP_NUMBER = "529157402244";

const CEREMONY = {
  name: "Parroquia San Mateo",
  address: "Ceremonia religiosa",
  time: "4:00 pm",
  photo: iglesiaImg.url,
  maps: "https://www.google.com/maps/search/Parroquia+San+Mateo",
};

const VENUE = {
  name: "Quinta El Vergel",
  address: "Recepción y celebración",
  time: "9:00 pm",
  photo: recepcionImg.url,
  maps: "https://maps.google.com/maps/place//data=!4m2!3m1!1s0x86e74386ac8aecef:0x9269787617dfec3b",
};


const WELCOME = [
  "Con gran alegría y emoción, quiero compartir contigo uno de los momentos más especiales de mi vida.",
  "Ha llegado el momento de celebrar mis XV años, una etapa que comienza llena de sueños, ilusiones y nuevas experiencias.",
  "Será un honor contar con tu presencia en esta noche tan especial, en la que celebraré junto a mi familia y seres queridos el inicio de un nuevo capítulo de mi vida.",
  "Espero que nos acompañes y seas parte de este recuerdo que guardaré por siempre en mi corazón.",
];

const STORY_PARAGRAPHS = [
  "Desde pequeña he soñado con este momento, imaginando una noche llena de magia y alegría.",
  "Hoy, al llegar a mis XV años, miro atrás con gratitud por cada enseñanza y cada persona que ha sido parte de mi vida.",
  "Comienza una nueva etapa llena de sueños y nuevas ilusiones, rodeada del amor de mi familia y seres queridos.",
  "Esta noche no es el final de un cuento… es el comienzo de una nueva historia. 👑✨",
];

const PARENTS = [
  { title: "Mis papás", names: ["Pedro Paredes", "Dayanara Paredes"] },
  { title: "Mis padrinos", names: ["Mario Hinojos", "Jazmín Monjer de Hinojos"] },
  { title: "Chambelán de honor", names: ["Pedro Damián Paredes"] },
];

const DRESS_CODE_NOTES = [
  "Damas: vestido largo o de gala",
  "Caballeros: traje formal obligatorio",
  "Colores sugeridos: tonos elegantes y sobrios",
  "Se recomienda evitar el color blanco, reservado para la quinceañera",
];

const GALLERY = [
  { src: d5.url, caption: "Sonrisa" },
  { src: d18.url, caption: "Mirada" },
  { src: d46.url, caption: "Ciudad" },
  { src: d58.url, caption: "Paseo" },
  { src: d65.url, caption: "Jardín" },
  { src: d92.url, caption: "Patio" },
  { src: d141.url, caption: "Mi pasión" },
  { src: d154.url, caption: "Cancha" },
  { src: d174.url, caption: "Portón" },
  { src: d176.url, caption: "Tarde dorada" },
];

const SILK_BG = (a1: string, a2: string) => ({
  backgroundImage: `linear-gradient(180deg, ${a1}, ${a2}), url(${silk.url})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundAttachment: "fixed",
});

const SOFT_BG = (tint = "rgba(245,237,228,0.55)") => ({
  backgroundImage: `linear-gradient(180deg, ${tint}, ${tint}), url(${floralSoft.url})`,
  backgroundSize: "760px auto",
  backgroundRepeat: "repeat",
  backgroundPosition: "center",
});


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
        <div className="text-xs tracking-[0.35em] uppercase mb-3" style={{ color: light ? "#EED8CC" : C.gold }}>
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
function DannaXV() {
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
const YOUTUBE_SONG_ID = "md4Eav4rhFM";

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
      style={{ backgroundColor: C.bg }}
    >
      {/* arte floral inspirado en la referencia */}
      <img
        src={splashBg.url}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
      />
      <div className="absolute inset-0 flex items-center justify-center px-8">
        {/* contenido alineado dentro del arco claro */}
        <div className="relative z-10 text-center max-w-[19rem] md:max-w-sm">

          <div className="text-[10px] md:text-xs tracking-[0.35em] uppercase mb-3" style={{ color: C.sageDark }}>
            16 · Octubre · 2026
          </div>
          <h1 className="font-serif italic text-3xl md:text-5xl leading-tight" style={{ color: C.primaryDark }}>
            Danna Joaquina
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
          backgroundImage: `linear-gradient(180deg, rgb(74 68 62 / 45%), rgb(0 0 0 / 65%)), url(${d18.url})`,
          backgroundSize: "cover",
          backgroundPosition: "center 25%",
        }}
      />
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 text-white">
        <Reveal delay={200}>
          <div className="text-xs md:text-sm tracking-[0.35em] uppercase mb-6 text-white/90">16 · Octubre · 2026</div>
        </Reveal>
        <Reveal delay={400}>
          <h1 className="font-serif italic text-5xl sm:text-6xl md:text-8xl leading-[0.95]">Danna Joaquina</h1>
        </Reveal>
        <Reveal delay={600}>
          <p className="font-script text-6xl md:text-[4rem] mt-3 drop-shadow-lg" style={{ color: "#EED8CC" }}>
            Mis XV Años
          </p>
        </Reveal>
        <Reveal delay={800}>
          <p className="mt-8 max-w-md text-xs md:text-sm tracking-[0.25em] uppercase text-white/85">
            Una noche llena de magia y alegría
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
    <section className="py-20 md:py-28 px-6" style={SOFT_BG("rgba(238,216,204,0.78)")}>
      <div className="max-w-2xl mx-auto text-center space-y-5">
        <Reveal>
          <div className="text-xs tracking-[0.35em] uppercase mb-2" style={{ color: C.sageDark }}>— Bienvenid@ —</div>
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

/* ---------------- COUNTDOWN (seda) ---------------- */
function Countdown() {
  const { days, hours, minutes, seconds } = useCountdown(EVENT_DATE);
  const items = [
    { label: "Días", v: days },
    { label: "Hrs", v: hours },
    { label: "Min", v: minutes },
    { label: "Seg", v: seconds },
  ];
  return (
    <section className="py-16 md:py-24 px-6" style={SILK_BG("rgba(245,237,228,0.82)", "rgba(245,237,228,0.88)")}>
      <div className="max-w-3xl mx-auto text-center">
        <SectionTitle kicker="Cuenta regresiva" title="Falta poco" />
        <div className="grid grid-cols-4 gap-3 md:gap-6">
          {items.map((t) => (
            <div key={t.label} className="p-5 rounded-sm" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
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
    <section id="historia" className="py-24 md:py-32 px-6" style={SOFT_BG("rgba(245,237,228,0.70)")}>
      <div className="max-w-3xl mx-auto">
        <Reveal><SectionTitle kicker="Mi historia" title="Sobre mí" /></Reveal>
        <Reveal delay={100}>
          <div className="mb-12 overflow-hidden rounded-sm shadow-lg">
            <img src={d65.url} alt="Danna Joaquina" className="w-full aspect-[16/10] object-cover" style={{ objectPosition: "center 30%" }} loading="lazy" />
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
    <section className="py-24 md:py-32 px-6" style={SOFT_BG("rgba(238,216,204,0.78)")}>
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

/* ---------------- GALLERY (carrusel, seda) ---------------- */
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
    <section className="py-24 md:py-32 px-6 overflow-hidden" style={SILK_BG("rgba(238,216,204,0.80)", "rgba(245,237,228,0.86)")}>
      <div className="max-w-6xl mx-auto">
        <Reveal><SectionTitle kicker="Galería" title="Mis recuerdos" /></Reveal>

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

        <p className="text-center mt-6 text-xs tracking-[0.3em] uppercase" style={{ color: C.textMuted }}>
          {GALLERY[selected]?.caption}
        </p>

        <div className="flex justify-center gap-2 mt-5">
          {GALLERY.map((_, i) => (
            <button
              key={i}
              aria-label={`Ir a la foto ${i + 1}`}
              onClick={() => emblaApi?.scrollTo(i)}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{ width: selected === i ? "1.75rem" : "0.375rem", backgroundColor: selected === i ? C.gold : C.border }}
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
    { label: "Ceremonia Religiosa", ...CEREMONY, icon: "⛪" },
    { label: "Recepción", ...VENUE, icon: "🥂" },
  ];
  const cal = () => {
    const start = "20261017T010000Z";
    const end = "20261017T060000Z";
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=XV+Danna+Joaquina&dates=${start}/${end}&details=Acomp%C3%A1%C3%B1ame+a+celebrar+mis+XV+a%C3%B1os&location=${encodeURIComponent(VENUE.name)}`;
  };
  return (
    <section id="detalles" className="py-24 md:py-32 px-6" style={SOFT_BG("rgba(245,237,228,0.70)")}>
      <div className="max-w-5xl mx-auto">
        <Reveal><SectionTitle kicker="Detalles del evento" title="¿Cuándo y dónde?" /></Reveal>
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {cards.map((ev, i) => (
            <Reveal key={ev.label} delay={i * 120}>
              <article className="rounded-sm overflow-hidden shadow-md h-full flex flex-col text-center" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
                <img src={ev.photo} alt={ev.name} loading="lazy" className="w-full h-48 md:h-56 object-cover" />
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

/* ---------------- DRESS CODE (seda oscura) ---------------- */
function DressCode() {
  return (
    <section className="relative py-24 md:py-32 px-6" style={SILK_BG("rgba(92,107,82,0.55)", "rgba(122,138,110,0.55)")}>
      <div className="max-w-3xl mx-auto text-center">
        <Reveal><SectionTitle kicker="Código de vestimenta" title="Formal" light /></Reveal>
        <Reveal delay={150}>
          <div className="flex justify-center gap-10 my-8 text-5xl">
            <span title="Damas">👗</span>
            <span title="Caballeros">🤵</span>
          </div>
        </Reveal>
        <Reveal delay={250}>
          <div className="max-w-md mx-auto rounded-sm p-7 text-left shadow-xl" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
            <p className="text-sm mb-4" style={{ color: C.text }}>
              Con el propósito de hacer de esta celebración un evento aún más especial y armonioso, les solicito amablemente asistir con vestimenta formal:
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
      `Hola! Confirmo asistencia a los XV de Danna Joaquina.\n` +
      `Nombre: ${form.name}\n` +
      `Asistencia: ${form.attending === "yes" ? "Sí" : "No"}` +
      (invite ? `\nLugares reservados: ${invite.guests_allowed}` : "") +
      (form.message ? `\nMensaje: ${form.message}` : "");
    const wa = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    const w = window.open(wa, "_blank", "noopener,noreferrer");
    if (!w) window.location.href = wa;

    try {
      await submit({
        data: {
          invitation_slug: "xv-danna",
          name: form.name.trim(),
          attending: form.attending as "yes" | "no",
          guests: invite?.guests_allowed ?? 1,
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
    <section className="relative py-24 md:py-32 px-6" style={SOFT_BG("rgba(238,216,204,0.78)")}>
      <div className="max-w-2xl mx-auto">
        <Reveal><SectionTitle kicker="Confirmación" title="¿Me acompañas?" /></Reveal>
        {submitted ? (
          <div className="text-center rounded-sm p-10 shadow-md" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
            <div className="text-5xl mb-4">💌</div>
            <h3 className="font-serif italic text-3xl mb-3" style={{ color: C.primary }}>¡Gracias, {form.name || "amig@"}!</h3>
            <p style={{ color: C.textMuted }}>He recibido tu confirmación. Nos vemos el 16 de octubre.</p>
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
            <Field label="Mensaje para Danna (opcional)">
              <textarea rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full bg-transparent border outline-none p-3 rounded-sm resize-none" style={{ borderColor: C.border }} />
            </Field>
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
    <section className="py-24 md:py-32 px-6" style={SOFT_BG("rgba(245,237,228,0.70)")}>
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
            <h3 className="font-serif italic text-2xl mb-2" style={{ color: C.primary }}>Baúl de sobres</h3>
            <p className="text-sm" style={{ color: C.textMuted }}>
              Para quienes deseen tener un detalle conmigo, habrá un baúl destinado a sobres de dinero.
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
    <section className="py-24 md:py-32 px-6 text-center" style={SOFT_BG("rgba(238,216,204,0.78)")}>
      <div className="max-w-3xl mx-auto">
        <Reveal>
          <div className="text-xs tracking-[0.35em] uppercase mb-3" style={{ color: C.sageDark }}>— Comparte —</div>
          <h2 className="font-serif italic text-4xl md:text-5xl mb-6" style={{ color: C.primary }}>Comparte tus fotos</h2>
        </Reveal>
        <Reveal delay={150}>
          <p className="mb-8" style={{ color: C.textMuted }}>Etiquétame y usa mi hashtag para verlas todas en un mismo lugar.</p>
          <div className="inline-block font-script text-2xl md:text-4xl px-10 py-5 rounded-full shadow-md" style={{ background: `linear-gradient(135deg, ${C.rose}, ${C.sage})`, color: "#fff" }}>
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
      { q: "¿Cuál es el código de vestimenta?", a: "Formal: vestido largo o de gala para damas y traje formal para caballeros. Se recomienda evitar el blanco." },
      { q: "¿Puedo llevar acompañante?", a: "Los lugares son los indicados en tu invitación personal. Confirma en la sección de confirmación para reservarlos." },
      { q: "¿Dónde será la celebración?", a: "La ceremonia religiosa en la Parroquia San Mateo y la recepción en Quinta El Vergel." },
      { q: "¿Hasta cuándo puedo confirmar?", a: "Te pido confirmar antes del 1 de octubre de 2026 directamente en esta invitación." },
    ],
    []
  );
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="py-24 md:py-32 px-6" style={SOFT_BG("rgba(245,237,228,0.70)")}>
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
                  style={{ color: C.textMuted, maxHeight: open === i ? "220px" : 0, paddingBottom: open === i ? "1.25rem" : 0, overflow: "hidden" }}
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
        backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.45), rgba(0,0,0,0.55)), url(${d176.url})`,
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
        <div className="mt-8 font-script text-4xl md:text-6xl" style={{ color: "#EED8CC" }}>
          Danna Joaquina
        </div>
        <div className="mt-6 text-xs tracking-[0.4em] uppercase text-white/70">16 · 10 · 2026</div>
      </div>
    </section>
  );
}
