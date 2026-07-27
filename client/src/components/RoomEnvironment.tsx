/*
 * THE MUSEUM OF CHICKO — RoomEnvironment
 * Layers ambient environmental details inside gallery rooms.
 * Every detail is CSS-only, zero external assets, no layout changes.
 * Elements are positioned absolutely so they never interfere with gallery content.
 *
 * Think: grandfather clocks, old windows, moving curtains, sunlight rays,
 * dust particles, books, shelves, benches, plants, paintings, glass reflections,
 * old keys, museum boxes, fireplaces, reading lamps, stone walls, wood ceilings,
 * hanging lights.
 */
import { useEffect, useRef, useState, useMemo } from "react";

/* ============================================================
   INDIVIDUAL ENVIRONMENTAL ELEMENTS
   ============================================================ */

function GrandfatherClock({ visible }: { visible: boolean }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const iv = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(iv);
  }, []);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const hourAngle = (hours + minutes / 60) * 30;
  const minuteAngle = minutes * 6;

  return (
    <div
      className="absolute bottom-8 right-4 md:right-8 z-[5] pointer-events-none"
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 3s ease",
      }}
      aria-hidden="true"
    >
      {/* Clock body */}
      <div className="relative w-12 h-28 md:w-14 md:h-32">
        {/* Clock tower */}
        <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.35_0.04_60)] to-[oklch(0.25_0.03_60)] rounded-t-md shadow-lg" />
        {/* Clock face */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-9 h-9 md:w-11 md:h-11 rounded-full bg-[oklch(0.95_0.02_85)] border-2 border-[oklch(0.6_0.08_78)] shadow-inner">
          {/* Hour markers */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-[1px] h-[3px] bg-[oklch(0.3_0.03_60)] origin-bottom"
              style={{
                left: "50%",
                top: "2px",
                transformOrigin: `50% 18px`,
                transform: `translateX(-50%) rotate(${i * 30}deg)`,
              }}
            />
          ))}
          {/* Hour hand */}
          <div
            className="absolute left-1/2 top-1/2 w-[2px] h-3 bg-[oklch(0.2_0.02_60)] origin-bottom -translate-x-1/2 -translate-y-full rounded-sm"
            style={{ transform: `translateX(-50%) translateY(-100%) rotate(${hourAngle}deg)`, transformOrigin: "50% 100%" }}
          />
          {/* Minute hand */}
          <div
            className="absolute left-1/2 top-1/2 w-[1px] h-4 bg-[oklch(0.3_0.03_60)] origin-bottom -translate-x-1/2 -translate-y-full rounded-sm"
            style={{ transform: `translateX(-50%) translateY(-100%) rotate(${minuteAngle}deg)`, transformOrigin: "50% 100%" }}
          />
          {/* Center dot */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[3px] h-[3px] rounded-full bg-[oklch(0.5_0.06_65)]" />
        </div>
        {/* Pendulum window */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-6 h-8 bg-[oklch(0.2_0.02_60/60%)] rounded-sm border border-[oklch(0.5_0.06_70/30%)]">
          <div className="absolute left-1/2 top-0 -translate-x-1/2">
            <div
              className="w-[1px] h-5 bg-[oklch(0.5_0.06_70/50%)]"
              style={{ animation: "pendulumSwing 3s ease-in-out infinite", transformOrigin: "top center" }}
            />
            <div
              className="w-3 h-3 rounded-full bg-[oklch(0.6_0.08_78)] mx-auto -mt-0.5"
              style={{ animation: "pendulumSwing 3s ease-in-out infinite", transformOrigin: "top center" }}
            />
          </div>
        </div>
      </div>
      {/* Shadow */}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-10 h-1 bg-black/10 blur-[2px]" />
      <style>{`@keyframes pendulumSwing { 0%, 100% { transform: rotate(-15deg); } 50% { transform: rotate(15deg); } }`}</style>
    </div>
  );
}

function OldWindow({ visible, side = "right", curtainColor = "warm" }: { visible: boolean; side?: "left" | "right"; curtainColor?: "warm" | "cool" | "dark" }) {
  const curtainColors: Record<string, string> = {
    warm: "oklch(0.55 0.06 60)",
    cool: "oklch(0.55 0.04 260)",
    dark: "oklch(0.3 0.03 60)",
  };
  const lightColor = curtainColor === "dark" ? "oklch(0.6 0.05 80 / 20%)" : "oklch(0.85 0.08 85 / 25%)";

  return (
    <div
      className={`absolute top-16 ${side === "left" ? "left-4 md:left-8" : "right-4 md:right-8"} z-[5] pointer-events-none`}
      style={{ opacity: visible ? 1 : 0, transition: "opacity 3s ease" }}
      aria-hidden="true"
    >
      {/* Window frame */}
      <div className="relative w-16 h-24 md:w-20 md:h-28 border-[3px] border-[oklch(0.4_0.05_60)] bg-gradient-to-b from-[oklch(0.85_0.06_85/30%)] to-[oklch(0.75_0.05_80/20%)] shadow-inner">
        {/* Window cross bars */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-[oklch(0.4_0.05_60/80%)]" />
        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-[oklch(0.4_0.05_60/80%)]" />
        {/* Light glow */}
        <div
          className="absolute -inset-4"
          style={{ background: `radial-gradient(ellipse at center, ${lightColor}, transparent 70%)` }}
        />
      </div>
      {/* Curtains */}
      <div
        className={`absolute -top-1 ${side === "left" ? "-left-3" : "-right-3"} w-4 h-26 md:h-30`}
        style={{
          background: `linear-gradient(180deg, ${curtainColors[curtainColor]}, ${curtainColors[curtainColor]}/60%)`,
          borderRadius: "0 2px 4px 2px",
          boxShadow: "2px 2px 8px oklch(0.15 0.02 60 / 30%)",
          animation: "curtainSway 6s ease-in-out infinite",
        }}
      />
      <div
        className={`absolute -top-1 ${side === "left" ? "-right-3" : "-left-3"} w-4 h-26 md:h-30`}
        style={{
          background: `linear-gradient(180deg, ${curtainColors[curtainColor]}, ${curtainColors[curtainColor]}/60%)`,
          borderRadius: "2px 0 2px 4px",
          boxShadow: "-2px 2px 8px oklch(0.15 0.02 60 / 30%)",
          animation: "curtainSway 6s ease-in-out infinite 0.5s",
        }}
      />
      <style>{`@keyframes curtainSway { 0%, 100% { transform: rotate(0deg); } 33% { transform: rotate(1.5deg); } 66% { transform: rotate(-0.8deg); } }`}</style>
    </div>
  );
}

function SunlightRays({ visible }: { visible: boolean }) {
  return (
    <div
      className="absolute top-0 left-[20%] w-[40%] h-[60%] z-[4] pointer-events-none overflow-hidden"
      style={{ opacity: visible ? 0.6 : 0, transition: "opacity 4s ease" }}
      aria-hidden="true"
    >
      {/* Multiple angled light rays */}
      {[0, 15, 30, -10, 8].map((angle, i) => (
        <div
          key={i}
          className="absolute top-0 left-[40%] w-[8px]"
          style={{
            height: "120%",
            background: `linear-gradient(180deg, oklch(0.95 0.05 85 / ${0.04 - i * 0.005}), transparent 80%)`,
            transform: `rotate(${angle}deg)`,
            transformOrigin: "top center",
            animation: `rayPulse ${4 + i}s ease-in-out infinite ${i * 0.5}s`,
          }}
        />
      ))}
      {/* Dust in light beams */}
      {[...Array(6)].map((_, i) => (
        <div
          key={`dust-${i}`}
          className="absolute w-[2px] h-[2px] rounded-full bg-[oklch(0.85 0.1 85 / 40%)]"
          style={{
            left: `${30 + i * 8}%`,
            top: `${15 + (i % 3) * 20}%`,
            animation: `dustFloat ${5 + i}s ease-in-out infinite ${i * 0.8}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes rayPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
        @keyframes dustFloat { 0% { transform: translate(0, 0); } 25% { transform: translate(3px, -5px); } 50% { transform: translate(-2px, -10px); } 75% { transform: translate(4px, -3px); } 100% { transform: translate(0, 0); } }
      `}</style>
    </div>
  );
}

function BooksStacked({ visible, variant = "shelf" }: { visible: boolean; variant?: "shelf" | "floor" | "desk" }) {
  const bookColors = [
    "oklch(0.5 0.08 25)", "oklch(0.4 0.06 140)", "oklch(0.6 0.06 70)",
    "oklch(0.45 0.07 260)", "oklch(0.55 0.05 60)", "oklch(0.35 0.05 300)",
    "oklch(0.65 0.08 80)", "oklch(0.4 0.05 180)",
  ];

  const shelf = (
    <div className="absolute top-20 left-4 md:left-8 z-[5] pointer-events-none" style={{ opacity: visible ? 1 : 0, transition: "opacity 3s ease" }}>
      {/* Shelf */}
      <div className="relative w-24 md:w-32">
        {/* Shelf board */}
        <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-[oklch(0.4_0.05_60)] shadow-md" />
        <div className="absolute bottom-1 left-0 right-0 h-[2px] bg-[oklch(0.5_0.06_65/50%)]" />
        {/* Books on shelf */}
        <div className="absolute bottom-1 left-1 flex gap-[2px]">
          {bookColors.slice(0, 6).map((color, i) => (
            <div
              key={i}
              className="w-[5px] rounded-t-sm shadow-sm"
              style={{
                height: `${16 + (i % 3) * 4}px`,
                background: color,
                transform: `rotate(${(i % 2 === 0 ? 1 : -1) * 0.5}deg)`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const floor = (
    <div className="absolute bottom-8 left-[15%] z-[5] pointer-events-none" style={{ opacity: visible ? 1 : 0, transition: "opacity 3s ease" }}>
      <div className="relative">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-sm shadow-sm"
            style={{
              width: `${30 + i * 5}px`,
              height: "4px",
              background: bookColors[i],
              left: `${i * 2}px`,
              bottom: `${i * 5}px`,
              transform: `rotate(${(i % 2 === 0 ? -0.5 : 0.3)}deg)`,
            }}
          />
        ))}
      </div>
    </div>
  );

  const desk = (
    <div className="absolute bottom-12 right-[20%] z-[5] pointer-events-none" style={{ opacity: visible ? 1 : 0, transition: "opacity 3s ease" }}>
      <div className="relative">
        {/* Small stack */}
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-sm shadow-sm"
            style={{
              width: "20px",
              height: "3px",
              background: bookColors[i + 4],
              left: `${i}px`,
              bottom: `${i * 3}px`,
            }}
          />
        ))}
      </div>
    </div>
  );

  return variant === "shelf" ? shelf : variant === "floor" ? floor : desk;
}

function WoodenShelves({ visible }: { visible: boolean }) {
  return (
    <div
      className="absolute top-0 right-0 w-16 md:w-20 h-full z-[3] pointer-events-none"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 3s ease" }}
      aria-hidden="true"
    >
      {/* Shelf boards */}
      {[20, 38, 56, 74].map((top) => (
        <div
          key={top}
          className="absolute left-0 right-0 h-[3px] bg-gradient-to-r from-[oklch(0.35_0.04_60)] to-[oklch(0.3_0.03_60)] shadow-sm"
          style={{ top: `${top}%` }}
        />
      ))}
      {/* Shelf side panel */}
      <div className="absolute top-0 left-0 bottom-0 w-[2px] bg-[oklch(0.35_0.04_60)]" />
      {/* Books in shelves */}
      {[20, 38, 56, 74].map((shelfTop, si) => (
        <div key={si} className="absolute" style={{ top: `${shelfTop - 5}%`, left: "4px", right: "4px", height: "5%" }}>
          {[...Array(5)].map((_, bi) => (
            <div
              key={bi}
              className="absolute bottom-0 w-[4px] rounded-t-sm"
              style={{
                left: `${bi * 5}px`,
                height: `${12 + Math.sin(si + bi) * 4}px`,
                background: `hsl(${(si * 60 + bi * 45) % 360}, 30%, ${30 + (si + bi) % 15}%)`,
                transform: `rotate(${(bi % 2 === 0 ? 0.5 : -0.5)}deg)`,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function MuseumBench({ visible, side = "left" }: { visible: boolean; side?: "left" | "right" }) {
  return (
    <div
      className={`absolute bottom-6 ${side === "left" ? "left-4 md:left-10" : "right-4 md:right-10"} z-[5] pointer-events-none`}
      style={{ opacity: visible ? 1 : 0, transition: "opacity 3s ease" }}
      aria-hidden="true"
    >
      {/* Bench seat */}
      <div className="w-16 md:w-20 h-2 bg-[oklch(0.45_0.05_60)] rounded-sm shadow-md" />
      {/* Bench legs */}
      <div className="flex justify-between px-1">
        <div className="w-[2px] h-4 bg-[oklch(0.35_0.04_60)]" />
        <div className="w-[2px] h-4 bg-[oklch(0.35_0.04_60)]" />
      </div>
      {/* Shadow */}
      <div className="absolute -bottom-1 left-0 right-0 h-[2px] bg-black/8 blur-[1px]" />
    </div>
  );
}

function Plant({ visible, size = "md", side = "left" }: { visible: boolean; size?: "sm" | "md" | "lg"; side?: "left" | "right" | "center" }) {
  const pos = side === "center" ? "left-1/2 -translate-x-1/2" : side === "left" ? "left-4 md:left-8" : "right-4 md:right-8";
  const h = size === "lg" ? 20 : size === "md" ? 14 : 10;
  return (
    <div
      className={`absolute bottom-4 ${pos} z-[5] pointer-events-none`}
      style={{ opacity: visible ? 1 : 0, transition: "opacity 3s ease" }}
      aria-hidden="true"
    >
      {/* Pot */}
      <div className="w-6 h-4 bg-[oklch(0.45_0.05_30)] rounded-b-md mx-auto shadow-sm" />
      {/* Soil */}
      <div className="absolute -top-0.5 left-0.5 right-0.5 h-1 bg-[oklch(0.25_0.04_40)] rounded-t-sm" />
      {/* Leaves */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2">
        {[0, -20, 20, -40, 40].map((angle, i) => (
          <div
            key={i}
            className="absolute bottom-0 left-1/2 origin-bottom"
            style={{
              width: "6px",
              height: `${h - i * 2}px`,
              background: `linear-gradient(180deg, oklch(${0.5 + i * 0.03} 0.12 140), oklch(${0.35 + i * 0.02} 0.1 140))`,
              transform: `translateX(-50%) rotate(${angle}deg)`,
              borderRadius: "50% 50% 0 0",
              animation: `leafSway ${4 + i}s ease-in-out infinite ${i * 0.3}s`,
            }}
          />
        ))}
      </div>
      <style>{`@keyframes leafSway { 0%, 100% { transform: translateX(-50%) rotate(var(--base-angle, 0deg)); } 50% { transform: translateX(-50%) rotate(calc(var(--base-angle, 0deg) + 3deg)); } }`}</style>
    </div>
  );
}

function OldPainting({ visible, side = "right", title }: { visible: boolean; side?: "left" | "right"; title?: string }) {
  return (
    <div
      className={`absolute top-12 ${side === "left" ? "left-4 md:left-8" : "right-4 md:right-8"} z-[5] pointer-events-none`}
      style={{ opacity: visible ? 1 : 0, transition: "opacity 3s ease" }}
      aria-hidden="true"
    >
      {/* Frame */}
      <div className="relative w-14 h-18 md:w-16 md:h-20 border-[3px] border-[oklch(0.6_0.08_78)] bg-gradient-to-br from-[oklch(0.5_0.04_60/60%)] to-[oklch(0.4_0.03_50/60%)] shadow-lg">
        {/* Inner frame */}
        <div className="absolute inset-[2px] border border-[oklch(0.75_0.1_82/40%)]" />
        {/* Painting content — abstract gradient */}
        <div className="absolute inset-[6px] bg-gradient-to-br from-[oklch(0.6_0.05_60/40%)] via-[oklch(0.5_0.08_140/30%)] to-[oklch(0.7_0.06_80/40%)]" />
        {/* Canvas texture */}
        <div className="absolute inset-[6px] opacity-20" style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 3px, oklch(0 0 0 / 5%) 3px, oklch(0 0 0 / 5%) 4px)`,
        }} />
      </div>
      {/* Frame label */}
      {title && (
        <div className="mt-1 text-center">
          <p className="font-display text-[7px] tracking-[0.2em] text-[oklch(0.55_0.04_60/50%)] uppercase">{title}</p>
        </div>
      )}
    </div>
  );
}

function GlassReflection({ visible }: { visible: boolean }) {
  return (
    <div
      className="absolute top-[30%] left-[60%] w-[20%] h-[30%] z-[6] pointer-events-none"
      style={{
        opacity: visible ? 0.15 : 0,
        transition: "opacity 3s ease",
        background: "linear-gradient(135deg, oklch(0.95 0.03 85 / 40%), transparent 50%, oklch(0.95 0.03 85 / 20%))",
        transform: "skewX(-15deg)",
      }}
      aria-hidden="true"
    />
  );
}

function OldKey({ visible, side = "right" }: { visible: boolean; side?: "left" | "right" }) {
  return (
    <div
      className={`absolute top-[40%] ${side === "left" ? "left-6" : "right-6"} z-[5] pointer-events-none`}
      style={{ opacity: visible ? 1 : 0, transition: "opacity 3s ease", animation: visible ? "keyShine 4s ease-in-out infinite" : "none" }}
      aria-hidden="true"
    >
      <div className="relative">
        {/* Key bow */}
        <div className="w-4 h-4 rounded-full border-2 border-[oklch(0.7_0.09_80)] bg-[oklch(0.65_0.08_78/20%)] mx-auto" />
        {/* Key shaft */}
        <div className="w-[2px] h-8 bg-[oklch(0.65_0.08_78)] mx-auto" />
        {/* Key teeth */}
        <div className="flex gap-[1px] justify-end pr-0.5">
          <div className="w-[3px] h-2 bg-[oklch(0.6_0.08_78)]" />
          <div className="w-[3px] h-3 bg-[oklch(0.6_0.08_78)]" />
        </div>
      </div>
      <style>{`@keyframes keyShine { 0%, 100% { filter: brightness(1); } 50% { filter: brightness(1.2); } }`}</style>
    </div>
  );
}

function MuseumBox({ visible, side = "left" }: { visible: boolean; side?: "left" | "right" }) {
  return (
    <div
      className={`absolute bottom-10 ${side === "left" ? "left-[8%]" : "right-[8%]"} z-[5] pointer-events-none`}
      style={{ opacity: visible ? 0.7 : 0, transition: "opacity 3s ease" }}
      aria-hidden="true"
    >
      {/* Box body */}
      <div className="w-12 h-8 bg-gradient-to-b from-[oklch(0.55_0.04_60)] to-[oklch(0.45_0.04_55)] border border-[oklch(0.4_0.04_55)] shadow-md">
        {/* Box lid line */}
        <div className="absolute top-2 left-0 right-0 h-[1px] bg-[oklch(0.5_0.04_55/60%)]" />
        {/* Label */}
        <div className="absolute top-3 left-2 w-6 h-3 bg-[oklch(0.9_0.03_85/60%)] border border-[oklch(0.6_0.06_70/30%)]">
          <div className="absolute inset-[2px] border border-dashed border-[oklch(0.5_0.04_60/40%)]" />
        </div>
      </div>
    </div>
  );
}

function Fireplace({ visible }: { visible: boolean }) {
  return (
    <div
      className="absolute bottom-8 left-4 md:left-12 z-[5] pointer-events-none"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 3s ease" }}
      aria-hidden="true"
    >
      {/* Fireplace structure */}
      <div className="relative w-16 md:w-20">
        {/* Mantel */}
        <div className="w-full h-[4px] bg-[oklch(0.35_0.04_60)] rounded-sm shadow-md mb-1" />
        {/* Surround */}
        <div className="flex">
          <div className="w-3 h-12 bg-[oklch(0.3_0.03_60)] border-r border-[oklch(0.4_0.04_55)]" />
          <div className="flex-1 h-12 bg-[oklch(0.15_0.02_30)] relative overflow-hidden">
            {/* Fire */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
              {[0, -3, 3, -6, 6].map((offset, i) => (
                <div
                  key={i}
                  className="absolute bottom-0"
                  style={{
                    left: `${offset}px`,
                    width: "4px",
                    height: `${8 + Math.random() * 6}px`,
                    background: `linear-gradient(180deg, oklch(0.85 0.15 80 / 60%), oklch(0.65 0.2 30 / 80%), oklch(0.4 0.15 25 / 90%))`,
                    borderRadius: "50% 50% 0 0",
                    animation: `flame ${1.5 + i * 0.3}s ease-in-out infinite ${i * 0.1}s`,
                    transformOrigin: "bottom center",
                  }}
                />
              ))}
              {/* Ember glow */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-2 bg-[oklch(0.7 0.2 30 / 30%)] blur-[4px]" />
            </div>
          </div>
          <div className="w-3 h-12 bg-[oklch(0.3_0.03_60)] border-l border-[oklch(0.4_0.04_55)]" />
        </div>
        {/* Hearth */}
        <div className="w-full h-[3px] bg-[oklch(0.35_0.04_60)]" />
      </div>
      <style>{`@keyframes flame { 0%, 100% { transform: scaleY(1) scaleX(1); } 25% { transform: scaleY(1.2) scaleX(0.8); } 50% { transform: scaleY(0.9) scaleX(1.1); } 75% { transform: scaleY(1.15) scaleX(0.9); } }`}</style>
    </div>
  );
}

function ReadingLamp({ visible, side = "right" }: { visible: boolean; side?: "left" | "right" }) {
  return (
    <div
      className={`absolute bottom-6 ${side === "left" ? "left-6" : "right-6"} z-[5] pointer-events-none`}
      style={{ opacity: visible ? 1 : 0, transition: "opacity 3s ease" }}
      aria-hidden="true"
    >
      {/* Lamp base */}
      <div className="w-6 h-1 bg-[oklch(0.4_0.04_60)] rounded-full mx-auto" />
      {/* Lamp stem */}
      <div className="w-[2px] h-10 bg-[oklch(0.45_0.04_60)] mx-auto" />
      {/* Lamp shade */}
      <div className="relative">
        <div
          className="w-8 h-6 mx-auto"
          style={{
            background: "linear-gradient(180deg, oklch(0.75 0.06 80), oklch(0.65 0.05 75))",
            clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)",
          }}
        />
        {/* Light glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-16"
          style={{
            background: "radial-gradient(ellipse at 50% 0%, oklch(0.9 0.1 85 / 25%), transparent 60%)",
            animation: "lampGlow 5s ease-in-out infinite",
          }}
        />
      </div>
      <style>{`@keyframes lampGlow { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }`}</style>
    </div>
  );
}

function StoneWall({ visible }: { visible: boolean }) {
  return (
    <div
      className="absolute inset-0 z-[2] pointer-events-none"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 4s ease" }}
      aria-hidden="true"
    >
      {/* Stone pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 20px,
              oklch(0.3 0.03 60 / 40%) 20px,
              oklch(0.3 0.03 60 / 40%) 21px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 40px,
              oklch(0.3 0.03 60 / 30%) 40px,
              oklch(0.3 0.03 60 / 30%) 41px
            )
          `,
        }}
      />
      {/* Stone highlights */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute w-12 h-8 border border-[oklch(0.4 0.03 60 / 8%)] rounded-sm"
          style={{
            left: `${(i % 4) * 25}%`,
            top: `${Math.floor(i / 4) * 50 + 10}%`,
          }}
        />
      ))}
    </div>
  );
}

function WoodCeiling({ visible }: { visible: boolean }) {
  return (
    <div
      className="absolute top-0 left-0 right-0 h-[8%] z-[3] pointer-events-none"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 3s ease" }}
      aria-hidden="true"
    >
      {/* Wood beam pattern */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            repeating-linear-gradient(
              90deg,
              oklch(0.3 0.04 60 / 50%),
              oklch(0.3 0.04 60 / 50%) 2rem,
              oklch(0.25 0.03 60 / 40%) 2rem,
              oklch(0.25 0.03 60 / 40%) 4rem
            )
          `,
          boxShadow: "inset 0 -8px 20px oklch(0.15 0.03 60 / 30%)",
        }}
      />
      {/* Beam lines */}
      {[25, 50, 75].map((pct) => (
        <div
          key={pct}
          className="absolute top-0 bottom-0 w-[2px] bg-[oklch(0.25 0.03 60 / 60%)]"
          style={{ left: `${pct}%` }}
        />
      ))}
    </div>
  );
}

function HangingLights({ visible, count = 3 }: { visible: boolean; count?: number }) {
  return (
    <div className="absolute top-0 left-0 right-0 z-[6] pointer-events-none" style={{ opacity: visible ? 1 : 0, transition: "opacity 3s ease" }} aria-hidden="true">
      {[...Array(count)].map((_, i) => {
        const left = 20 + (i * 60) / count;
        return (
          <div
            key={i}
            className="absolute top-0"
            style={{ left: `${left}%` }}
          >
            {/* Hanging wire */}
            <div className="w-[1px] h-6 bg-[oklch(0.4 0.04 60)] mx-auto" />
            {/* Bulb */}
            <div className="relative">
              <div className="w-3 h-4 mx-auto rounded-full bg-[oklch(0.9 0.08 85)] shadow-[0_0_12px_oklch(0.85_0.1_85/40%)]" />
              {/* Glow */}
              <div
                className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-12"
                style={{
                  background: "radial-gradient(ellipse at 50% 0%, oklch(0.9 0.08 85 / 20%), transparent 60%)",
                  animation: `lightFlicker ${5 + i}s ease-in-out infinite ${i * 0.5}s`,
                }}
              />
            </div>
          </div>
        );
      })}
      <style>{`@keyframes lightFlicker { 0%, 95%, 100% { opacity: 1; } 96% { opacity: 0.8; } 97% { opacity: 1; } 98% { opacity: 0.9; } }`}</style>
    </div>
  );
}

function DustParticles({ visible, count = 20 }: { visible: boolean; count?: number }) {
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 1 + Math.random() * 2,
      duration: 8 + Math.random() * 12,
      delay: Math.random() * 5,
    })), []);

  return (
    <div className="absolute inset-0 z-[7] pointer-events-none overflow-hidden" style={{ opacity: visible ? 1 : 0, transition: "opacity 3s ease" }} aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-[oklch(0.85 0.1 85 / 30%)]"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animation: `ambientDust ${p.duration}s ease-in-out infinite ${p.delay}s`,
          }}
        />
      ))}
      <style>{`@keyframes ambientDust { 0% { transform: translate(0, 0) scale(1); opacity: 0.3; } 25% { transform: translate(10px, -15px) scale(1.1); opacity: 0.5; } 50% { transform: translate(-5px, -30px) scale(0.9); opacity: 0.2; } 75% { transform: translate(8px, -10px) scale(1.05); opacity: 0.4; } 100% { transform: translate(0, 0) scale(1); opacity: 0.3; } }`}</style>
    </div>
  );
}

function CandleGlow({ visible, count = 2, side = "right" }: { visible: boolean; count?: number; side?: "left" | "right" }) {
  return (
    <div
      className={`absolute bottom-16 ${side === "left" ? "left-[15%]" : "right-[15%]"} z-[5] pointer-events-none`}
      style={{ opacity: visible ? 1 : 0, transition: "opacity 3s ease" }}
      aria-hidden="true"
    >
      <div className="flex gap-6">
        {[...Array(count)].map((_, i) => (
          <div key={i} className="relative">
            {/* Candle body */}
            <div className="w-2 h-6 bg-[oklch(0.9 0.04 85)] rounded-t-sm mx-auto" />
            {/* Wick */}
            <div className="w-[1px] h-1.5 bg-[oklch(0.2 0.02 60)] mx-auto" />
            {/* Flame */}
            <div
              className="absolute -top-3 left-1/2 -translate-x-1/2 w-2 h-3 rounded-full"
              style={{
                background: "linear-gradient(180deg, oklch(0.9 0.15 85 / 80%), oklch(0.75 0.2 50 / 60%))",
                animation: `candleFlicker ${2 + i * 0.5}s ease-in-out infinite`,
                transformOrigin: "bottom center",
              }}
            />
            {/* Glow */}
            <div
              className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full"
              style={{
                background: "radial-gradient(circle, oklch(0.9 0.15 85 / 15%), transparent 60%)",
                animation: `candleFlicker ${2 + i * 0.5}s ease-in-out infinite`,
              }}
            />
          </div>
        ))}
      </div>
      <style>{`@keyframes candleFlicker { 0%, 100% { transform: translateX(-50%) scaleY(1) scaleX(1); } 25% { transform: translateX(-50%) scaleY(1.1) scaleX(0.9); } 50% { transform: translateX(-50%) scaleY(0.95) scaleX(1.05); } 75% { transform: translateX(-50%) scaleY(1.05) scaleX(0.95); } }`}</style>
    </div>
  );
}

/* ============================================================
   ENVIRONMENT PROFILE TYPES
   ============================================================ */

export interface EnvironmentProfile {
  grandfatherClock?: boolean;
  oldWindow?: { side: "left" | "right"; curtainColor: "warm" | "cool" | "dark" };
  sunlightRays?: boolean;
  booksStacked?: "shelf" | "floor" | "desk";
  woodenShelves?: boolean;
  museumBench?: { side: "left" | "right" };
  plant?: { size: "sm" | "md" | "lg"; side: "left" | "right" | "center" };
  oldPainting?: { side: "left" | "right"; title?: string };
  glassReflection?: boolean;
  oldKey?: { side: "left" | "right" };
  museumBox?: { side: "left" | "right" };
  fireplace?: boolean;
  readingLamp?: { side: "left" | "right" };
  stoneWall?: boolean;
  woodCeiling?: boolean;
  hangingLights?: { count: number };
  dustParticles?: boolean;
  candleGlow?: { count: number; side: "left" | "right" };
}

/* ============================================================
   MAIN ROOM ENVIRONMENT COMPONENT
   ============================================================ */

export default function RoomEnvironment({ profile, visible }: { profile: EnvironmentProfile; visible: boolean }) {
  if (!profile) return null;

  return (
    <>
      {profile.grandfatherClock && <GrandfatherClock visible={visible} />}
      {profile.oldWindow && <OldWindow visible={visible} side={profile.oldWindow.side} curtainColor={profile.oldWindow.curtainColor} />}
      {profile.sunlightRays && <SunlightRays visible={visible} />}
      {profile.booksStacked && <BooksStacked visible={visible} variant={profile.booksStacked} />}
      {profile.woodenShelves && <WoodenShelves visible={visible} />}
      {profile.museumBench && <MuseumBench visible={visible} side={profile.museumBench.side} />}
      {profile.plant && <Plant visible={visible} size={profile.plant.size} side={profile.plant.side} />}
      {profile.oldPainting && <OldPainting visible={visible} side={profile.oldPainting.side} title={profile.oldPainting.title} />}
      {profile.glassReflection && <GlassReflection visible={visible} />}
      {profile.oldKey && <OldKey visible={visible} side={profile.oldKey.side} />}
      {profile.museumBox && <MuseumBox visible={visible} side={profile.museumBox.side} />}
      {profile.fireplace && <Fireplace visible={visible} />}
      {profile.readingLamp && <ReadingLamp visible={visible} side={profile.readingLamp.side} />}
      {profile.stoneWall && <StoneWall visible={visible} />}
      {profile.woodCeiling && <WoodCeiling visible={visible} />}
      {profile.hangingLights && <HangingLights visible={visible} count={profile.hangingLights.count} />}
      {profile.dustParticles && <DustParticles visible={visible} />}
      {profile.candleGlow && <CandleGlow visible={visible} count={profile.candleGlow.count} side={profile.candleGlow.side} />}
    </>
  );
}

/* ============================================================
   PREDEFINED PROFILES PER GALLERY
   ============================================================ */

export const GALLERY_ENVIRONMENTS: Record<string, EnvironmentProfile> = {
  "gallery-1": {
    grandfatherClock: true,
    oldWindow: { side: "right", curtainColor: "warm" },
    booksStacked: "shelf",
    readingLamp: { side: "left" },
    dustParticles: true,
  },
  "gallery-2": {
    sunlightRays: true,
    glassReflection: true,
    plant: { size: "md", side: "right" },
    woodenShelves: true,
    oldPainting: { side: "left", title: "Portrait Study" },
    dustParticles: true,
  },
  "gallery-3": {
    glassReflection: true,
    oldPainting: { side: "right", title: "Untitled No. 3" },
    museumBench: { side: "left" },
    hangingLights: { count: 3 },
    woodCeiling: true,
    dustParticles: true,
  },
  "gallery-4": {
    woodenShelves: true,
    fireplace: true,
    stoneWall: true,
    woodCeiling: true,
    booksStacked: "shelf",
    readingLamp: { side: "right" },
    oldWindow: { side: "left", curtainColor: "warm" },
    dustParticles: true,
  },
  "gallery-5": {
    hangingLights: { count: 4 },
    woodCeiling: true,
    oldPainting: { side: "left", title: "Acoustic Portrait" },
    museumBench: { side: "right" },
    candleGlow: { count: 2, side: "left" },
    dustParticles: true,
  },
  "gallery-6": {
    oldWindow: { side: "right", curtainColor: "warm" },
    candleGlow: { count: 3, side: "right" },
    museumBench: { side: "left" },
    plant: { size: "lg", side: "center" },
    stoneWall: true,
    hangingLights: { count: 2 },
    dustParticles: true,
  },
  "gallery-7": {
    woodenShelves: true,
    oldKey: { side: "right" },
    museumBox: { side: "left" },
    readingLamp: { side: "left" },
    plant: { size: "sm", side: "right" },
    booksStacked: "floor",
    dustParticles: true,
  },
  "gallery-8": {
    oldWindow: { side: "left", curtainColor: "cool" },
    sunlightRays: true,
    museumBench: { side: "right" },
    hangingLights: { count: 2 },
    plant: { size: "md", side: "left" },
    dustParticles: true,
  },
  "gallery-9": {
    oldPainting: { side: "right", title: "Cartographer's Study" },
    woodenShelves: true,
    readingLamp: { side: "left" },
    oldKey: { side: "right" },
    museumBox: { side: "left" },
    dustParticles: true,
  },
  "gallery-10": {
    fireplace: true,
    candleGlow: { count: 2, side: "right" },
    woodenShelves: true,
    museumBench: { side: "left" },
    oldPainting: { side: "right", title: "Gratitude" },
    hangingLights: { count: 2 },
    dustParticles: true,
  },
  "gallery-11": {
    woodCeiling: true,
    hangingLights: { count: 5 },
    oldPainting: { side: "left", title: "Star Chart" },
    museumBench: { side: "right" },
    dustParticles: true,
  },
  "gallery-12": {
    oldWindow: { side: "right", curtainColor: "dark" },
    fireplace: true,
    oldKey: { side: "left" },
    candleGlow: { count: 2, side: "right" },
    stoneWall: true,
    readingLamp: { side: "left" },
    booksStacked: "desk",
    dustParticles: true,
  },
  "gallery-13": {
    oldWindow: { side: "left", curtainColor: "cool" },
    sunlightRays: true,
    plant: { size: "lg", side: "right" },
    museumBench: { side: "left" },
    dustParticles: true,
  },
  "final-room": {
    oldWindow: { side: "left", curtainColor: "warm" },
    plant: { size: "lg", side: "right" },
    hangingLights: { count: 1 },
    museumBench: { side: "right" },
    dustParticles: true,
  },
};
