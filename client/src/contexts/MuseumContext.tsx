/*
 * Gilded Archive — museum global state.
 * Handles: day/night, rain, leaves, dust, sound, achievements, visited rooms,
 * hidden room unlocking, guide dialogue mode, and soundtrack switching.
 */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export type AchievementId =
  | "timetraveller" | "curious" | "listener" | "bookworm" | "rainlistener"
  | "stargazer" | "finished" | "friendofarchivist" | "curator";

/* Per spec: never call them achievements — they are "Curator's Discoveries", brass museum cards. */
export const ACHIEVEMENTS: Record<AchievementId, { title: string; desc: string; icon: string }> = {
  timetraveller: { title: "Time Traveller", desc: "Visited every gallery.", icon: "🕰" },
  curious: { title: "Curious Mind", desc: "Found what was hidden.", icon: "🗝" },
  listener: { title: "Good Listener", desc: "Played every audio recording.", icon: "🎧" },
  bookworm: { title: "Bookworm", desc: "Read every letter never sent.", icon: "📚" },
  rainlistener: { title: "Rain Listener", desc: "Experienced the museum during rain.", icon: "🌧" },
  stargazer: { title: "Stargazer", desc: "Completed the Constellation Room.", icon: "⭐" },
  finished: { title: "Finished Chapter", desc: "Reached the end of the museum.", icon: "📖" },
  friendofarchivist: { title: "Friend of the Archivist", desc: "Befriended the museum guide.", icon: "🪶" },
  curator: { title: "Curator", desc: "Saw everything there was to see.", icon: "🏛" },
};

export const ROOM_IDS = [
  "intro-hall", "gallery-1", "gallery-2", "gallery-3", "gallery-4", "gallery-5",
  "gallery-6", "gallery-7", "gallery-8", "gallery-9", "gallery-10", "gallery-11",
  "gallery-13", "final-room",
];

interface MuseumState {
  night: boolean;
  toggleNight: () => void;
  rain: boolean;
  toggleRain: () => void;
  leaves: boolean;
  toggleLeaves: () => void;
  soundOn: boolean;
  toggleSound: () => void;
  altTrack: boolean;
  toggleTrack: () => void;
  volume: number;
  setVolume: (v: number) => void;
  visited: Set<string>;
  markVisited: (room: string) => void;
  achievements: Set<AchievementId>;
  award: (id: AchievementId) => void;
  hiddenUnlocked: boolean;
  unlockHidden: (via: string) => void;
  songsHeard: Set<string>;
  markSongHeard: (id: string) => void;
  lettersRead: Set<string>;
  markLetterRead: (id: string) => void;
  toughGuyMode: boolean;
  setToughGuyMode: (b: boolean) => void;
  flowersBlooming: boolean;
  bloomFlowers: () => void;
  booksGlow: boolean;
  glowBooks: () => void;
  lightsFlicker: boolean;
  flickerLights: () => void;
  returningVisitor: boolean;
  entered: boolean;
  setEntered: (b: boolean) => void;
}

const Ctx = createContext<MuseumState | null>(null);

function loadSet(key: string): Set<string> {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return new Set(JSON.parse(raw));
  } catch { /* ignore */ }
  return new Set();
}
function saveSet(key: string, s: Set<string>) {
  try { localStorage.setItem(key, JSON.stringify(Array.from(s))); } catch { /* ignore */ }
}

export function MuseumProvider({ children }: { children: React.ReactNode }) {
  const [night, setNight] = useState(false);
  const [rain, setRain] = useState(false);
  const [leaves, setLeaves] = useState(true);
  const [soundOn, setSoundOn] = useState(false);
  const [altTrack, setAltTrack] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [visited, setVisited] = useState<Set<string>>(() => loadSet("moc-visited"));
  const [achievements, setAchievements] = useState<Set<AchievementId>>(() => loadSet("moc-achievements") as Set<AchievementId>);
  const [hiddenUnlocked, setHiddenUnlocked] = useState(() => localStorage.getItem("moc-hidden") === "1");
  const [songsHeard, setSongsHeard] = useState<Set<string>>(() => loadSet("moc-songs"));
  const [lettersRead, setLettersRead] = useState<Set<string>>(() => loadSet("moc-letters"));
  const [toughGuyMode, setToughGuyMode] = useState(false);
  const [flowersBlooming, setFlowersBlooming] = useState(false);
  const [booksGlow, setBooksGlow] = useState(false);
  const [lightsFlicker, setLightsFlicker] = useState(false);
  const [returningVisitor] = useState<boolean>(() => {
    try {
      const today = new Date().toDateString();
      const first = localStorage.getItem("moc-first-visit");
      if (!first) { localStorage.setItem("moc-first-visit", today); return false; }
      return first !== today;
    } catch { return false; }
  });
  const [entered, setEnteredState] = useState(() => {
    try { return sessionStorage.getItem("moc-entered") === "1"; } catch { return false; }
  });
  const setEntered = useCallback((b: boolean) => {
    setEnteredState(b);
    try { sessionStorage.setItem("moc-entered", b ? "1" : "0"); } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", night);
  }, [night]);

  const award = useCallback((id: AchievementId) => {
    setAchievements((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      saveSet("moc-achievements", next);
      const a = ACHIEVEMENTS[id];
      setTimeout(() => toast(`${a.icon} Curator's Discovery: ${a.title}`, { description: a.desc, duration: 5000 }), 400);
      return next;
    });
  }, []);

  const markVisited = useCallback((room: string) => {
    setVisited((prev) => {
      if (prev.has(room)) return prev;
      const next = new Set(prev);
      next.add(room);
      saveSet("moc-visited", next);
      return next;
    });
  }, []);

  // Time Traveller: all rooms visited (hidden room not required — it has its own card)
  useEffect(() => {
    if (ROOM_IDS.every((r) => visited.has(r))) award("timetraveller");
  }, [visited, award]);

  // Curator: everything discovered
  useEffect(() => {
    const others: AchievementId[] = ["timetraveller", "curious", "listener", "bookworm", "rainlistener", "stargazer", "finished"];
    if (others.every((a) => achievements.has(a))) award("curator");
  }, [achievements, award]);

  // Rain Listener
  useEffect(() => {
    if (rain) award("rainlistener");
  }, [rain, award]);

  const unlockHidden = useCallback((via: string) => {
    setHiddenUnlocked((prev) => {
      if (!prev) {
        localStorage.setItem("moc-hidden", "1");
        toast("🗝️ A key turns somewhere in the museum...", { description: `The Hidden Room is now open. (${via})`, duration: 6000 });
      }
      return true;
    });
    award("curious");
  }, [award]);

  const markSongHeard = useCallback((id: string) => {
    setSongsHeard((prev) => {
      const next = new Set(prev);
      next.add(id);
      saveSet("moc-songs", next);
      return next;
    });
  }, []);

  const markLetterRead = useCallback((id: string) => {
    setLettersRead((prev) => {
      const next = new Set(prev);
      next.add(id);
      saveSet("moc-letters", next);
      return next;
    });
  }, []);

  const bloomFlowers = useCallback(() => {
    setFlowersBlooming(true);
    setTimeout(() => setFlowersBlooming(false), 9000);
  }, []);

  const glowBooks = useCallback(() => {
    setBooksGlow(true);
    setTimeout(() => setBooksGlow(false), 5000);
  }, []);

  const flickerLights = useCallback(() => {
    setLightsFlicker(true);
    setTimeout(() => setLightsFlicker(false), 2500);
  }, []);

  const value = useMemo<MuseumState>(() => ({
    night, toggleNight: () => setNight((v) => !v),
    rain, toggleRain: () => setRain((v) => !v),
    leaves, toggleLeaves: () => setLeaves((v) => !v),
    soundOn, toggleSound: () => setSoundOn((v) => !v),
    altTrack, toggleTrack: () => setAltTrack((v) => !v),
    volume, setVolume,
    visited, markVisited,
    achievements, award,
    hiddenUnlocked, unlockHidden,
    songsHeard, markSongHeard,
    lettersRead, markLetterRead,
    toughGuyMode, setToughGuyMode,
    flowersBlooming, bloomFlowers,
    booksGlow, glowBooks,
    lightsFlicker, flickerLights,
    returningVisitor,
    entered, setEntered,
  }), [night, rain, leaves, soundOn, altTrack, volume, visited, achievements, hiddenUnlocked, songsHeard, lettersRead, toughGuyMode, flowersBlooming, booksGlow, lightsFlicker, returningVisitor, entered, award, markVisited, unlockHidden, markSongHeard, markLetterRead, bloomFlowers, glowBooks, flickerLights]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useMuseum() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useMuseum must be used within MuseumProvider");
  return ctx;
}
