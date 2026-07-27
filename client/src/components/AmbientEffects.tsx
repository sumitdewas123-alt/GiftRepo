/*
 * Gilded Archive — canvas ambient layers: floating dust, falling leaves, rain.
 * Low particle counts, GPU-friendly, respects prefers-reduced-motion.
 */
import { useEffect, useRef } from "react";
import { useMuseum } from "@/contexts/MuseumContext";

interface Particle {
  x: number; y: number; vx: number; vy: number;
  size: number; alpha: number; phase: number; spin: number; rot: number;
  kind: "dust" | "leaf" | "rain";
}

export default function AmbientEffects() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { rain, leaves, night } = useMuseum();
  const stateRef = useRef({ rain, leaves, night });
  stateRef.current = { rain, leaves, night };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const onResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);

    const dust: Particle[] = Array.from({ length: 40 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.15, vy: -0.05 - Math.random() * 0.12,
      size: 0.8 + Math.random() * 1.8, alpha: 0.15 + Math.random() * 0.3,
      phase: Math.random() * Math.PI * 2, spin: 0, rot: 0, kind: "dust",
    }));
    const leafParticles: Particle[] = Array.from({ length: 14 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: 0.2 + Math.random() * 0.3, vy: 0.3 + Math.random() * 0.4,
      size: 5 + Math.random() * 7, alpha: 0.5 + Math.random() * 0.3,
      phase: Math.random() * Math.PI * 2, spin: (Math.random() - 0.5) * 0.02, rot: Math.random() * Math.PI * 2, kind: "leaf",
    }));
    const rainDrops: Particle[] = Array.from({ length: 90 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: -1, vy: 9 + Math.random() * 6,
      size: 8 + Math.random() * 10, alpha: 0.12 + Math.random() * 0.18,
      phase: 0, spin: 0, rot: 0, kind: "rain",
    }));

    let raf = 0;
    let t = 0;
    const draw = () => {
      const s = stateRef.current;
      t += 0.008;
      ctx.clearRect(0, 0, w, h);

      // dust — always on (signature)
      for (const p of dust) {
        p.x += p.vx + Math.sin(t + p.phase) * 0.08;
        p.y += p.vy;
        if (p.y < -5) { p.y = h + 5; p.x = Math.random() * w; }
        if (p.x < -5) p.x = w + 5;
        if (p.x > w + 5) p.x = -5;
        const twinkle = 0.6 + 0.4 * Math.sin(t * 2 + p.phase);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = s.night
          ? `rgba(232, 205, 140, ${p.alpha * twinkle})`
          : `rgba(201, 164, 92, ${p.alpha * twinkle * 0.8})`;
        ctx.fill();
      }

      if (s.leaves) {
        for (const p of leafParticles) {
          p.x += p.vx + Math.sin(t * 1.5 + p.phase) * 0.6;
          p.y += p.vy;
          p.rot += p.spin;
          if (p.y > h + 20) { p.y = -20; p.x = Math.random() * w; }
          if (p.x > w + 20) p.x = -20;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot + Math.sin(t + p.phase) * 0.4);
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * 0.45, 0, 0, Math.PI * 2);
          ctx.fillStyle = s.night ? `rgba(160, 120, 60, ${p.alpha * 0.5})` : `rgba(178, 124, 56, ${p.alpha * 0.6})`;
          ctx.fill();
          ctx.strokeStyle = s.night ? `rgba(120, 90, 45, ${p.alpha * 0.4})` : `rgba(140, 95, 40, ${p.alpha * 0.5})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(-p.size, 0);
          ctx.lineTo(p.size, 0);
          ctx.stroke();
          ctx.restore();
        }
      }

      if (s.rain) {
        ctx.strokeStyle = s.night ? "rgba(180, 200, 230, 0.25)" : "rgba(120, 140, 170, 0.3)";
        ctx.lineWidth = 1;
        for (const p of rainDrops) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.y > h + 20) { p.y = -20; p.x = Math.random() * (w + 100); }
          ctx.globalAlpha = p.alpha * 2;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - 1.5, p.y + p.size);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-40"
    />
  );
}
