/**
 * Museum Data Loader — reads content from museum.json or localStorage cache.
 * In Curator Mode, edits are saved to localStorage and override the default JSON.
 * Public museum reads from the same source, so both see identical content.
 */

import defaultMuseumData from "./museum.json";

const STORAGE_KEY = "moc-museum-data";

// Deep merge helper
function deepMerge<T>(target: T, source: Partial<T>): T {
  if (typeof target !== "object" || target === null) return source as T;
  const result: any = Array.isArray(target) ? [...target] : { ...target };
  for (const key of Object.keys(source)) {
    const sVal = (source as any)[key];
    const tVal = (target as any)[key];
    if (sVal !== undefined) {
      if (typeof sVal === "object" && sVal !== null && !Array.isArray(sVal) && typeof tVal === "object" && tVal !== null) {
        result[key] = deepMerge(tVal, sVal);
      } else {
        result[key] = sVal;
      }
    }
  }
  return result;
}

// Export types for the JSON structure
export interface TimelineEntry {
  year: string;
  title: string;
  text: string;
  keywords: string[];
  image: string | null;
}
export interface MemoryCardSmall {
  no: string;
  text: string;
  keywords: string[];
}
export interface WallItem {
  id: string;
  title: string;
  subtitle: string;
  lines: string[];
  closing?: string;
  keywords: string[];
}
export interface Observation {
  id: string;
  frame: string;
  text: string;
  keywords: string[];
}
export interface Evidence {
  id: string;
  section: string;
  type: "photo" | "note" | "chat" | "meme" | "audio";
  title: string;
  caption: string;
  context: string;
  keywords: string[];
  pin: { top: string; left: string; rotate: number };
  image: string | null;
}
export interface Book {
  id: string;
  title: string;
  by: string;
  color: string;
  note: string;
  quote: string;
  keywords: string[];
  coverImage: string | null;
}
export interface Cassette {
  id: string;
  label: string;
  why: string;
  keywords: string[];
  audioFile: string | null;
}
export interface Song {
  id: string;
  title: string;
  vibe: string;
  why: string;
  keywords: string[];
  spotifyLink: string | null;
}
export interface Cabinet {
  id: string;
  emoji: string;
  label: string;
  contents: string;
  explanation: string;
  extra?: string;
  locked?: boolean;
  keywords: string[];
}
export interface Polaroid {
  id: string;
  caption: string;
  back: string;
  hue: number;
  keywords: string[];
  image: string | null;
}
export interface MapPin {
  id: string;
  place: string;
  x: number;
  y: number;
  memory: string;
  date: string;
  future?: boolean;
  keywords: string[];
  image: string | null;
}
export interface Star {
  id: string;
  x: number;
  y: number;
  size: number;
  memory: string;
  keywords: string[];
}
export interface Letter {
  id: string;
  title: string;
  body: string[];
  keywords: string[];
}
export interface FutureLabel {
  title: string;
  status: string;
}

export interface MuseumData {
  metadata: { version: string; lastModified: string; curatorName: string; visitorName: string };
  gallery1: { timeline: TimelineEntry[]; memoryCards: MemoryCardSmall[]; portraitImage: string | null; drawerNote: string };
  gallery2: {
    walls: WallItem[];
    mirrorLines: string[];
    observations: Observation[];
    secretObservation: { title: string; text: string };
  };
  gallery3: {
    evidence: Evidence[];
    laughCounter: { label: string; value: string }[];
    glassCaseText: string;
    glassCaseDescription: string;
  };
  gallery4: {
    books: Book[];
    quoteWall: { quote: string; why: string }[];
    hiddenNote: string;
    reservedChairText: string;
    hiddenCompartmentNote: string;
  };
  gallery5: {
    cassettes: Cassette[];
    songs: Song[];
    silenceBoothLabel: string;
    laughExhibitLabel: string;
  };
  gallery6: {
    thankYouNotes: string[];
    envelopeText: string[];
  };
  gallery7: {
    cabinets: Cabinet[];
    drawerNotes: string[];
  };
  gallery8: {
    polaroids: Polaroid[];
    compliments: string[];
  };
  gallery9: { mapPins: MapPin[] };
  gallery10: { stars: Star[]; brightestStarText: string };
  gallery11: { letters: Letter[]; hiddenLetterText: string; password: string };
  gallery12: { futureLabels: FutureLabel[]; futureFrameLabel: string };
  finale: {
    corridorFrames: string[];
    epilogueLines: string[];
    postCreditsLetter: string[];
    creditsCards: { role: string; name: string }[];
  };
  guide: { birdFacts: string[] };
  museum: {
    rules: string[];
    dearChickoLetter: string[];
    welcomeTitle: string;
    welcomeSubtitle: string;
    welcomeTagline: string;
  };
  guestbook: {
    title: string;
    subtitle: string;
    placeholder: string;
    signatures: { name: string; message: string; date: string }[];
  };
}

// Load cached data or fall back to default JSON
function loadFromStorage(): MuseumData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as MuseumData;
  } catch {
    /* ignore parse errors */
  }
  return null;
}

// Save data to localStorage (Curator Mode only)
function saveToStorage(data: MuseumData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    console.warn("Failed to save museum data to localStorage");
  }
}

// Get the current active museum data (cached > default)
export function getMuseumData(): MuseumData {
  const cached = loadFromStorage();
  if (cached) return cached;
  return defaultMuseumData as MuseumData;
}

// Save curated data (used by Curator Mode)
export function saveMuseumData(data: MuseumData): void {
  saveToStorage(data);
}

// Reset to default JSON data
export function resetMuseumData(): void {
  localStorage.removeItem(STORAGE_KEY);
}

// Export museum data as JSON string for backup
export function exportMuseumData(): string {
  const data = getMuseumData();
  data.metadata.lastModified = new Date().toISOString();
  return JSON.stringify(data, null, 2);
}

// Import museum data from JSON string
export function importMuseumData(jsonString: string): MuseumData | null {
  try {
    const data = JSON.parse(jsonString) as MuseumData;
    if (data && data.metadata && data.gallery1) {
      saveToStorage(data);
      return data;
    }
    return null;
  } catch {
    return null;
  }
}

// Convenience getters for each gallery section
export const getGallery1 = () => getMuseumData().gallery1;
export const getGallery2 = () => getMuseumData().gallery2;
export const getGallery3 = () => getMuseumData().gallery3;
export const getGallery4 = () => getMuseumData().gallery4;
export const getGallery5 = () => getMuseumData().gallery5;
export const getGallery6 = () => getMuseumData().gallery6;
export const getGallery7 = () => getMuseumData().gallery7;
export const getGallery8 = () => getMuseumData().gallery8;
export const getGallery9 = () => getMuseumData().gallery9;
export const getGallery10 = () => getMuseumData().gallery10;
export const getGallery11 = () => getMuseumData().gallery11;
export const getGallery12 = () => getMuseumData().gallery12;
export const getFinale = () => getMuseumData().finale;
export const getGuide = () => getMuseumData().guide;
export const getMuseumMeta = () => getMuseumData().museum;
export const getGuestbook = () => getMuseumData().guestbook;

// Re-export types for compatibility with existing gallery components
export { defaultMuseumData };
export type { MuseumData as MuseumDataSchema };

// Search item type (compatible with original museumData.ts)
export interface SearchItem {
  id: string;
  gallery: string;
  galleryAnchor: string;
  title: string;
  snippet: string;
  keywords: string[];
}

// Build search index from current data
export function buildSearchIndex(): SearchItem[] {
  const data = getMuseumData();
  const items: any[] = [];
  data.gallery1.timeline.forEach((t) => items.push({ id: `tl-${t.year}`, gallery: "Gallery 1 · The Girl I Met", galleryAnchor: "gallery-1", title: `${t.year} — ${t.title}`, snippet: t.text, keywords: t.keywords }));
  data.gallery1.memoryCards.forEach((m) => items.push({ id: m.no, gallery: "Gallery 1 · The Girl I Met", galleryAnchor: "gallery-1", title: m.no, snippet: m.text, keywords: m.keywords }));
  data.gallery2.walls.forEach((w) => items.push({ id: w.id, gallery: "Gallery 2 · The Person You Became", galleryAnchor: "gallery-2", title: w.title, snippet: w.lines.join(" "), keywords: w.keywords }));
  data.gallery2.observations.forEach((o) => items.push({ id: o.id, gallery: "Gallery 3 · The Things You Never Notice", galleryAnchor: "gallery-3", title: o.frame, snippet: o.text, keywords: o.keywords }));
  data.gallery3.evidence.forEach((e) => items.push({ id: e.id, gallery: "Gallery 4 · The Evidence Room", galleryAnchor: "gallery-4", title: e.title, snippet: e.context, keywords: e.keywords }));
  data.gallery4.books.forEach((b) => items.push({ id: b.id, gallery: "Gallery 5 · The Library of Us", galleryAnchor: "gallery-5", title: b.title, snippet: b.note, keywords: b.keywords }));
  data.gallery5.cassettes.forEach((c) => items.push({ id: c.id, gallery: "Gallery 6 · The Sound Room", galleryAnchor: "gallery-6", title: `Cassette: ${c.label}`, snippet: c.why, keywords: c.keywords }));
  data.gallery5.songs.forEach((s) => items.push({ id: s.id, gallery: "Gallery 6 · The Sound Room", galleryAnchor: "gallery-6", title: s.title, snippet: s.why, keywords: s.keywords }));
  data.gallery7.cabinets.forEach((c) => items.push({ id: c.id, gallery: "Gallery 7 · The Little Things Room", galleryAnchor: "gallery-7", title: c.label, snippet: c.explanation, keywords: c.keywords }));
  data.gallery9.mapPins.forEach((m) => items.push({ id: m.id, gallery: "Gallery 9 · The Map of Memories", galleryAnchor: "gallery-9", title: m.place, snippet: m.memory, keywords: m.keywords }));
  data.gallery10.stars.forEach((s) => items.push({ id: s.id, gallery: "Gallery 10 · The Constellation Room", galleryAnchor: "gallery-10", title: "A star-memory", snippet: s.memory, keywords: s.keywords }));
  data.gallery11.letters.forEach((l) => items.push({ id: l.id, gallery: "Gallery 11 · Letters Never Sent", galleryAnchor: "gallery-11", title: l.title, snippet: l.body[0], keywords: l.keywords }));
  return items;
}

// Build all memories pool
export interface MemoryCard {
  title: string;
  text: string;
  gallery: string;
  anchor: string;
}
export function allMemories(): MemoryCard[] {
  const data = getMuseumData();
  const pool: MemoryCard[] = [];
  data.gallery1.timeline.forEach((t) => pool.push({ title: `${t.year} — ${t.title}`, text: t.text, gallery: "The Girl I Met", anchor: "gallery-1" }));
  data.gallery1.memoryCards.forEach((m) => pool.push({ title: m.no, text: m.text, gallery: "The Girl I Met", anchor: "gallery-1" }));
  data.gallery2.observations.forEach((o) => pool.push({ title: o.frame, text: o.text, gallery: "The Things You Never Notice", anchor: "gallery-3" }));
  data.gallery3.evidence.forEach((e) => pool.push({ title: e.title, text: e.context, gallery: "The Evidence Room", anchor: "gallery-4" }));
  data.gallery4.books.forEach((b) => pool.push({ title: b.title, text: b.note, gallery: "The Library of Us", anchor: "gallery-5" }));
  data.gallery10.stars.forEach((s) => pool.push({ title: "A star-memory", text: s.memory, gallery: "The Constellation Room", anchor: "gallery-10" }));
  return pool;
}
