import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { submitRsvp } from "@/lib/rsvp.functions";
import { lookupInvitationSendByToken } from "@/lib/invitation-sends.functions";
import { toast } from "sonner";
import cover from "@/assets/xv-isabella/isabella-cover.jpg.asset.json";
import g7262 from "@/assets/xv-isabella/isabella-7262.jpg.asset.json";
import g7263 from "@/assets/xv-isabella/isabella-7263.jpg.asset.json";
import g7264 from "@/assets/xv-isabella/isabella-7264.jpg.asset.json";
import g7265 from "@/assets/xv-isabella/isabella-7265.jpg.asset.json";
import g7266 from "@/assets/xv-isabella/isabella-7266.jpg.asset.json";
import g7267 from "@/assets/xv-isabella/isabella-7267.jpg.asset.json";
import g7268 from "@/assets/xv-isabella/isabella-7268.jpg.asset.json";
import g7269 from "@/assets/xv-isabella/isabella-7269.jpg.asset.json";
import g7270 from "@/assets/xv-isabella/isabella-7270.jpg.asset.json";
import g7271 from "@/assets/xv-isabella/isabella-7271.jpg.asset.json";
import parroquiaImg from "@/assets/xv-isabella/isabella-parroquia.png.asset.json";
import ubuntuImg from "@/assets/xv-isabella/isabella-ubuntu.png.asset.json";
import floralBg from "@/assets/xv-lucia/floral-bg.jpg.asset.json";
import floralFrame from "@/assets/xv-lucia/lucia-flower-frame.png.asset.json";

export const Route = createFileRoute("/xv-isabella")({
  head: () => ({
    meta: [
      { title: "Isabella · Mis XV Años" },
      { name: "description", content: "Invitación digital a los XV años de Isabella. 4 de septiembre de 2026." },
      { property: "og:title", content: "Isabella · Mis XV Años" },
      { property: "og:description", content: "Acompáñame a celebrar mis XV años el 4 de septiembre de 2026." },
      { property: "og:image", content: cover.url },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: cover.url },
    ],
  }),
  component: IsabellaXV,
});

/* -------- Datos del evento (según lo enviado por la cliente) -------- */
const EVENT_DATE = new Date("2026-09-04T20:30:00-06:00");
const HASHTAG = "#XVIsabella";
const WHATSAPP_NUMBER = "526564432561";
const YOUTUBE_SONG_ID = "oqdWSJIDjxc";

const CEREMONY = {
  name: "Parroquia Sagrada Familia",
  address: "Avenida del Charro 899, Col. Raúl García",
  time: "5:00 pm",
  maps: "https://www.google.com/maps/search/?api=1&query=Parroquia+Sagrada+Familia+Avenida+del+Charro+899+Ju%C3%A1rez",
};

const VENUE = {
  name: "Salón de eventos Ubuntu",
  address: "Calle Santa Cecilia #6826, Col. Era de San Lorenzo",
  time: "8:30 pm",
  maps: "https://maps.app.goo.gl/oj8Kgv7TxYuR5Gyg9?g_st=ic",
};

const WELCOME =
  "Los sueños se dibujan con ilusión, se escriben con amor y se viven con quienes más queremos. Gracias por acompañar a Isabella en el comienzo de esta nueva etapa.";

const STORY =
  "Isabella es una joven soñadora, creativa y llena de sensibilidad. Encuentra inspiración en la música, disfruta perderse entre las páginas de un buen libro, expresar su imaginación a través del dibujo y vivir grandes historias en el cine y las series románticas. Amante del color rosa y de la moda, hoy celebra con alegría el inicio de una nueva etapa, conservando la esencia que la hace única y el corazón lleno de sueños por cumplir.";

const PARENTS = [
  { title: "Mamá", names: ["Karina Montes"] },
  { title: "Padrinos", names: ["Rubén Montañez", "Angélica Puentes"] },
];

const CHAMBELAN_HONOR = "Luis Alejandro García";
const CHAMBELANES = [
  "Nahum Domínguez",
  "Íker Rentería",
  "Alan Villareal",
  "Íker López",
  "Diego Chávez",
  "Jesús Zendejas",
];

const TIMELINE = [
  { time: "5:00 pm", title: "Ceremonia religiosa", icon: "⛪" },
  { time: "8:30 pm", title: "Bienvenida", icon: "🥂" },
  { time: "9:30 pm", title: "Presentación y Vals", icon: "💃" },
  { time: "11:30 pm", title: "Brindis, pastel y baile sorpresa", icon: "🎂" },
  { time: "2:00 am", title: "Fin de la celebración", icon: "✨" },
];

const DRESS_CODE_NOTES = [
  "Formal / Elegante",
  "No mezclilla (jeans)",
  "No tenis ni calzado deportivo",
  "No usar color rosa (reservado para la quinceañera)",
  "Zapato de vestir recomendado",
];

const GALLERY = [
  { src: cover.url, caption: "Mis XV" },
  { src: g7262.url, caption: "Entre flores" },
  { src: g7263.url, caption: "Sonrisa" },
  { src: g7264.url, caption: "Mis historias" },
  { src: g7265.url, caption: "Luz de tarde" },
  { src: g7266.url, caption: "Serena" },
  { src: g7267.url, caption: "Al aire libre" },
  { src: g7268.url, caption: "Detalles" },
  { src: g7269.url, caption: "Mis libros" },
  { src: g7270.url, caption: "Camino" },
  { src: g7271.url, caption: "Yo" },
];

/* -------- Paleta rosa (Isabella ama el rosa) -------- */
const C = {
  bg: "#FDF3F6",
  bgAlt: "#F9E5EC",
  primary: "#B85D7A",
  primaryDark: "#8F3E5B",
  accent: "#E7A6BC",
  gold: "#C9A24A",
  text: "#4A2A36",
  textMuted: "#8A6673",
  card: "#FFFFFF",
  border: "#EAD1DA",
};

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

function SectionTitle({ kicker, title }: { kicker?: string; title: string }) {
  return (
    <div className="text-center mb-12">
      {kicker && (
        <div className="text-xs tracking-[0.35em] uppercase mb-3" style={{ color: C.gold }}>
          — {kicker} —
        </div>
      )}
      <h2 className="font-serif italic text-4xl md:text-5xl lg:text-6xl" style={{ color: C.primary }}>
        {title}
      </h2>
    </div>
  );
}

/* ---------------- ROOT ---------------- */
function IsabellaXV() {
  const [entered, setEntered] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden relative" style={{ backgroundColor: C.bg, color: C.text }}>
      <Music entered={entered} />
      {!entered && <Splash onEnter={() => setEntered(true)} />}
      <Hero />
      <FloralParallax />
      <Welcome />
      <Countdown />
      <Story />
      <ParentsAndCourt />
      <Gallery />
      <EventDetails />
      <Timeline />
      <DressCode />
      <Rsvp />
      <GiftRegistry />
      <SocialWall />
      <Faq />
      <ThankYou />
    </div>
  );
}

/* ---------------- MUSIC ---------------- */
function Music({ entered }: { entered: boolean }) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [playing, setPlaying] = useState(false);

  const send = (fn: string) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func: fn, args: [] }),
      "*"
    );
  };

  useEffect(() => {
    if (entered) {
      send("playVideo");
      setPlaying(true);
    }
  }, [entered]);

  return (
    <>
      <iframe
        ref={iframeRef}
        title="isabella-music"
        src={`https://www.youtube.com/embed/${YOUTUBE_SONG_ID}?enablejsapi=1&autoplay=1&loop=1&playlist=${YOUTUBE_SONG_ID}&controls=0&modestbranding=1`}
        allow="autoplay"
        style={{ position: "fixed", width: 1, height: 1, opacity: 0, pointerEvents: "none", border: 0 }}
      />
      <button
        onClick={() => {
          const next = !playing;
          send(next ? "playVideo" : "pauseVideo");
          setPlaying(next);
        }}
        aria-label="Música"
        className="fixed bottom-5 right-5 z-40 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110"
        style={{ backgroundColor: C.primary, color: "#fff" }}
      >
        {playing ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/></svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
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
      className={`fixed inset-0 z-[60] flex items-center justify-center text-center px-6 transition-opacity duration-700 ${fading ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(253,243,246,0.6), rgba(231,166,188,0.75)), url(${cover.url})`,
        backgroundSize: "cover",
        backgroundPosition: "center 25%",
      }}
    >
      <div className="max-w-lg">
        <div className="text-xs tracking-[0.35em] uppercase mb-4" style={{ color: C.primaryDark }}>04 · Septiembre · 2026</div>
        <h1 className="font-serif italic text-6xl md:text-7xl mb-3" style={{ color: C.primaryDark }}>
          Isabella
        </h1>
        <p className="font-script text-3xl md:text-4xl mb-8" style={{ color: C.primary }}>Mis XV Años</p>
        <p className="text-xs tracking-[0.3em] uppercase mb-8" style={{ color: C.text }}>Estás Invitad@</p>
        <button
          onClick={() => { setFading(true); setTimeout(onEnter, 700); }}
          className="inline-flex items-center gap-3 px-10 py-4 rounded-full text-sm tracking-[0.2em] uppercase transition-all hover:gap-5 shadow-lg"
          style={{ backgroundColor: C.primary, color: "#fff" }}
        >
          Ingresa <span>→</span>
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
      style={{ opacity: visible ? 0.65 : 0 }}
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
  return (
    <section className="relative h-[100svh] min-h-[620px] w-full overflow-hidden">
      <img
        src={cover.url}
        alt="Isabella"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: "center 25%" }}
        fetchPriority="high"
      />
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(253,243,246,0.05) 0%, rgba(249,231,239,0.05) 100%)" }} />
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 text-white">
        <Reveal delay={200}>
          <div className="text-xs md:text-sm tracking-[0.35em] uppercase mb-6 text-white/90">
            04 · Septiembre · 2026
          </div>
        </Reveal>
        <Reveal delay={400}>
          <h1 className="font-serif italic text-6xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.95]">
            Isabella
          </h1>
        </Reveal>
        <Reveal delay={600}>
          <p className="font-script text-4xl md:text-5xl mt-3" style={{ color: "#F9C7D6" }}>Mis XV Años</p>
        </Reveal>
        <Reveal delay={800}>
          <p className="mt-8 max-w-md text-xs md:text-sm tracking-[0.25em] uppercase text-white/85">
            Una noche para soñar, celebrar y recordar
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
    <section className="py-20 md:py-28 px-6" style={{ backgroundColor: C.bgAlt }}>
      <div className="max-w-2xl mx-auto text-center">
        <Reveal>
          <div className="text-xs tracking-[0.35em] uppercase mb-4" style={{ color: C.gold }}>— Bienvenid@ —</div>
        </Reveal>
        <Reveal delay={150}>
          <p className="font-serif italic text-xl md:text-2xl leading-relaxed" style={{ color: C.primaryDark }}>
            {WELCOME}
          </p>
        </Reveal>
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
    <section className="py-16 md:py-24 px-6" style={{ backgroundColor: C.bg }}>
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
    <section id="historia" className="py-24 md:py-32 px-6" style={{ backgroundColor: C.bgAlt }}>
      <div className="max-w-4xl mx-auto">
        <Reveal><SectionTitle kicker="Mi historia" title="Sobre mí" /></Reveal>
        <Reveal delay={150}>
          <div className="mb-12 overflow-hidden rounded-sm shadow-lg">
            <img src={g7264.url} alt="Isabella" className="w-full aspect-[16/10] object-cover" loading="lazy" />
          </div>
        </Reveal>
        <Reveal delay={250}>
          <p className="font-serif italic text-lg md:text-xl leading-relaxed text-center" style={{ color: C.text }}>
            {STORY}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- PARENTS + COURT ---------------- */
function ParentsAndCourt() {
  return (
    <section className="py-24 md:py-32 px-6" style={{ backgroundColor: C.bg }}>
      <div className="max-w-6xl mx-auto">
        <Reveal><SectionTitle kicker="Con amor" title="Mi familia" /></Reveal>
        <p className="text-center max-w-2xl mx-auto font-serif italic text-lg mb-14" style={{ color: C.textMuted }}>
          "Con la bendición de Dios y el amor de mi familia, quiero compartir contigo este día tan especial."
        </p>
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-20">
          {PARENTS.map((g) => (
            <Reveal key={g.title}>
              <div className="rounded-sm p-8 text-center shadow-md" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
                <div className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: C.gold }}>{g.title}</div>
                {g.names.map((n) => (
                  <p key={n} className="font-serif text-xl leading-relaxed" style={{ color: C.primary }}>{n}</p>
                ))}
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal><SectionTitle kicker="Corte de honor" title="Chambelanes" /></Reveal>
        <Reveal delay={150}>
          <div className="max-w-md mx-auto mb-10 rounded-sm p-6 text-center" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
            <div className="text-xs tracking-[0.3em] uppercase mb-2" style={{ color: C.gold }}>Chambelán de honor</div>
            <p className="font-serif text-2xl italic" style={{ color: C.primary }}>{CHAMBELAN_HONOR}</p>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {CHAMBELANES.map((n, i) => (
            <Reveal key={n} delay={i * 80}>
              <div className="rounded-sm p-5 text-center shadow-sm" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
                <p className="font-serif text-lg" style={{ color: C.primary }}>{n}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- EVENT DETAILS ---------------- */
function EventDetails() {
  const cards = [
    { label: "Ceremonia religiosa", ...CEREMONY, icon: "⛪", image: parroquiaImg.url },
    { label: "Recepción", ...VENUE, icon: "🥂", image: ubuntuImg.url },
  ];
  const cal = () => {
    const start = "20260904T230000Z"; // 5pm CST → 23:00 UTC
    const end = "20260905T080000Z";
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=XV+Isabella&dates=${start}/${end}&details=Acomp%C3%A1%C3%B1anos+a+celebrar+los+XV+de+Isabella&location=${encodeURIComponent(VENUE.address)}`;
  };
  return (
    <section id="detalles" className="py-24 md:py-32 px-6" style={{ backgroundColor: C.bgAlt }}>
      <div className="max-w-5xl mx-auto">
        <Reveal><SectionTitle kicker="Detalles del evento" title="¿Cuándo y dónde?" /></Reveal>
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {cards.map((ev, i) => (
            <Reveal key={ev.label} delay={i * 120}>
              <article className="rounded-sm overflow-hidden shadow-md h-full flex flex-col" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
                <img src={ev.image} alt={ev.name} className="w-full aspect-[4/3] object-cover" loading="lazy" />
                <div className="p-8 md:p-10 text-center flex-1 flex flex-col">
                <div className="text-4xl mb-3">{ev.icon}</div>
                <div className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: C.gold }}>{ev.label}</div>
                <div className="font-serif italic text-3xl mb-3" style={{ color: C.primary }}>{ev.time}</div>
                <h3 className="font-serif text-xl mb-2" style={{ color: C.text }}>{ev.name}</h3>
                <p className="text-sm mb-6 flex-1" style={{ color: C.textMuted }}>{ev.address}</p>
                <a
                  href={ev.maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 text-xs tracking-[0.2em] uppercase rounded-full transition-colors"
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
            <a
              href={cal()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm tracking-[0.2em] uppercase"
              style={{ color: C.gold }}
            >
              + Añadir al calendario
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- TIMELINE ---------------- */
function Timeline() {
  return (
    <section className="py-24 md:py-32 px-6" style={{ backgroundColor: C.bg }}>
      <div className="max-w-3xl mx-auto">
        <Reveal><SectionTitle kicker="Itinerario" title="Programa del evento" /></Reveal>
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-px" style={{ background: `linear-gradient(to bottom, ${C.accent}, transparent)` }} />
          {TIMELINE.map((it, i) => (
            <Reveal key={it.title} delay={i * 100}>
              <div className="relative flex items-center gap-6 mb-8 pl-2">
                <div className="relative z-10 w-14 h-14 rounded-full flex items-center justify-center text-xl shadow-md shrink-0" style={{ background: `linear-gradient(135deg, ${C.accent}, ${C.primary})`, color: "#fff" }}>
                  {it.icon}
                </div>
                <div className="flex-1 rounded-sm p-5 shadow-sm" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
                  <div className="text-xs tracking-[0.3em] uppercase" style={{ color: C.gold }}>{it.time}</div>
                  <h3 className="font-serif text-xl md:text-2xl italic" style={{ color: C.primary }}>{it.title}</h3>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- DRESS CODE ---------------- */
function DressCode() {
  return (
    <section className="py-24 md:py-32 px-6" style={{ background: `linear-gradient(180deg, ${C.bgAlt}, ${C.bg})` }}>
      <div className="max-w-3xl mx-auto text-center">
        <Reveal><SectionTitle kicker="Código de vestimenta" title="Formal / Elegante" /></Reveal>
        <Reveal delay={150}>
          <div className="flex justify-center gap-8 my-8 text-5xl">
            <span title="Damas">👗</span>
            <span title="Caballeros">🤵</span>
          </div>
        </Reveal>
        <Reveal delay={250}>
          <div className="max-w-md mx-auto rounded-sm p-7 text-left" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
            <ul className="space-y-2 text-sm" style={{ color: C.text }}>
              {DRESS_CODE_NOTES.map((n) => (
                <li key={n} className="flex gap-3">
                  <span style={{ color: C.primary }}>•</span>
                  <span>{n}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs italic" style={{ color: C.textMuted }}>
              Favor de respetar el código para mantener la armonía del evento.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- GALLERY ---------------- */
function Gallery() {
  const [lightbox, setLightbox] = useState<number | null>(null);
  return (
    <section className="py-24 md:py-32 px-6" style={{ backgroundColor: C.bg }}>
      <div className="max-w-6xl mx-auto">
        <Reveal><SectionTitle kicker="Galería" title="Mis recuerdos" /></Reveal>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {GALLERY.map((g, i) => (
            <Reveal key={i} delay={(i % 3) * 100}>
              <button
                onClick={() => setLightbox(i)}
                className={`group block w-full overflow-hidden rounded-sm shadow-sm ${i === 0 ? "md:col-span-2 md:row-span-2" : ""}`}
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
      `Hola! Confirmo asistencia a los XV de Isabella.\n` +
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
          invitation_slug: "xv-isabella",
          name: form.name.trim(),
          attending: form.attending as "yes" | "no",
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
    <section className="relative py-24 md:py-32 px-6" style={{ backgroundColor: C.bgAlt, backgroundImage: `linear-gradient(180deg, rgba(253,243,246,0.82), rgba(249,229,236,0.9)), url(${floralBg.url})`, backgroundSize: "cover", backgroundPosition: "center" }}>
      <div className="max-w-2xl mx-auto">
        <Reveal><SectionTitle kicker="Confirmación" title="¿Me acompañas?" /></Reveal>
        {submitted ? (
          <div className="text-center rounded-sm p-10 shadow-md" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
            <div className="text-5xl mb-4">💌</div>
            <h3 className="font-serif italic text-3xl mb-3" style={{ color: C.primary }}>¡Gracias, {form.name || "amig@"}!</h3>
            <p style={{ color: C.textMuted }}>He recibido tu confirmación. Nos vemos el 4 de septiembre.</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="rounded-sm p-7 md:p-10 shadow-md space-y-5" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
            {invite && (
              <div className="text-center rounded-sm px-4 py-3 text-sm" style={{ backgroundColor: C.bgAlt, border: `1px solid ${C.border}`, color: C.textMuted }}>
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
            <Field label="Mensaje para Isabella (opcional)">
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
    <section className="py-24 md:py-32 px-6" style={{ backgroundColor: C.bg }}>
      <div className="max-w-3xl mx-auto text-center">
        <Reveal><SectionTitle kicker="Con cariño" title="Mesa de regalos" /></Reveal>
        <Reveal delay={150}>
          <p className="font-serif italic text-lg mb-10" style={{ color: C.textMuted }}>
            Tu presencia es mi mejor regalo. Si deseas obsequiarme algo más, contaré con un buzón especial el día del evento.
          </p>
        </Reveal>
        <Reveal delay={250}>
          <div className="max-w-md mx-auto rounded-sm p-10 shadow-md" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
            <div className="text-5xl mb-4">💌</div>
            <h3 className="font-serif italic text-2xl mb-2" style={{ color: C.primary }}>Buzón de dinero</h3>
            <p className="text-sm" style={{ color: C.textMuted }}>
              El día del evento encontrarás un buzón donde podrás dejar tu sobre con todo cariño.
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
    <section className="py-24 md:py-32 px-6 text-center" style={{ backgroundColor: C.bgAlt }}>
      <div className="max-w-3xl mx-auto">
        <Reveal>
          <div className="text-xs tracking-[0.35em] uppercase mb-3" style={{ color: C.gold }}>— Comparte —</div>
          <h2 className="font-serif italic text-4xl md:text-5xl mb-6" style={{ color: C.primary }}>Comparte tus fotos</h2>
        </Reveal>
        <Reveal delay={150}>
          <p className="mb-8" style={{ color: C.textMuted }}>Etiquétame y usa mi hashtag para verlas todas en un mismo lugar.</p>
          <div className="inline-block font-script text-3xl md:text-4xl px-10 py-5 rounded-full shadow-md" style={{ background: `linear-gradient(135deg, ${C.accent}, ${C.primary})`, color: "#fff" }}>
            {HASHTAG}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */
function Faq() {
  const items = useMemo(() => ([
    { q: "¿Puedo llevar acompañante?", a: "Por favor confirma en la sección de RSVP el número de personas para poder recibirlos con el mejor lugar." },
    { q: "¿Cuál es el código de vestimenta?", a: "Formal / elegante. Por favor evita mezclilla, tenis y el color rosa (reservado para la quinceañera)." },
    { q: "¿Hay estacionamiento?", a: "Sí, el recinto cuenta con estacionamiento para los invitados." },
    { q: "¿Hasta cuándo puedo confirmar?", a: "Te pedimos confirmar antes del 20 de agosto de 2026 directamente en esta invitación." },
  ]), []);
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="py-24 md:py-32 px-6" style={{ backgroundColor: C.bg }}>
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
                  style={{
                    color: C.textMuted,
                    maxHeight: open === i ? "220px" : 0,
                    paddingBottom: open === i ? "1.25rem" : 0,
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
      <img src={g7267.url} alt="Isabella" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
      <div className="absolute inset-0" style={{ backgroundColor: "#00000080" }} />
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 text-white">
        <div className="text-xs tracking-[0.4em] uppercase mb-6 text-white/85">Gracias</div>
        <h2 className="font-serif italic text-5xl md:text-7xl max-w-3xl leading-tight">
          Gracias por ser parte de mi historia
        </h2>
        <p className="mt-6 max-w-xl italic font-serif text-lg text-white/85">
          Tu presencia hará este día aún más inolvidable. Con todo mi cariño,
        </p>
        <div className="mt-8 font-script text-5xl md:text-6xl" style={{ color: "#F9C7D6" }}>
          Isabella
        </div>
        <div className="mt-6 text-xs tracking-[0.4em] uppercase text-white/70">
          04 · 09 · 2026
        </div>
      </div>
    </section>
  );
}
