import { useState } from "react";
import { Shuffle, Check } from "lucide-react";

export type Palette = {
  id: string;
  name: string;
  colors: string[];
};

const PRESETS: Palette[] = [
  { id: "sage-blush", name: "Sage & Rosa", colors: ["#A9B49B", "#7A8A6E", "#D9B8AE", "#EED8CC", "#F5EDE4"] },
  { id: "burgundy-terracota", name: "Burgundy & Terracota", colors: ["#6E1F2A", "#B85C3E", "#E4A579", "#F1D9B8", "#FBF3E7"] },
  { id: "navy-gold", name: "Marino & Oro", colors: ["#1B2A44", "#334A6B", "#C9A24A", "#E8D5A6", "#F6F0DF"] },
  { id: "dusty-blue", name: "Azul polvo", colors: ["#4A6B82", "#7C9AAE", "#C7D6DE", "#EFE8DE", "#F8F4EC"] },
  { id: "mauve-cream", name: "Malva & Crema", colors: ["#7B4A5C", "#B37C8B", "#E1BFC7", "#F1DDD3", "#FAF3EA"] },
  { id: "forest-cream", name: "Bosque & Crema", colors: ["#2F4A3A", "#5C7A5F", "#B7C6A6", "#E4E1CE", "#F6F1E4"] },
  { id: "peach-burgundy", name: "Durazno & Burgundy", colors: ["#7A1F2E", "#C46B4B", "#EFB89A", "#F3D9C6", "#FBEFE3"] },
  { id: "pastel-xv", name: "XV Pastel", colors: ["#C48CA9", "#E7B7C7", "#F5D9E1", "#F2E8D3", "#FBF4EA"] },
];

function randomHex() {
  const n = Math.floor(Math.random() * 0xffffff);
  return "#" + n.toString(16).padStart(6, "0").toUpperCase();
}

type Mode = "preset" | "custom";

export default function PaletteSelector({ name = "palette" }: { name?: string }) {
  const [mode, setMode] = useState<Mode>("preset");
  const [selectedId, setSelectedId] = useState<string>(PRESETS[0].id);
  const [custom, setCustom] = useState<string[]>(["#A9B49B", "#D9B8AE", "#EED8CC", "#F5EDE4", "#2D2D2D"]);

  const selectedPreset = PRESETS.find((p) => p.id === selectedId) ?? PRESETS[0];
  const finalPalette = mode === "preset" ? selectedPreset : { id: "custom", name: "Personalizada", colors: custom };
  const serialized = JSON.stringify(finalPalette);

  function updateCustom(i: number, val: string) {
    setCustom((c) => c.map((x, idx) => (idx === i ? val.toUpperCase() : x)));
  }

  function randomize() {
    setCustom(Array.from({ length: 5 }, () => randomHex()));
  }

  return (
    <div className="space-y-4">
      <input type="hidden" name={name} value={serialized} />

      <div className="flex gap-2 text-xs tracking-[0.2em] uppercase">
        <button
          type="button"
          onClick={() => setMode("preset")}
          className={`px-4 py-2 rounded-sm border transition ${
            mode === "preset"
              ? "bg-[#2D2D2D] text-white border-[#2D2D2D]"
              : "bg-white text-[#5C5347] border-[#E5DED4] hover:border-[#D4AF37]"
          }`}
        >
          Paletas listas
        </button>
        <button
          type="button"
          onClick={() => setMode("custom")}
          className={`px-4 py-2 rounded-sm border transition ${
            mode === "custom"
              ? "bg-[#2D2D2D] text-white border-[#2D2D2D]"
              : "bg-white text-[#5C5347] border-[#E5DED4] hover:border-[#D4AF37]"
          }`}
        >
          Personalizar
        </button>
      </div>

      {mode === "preset" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PRESETS.map((p) => {
            const active = p.id === selectedId;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedId(p.id)}
                className={`relative flex items-center gap-3 rounded-sm border px-3 py-3 text-left transition ${
                  active
                    ? "border-[#D4AF37] bg-[#FBF7EF] shadow-sm"
                    : "border-[#E5DED4] bg-white hover:border-[#C4A77D]"
                }`}
              >
                <div className="flex -space-x-1">
                  {p.colors.map((c) => (
                    <span
                      key={c}
                      className="w-6 h-6 rounded-full border border-white shadow-sm"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <span className="text-sm text-[#2D2D2D] flex-1">{p.name}</span>
                {active && <Check className="w-4 h-4 text-[#D4AF37]" />}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#8A7E72]">
              Toca cada color para editarlo o presiona el dado para inspirarte.
            </p>
            <button
              type="button"
              onClick={randomize}
              className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase px-3 py-2 rounded-sm border border-[#E5DED4] bg-white hover:border-[#D4AF37]"
            >
              <Shuffle className="w-3.5 h-3.5" />
              Aleatorio
            </button>
          </div>

          <div className="grid grid-cols-5 gap-2 rounded-sm overflow-hidden border border-[#E5DED4]">
            {custom.map((c, i) => (
              <label key={i} className="relative aspect-[3/4] cursor-pointer group" style={{ backgroundColor: c }}>
                <input
                  type="color"
                  value={c}
                  onChange={(e) => updateCustom(i, e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  aria-label={`Color ${i + 1}`}
                />
                <span className="absolute bottom-1 left-1 right-1 text-[10px] tracking-widest font-mono text-center py-1 bg-white/85 text-[#2D2D2D] rounded-sm opacity-0 group-hover:opacity-100 transition">
                  {c}
                </span>
              </label>
            ))}
          </div>

          <div className="grid grid-cols-5 gap-2">
            {custom.map((c, i) => (
              <input
                key={i}
                type="text"
                value={c}
                onChange={(e) => {
                  const v = e.target.value.startsWith("#") ? e.target.value : "#" + e.target.value;
                  updateCustom(i, v.slice(0, 7));
                }}
                className="text-[11px] font-mono text-center px-1 py-1.5 rounded-sm border border-[#E5DED4] bg-white uppercase"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
