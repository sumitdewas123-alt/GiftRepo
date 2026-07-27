/* Spec — Gallery 13: The Final Hall. Quiet. One bench, one window, a garden outside.
 * A frame that is a mirror. The Archivist drops a feather. Button: "Leave Museum". */
import { useEffect, useRef, useState } from "react";
import { useMuseum } from "@/contexts/MuseumContext";
import RoomEnvironment, { GALLERY_ENVIRONMENTS } from "@/components/RoomEnvironment";
import RoomAtmosphere, { GALLERY_ATMOSPHERES } from "@/components/RoomAtmosphere";

const BIRD = "/manus-storage/logo-bird_bdea2d3a.png";

const finalLines = [
  "Every museum has an exit.",
  "Not because the story ends.",
  "Because visitors eventually have to go home.",
];

export default function FinalRoom({ onLastExhibit }: { onLastExhibit: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [lineIdx, setLineIdx] = useState(-1);
  const [mirrorStage, setMirrorStage] = useState(0);
  const { markVisited, award } = useMuseum();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { setVisible(true); markVisited("final-room"); }
      }),
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [markVisited]);

  useEffect(() => {
    if (!visible) return;
    setLineIdx(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i < finalLines.length; i++) {
      timers.push(setTimeout(() => setLineIdx(i), i * 2200));
    }
    timers.push(setTimeout(() => setMirrorStage(1), finalLines.length * 2200 + 1500));
    timers.push(setTimeout(() => setMirrorStage(2), finalLines.length * 2200 + 4500));
    timers.push(setTimeout(() => setMirrorStage(3), finalLines.length * 2200 + 7500));
    return () => timers.forEach(clearTimeout);
  }, [visible]);

  return (
    <section
      ref={ref}
      id="final-room"
      aria-label="Gallery Thirteen — The Final Hall"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-background via-[#fdfbf6] to-white px-6 py-32 text-center dark:via-[oklch(0.3_0.02_60)] dark:to-[oklch(0.4_0.02_75)]"
    >
      {/* Environmental storytelling */}
      <RoomEnvironment profile={GALLERY_ENVIRONMENTS["final-room"] || {}} visible={visible} />
      <RoomAtmosphere profile={GALLERY_ATMOSPHERES["final-room"] || {}} visible={visible} />
      <p className="plaque mb-10">gallery thirteen · the final hall</p>
      {/* bench + window */}
      <div className="mb-10 flex items-end gap-6 opacity-80" aria-hidden="true" style={{ animation: visible ? "fadeIn 3s ease both" : undefined }}>
        <span className="text-5xl">🪟</span>
        <span className="text-6xl">🪑</span>
        <span className="text-4xl">🌿</span>
      </div>

      <div className="museum-frame max-w-xl bg-white/85 p-10 backdrop-blur-sm dark:bg-[oklch(0.32_0.02_65/90%)] md:p-14">
        <div className="min-h-[8rem]">
          {finalLines.map((line, i) => (
            <p
              key={line}
              className={`room-title text-xl leading-relaxed text-[#3d3020] dark:text-[#efe2c2] md:text-2xl ${i > lineIdx ? "hidden" : ""}`}
              style={{ animation: "fadeUp 1.8s cubic-bezier(0.23,1,0.32,1) both", marginBottom: "0.8rem" }}
            >
              {line}
            </p>
          ))}
        </div>

        {/* The mirror frame */}
        {mirrorStage >= 1 && (
          <div className="mx-auto mt-6 max-w-xs" style={{ animation: "fadeUp 2s ease both" }}>
            <div className="museum-frame relative overflow-hidden bg-gradient-to-b from-[#d9d2c0] via-[#efe9da] to-[#cfc7b2] p-8 dark:from-[#3a3225] dark:via-[#4a4030] dark:to-[#2e271b]">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent" aria-hidden="true" />
              <p className="font-hand text-lg text-[#6b5c40] dark:text-[#d8c9a5]">not a picture. a mirror.</p>
              <p className="mt-2 font-display text-xs italic tracking-wide text-[#8a7a5c]">the visitor sees themselves.</p>
            </div>
            <p className="plaque mx-auto mt-4">Every exhibit you saw today existed because you lived it.</p>
            {mirrorStage >= 2 && (
              <p className="mt-3 font-body italic leading-relaxed text-muted-foreground" style={{ animation: "fadeIn 2s ease both" }}>
                Thank you for unknowingly giving this museum something worth preserving.
              </p>
            )}
          </div>
        )}

        {/* The Archivist's feather */}
        {mirrorStage >= 3 && (
          <div className="mt-6 flex flex-col items-center" style={{ animation: "fadeUp 1.5s ease both" }}>
            <img src={BIRD} alt="The Archivist lands beside the frame" className="h-12 w-12" style={{ animation: "floatSlow 4s ease-in-out infinite" }} />
            <p className="mt-1 font-hand text-lg text-muted-foreground">it drops one feather 🪶 · looks toward the exit · flies away</p>
            <button
              onClick={() => { award("finished"); onLastExhibit(); }}
              className="mt-8 border border-[#8a6f3c] px-10 py-4 font-display text-sm tracking-[0.3em] text-[#6b5426] transition-all duration-200 hover:bg-[#c9a45c]/15 hover:shadow-[0_0_30px_rgba(201,164,92,0.2)] focus:outline-none focus:ring-2 focus:ring-[#c9a45c] active:scale-[0.97] dark:text-[#e8cd8c]"
              style={{ animation: "fadeUp 1.5s ease 0.8s both" }}
            >
              LEAVE MUSEUM
            </button>
          </div>
        )}
      </div>
      <p className="mt-10 font-body text-sm italic text-muted-foreground" style={{ animation: visible ? "fadeIn 4s ease 2s both" : undefined }}>
        outside the window: a huge garden. birds. sunlight on wood.
      </p>
    </section>
  );
}
