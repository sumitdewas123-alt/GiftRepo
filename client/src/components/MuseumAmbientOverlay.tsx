/*
 * THE MUSEUM OF CHICKO — MuseumAmbientOverlay
 * Adds subtle visual layers on top of the existing ambient effects.
 * A warm vignette that intensifies in corridors, and a soft breathing
 * light effect that makes the museum feel alive.
 *
 * This sits on top of AmbientEffects and adds the "building" feeling
 * through edge darkening and subtle warm pulsing.
 */
import { useEffect, useState } from "react";

export default function MuseumAmbientOverlay() {
  const [scrollY, setScrollY] = useState(0);
  const [breathPhase, setBreathPhase] = useState(0);

  useEffect(() => {
    let raf = 0;
    let t = 0;
    const breathe = () => {
      t += 0.003;
      setBreathPhase(t);
      raf = requestAnimationFrame(breathe);
    };
    raf = requestAnimationFrame(breathe);

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Breathing opacity oscillates between 0.08 and 0.18
  const breathOpacity = 0.08 + 0.05 * Math.sin(breathPhase);

  return (
    <>
      {/* Warm vignette — darkens edges of the entire museum */}
      <div
        className="pointer-events-none fixed inset-0 z-[35]"
        style={{
          background: `radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, oklch(0.1 0.02 60 / ${breathOpacity}))`,
          transition: "background 2s ease",
        }}
        aria-hidden="true"
      />

      {/* Top warm glow — simulates museum ceiling lights */}
      <div
        className="pointer-events-none fixed left-0 right-0 top-0 z-[35]"
        style={{
          height: "30vh",
          background: `linear-gradient(180deg, oklch(0.85 0.08 85 / ${breathOpacity * 0.6}), transparent)`,
        }}
        aria-hidden="true"
      />

      {/* Bottom warm glow — simulates floor-level warmth */}
      <div
        className="pointer-events-none fixed bottom-0 left-0 right-0 z-[35]"
        style={{
          height: "15vh",
          background: `linear-gradient(0deg, oklch(0.55 0.06 60 / ${breathOpacity * 0.4}), transparent)`,
        }}
        aria-hidden="true"
      />
    </>
  );
}
