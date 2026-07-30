import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { submitRsvp } from "@/lib/rsvp.functions";
import { lookupInvitationSendByToken } from "@/lib/invitation-sends.functions";
import { toast } from "sonner";
import cowhide from "@/assets/xv-ariadne/cowhide.jpg.asset.json";
import a73 from "@/assets/xv-ariadne/a73.jpg.asset.json";
import a147 from "@/assets/xv-ariadne/a147.jpg.asset.json";
import a162 from "@/assets/xv-ariadne/a162.jpg.asset.json";
import a205 from "@/assets/xv-ariadne/a205.jpg.asset.json";
import a309 from "@/assets/xv-ariadne/a309.jpg.asset.json";
import a321 from "@/assets/xv-ariadne/a321.jpg.asset.json";
import a367 from "@/assets/xv-ariadne/a367.jpg.asset.json";
import a416 from "@/assets/xv-ariadne/a416.jpg.asset.json";
import a439 from "@/assets/xv-ariadne/a439.jpg.asset.json";
import a450 from "@/assets/xv-ariadne/a450.jpg.asset.json";

export const Route = createFileRoute("/xv-ariadne")({
  head: () => ({
    meta: [
      { title: "Ariadne Estrella · Mis XV Años" },
      { name: "description", content: "Invitación digital a los XV años de Ariadne Estrella. 29 de agosto de 2026, Hacienda los Monroy." },
      { property: "og:title", content: "Ariadne Estrella · Mis XV Años" },
      { property: "og:description", content: "Acompáñame a celebrar mis XV años el 29 de agosto de 2026." },
      { property: "og:image", content: a73.url },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: a73.url },
    ],
  }),
  component: AriadneXV,
});

const GALLERY = [
  { src: a73.url, caption: "Mi compañero" },
  { src: a162.url, caption: "Sombrero" },
  { src: a147.url, caption: "Camino al establo" },
  { src: a205.url, caption: "Atardecer" },
  { src: a309.url, caption: "Rojo bandana" },
  { src: a321.url, caption: "Descanso" },
  { src: a367.url, caption: "Botas" },
  { src: a416.url, caption: "Tarde en el rancho" },
  { src: a439.url, caption: "Lienzo charro" },
  { src: a450.url, caption: "Bajo el arco" },
];


/* -------- Datos del evento -------- */
const EVENT_DATE = new Date("2026-08-29T20:00:00-06:00");
const HASHTAG = "#XVAriadneEstrella";
const WHATSAPP_NUMBER = "526561807344";

const CEREMONY = {
  name: "Acción de Gracias · Hacienda los Monroy",
  address: "Av. Ejército Nacional 3404, C.P. 32542, Cd. Juárez, Chih.",
  time: "8:00 pm",
  maps: "https://www.google.com/maps/place/Hacienda+los+Monroy/@31.6915974,-106.401682,17z",
};

const VENUE = {
  name: "Hacienda los Monroy",
  address: "Av. Ejército Nacional 3404, C.P. 32542, Cd. Juárez, Chih.",
  time: "8:30 pm",
  maps: "https://www.google.com/maps/place/Hacienda+los+Monroy/@31.6915974,-106.401682,17z",
};

const WELCOME =
  "Con inmensa alegría y profundo agradecimiento a Dios, hoy celebramos un momento que quedará para siempre en nuestros corazones: los quince años de nuestra querida hija. Este día marca el inicio de una nueva etapa llena de ilusiones, sueños y grandes oportunidades. Gracias por acompañarnos y por ser testigos de este hermoso momento.";

const STORY_PARAGRAPHS = [
  "Hace quince años llegó a nuestras vidas para llenarlas de amor, alegría e ilusión. Desde pequeña demostró ser una niña curiosa, creativa y soñadora. Entre sus primeros sueños estaba el de ser chef, disfrutando crear dulces momentos para quienes la rodeaban.",
  "Con el paso del tiempo fue descubriendo nuevas pasiones. Hoy disfruta del fútbol, donde ha aprendido el valor del esfuerzo, el trabajo en equipo y la disciplina; encuentra en la batería una forma de expresar su energía; en los libros descubre nuevos mundos, y en cada viaje confirma que el mundo está lleno de lugares por conocer.",
  "Es una joven que sueña en grande, que enfrenta cada desafío con determinación y que cree que los límites existen para ser superados. Su sonrisa, su noble corazón y su deseo constante de aprender la convierten en una persona especial que inspira a quienes tienen la fortuna de conocerla.",
  "Hoy celebramos sus quince años con la certeza de que este es solo el comienzo de un camino lleno de oportunidades. Con todo nuestro amor, celebramos la maravillosa joven en la que te has convertido y el brillante futuro que te espera.",
];

const PARENTS = [
  { title: "Mis papás", names: ["Elías Zúñiga", "Mayra Bernal"] },
  { title: "Chambelán de honor", names: ["Elías Zúñiga", "(mi hermano)"] },
];

const TIMELINE = [
  { time: "8:00 pm", title: "Misa de Acción de Gracias", icon: "⛪" },
  { time: "8:30 pm", title: "Recepción y bienvenida", icon: "🥂" },
  { time: "9:30 pm", title: "Presentación y Vals", icon: "💃" },
  { time: "11:30 pm", title: "Brindis, pastel y baile sorpresa", icon: "🎂" },
  { time: "1:00 am", title: "Fin de la celebración", icon: "✨" },
];

const DRESS_CODE_NOTES = [
  "Formal o vaquero",
  "Color rojo y dorado exclusivos para la quinceañera",
  "Botas vaqueras bienvenidas",
  "Zapato de vestir recomendado para etiqueta formal",
];

/* -------- Paleta Vintage Garden -------- */
const C = {
  bg: "#F2EFE8", // Alabaster Lace
  bgAlt: "#EAE3D3", // Honeyed Light suave
  honey: "#E0D4A5", // Honeyed Light
  sage: "#9BA488", // Sage Whisper
  primary: "#A97A82", // Withered Mauve
  primaryDark: "#8A5F68",
  accent: "#D29A91", // Antique Rose
  gold: "#9BA488",
  text: "#4A403C",
  textMuted: "#8B7D77",
  card: "#FBF9F5",
  border: "#DED5C6",
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

function SectionTitle({ kicker, title, light = false }: { kicker?: string; title: string; light?: boolean }) {
  return (
    <div className="text-center mb-12">
      {kicker && (
        <div className="text-xs tracking-[0.35em] uppercase mb-3" style={{ color: light ? C.honey : C.gold }}>
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
function AriadneXV() {
  const [entered, setEntered] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden relative" style={{ backgroundColor: C.bg, color: C.text }}>
      {!entered && <Splash onEnter={() => setEntered(true)} />}
      <Hero />
      <Welcome />
      <Countdown />
      <Story />
      <Parents />
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

/* ---------------- SPLASH ---------------- */
function Splash({ onEnter }: { onEnter: () => void }) {
  const [fading, setFading] = useState(false);
  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center text-center px-6 transition-opacity duration-700 ${fading ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(242,239,232,0.72), rgba(224,212,165,0.72)), url(${a162.url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-lg">
        <div className="text-xs tracking-[0.35em] uppercase mb-4" style={{ color: C.primaryDark }}>29 · Agosto · 2026</div>
        <h1 className="font-serif italic text-5xl md:text-7xl mb-3" style={{ color: C.primaryDark }}>
          Ariadne Estrella
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

/* ---------------- HERO ---------------- */
function Hero() {
  return (
    <section className="relative h-[100svh] min-h-[620px] w-full overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(74,64,60,0.35), rgba(169,122,130,0.5)), url(${a147.url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 text-white">
        <Reveal delay={200}>
          <div className="text-xs md:text-sm tracking-[0.35em] uppercase mb-6 text-white/90">
            29 · Agosto · 2026
          </div>
        </Reveal>
        <Reveal delay={400}>
          <h1 className="font-serif italic text-5xl sm:text-6xl md:text-8xl leading-[0.95]">
            Ariadne Estrella
          </h1>
        </Reveal>
        <Reveal delay={600}>
          <p className="font-script text-4xl md:text-5xl mt-3" style={{ color: C.honey }}>Mis XV Años</p>
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
          <p className="font-serif italic text-lg md:text-2xl leading-relaxed" style={{ color: C.primaryDark }}>
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
      <div className="max-w-3xl mx-auto">
        <Reveal><SectionTitle kicker="Mi historia" title="Sobre mí" /></Reveal>
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
    <section className="py-24 md:py-32 px-6" style={{ backgroundColor: C.bg }}>
      <div className="max-w-4xl mx-auto">
        <Reveal><SectionTitle kicker="Con amor" title="Mi familia" /></Reveal>
        <p className="text-center max-w-2xl mx-auto font-serif italic text-lg mb-14" style={{ color: C.textMuted }}>
          "Con la bendición de Dios y el amor de mi familia, quiero compartir contigo este día tan especial."
        </p>
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
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

/* ---------------- EVENT DETAILS ---------------- */
function EventDetails() {
  const cards = [
    { label: "Misa de Acción de Gracias", ...CEREMONY, icon: "⛪" },
    { label: "Recepción", ...VENUE, icon: "🥂" },
  ];
  const cal = () => {
    const start = "20260830T020000Z";
    const end = "20260830T070000Z";
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=XV+Ariadne+Estrella&dates=${start}/${end}&details=Acomp%C3%A1%C3%B1anos+a+celebrar+los+XV+de+Ariadne+Estrella&location=${encodeURIComponent(VENUE.address)}`;
  };
  return (
    <section id="detalles" className="py-24 md:py-32 px-6" style={{ backgroundColor: C.bgAlt }}>
      <div className="max-w-5xl mx-auto">
        <Reveal><SectionTitle kicker="Detalles del evento" title="¿Cuándo y dónde?" /></Reveal>
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {cards.map((ev, i) => (
            <Reveal key={ev.label} delay={i * 120}>
              <article className="rounded-sm overflow-hidden shadow-md h-full flex flex-col p-8 md:p-10 text-center" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
                <div className="text-4xl mb-3">{ev.icon}</div>
                <div className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: C.gold }}>{ev.label}</div>
                <div className="font-serif italic text-3xl mb-3" style={{ color: C.primary }}>{ev.time}</div>
                <h3 className="font-serif text-xl mb-2" style={{ color: C.text }}>{ev.name}</h3>
                <p className="text-sm mb-6 flex-1" style={{ color: C.textMuted }}>{ev.address}</p>
                <a
                  href={ev.maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 text-xs tracking-[0.2em] uppercase rounded-full transition-colors"
                  style={{ backgroundColor: C.primary, color: "#fff" }}
                >
                  Ver ubicación →
                </a>
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
              style={{ color: C.primaryDark }}
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

/* ---------------- DRESS CODE (fondo piel de vaca) ---------------- */
function DressCode() {
  return (
    <section
      className="relative py-24 md:py-32 px-6"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(74,64,60,0.72), rgba(169,122,130,0.72)), url(${cowhide.url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-3xl mx-auto text-center">
        <Reveal><SectionTitle kicker="Código de vestimenta" title="Formal o Vaquero" light /></Reveal>
        <Reveal delay={150}>
          <div className="flex justify-center gap-8 my-8 text-5xl">
            <span title="Damas">👗</span>
            <span title="Vaquero">🤠</span>
            <span title="Caballeros">🥾</span>
          </div>
        </Reveal>
        <Reveal delay={250}>
          <div className="max-w-md mx-auto rounded-sm p-7 text-left shadow-xl" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
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
      `Hola! Confirmo asistencia a los XV de Ariadne Estrella.\n` +
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
          invitation_slug: "xv-ariadne",
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
    <section className="relative py-24 md:py-32 px-6" style={{ backgroundColor: C.bgAlt }}>
      <div className="max-w-2xl mx-auto">
        <Reveal><SectionTitle kicker="Confirmación" title="¿Me acompañas?" /></Reveal>
        {submitted ? (
          <div className="text-center rounded-sm p-10 shadow-md" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
            <div className="text-5xl mb-4">💌</div>
            <h3 className="font-serif italic text-3xl mb-3" style={{ color: C.primary }}>¡Gracias, {form.name || "amig@"}!</h3>
            <p style={{ color: C.textMuted }}>He recibido tu confirmación. Nos vemos el 29 de agosto.</p>
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
            <Field label="Mensaje para Ariadne (opcional)">
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
          <div className="inline-block font-script text-2xl md:text-4xl px-10 py-5 rounded-full shadow-md" style={{ background: `linear-gradient(135deg, ${C.accent}, ${C.primary})`, color: "#fff" }}>
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
    { q: "¿Puedo llevar acompañante?", a: "Por favor confirma en la sección de confirmación para poder recibirlos con el mejor lugar." },
    { q: "¿Cuál es el código de vestimenta?", a: "Formal o vaquero. El color rojo y dorado son exclusivos para la quinceañera." },
    { q: "¿Hay estacionamiento?", a: "Sí, Hacienda los Monroy cuenta con estacionamiento para los invitados." },
    { q: "¿Hasta cuándo puedo confirmar?", a: "Te pedimos confirmar antes del 15 de agosto de 2026 directamente en esta invitación." },
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
    <section
      className="relative h-[100svh] min-h-[600px] w-full overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${a450.url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 text-white">
        <div className="text-xs tracking-[0.4em] uppercase mb-6 text-white/85">Gracias</div>
        <h2 className="font-serif italic text-4xl md:text-7xl max-w-3xl leading-tight">
          Gracias por ser parte de mi historia
        </h2>
        <p className="mt-6 max-w-xl italic font-serif text-lg text-white/85">
          Tu presencia hará este día aún más inolvidable. Con todo mi cariño,
        </p>
        <div className="mt-8 font-script text-4xl md:text-6xl" style={{ color: C.honey }}>
          Ariadne Estrella
        </div>
        <div className="mt-6 text-xs tracking-[0.4em] uppercase text-white/70">
          29 · 08 · 2026
        </div>
      </div>
    </section>
  );
}
