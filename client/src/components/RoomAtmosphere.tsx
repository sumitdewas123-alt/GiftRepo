/*
 * THE MUSEUM OF CHICKO — RoomAtmosphere
 * Unique atmospheric layers per room. Each gallery gets a completely
 * different world. Built as canvas-based + CSS animation overlays that
 * sit behind content (z-index: 1) inside the RoomSection container.
 *
 * ATMOSPHERES:
 * - Library: fireplace warmth, paper floating, coffee steam, lamp glow, rain
 * - Evidence: detective string animation, spotlight sweep, magnifying cursor
 * - Little Things: cozy tea steam, blanket warmth, floating books, plant sway
 * - Sound Room: vinyl crackle visualizer, cassette hum, deep silence waves
 * - Constellation: moving stars, water reflection, slow wind, shooting stars
 * - Letters: rain against window, lamp flicker, paper texture drift, wind
 * - Future: white fog, floating frames, light rays, gentle particles
 * - Final Hall: sunrise gradient, birds in flight, garden breeze, warmth
 */
import { useEffect, useRef, useState, useCallback } from "react";

/* ============================================================
   CANVAS RAIN SYSTEM
   ============================================================ */

function CanvasRain({ visible, intensity = 0.5 }: { visible: boolean; intensity?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    if (!visible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();

    const drops: { x: number; y: number; speed: number; length: number; opacity: number }[] = [];
    const count = Math.floor(80 * intensity);
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;

    for (let i = 0; i < count; i++) {
      drops.push({
        x: Math.random() * w,
        y: Math.random() * h,
        speed: 4 + Math.random() * 6,
        length: 10 + Math.random() * 20,
        opacity: 0.1 + Math.random() * 0.2,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      for (const d of drops) {
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + 1, d.y + d.length);
        ctx.strokeStyle = `rgba(180, 200, 220, ${d.opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        d.y += d.speed;
        d.x -= 0.5; // slight wind
        if (d.y > h) { d.y = -d.length; d.x = Math.random() * w; }
        if (d.x < 0) d.x = w;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafRef.current);
  }, [visible, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-[1] pointer-events-none"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 4s ease" }}
      aria-hidden="true"
    />
  );
}

/* ============================================================
   CANVAS STARS SYSTEM (for Constellation Room enhancement)
   ============================================================ */

function CanvasMovingStars({ visible }: { visible: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    if (!visible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();

    interface Star { x: number; y: number; size: number; twinkleSpeed: number; twinklePhase: number; drift: number; }
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    const stars: Star[] = Array.from({ length: 60 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: 0.5 + Math.random() * 1.5,
      twinkleSpeed: 0.02 + Math.random() * 0.04,
      twinklePhase: Math.random() * Math.PI * 2,
      drift: (Math.random() - 0.5) * 0.1,
    }));

    // Shooting stars
    const shootingStars: { x: number; y: number; speed: number; angle: number; life: number; active: boolean }[] = [];
    let frameCount = 0;

    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      frameCount++;

      // Draw stars with twinkle
      for (const s of stars) {
        const brightness = 0.3 + 0.7 * Math.abs(Math.sin(s.twinklePhase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * brightness, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 245, 220, ${brightness * 0.8})`;
        ctx.fill();

        // Subtle glow
        if (s.size > 1) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 245, 220, ${brightness * 0.1})`;
          ctx.fill();
        }

        s.twinklePhase += s.twinkleSpeed;
        s.x += s.drift;
        if (s.x < 0) s.x = w;
        if (s.x > w) s.x = 0;
      }

      // Shooting star
      if (frameCount % 300 === 0 && Math.random() > 0.4) {
        shootingStars.push({
          x: Math.random() * w,
          y: 0,
          speed: 8 + Math.random() * 4,
          angle: Math.PI * 0.3 + Math.random() * 0.2,
          life: 1,
          active: true,
        });
      }

      for (const ss of shootingStars) {
        if (!ss.active) continue;
        ss.x += Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;
        ss.life -= 0.015;

        if (ss.life <= 0) { ss.active = false; continue; }

        const tailLen = 40;
        const tailX = ss.x - Math.cos(ss.angle) * tailLen;
        const tailY = ss.y - Math.sin(ss.angle) * tailLen;

        const gradient = ctx.createLinearGradient(ss.x, ss.y, tailX, tailY);
        gradient.addColorStop(0, `rgba(255, 245, 200, ${ss.life * 0.8})`);
        gradient.addColorStop(1, `rgba(255, 245, 200, 0)`);

        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Water reflection at bottom
      const reflectionH = 60;
      for (let x = 0; x < w; x += 3) {
        const wave = Math.sin(frameCount * 0.02 + x * 0.05) * 3;
        ctx.fillStyle = `rgba(255, 245, 220, ${0.03 + Math.sin(frameCount * 0.01 + x * 0.02) * 0.02})`;
        ctx.fillRect(x, h - reflectionH + wave, 3, reflectionH);
      }

      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafRef.current);
  }, [visible]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-[1] pointer-events-none"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 4s ease" }}
      aria-hidden="true"
    />
  );
}

/* ============================================================
   CANVAS FOG SYSTEM (for Future Wing)
   ============================================================ */

function CanvasFog({ visible, tone = "white" }: { visible: boolean; tone?: "white" | "warm" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    if (!visible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();

    interface FogParticle { x: number; y: number; radius: number; speed: number; opacity: number; angle: number; }
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    const particles: FogParticle[] = Array.from({ length: 30 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      radius: 60 + Math.random() * 120,
      speed: 0.2 + Math.random() * 0.4,
      opacity: 0.02 + Math.random() * 0.04,
      angle: Math.random() * Math.PI * 2,
    }));

    let frame = 0;
    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      frame++;

      for (const p of particles) {
        const drift = Math.sin(frame * 0.005 + p.angle) * 0.3;
        p.x += p.speed + drift;
        p.y += Math.sin(frame * 0.003 + p.angle * 2) * 0.1;

        if (p.x > w + p.radius) p.x = -p.radius;
        if (p.x < -p.radius) p.x = w + p.radius;

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        if (tone === "warm") {
          gradient.addColorStop(0, `rgba(255, 240, 210, ${p.opacity})`);
          gradient.addColorStop(1, `rgba(255, 240, 210, 0)`);
        } else {
          gradient.addColorStop(0, `rgba(255, 255, 255, ${p.opacity})`);
          gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
        }
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafRef.current);
  }, [visible, tone]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-[1] pointer-events-none"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 4s ease" }}
      aria-hidden="true"
    />
  );
}

/* ============================================================
   CANVAS PARTICLES SYSTEM (for cozy / floating effects)
   ============================================================ */

function CanvasFloatingParticles({ visible, color = "warm", count = 25 }: { visible: boolean; color?: "warm" | "gold" | "blue" | "green"; count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);

  const colorMap = {
    warm: "rgba(220, 200, 160, ",
    gold: "rgba(201, 164, 92, ",
    blue: "rgba(180, 200, 230, ",
    green: "rgba(160, 200, 150, ",
  };

  useEffect(() => {
    if (!visible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();

    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: 1 + Math.random() * 3,
      speedY: -(0.2 + Math.random() * 0.5),
      speedX: (Math.random() - 0.5) * 0.3,
      opacity: 0.1 + Math.random() * 0.3,
      wobble: Math.random() * Math.PI * 2,
    }));

    let frame = 0;
    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      frame++;

      for (const p of particles) {
        p.y += p.speedY;
        p.x += Math.sin(frame * 0.01 + p.wobble) * 0.3 + p.speedX;

        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        const alpha = p.opacity * (0.5 + 0.5 * Math.sin(frame * 0.02 + p.wobble));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = colorMap[color] + alpha + ")";
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafRef.current);
  }, [visible, color, count]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-[1] pointer-events-none"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 4s ease" }}
      aria-hidden="true"
    />
  );
}

/* ============================================================
   CANVAS SPOTLIGHT SYSTEM (for Evidence Room)
   ============================================================ */

function CanvasSpotlight({ visible }: { visible: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    if (!visible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();

    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    let angle = 0;

    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      angle += 0.003;

      // Slow sweeping spotlight
      const x = w * 0.5 + Math.cos(angle) * w * 0.3;
      const y = h * 0.4 + Math.sin(angle * 0.7) * h * 0.15;
      const radius = Math.min(w, h) * 0.35;

      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, "rgba(255, 245, 220, 0.06)");
      gradient.addColorStop(0.5, "rgba(255, 245, 220, 0.03)");
      gradient.addColorStop(1, "rgba(255, 245, 220, 0)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      // Darker corners (vignette)
      const vignette = ctx.createRadialGradient(w / 2, h / 2, w * 0.2, w / 2, h / 2, w * 0.7);
      vignette.addColorStop(0, "rgba(0,0,0,0)");
      vignette.addColorStop(1, "rgba(0,0,0,0.15)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, w, h);

      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafRef.current);
  }, [visible]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-[1] pointer-events-none"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 4s ease" }}
      aria-hidden="true"
    />
  );
}

/* ============================================================
   CANVAS BIRDS SYSTEM (for Final Hall)
   ============================================================ */

function CanvasBirds({ visible }: { visible: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    if (!visible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();

    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;

    interface Bird { x: number; y: number; speed: number; wingPhase: number; size: number; }
    const birds: Bird[] = Array.from({ length: 5 }, (_, i) => ({
      x: -20 - i * 40,
      y: h * 0.15 + i * 20,
      speed: 1.5 + Math.random() * 0.5,
      wingPhase: Math.random() * Math.PI * 2,
      size: 4 + Math.random() * 3,
    }));

    let frame = 0;
    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      frame++;

      for (const b of birds) {
        b.x += b.speed;
        b.y += Math.sin(frame * 0.02 + b.wingPhase) * 0.3;
        b.wingPhase += 0.15;

        if (b.x > w + 30) { b.x = -30; b.y = h * 0.1 + Math.random() * h * 0.2; }

        const wingY = Math.sin(b.wingPhase) * b.size * 0.8;

        ctx.beginPath();
        ctx.moveTo(b.x - b.size, b.y + wingY);
        ctx.quadraticCurveTo(b.x, b.y - b.size * 0.5, b.x + b.size, b.y + wingY);
        ctx.strokeStyle = "rgba(60, 50, 30, 0.3)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafRef.current);
  }, [visible]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-[1] pointer-events-none"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 5s ease" }}
      aria-hidden="true"
    />
  );
}

/* ============================================================
   CSS-ONLY ATMOSPHERE ELEMENTS
   ============================================================ */

function CoffeeSteam({ visible }: { visible: boolean }) {
  return (
    <div className="absolute top-[25%] right-[12%] z-[2] pointer-events-none" style={{ opacity: visible ? 1 : 0, transition: "opacity 3s ease" }} aria-hidden="true">
      <div className="relative">
        {/* Cup silhouette */}
        <div className="w-5 h-3 bg-[oklch(0.4_0.04_60)] rounded-b-md mx-auto" />
        {/* Steam wisps */}
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute -top-4 left-1/2 -translate-x-1/2 w-[3px] h-6 rounded-full"
            style={{
              background: "linear-gradient(180deg, transparent, rgba(200, 190, 170, 0.15), transparent)",
              animation: `steam ${3 + i * 0.5}s ease-in-out infinite ${i * 0.8}s`,
              transformOrigin: "bottom center",
            }}
          />
        ))}
      </div>
      <style>{`@keyframes steam { 0% { transform: translateX(-50%) translateY(0) scaleX(1); opacity: 0.3; } 50% { transform: translateX(-50%) translateY(-8px) scaleX(1.5); opacity: 0.15; } 100% { transform: translateX(-50%) translateY(-16px) scaleX(2); opacity: 0; } }`}</style>
    </div>
  );
}

function PaperFloating({ visible, count = 4 }: { visible: boolean; count?: number }) {
  const papers = Array.from({ length: count }, (_, i) => ({
    left: 10 + i * 22,
    delay: i * 2,
    duration: 8 + i * 1.5,
    rotation: (i % 2 === 0 ? 1 : -1) * (5 + i * 3),
  }));

  return (
    <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden" style={{ opacity: visible ? 1 : 0, transition: "opacity 3s ease" }} aria-hidden="true">
      {papers.map((p, i) => (
        <div
          key={i}
          className="absolute top-[10%] w-4 h-5 bg-[oklch(0.92 0.04 85 / 20%)] border border-[oklch(0.85 0.06 80 / 15%)] rounded-sm"
          style={{
            left: `${p.left}%`,
            animation: `paperFloat ${p.duration}s ease-in-out infinite ${p.delay}s`,
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
      <style>{`@keyframes paperFloat { 0% { transform: translateY(0) rotate(${0}deg); opacity: 0.15; } 25% { transform: translateY(30px) rotate(${15}deg); opacity: 0.2; } 50% { transform: translateY(15px) rotate(${-5}deg); opacity: 0.1; } 75% { transform: translateY(40px) rotate(${10}deg); opacity: 0.15; } 100% { transform: translateY(0) rotate(${0}deg); opacity: 0.15; } }`}</style>
    </div>
  );
}

function DetectivesStrings({ visible }: { visible: boolean }) {
  return (
    <div className="absolute inset-0 z-[2] pointer-events-none" style={{ opacity: visible ? 1 : 0, transition: "opacity 4s ease" }} aria-hidden="true">
      {/* Animated red string connections */}
      <svg className="absolute inset-0 w-full h-full">
        <line x1="15%" y1="20%" x2="45%" y2="35%" stroke="rgba(180, 60, 40, 0.15)" strokeWidth="1" strokeDasharray="4 8">
          <animate attributeName="stroke-dashoffset" values="0;-24" dur="3s" repeatCount="indefinite" />
        </line>
        <line x1="45%" y1="35%" x2="70%" y2="25%" stroke="rgba(180, 60, 40, 0.15)" strokeWidth="1" strokeDasharray="4 8">
          <animate attributeName="stroke-dashoffset" values="0;-24" dur="3s" repeatCount="indefinite" />
        </line>
        <line x1="70%" y1="25%" x2="85%" y2="50%" stroke="rgba(180, 60, 40, 0.12)" strokeWidth="1" strokeDasharray="4 8">
          <animate attributeName="stroke-dashoffset" values="0;-24" dur="3.5s" repeatCount="indefinite" />
        </line>
        <line x1="25%" y1="60%" x2="55%" y2="45%" stroke="rgba(180, 60, 40, 0.1)" strokeWidth="1" strokeDasharray="4 8">
          <animate attributeName="stroke-dashoffset" values="0;-24" dur="4s" repeatCount="indefinite" />
        </line>
        <line x1="55%" y1="45%" x2="80%" y2="65%" stroke="rgba(180, 60, 40, 0.12)" strokeWidth="1" strokeDasharray="4 8">
          <animate attributeName="stroke-dashoffset" values="0;-24" dur="3.2s" repeatCount="indefinite" />
        </line>
        {/* Pins at intersections */}
        {[[15, 20], [45, 35], [70, 25], [85, 50], [25, 60], [55, 45], [80, 65]].map(([cx, cy], i) => (
          <circle key={i} cx={`${cx}%`} cy={`${cy}%`} r="3" fill="rgba(180, 60, 40, 0.3)">
            <animate attributeName="r" values="2;4;2" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </svg>
    </div>
  );
}

function TeaSteam({ visible }: { visible: boolean }) {
  return (
    <div className="absolute top-[20%] left-[15%] z-[2] pointer-events-none" style={{ opacity: visible ? 1 : 0, transition: "opacity 3s ease" }} aria-hidden="true">
      <div className="relative">
        <div className="w-6 h-4 bg-[oklch(0.5 0.05 60)] rounded-b-lg mx-auto shadow-sm" />
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-[oklch(0.4 0.04 30)] rounded-full" />
        {[0, 1].map((i) => (
          <div
            key={i}
            className="absolute -top-5 left-1/2 w-[2px] h-8 rounded-full"
            style={{
              background: "linear-gradient(180deg, transparent, rgba(180, 200, 180, 0.2), transparent)",
              animation: `teaRise ${4 + i}s ease-in-out infinite ${i * 1.5}s`,
              transformOrigin: "bottom center",
            }}
          />
        ))}
      </div>
      <style>{`@keyframes teaRise { 0% { transform: translateX(-50%) scaleY(0.8); opacity: 0.2; } 50% { transform: translateX(-50%) scaleY(1.2) translateX(2px); opacity: 0.1; } 100% { transform: translateX(-50%) scaleY(0.9) translateX(-1px); opacity: 0; } }`}</style>
    </div>
  );
}

function LampGlow({ visible, side = "left" }: { visible: boolean; side?: "left" | "right" }) {
  return (
    <div
      className={`absolute top-[15%] ${side === "left" ? "left-[5%]" : "right-[5%]"} z-[2] pointer-events-none`}
      style={{ opacity: visible ? 1 : 0, transition: "opacity 3s ease" }}
      aria-hidden="true"
    >
      <div
        className="w-24 h-24 rounded-full"
        style={{
          background: "radial-gradient(circle, oklch(0.85 0.1 85 / 12%), oklch(0.85 0.1 85 / 5%), transparent 60%)",
          animation: "lampBreath 6s ease-in-out infinite",
        }}
      />
      <style>{`@keyframes lampBreath { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.7; transform: scale(1.05); } }`}</style>
    </div>
  );
}

function VinylCrackle({ visible }: { visible: boolean }) {
  return (
    <div className="absolute inset-0 z-[2] pointer-events-none" style={{ opacity: visible ? 1 : 0, transition: "opacity 3s ease" }} aria-hidden="true">
      {/* Static noise overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255,255,255,0.008) 2px,
            rgba(255,255,255,0.008) 3px
          )`,
          animation: "vinylShift 0.1s linear infinite",
        }}
      />
      <style>{`@keyframes vinylShift { from { transform: translateY(0); } to { transform: translateY(3px); } }`}</style>
    </div>
  );
}

function SlowWind({ visible }: { visible: boolean }) {
  return (
    <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden" style={{ opacity: visible ? 1 : 0, transition: "opacity 4s ease" }} aria-hidden="true">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute h-[1px]"
          style={{
            top: `${15 + i * 15}%`,
            left: "-10%",
            width: "40%",
            background: `linear-gradient(90deg, transparent, rgba(255,255,255,${0.03 + i * 0.01}), transparent)`,
            animation: `windBlow ${6 + i * 2}s linear infinite ${i * 1.5}s`,
          }}
        />
      ))}
      <style>{`@keyframes windBlow { 0% { transform: translateX(0); } 100% { transform: translateX(250%); } }`}</style>
    </div>
  );
}

function SunriseGlow({ visible }: { visible: boolean }) {
  return (
    <div
      className="absolute inset-0 z-[2] pointer-events-none"
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 6s ease",
        background: "linear-gradient(180deg, transparent 30%, oklch(0.85 0.1 80 / 8%) 60%, oklch(0.9 0.12 85 / 12%) 100%)",
        animation: "sunrisePulse 12s ease-in-out infinite",
      }}
      aria-hidden="true"
    >
      <style>{`@keyframes sunrisePulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }`}</style>
    </div>
  );
}

function GardenBreeze({ visible }: { visible: boolean }) {
  return (
    <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden" style={{ opacity: visible ? 1 : 0, transition: "opacity 5s ease" }} aria-hidden="true">
      {/* Floating leaves */}
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${10 + i * 20}%`,
            top: `${-5}%`,
            background: `oklch(${0.55 + i * 0.05} 0.12 140 / 30%)`,
            animation: `leafDrift ${8 + i * 2}s ease-in-out infinite ${i * 1.2}s`,
          }}
        />
      ))}
      <style>{`@keyframes leafDrift { 0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; } 10% { opacity: 0.3; } 90% { opacity: 0.3; } 100% { transform: translateY(120vh) translateX(40px) rotate(720deg); opacity: 0; } }`}</style>
    </div>
  );
}

/* ============================================================
   ATMOSPHERE PROFILE TYPES
   ============================================================ */

export interface AtmosphereProfile {
  rain?: { intensity?: number };
  movingStars?: boolean;
  fog?: { tone: "white" | "warm" };
  floatingParticles?: { color: "warm" | "gold" | "blue" | "green"; count?: number };
  spotlight?: boolean;
  coffeeSteam?: boolean;
  paperFloating?: { count?: number };
  detectivesStrings?: boolean;
  teaSteam?: boolean;
  lampGlow?: { side: "left" | "right" };
  vinylCrackle?: boolean;
  slowWind?: boolean;
  sunriseGlow?: boolean;
  gardenBreeze?: boolean;
  birds?: boolean;
}

/* ============================================================
   MAIN ROOM ATMOSPHERE COMPONENT
   ============================================================ */

export default function RoomAtmosphere({ profile, visible }: { profile: AtmosphereProfile; visible: boolean }) {
  if (!profile || !visible) return null;

  return (
    <>
      {profile.rain && <CanvasRain visible={visible} intensity={profile.rain.intensity ?? 0.5} />}
      {profile.movingStars && <CanvasMovingStars visible={visible} />}
      {profile.fog && <CanvasFog visible={visible} tone={profile.fog.tone} />}
      {profile.floatingParticles && <CanvasFloatingParticles visible={visible} color={profile.floatingParticles.color} count={profile.floatingParticles.count} />}
      {profile.spotlight && <CanvasSpotlight visible={visible} />}
      {profile.coffeeSteam && <CoffeeSteam visible={visible} />}
      {profile.paperFloating && <PaperFloating visible={visible} count={profile.paperFloating.count} />}
      {profile.detectivesStrings && <DetectivesStrings visible={visible} />}
      {profile.teaSteam && <TeaSteam visible={visible} />}
      {profile.lampGlow && <LampGlow visible={visible} side={profile.lampGlow.side} />}
      {profile.vinylCrackle && <VinylCrackle visible={visible} />}
      {profile.slowWind && <SlowWind visible={visible} />}
      {profile.sunriseGlow && <SunriseGlow visible={visible} />}
      {profile.gardenBreeze && <GardenBreeze visible={visible} />}
      {profile.birds && <CanvasBirds visible={visible} />}
    </>
  );
}

/* ============================================================
   PREDEFINED ATMOSPHERE PROFILES PER GALLERY
   ============================================================ */

export const GALLERY_ATMOSPHERES: Record<string, AtmosphereProfile> = {
  // GALLERY 4 — The Library of Us
  "gallery-4": {
    rain: { intensity: 0.3 },
    coffeeSteam: true,
    paperFloating: { count: 5 },
    lampGlow: { side: "left" },
    floatingParticles: { color: "warm", count: 20 },
  },

  // GALLERY 3 — The Evidence Room
  "gallery-3": {
    spotlight: true,
    detectivesStrings: true,
    floatingParticles: { color: "gold", count: 15 },
  },

  // GALLERY 7 — The Little Things Room
  "gallery-7": {
    teaSteam: true,
    floatingParticles: { color: "green", count: 15 },
    lampGlow: { side: "right" },
    paperFloating: { count: 3 },
  },

  // GALLERY 5 — The Sound Room
  "gallery-5": {
    vinylCrackle: true,
    floatingParticles: { color: "gold", count: 25 },
    slowWind: true,
  },

  // GALLERY 10 — The Constellation Room
  "gallery-10": {
    movingStars: true,
    slowWind: true,
    floatingParticles: { color: "blue", count: 10 },
  },

  // GALLERY 11 — Letters Never Sent
  "gallery-11": {
    rain: { intensity: 0.7 },
    lampGlow: { side: "left" },
    paperFloating: { count: 6 },
    floatingParticles: { color: "warm", count: 12 },
  },

  // GALLERY 12 — The Future Wing
  "gallery-12": {
    fog: { tone: "white" },
    floatingParticles: { color: "warm", count: 20 },
    slowWind: true,
  },

  // GALLERY 13 / Final — The Final Hall
  "gallery-13": {
    sunriseGlow: true,
    birds: true,
    gardenBreeze: true,
    floatingParticles: { color: "gold", count: 18 },
  },

  "final-room": {
    sunriseGlow: true,
    birds: true,
    gardenBreeze: true,
    floatingParticles: { color: "warm", count: 22 },
  },
};
