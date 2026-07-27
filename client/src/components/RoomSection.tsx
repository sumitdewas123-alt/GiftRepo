/*
 * Gilded Archive — a museum "room": full-width section with plaque, fading title,
 * alternating wall tones, and intersection-observer based reveal + visit tracking.
 */
import React, { useEffect, useRef, useState } from "react";
import { useMuseum } from "@/contexts/MuseumContext";

interface RoomProps {
  id: string;
  plaque: string;
  title: string;
  subtitle?: string;
  tone?: "cream" | "parchment" | "walnut" | "night";
  children: React.ReactNode;
  bgImage?: string;
  className?: string;
}

export default function RoomSection({ id, plaque, title, subtitle, tone = "cream", children, bgImage, className = "" }: RoomProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const { markVisited } = useMuseum();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            markVisited(id);
          }
        });
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [id, markVisited]);

  const toneClass =
    tone === "walnut"
      ? "bg-[oklch(0.32_0.035_60)] text-[oklch(0.9_0.03_85)] dark:bg-[oklch(0.2_0.02_60)]"
      : tone === "night"
      ? "bg-[oklch(0.2_0.03_265)] text-[oklch(0.9_0.03_85)]"
      : tone === "parchment"
      ? "bg-card text-card-foreground"
      : "bg-background text-foreground";

  return (
    <section
      ref={ref}
      id={id}
      aria-label={title}
      className={`paper-texture relative overflow-hidden py-24 md:py-32 transition-colors duration-1000 ${toneClass} ${className}`}
      style={
        bgImage
          ? { backgroundImage: `linear-gradient(oklch(0.22 0.02 60 / 78%), oklch(0.22 0.02 60 / 88%)), url(${bgImage})`, backgroundSize: "cover", backgroundPosition: "center" }
          : undefined
      }
    >
      <div className="container relative z-10">
        <header
          className="mb-14 md:mb-20"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(28px)",
            transition: "opacity 1.2s cubic-bezier(0.23,1,0.32,1), transform 1.2s cubic-bezier(0.23,1,0.32,1)",
          }}
        >
          <span className="plaque">{plaque}</span>
          <h2 className={`room-title pinspot mt-6 text-4xl md:text-6xl ${bgImage || tone === "walnut" || tone === "night" ? "text-[oklch(0.92_0.04_85)]" : ""}`}>
            {title}
          </h2>
          {subtitle && (
            <p className={`mt-4 max-w-xl text-lg italic ${bgImage || tone === "walnut" || tone === "night" ? "text-[oklch(0.78_0.04_82)]" : "text-muted-foreground"}`}>
              {subtitle}
            </p>
          )}
        </header>
        <div
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 1.4s ease 0.3s",
          }}
        >
          {children}
        </div>
      </div>
    </section>
  );
}

