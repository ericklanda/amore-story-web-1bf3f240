import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import heroCouple from "@/assets/hero-couple.jpg";
import couple2 from "@/assets/couple-2.jpg";
import couple3 from "@/assets/couple-3.jpg";
import details from "@/assets/details.jpg";
import bouquet from "@/assets/bouquet.jpg";
import engagement from "@/assets/engagement.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Luis Carlos & Leonardo · 30 de Octubre, 2026" },
      { name: "description", content: "Invitación de boda de Luis Carlos y Leonardo. Confirma tu asistencia y conoce los detalles de nuestro gran día." },
      { property: "og:title", content: "Luis Carlos & Leonardo · Nuestra Boda" },
      { property: "og:description", content: "Acompáñanos el 30 de Octubre de 2026 en Ciudad Juárez." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: WeddingInvitation,
});

const WEDDING_DATE = new Date("2026-10-30T20:00:00");
const HASHTAG = "#LuisYLeo2026";
const WHATSAPP_NUMBER = "5216568637484"; // 52 + 1 + número
const YOUTUBE_SONG_ID = "gxXo8bWZbWw";
const VENUE_MAPS = "https://maps.app.goo.gl/fb6ZCWdXrxMd9wwu7";
const VENUE_ADDRESS = "Cam. Viejo a San José 4545, Las Arcadas, 32590 Juárez, Chih.";

const GALLERY = [
  { src: heroCouple, caption: "Nosotros" },
  { src: couple2, caption: "Momentos" },
  { src: couple3, caption: "Juntos" },
  { src: bouquet, caption: "Detalles" },
  { src: engagement, caption: "Risas" },
  { src: details, caption: "Celebración" },
];


function useCountdown(target: Date) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target.getTime() - now.getTime());
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
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Scroll progress */}
      <div
        className="fixed top-0 left-0 h-[2px] bg-gradient-gold z-50 transition-[width] duration-150"
        style={{ width: `${progress * 100}%` }}
      />

      {/* Floating controls */}
      <FloatingControls dark={dark} setDark={setDark} lang={lang} setLang={setLang} />

      <Hero />
      <OurStory />
      <ParentsSection />
      <Gallery />
      <EventDetails />
      <DressCode />
      <Timeline />
      <SpecialMoments />
      <Rsvp />
      <GiftRegistry />
      <Accommodation />
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
}: {
  dark: boolean;
  setDark: (v: boolean) => void;
  lang: "es" | "en";
  setLang: (v: "es" | "en") => void;
}) {
  const [playing, setPlaying] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const toggleMusic = () => {
    if (!iframeRef.current) return;
    const action = playing ? "pauseVideo" : "playVideo";
    iframeRef.current.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func: action, args: [] }),
      "*"
    );
    setPlaying(!playing);
  };

  return (
    <>
      <iframe
        ref={iframeRef}
        title="background-music"
        src={`https://www.youtube.com/embed/${YOUTUBE_SONG_ID}?enablejsapi=1&loop=1&playlist=${YOUTUBE_SONG_ID}&controls=0&modestbranding=1`}
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


/* ---------------- HERO ---------------- */
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
            alt="Luis Carlos y Leonardo"
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
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 text-white">
        <Reveal delay={200}>
          <div className="ornament !text-white/90 mb-6">30 · Octubre · 2026</div>
        </Reveal>
        <Reveal delay={400}>
          <h1 className="font-serif italic text-5xl sm:text-6xl md:text-8xl lg:text-9xl leading-[0.95]">
            Luis Carlos
            <span className="font-script text-gold block text-4xl sm:text-5xl md:text-6xl my-2 not-italic">&</span>
            Leonardo
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
    { date: "Marzo 2019", title: "El día que nos conocimos", text: "Una tarde inesperada en una cafetería del centro. Un café se convirtió en horas de conversación." },
    { date: "Diciembre 2020", title: "Nuestro primer viaje", text: "Recorrimos la costa y supimos que queríamos seguir explorando el mundo juntos." },
    { date: "Agosto 2023", title: "Una casa, un hogar", text: "Decidimos compartirlo todo bajo el mismo techo, entre cajas, risas y planes." },
    { date: "Febrero 2025", title: "La propuesta", text: "Bajo las estrellas, frente al mar, con un anillo y un 'sí' que cambió todo." },
  ];
  return (
    <section id="historia" className="py-24 md:py-36 px-6 bg-gradient-blush">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <SectionTitle kicker="Nuestra historia" title="El camino que nos trajo aquí" />
        </Reveal>

        <Reveal delay={150}>
          <div className="mb-16 overflow-hidden rounded-sm shadow-soft">
            <img src={engagement} alt="Luis Carlos y Leonardo" className="w-full aspect-[16/10] object-cover" loading="lazy" />
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
    { title: "Padres de Luis Carlos", names: ["Lazara Ayala Estrada", "Luis Carlos Delgado Leyva"] },
    { title: "Padres de Leonardo", names: ["Magdalena Bautista Ávalos", "Cirilo García Olivares †"] },
  ];

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
          {groups.map((g, i) => (
            <Reveal key={g.title} delay={i * 120}>
              <div className="bg-card border border-border rounded-sm p-8 text-center shadow-card hover:shadow-soft transition-shadow">
                <div className="ornament mb-5 !text-sm">{g.title}</div>
                {g.names.map((n) => (
                  <p key={n} className="font-serif text-xl text-primary leading-relaxed">
                    {n}
                  </p>
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
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
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
      label: "Ceremonia simbólica",
      time: "8:00 pm",
      place: "Terraza Jardín Arjeri",
      address: VENUE_ADDRESS,
      maps: VENUE_MAPS,
    },
    {
      label: "Recepción",
      time: "9:00 pm – 2:00 am",
      place: "Terraza Jardín Arjeri",
      address: VENUE_ADDRESS,
      maps: VENUE_MAPS,
    },
  ];

  const calendarLink = () => {
    // 30 Oct 2026 20:00 → 31 Oct 2026 02:00 (CST = UTC-6)
    const start = "20261031T020000Z";
    const end = "20261031T080000Z";
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Boda+Luis+Carlos+%26+Leonardo&dates=${start}/${end}&details=Acompáñanos+a+celebrar+nuestro+día.&location=${encodeURIComponent(VENUE_ADDRESS)}`;
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

/* ---------------- DRESS CODE ---------------- */
function DressCode() {
  const palette = ["#000000", "#1a1a1a", "#2b2b2b", "#3d3d3d", "#525252"];
  return (
    <section className="py-24 md:py-32 px-6 bg-gradient-blush">
      <div className="max-w-5xl mx-auto text-center">
        <Reveal>
          <SectionTitle kicker="Código de vestimenta" title="Black · Todos de negro" />
        </Reveal>
        <Reveal delay={150}>
          <p className="max-w-xl mx-auto text-muted-foreground mb-10">
            Queremos una noche elegante y cinematográfica: te pedimos vestir totalmente de <strong>negro</strong>.
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
            <div className="text-4xl mb-3">🖤</div>
            <h4 className="font-serif text-xl text-primary mb-1">Dress code</h4>
            <p className="text-sm text-muted-foreground tracking-wider">Black formal · de pies a cabeza</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}


/* ---------------- TIMELINE OF DAY ---------------- */
function Timeline() {
  const items = [
    { time: "8:00 pm", title: "Ceremonia simbólica", icon: "💍" },
    { time: "9:00 pm", title: "Recepción & cóctel", icon: "🥂" },
    { time: "10:00 pm", title: "Cena", icon: "🍽" },
    { time: "11:00 pm", title: "Primer baile", icon: "💃" },
    { time: "12:00 am", title: "Fiesta", icon: "🎶" },
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
    { year: "2025", title: "La propuesta", text: "El sí más fácil del mundo." },
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
  const [form, setForm] = useState({ name: "", attending: "yes", guests: "1", dietary: "", message: "" });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const whatsappMsg = useMemo(() => {
    const text = `Hola! Confirmo mi asistencia a la boda de Luis Carlos y Leonardo. Nombre: ${form.name || "(nombre)"}, asistencia: ${form.attending === "yes" ? "Sí" : "No"}, acompañantes: ${form.guests}`;
    return `https://wa.me/5210000000000?text=${encodeURIComponent(text)}`;
  }, [form]);

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
              <Field label="Acompañantes">
                <select
                  value={form.guests}
                  onChange={(e) => setForm({ ...form, guests: e.target.value })}
                  className="w-full bg-transparent border-b border-border focus:border-primary outline-none py-2"
                >
                  {[0, 1, 2, 3, 4].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </Field>
              <Field label="Restricciones alimentarias">
                <input
                  value={form.dietary}
                  onChange={(e) => setForm({ ...form, dietary: e.target.value })}
                  placeholder="Vegetariano, sin gluten…"
                  className="w-full bg-transparent border-b border-border focus:border-primary outline-none py-2"
                />
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
                  className="flex-1 py-3.5 bg-primary text-primary-foreground tracking-[0.2em] uppercase text-xs rounded-full hover:opacity-90 transition-opacity"
                >
                  Enviar confirmación
                </button>
                <a
                  href={whatsappMsg}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center py-3.5 border border-primary text-primary tracking-[0.2em] uppercase text-xs rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  Confirmar por WhatsApp
                </a>
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
    { icon: "🎁", title: "Mesa de regalos", text: "Liverpool · Código 12345", cta: "Ver mesa", href: "#" },
    { icon: "🛒", title: "Amazon", text: "Lista en línea curada", cta: "Abrir lista", href: "#" },
    { icon: "🏦", title: "Transferencia", text: "BBVA · 4152 3138 0000 0000", cta: "Copiar datos", href: "#" },
    { icon: "✈️", title: "Luna de miel", text: "Contribuye a nuestro viaje", cta: "Aportar", href: "#" },
  ];
  return (
    <section className="py-24 md:py-32 px-6 bg-background">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <SectionTitle kicker="Con cariño" title="Mesa de regalos" />
        </Reveal>
        <p className="text-center max-w-xl mx-auto text-muted-foreground italic font-serif mb-12">
          Tu presencia es el mejor regalo. Si deseas obsequiarnos algo más, aquí algunas opciones.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {gifts.map((g, i) => (
            <Reveal key={g.title} delay={i * 100}>
              <div className="bg-card border border-border rounded-sm p-7 text-center shadow-card hover:shadow-soft hover:-translate-y-1 transition-all h-full flex flex-col">
                <div className="text-4xl mb-4">{g.icon}</div>
                <h3 className="font-serif text-xl text-primary mb-2">{g.title}</h3>
                <p className="text-sm text-muted-foreground mb-5 flex-1">{g.text}</p>
                <a href={g.href} className="text-xs tracking-[0.2em] uppercase text-gold hover:text-primary transition-colors">
                  {g.cta} →
                </a>
              </div>
            </Reveal>
          ))}
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
          <SectionTitle kicker="Transporte" title="Cómo llegar" />
        </Reveal>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { icon: "🅿️", title: "Estacionamiento", text: "Gratis para invitados, capacidad para 80 autos." },
            { icon: "🚐", title: "Shuttle", text: "Salidas desde el centro a las 4:15 pm y 4:45 pm." },
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
    { q: "¿Puedo llevar acompañantes?", a: "Por capacidad del recinto, solo podemos recibir a las personas indicadas en tu invitación." },
    { q: "¿Hay estacionamiento?", a: "Sí, contamos con estacionamiento gratuito para todos los invitados." },
    { q: "¿Cuál es el código de vestimenta?", a: "Formal etiqueta jardín. Tonos cálidos y terrosos. Evita el blanco." },
    { q: "¿Pueden asistir niños?", a: "Será una celebración para adultos. Agradecemos tu comprensión." },
    { q: "¿Hasta cuándo puedo confirmar?", a: "Te pedimos confirmar antes del 14 de mayo de 2026." },
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
      <img src={couple3} alt="Luis Carlos y Leonardo" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 text-white">
        <Reveal>
          <div className="ornament !text-white/85 mb-6">Gracias</div>
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
          <div className="mt-8 font-script text-5xl md:text-6xl text-gold">
            Luis Carlos & Leonardo
          </div>
        </Reveal>
        <Reveal delay={800}>
          <div className="mt-6 text-xs tracking-[0.4em] uppercase text-white/70">
            14 · 06 · 2026
          </div>
        </Reveal>
      </div>
    </section>
  );
}
