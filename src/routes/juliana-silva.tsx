import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import babyImg from "@/assets/juliana/baby.jpg.asset.json";
import floralImg from "@/assets/juliana/floral-corner.png.asset.json";
import angelImg from "@/assets/juliana/angel.png.asset.json";

export const Route = createFileRoute("/juliana-silva")({
  head: () => ({
    meta: [
      { title: "Bautizo de Juliana Silva · 25 de Julio 2025" },
      { name: "description", content: "Acompáñanos en el bautizo de Juliana Silva. Sábado 25 de julio, 18:00 hrs." },
      { property: "og:title", content: "Bautizo de Juliana Silva" },
      { property: "og:description", content: "Sábado 25 de julio · 18:00 hrs · Centro de eventos entre Cerros y Chamantos" },
      { property: "og:image", content: babyImg.url },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Montserrat:wght@300;400;500;600&display=swap",
      },
    ],
  }),
  component: JulianaInvitation,
});

const EVENT_DATE = new Date("2025-07-25T18:00:00");
const WHATSAPP = "5215555555555"; // Reemplazar por el número real
const MAPS_URL = "https://maps.google.com/?q=Centro+de+eventos";
const WELCOME =
  "Hoy comenzará un hermoso camino espiritual para nuestra pequeña, y no podríamos haber elegido mejores padrinos para acompañarla en esta aventura de fe. Con mucho amor, te invitamos a compartir este día tan importante con nosotros.";

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

function JulianaInvitation() {
  const { days, hours, minutes, seconds } = useCountdown(EVENT_DATE);
  const whatsappHref = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
    "¡Hola! Confirmo mi asistencia al bautizo de Juliana Silva 🌸"
  )}`;

  return (
    <div
      className="min-h-screen w-full"
      style={{
        fontFamily: "'Cormorant Garamond', serif",
        background:
          "linear-gradient(180deg, #fce7ee 0%, #fef2f5 40%, #fce7ee 100%)",
        color: "#6b4a52",
      }}
    >
      <main className="relative mx-auto max-w-[480px] overflow-hidden bg-gradient-to-b from-[#fdf3f6] via-white to-[#fce7ee] shadow-2xl">
        {/* Floral corners */}
        <img
          src={floralImg.url}
          alt=""
          aria-hidden
          className="pointer-events-none absolute -top-6 -left-6 w-60 opacity-90 select-none"
        />
        <img
          src={floralImg.url}
          alt=""
          aria-hidden
          className="pointer-events-none absolute -top-6 -right-6 w-60 opacity-90 scale-x-[-1] select-none"
        />

        {/* Hero */}
        <section className="relative px-8 pt-24 pb-10 text-center">
          <div className="relative mx-auto h-52 w-52">
            <div
              className="absolute inset-0 rounded-full ring-4 ring-white shadow-lg overflow-hidden"
              style={{ boxShadow: "0 10px 30px -10px rgba(212, 130, 155, 0.5)" }}
            >
              <img
                src={babyImg.url}
                alt="Juliana Silva"
                className="h-full w-full object-cover"
                width={800}
                height={800}
              />
            </div>
          </div>

          <p className="mt-8 text-2xl italic text-[#7a5560]">Bautizo de</p>
          <h1
            className="mt-1 text-5xl leading-tight text-[#a67c8a]"
            style={{ fontFamily: "'Great Vibes', cursive" }}
          >
            Juliana Silva
          </h1>

          <p className="mx-auto mt-6 max-w-[340px] text-[15px] leading-relaxed italic text-[#7a5560]">
            "{WELCOME}"
          </p>
        </section>

        {/* Angel */}
        <section className="relative flex justify-center py-4">
          <img
            src={angelImg.url}
            alt=""
            aria-hidden
            className="w-40 select-none"
            loading="lazy"
          />
        </section>

        {/* Date */}
        <section className="relative px-8 py-8 text-center">
          <div className="mx-auto flex items-center justify-center gap-6">
            <div className="text-sm uppercase tracking-[0.25em] text-[#a67c8a]">
              Sábado
            </div>
            <div className="flex flex-col items-center border-x border-[#e8c8d3] px-6">
              <span className="text-xs uppercase tracking-widest text-[#a67c8a]">
                Julio
              </span>
              <span
                className="text-6xl leading-none text-[#7a5560]"
                style={{ fontFamily: "'Great Vibes', cursive" }}
              >
                25
              </span>
              <span className="text-xs tracking-widest text-[#a67c8a]">2025</span>
            </div>
            <div className="text-sm uppercase tracking-[0.25em] text-[#a67c8a]">
              18:00
            </div>
          </div>
        </section>

        {/* Countdown */}
        <section className="relative px-8 py-6">
          <p className="text-center text-xs uppercase tracking-[0.35em] text-[#a67c8a]">
            Falta
          </p>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {[
              { v: days, l: "días" },
              { v: hours, l: "hrs" },
              { v: minutes, l: "min" },
              { v: seconds, l: "seg" },
            ].map((c) => (
              <div
                key={c.l}
                className="rounded-lg border border-[#f0d3dc] bg-white/70 py-3 text-center backdrop-blur"
              >
                <div className="text-2xl font-medium text-[#7a5560]">
                  {String(c.v).padStart(2, "0")}
                </div>
                <div className="text-[10px] uppercase tracking-widest text-[#a67c8a]">
                  {c.l}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Ceremony */}
        <section className="relative px-8 py-8 text-center">
          <h2
            className="text-4xl text-[#a67c8a]"
            style={{ fontFamily: "'Great Vibes', cursive" }}
          >
            Ceremonia
          </h2>
          <p className="mt-3 text-xs uppercase tracking-[0.3em] text-[#7a5560]">
            Centro de eventos entre Cerros y Chamantos
          </p>
          <p className="mt-2 text-sm text-[#a67c8a]">18:00 hrs</p>
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-block rounded-full bg-[#e8b8c8] px-8 py-3 text-[11px] uppercase tracking-[0.25em] text-white shadow-md transition hover:bg-[#d99cb2]"
          >
            Pincha aquí para ver ubicación
          </a>
        </section>

        {/* Dress code */}
        <section className="relative px-8 py-8 text-center">
          <h2
            className="text-4xl text-[#a67c8a]"
            style={{ fontFamily: "'Great Vibes', cursive" }}
          >
            Dress Code
          </h2>
          <div className="mx-auto mt-3 h-px w-20 bg-[#e8c8d3]" />
          <p className="mt-4 text-sm uppercase tracking-[0.3em] text-[#7a5560]">
            Semi-formal
          </p>
        </section>

        {/* RSVP */}
        <section className="relative px-8 py-8 text-center">
          <h2
            className="text-4xl text-[#a67c8a]"
            style={{ fontFamily: "'Great Vibes', cursive" }}
          >
            Confirmación de Asistencia
          </h2>
          <p className="mt-3 text-[11px] uppercase tracking-[0.3em] text-[#7a5560]">
            Confirmar asistencia hasta 20 julio
          </p>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block rounded-full bg-[#e8b8c8] px-10 py-3 text-[11px] uppercase tracking-[0.25em] text-white shadow-md transition hover:bg-[#d99cb2]"
          >
            Confirmar por WhatsApp
          </a>
        </section>

        {/* Verse */}
        <section className="relative px-10 py-8 text-center">
          <p className="text-sm italic leading-relaxed text-[#7a5560]">
            "Dejad que los niños vengan a mí, y no se lo impidáis;
            <br />
            porque de los que son como estos es el Reino de Dios."
          </p>
          <p className="mt-2 text-xs tracking-widest text-[#a67c8a]">
            — Marcos 10:14
          </p>
        </section>

        {/* Closing */}
        <section className="relative flex flex-col items-center px-8 pt-4 pb-16">
          <img
            src={angelImg.url}
            alt=""
            aria-hidden
            className="w-32 select-none"
            loading="lazy"
          />
          <p
            className="mt-4 text-4xl text-[#a67c8a]"
            style={{ fontFamily: "'Great Vibes', cursive" }}
          >
            te esperamos
          </p>
        </section>

        {/* Bottom florals */}
        <img
          src={floralImg.url}
          alt=""
          aria-hidden
          className="pointer-events-none absolute -bottom-6 -left-6 w-60 opacity-90 scale-y-[-1] select-none"
        />
        <img
          src={floralImg.url}
          alt=""
          aria-hidden
          className="pointer-events-none absolute -bottom-6 -right-6 w-60 opacity-90 scale-x-[-1] scale-y-[-1] select-none"
        />
      </main>
    </div>
  );
}
