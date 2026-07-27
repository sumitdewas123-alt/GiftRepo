/*
 * Gilded Archive — cinematic entrance per master spec:
 * black → warm light → hallway (covered exhibits + personal hints) → Archivist notes →
 * brass plaque "One Visitor Expected" → Enter → doors → engraved title reveal →
 * intro hall 6 sentences → Lift Plaque (Dear Chicko letter) → Museum Rules → "Ready?" → Begin Exploring.
 * Eggs: click bird 5x, click empty frame, double-click floor, idle 60s bird sleeps.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { useMuseum } from "@/contexts/MuseumContext";
import { soundEngine } from "@/lib/soundEngine";
import { museumRules, dearChickoLetter } from "@/lib/museumData";

const HALLWAY = "/manus-storage/museum-hallway_34980189.png";
const BIRD = "/manus-storage/logo-bird_bdea2d3a.png";

const introLines = [
  "This museum is not about achievements.",
  "It isn't about birthdays.",
  "It isn't even about memories.",
  "It's about impact.",
  "About the quiet ways one person changes another person's life...",
  "...without ever realizing they did.",
];

const hallwayHints = [
  { text: "\u201cTuesdays with Morrie\u201d rests on a shelf", icon: "📖" },
  { text: "a tiny ceramic tooth", icon: "🦷" },
  { text: "\u201cTough Guy\u201d — crossed out — \u201cStill Tough Guy.\u201d", icon: "🥊" },
  { text: "a sticky note: \u201cWeak Memory was here.\u201d", icon: "📝" },
  { text: "a missing book: \u201c25 Chapters of You\u201d · Returned: Never.", icon: "📕" },
];

export default function Entrance({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState<"dark" | "lights" | "hall" | "doors" | "title" | "intro" | "letter" | "ready">("dark");
  const [lineIdx, setLineIdx] = useState(-1);
  const [birdNote, setBirdNote] = useState<string | null>(null);
  const [birdClicks, setBirdClicks] = useState(0);
  const [birdAsleep, setBirdAsleep] = useState(false);
  const [frameFlicker, setFrameFlicker] = useState(false);
  const [floorNote, setFloorNote] = useState(false);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { toggleSound, soundOn } = useMuseum();

  useEffect(() => {
    const t1 = setTimeout(() => setStage("lights"), 1600);
    const t2 = setTimeout(() => setStage("hall"), 3600);
    const t3 = setTimeout(() => setBirdNote("Some places aren't built with bricks.\nSome are built with memories."), 5600);
    const t4 = setTimeout(() => setBirdNote("Follow me."), 10500);
    const t5 = setTimeout(() => setBirdNote(null), 14000);
    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
  }, []);

  // idle 60s → bird sleeps
  const resetIdle = useCallback(() => {
    setBirdAsleep(false);
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setBirdAsleep(true), 60000);
  }, []);
  useEffect(() => {
    resetIdle();
    window.addEventListener("mousemove", resetIdle);
    window.addEventListener("keydown", resetIdle);
    return () => {
      window.removeEventListener("mousemove", resetIdle);
      window.removeEventListener("keydown", resetIdle);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [resetIdle]);

  useEffect(() => {
    if (stage !== "intro") return;
    setLineIdx(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i < introLines.length; i++) {
      timers.push(setTimeout(() => setLineIdx(i), i * 2600));
    }
    return () => timers.forEach(clearTimeout);
  }, [stage]);

  const clickBird = () => {
    const n = birdClicks + 1;
    setBirdClicks(n);
    if (n >= 5) {
      setBirdNote("I am the guide.\nNot the exhibit.");
      setBirdClicks(0);
      setTimeout(() => setBirdNote(null), 5000);
    }
  };

  const clickFrame = () => {
    setFrameFlicker(true);
    setTimeout(() => setFrameFlicker(false), 600);
  };

  const enter = () => {
    if (!soundOn) {
      soundEngine.start();
      toggleSound();
    }
    soundEngine.chime();
    setStage("doors");
    setTimeout(() => setStage("title"), 2400);
    setTimeout(() => setStage("intro"), 8200);
  };

  return (
    <div
      className="fixed inset-0 z-[60] overflow-y-auto overflow-x-hidden bg-[#0d0a06]"
      role="dialog"
      aria-label="Museum entrance"
      onDoubleClick={(e) => {
        // double-click the floor (lower part of screen, empty area)
        if (stage === "hall" && (e.target as HTMLElement).dataset.floor) setFloorNote(true);
      }}
    >
      {/* Hallway backdrop */}
      <div
        className="pointer-events-none fixed inset-0 bg-cover bg-center transition-opacity duration-[2500ms]"
        style={{
          backgroundImage: `url(${HALLWAY})`,
          opacity: stage === "dark" ? 0 : stage === "lights" ? 0.35 : stage === "hall" || stage === "doors" ? 1 : 0,
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed inset-0 transition-opacity duration-[3000ms]"
        style={{
          background: "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(201,164,92,0.14), transparent 70%)",
          opacity: stage === "dark" ? 0 : 1,
        }}
        aria-hidden="true"
      />

      {/* Stage: hallway */}
      {(stage === "hall" || stage === "doors") && (
        <div
          data-floor="1"
          className="relative flex min-h-full flex-col items-center justify-center px-4 py-10 transition-all duration-[2000ms]"
          style={{
            opacity: stage === "doors" ? 0 : 1,
            transform: stage === "doors" ? "scale(1.35)" : "scale(1)",
          }}
        >
          {/* The Archivist */}
          <button
            onClick={clickBird}
            aria-label="A small robin — The Archivist"
            className="absolute left-6 top-6 focus:outline-none focus:ring-2 focus:ring-[#c9a45c] md:left-12 md:top-12"
          >
            <img
              src={BIRD}
              alt=""
              className={`h-12 w-12 transition-transform duration-500 ${birdAsleep ? "rotate-12 opacity-60" : ""}`}
              style={{ animation: birdAsleep ? "none" : "floatSlow 4s ease-in-out infinite" }}
            />
            {birdAsleep && <span className="font-hand text-lg text-[#c9a45c]">zzz…</span>}
          </button>

          {birdNote && (
            <div className="absolute left-6 top-24 max-w-[15rem] whitespace-pre-line border border-[#c9a45c]/40 bg-[#1d1710]/95 p-4 font-hand text-xl leading-snug text-[#e8cd8c] shadow-xl md:left-12 md:top-28" style={{ animation: "fadeUp 1.2s ease both" }}>
              {birdNote}
            </div>
          )}

          {/* Empty golden frame above doors (egg) */}
          <button
            onClick={clickFrame}
            aria-label="An empty golden frame"
            className="museum-frame mb-6 flex h-20 w-28 items-center justify-center bg-[#171208]/70 transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#c9a45c]"
          >
            {frameFlicker ? (
              <span className="text-3xl" style={{ animation: "fadeIn 0.15s ease both" }} aria-label="A memory flickers">📷</span>
            ) : (
              <span className="font-hand text-sm text-[#c9a45c]/40">empty</span>
            )}
          </button>

          <div className="museum-frame max-w-lg bg-[#171208]/85 px-8 py-9 text-center backdrop-blur-sm md:px-12 md:py-12" style={{ animation: "fadeUp 1.8s cubic-bezier(0.23,1,0.32,1) both" }}>
            <p className="font-display text-xs tracking-[0.35em] text-[#c9a45c]">TODAY'S EXHIBITION</p>
            <h1 className="room-title mt-4 text-2xl leading-tight text-[#efe2c2] md:text-4xl" style={{ animation: "flicker 7s infinite" }}>
              One Visitor Expected
            </h1>
            <p className="mt-5 font-body text-base italic leading-relaxed text-[#d8c9a5]">
              Beyond these doors: moments, memories, stories, and little pieces of life that only exist because you were part of them.
            </p>
            <button
              onClick={enter}
              className="mt-8 border-2 border-[#c9a45c]/80 bg-gradient-to-b from-[#c9a45c]/25 to-[#8a6f3c]/25 px-10 py-3.5 font-display text-sm tracking-[0.3em] text-[#e8cd8c] shadow-[0_3px_0_#6b5426] transition-all duration-150 hover:from-[#c9a45c]/40 hover:to-[#8a6f3c]/40 focus:outline-none focus:ring-2 focus:ring-[#c9a45c] active:translate-y-0.5 active:shadow-none"
            >
              ENTER
            </button>
          </div>

          {/* Hallway hints */}
          <div className="mt-8 flex max-w-2xl flex-wrap justify-center gap-3" aria-label="Tiny details along the hallway">
            {hallwayHints.map((h, i) => (
              <div key={h.text} className="border border-[#c9a45c]/30 bg-[#1d1710]/80 px-4 py-2.5 font-hand text-base text-[#d8c9a5] shadow-md backdrop-blur-sm" style={{ animation: `fadeUp 1.5s ease ${0.8 + i * 0.3}s both`, transform: `rotate(${(i % 3) - 1}deg)` }}>
              <span className="mr-2" aria-hidden="true">{h.icon}</span>{h.text}
              </div>
            ))}
          </div>

          {floorNote && (
            <div className="fixed bottom-10 left-1/2 z-10 -translate-x-1/2 border border-[#c9a45c]/50 bg-[#f6ecd4] px-6 py-4 font-hand text-xl text-[#5a4327] shadow-2xl" style={{ animation: "fadeUp 0.6s ease both" }} role="note">
              a loose floorboard opens… <br />"Some stories are hidden on purpose."
              <button onClick={() => setFloorNote(false)} className="ml-3 text-sm underline focus:outline-none">close</button>
            </div>
          )}
        </div>
      )}

      {/* Doors opening */}
      {stage === "doors" && (
        <>
          <div className="fixed inset-y-0 left-0 w-1/2 origin-left bg-gradient-to-r from-[#241a0e] to-[#3a2c18]" style={{ animation: "doorLeft 2.2s cubic-bezier(0.77,0,0.175,1) forwards" }} aria-hidden="true" />
          <div className="fixed inset-y-0 right-0 w-1/2 origin-right bg-gradient-to-l from-[#241a0e] to-[#3a2c18]" style={{ animation: "doorRight 2.2s cubic-bezier(0.77,0,0.175,1) forwards" }} aria-hidden="true" />
          <style>{`
            @keyframes doorLeft { from { transform: translateX(0); } to { transform: translateX(-100%); } }
            @keyframes doorRight { from { transform: translateX(0); } to { transform: translateX(100%); } }
          `}</style>
        </>
      )}

      {/* Title reveal — engraved marble wall */}
      {stage === "title" && (
        <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-[#e8e2d4] to-[#d5cbb6] px-6" style={{ animation: "fadeIn 2s ease both" }}>
          <div className="paper-texture absolute inset-0" aria-hidden="true" />
          <div className="relative text-center">
            <h1
              className="room-title text-4xl tracking-[0.08em] text-transparent md:text-7xl"
              style={{
                WebkitTextStroke: "1px #8a6f3c",
                background: "linear-gradient(180deg, #b8955297, #8a6f3c)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                animation: "engrave 4s ease both",
                textShadow: "0 1px 0 rgba(255,255,255,0.4)",
              }}
            >
              THE MUSEUM<br />OF CHICKO
            </h1>
            <p className="mt-8 font-display text-sm italic tracking-[0.2em] text-[#6b5426]" style={{ animation: "fadeIn 2s ease 2.5s both" }}>
              Curated by Weak Memory
            </p>
            <p className="mt-1 font-body text-sm italic text-[#8a7a5c]" style={{ animation: "fadeIn 2s ease 3.2s both" }}>
              For the visitor who unknowingly created every exhibit.
            </p>
          </div>
          <style>{`@keyframes engrave { from { opacity: 0; letter-spacing: 0.3em; filter: blur(4px); } to { opacity: 1; letter-spacing: 0.08em; filter: blur(0); } }`}</style>
        </div>
      )}

      {/* Intro hall — sentences, then plaque & letter & rules */}
      {(stage === "intro" || stage === "letter" || stage === "ready") && (
        <div className="relative flex min-h-full items-center justify-center bg-gradient-to-b from-[#efe8da] to-[#e2d7c2] px-4 py-12" style={{ animation: "fadeIn 1.5s ease both" }}>
          <div className="paper-texture pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="relative w-full max-w-2xl text-center">
            <p className="plaque mb-8">the intro hall</p>

            {stage === "intro" && (
              <>
                <div className="min-h-[14rem]">
                  {introLines.map((line, i) => (
                    <p
                      key={line}
                      className={`room-title mx-auto text-xl leading-snug text-[#3d3020] md:text-3xl ${i > lineIdx ? "hidden" : ""} ${i < lineIdx ? "!text-base !text-[#8a7a5c] md:!text-lg" : ""}`}
                      style={{ animation: "fadeUp 1.6s cubic-bezier(0.23,1,0.32,1) both", transition: "font-size 0.8s ease, color 0.8s ease", marginBottom: "0.8rem" }}
                    >
                      {line}
                    </p>
                  ))}
                </div>
                {lineIdx >= introLines.length - 1 && (
                  <button
                    onClick={() => setStage("letter")}
                    className="mt-8 border border-[#8a6f3c] bg-transparent px-10 py-3 font-display text-sm tracking-[0.25em] text-[#6b5426] transition-all duration-200 hover:bg-[#c9a45c]/15 focus:outline-none focus:ring-2 focus:ring-[#c9a45c] active:scale-[0.97]"
                    style={{ animation: "fadeUp 1.2s ease both" }}
                  >
                    LIFT PLAQUE
                  </button>
                )}
              </>
            )}

            {stage === "letter" && (
              <div style={{ animation: "fadeUp 1s cubic-bezier(0.23,1,0.32,1) both" }}>
                <div className="paper-texture mx-auto max-h-[52vh] overflow-y-auto border border-[#c9a45c]/50 bg-[#f8f2e2] p-6 text-left shadow-2xl md:p-9">
                  {dearChickoLetter.map((para, i) =>
                    /<[a-z][\s\S]*>/i.test(para) ? (
                      <div
                        key={para.slice(0, 24)}
                        className={`mb-3 font-hand leading-relaxed text-[#4a3c1a] ${i === 0 ? "text-3xl" : i >= dearChickoLetter.length - 2 ? "text-2xl" : "text-xl"} [&_blockquote]:border-l-2 [&_blockquote]:border-[#8a6f3c] [&_blockquote]:pl-3 [&_blockquote]:italic [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6`}
                        dangerouslySetInnerHTML={{ __html: para }}
                      />
                    ) : (
                      <p key={para.slice(0, 24)} className={`mb-3 font-hand leading-relaxed text-[#4a3c1a] ${i === 0 ? "text-3xl" : i >= dearChickoLetter.length - 2 ? "text-2xl" : "text-xl"}`}>
                        {para}
                      </p>
                    )
                  )}
                </div>

                {/* Museum Rules */}
                <div className="mx-auto mt-6 max-w-md border border-[#8a6f3c]/50 bg-[#1d1710]/90 px-6 py-5 text-left shadow-lg" style={{ animation: "fadeUp 1.6s ease 0.6s both" }}>
                  <p className="font-display text-xs tracking-[0.3em] text-[#c9a45c]">MUSEUM RULES</p>
                  <ul className="mt-3 space-y-1.5">
                    {museumRules.map((rule) => (
                      <li key={rule} className="font-body text-sm leading-relaxed text-[#d8c9a5]">
                        <span className="mr-2 text-[#c9a45c]">•</span>{rule}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => setStage("ready")}
                  className="mt-8 border border-[#8a6f3c] px-10 py-3 font-display text-sm tracking-[0.25em] text-[#6b5426] transition-all duration-200 hover:bg-[#c9a45c]/15 focus:outline-none focus:ring-2 focus:ring-[#c9a45c] active:scale-[0.97]"
                >
                  CONTINUE →
                </button>
              </div>
            )}

            {stage === "ready" && (
              <div className="flex flex-col items-center" style={{ animation: "fadeUp 1s ease both" }}>
                <img src={BIRD} alt="The Archivist" className="h-16 w-16" style={{ animation: "floatSlow 4s ease-in-out infinite" }} />
                <div className="mt-4 border border-[#8a6f3c]/40 bg-[#f8f2e2] px-6 py-3 font-hand text-2xl text-[#4a3c1a] shadow-md">
                  Ready?
                </div>
                <button
                  onClick={onComplete}
                  className="mt-8 border-2 border-[#8a6f3c] px-12 py-4 font-display text-sm tracking-[0.3em] text-[#6b5426] transition-all duration-200 hover:bg-[#c9a45c]/15 hover:shadow-[0_0_30px_rgba(201,164,92,0.25)] focus:outline-none focus:ring-2 focus:ring-[#c9a45c] active:scale-[0.97]"
                >
                  BEGIN EXPLORING
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
