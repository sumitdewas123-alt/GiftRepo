/*
 * THE MUSEUM OF CHICKO — content data layer (compatibility facade).
 *
 * ⚠️ No content lives in this file anymore.
 * All editable content has moved to `museum.json` (loaded via `museumDataLoader.ts`).
 * Edit content through the hidden Curator Mode (Ctrl+Shift+C, /curator, or ?curator=true)
 * or by editing `museum.json` directly — never by touching TypeScript files.
 *
 * This module re-exports live getters so every existing gallery component keeps
 * its original imports and behavior. The exports are ES module live bindings that
 * are refreshed from the JSON/localStorage source whenever the museum data changes
 * (the curator dispatches a `moc-data-changed` event after saving).
 */
import {
  getMuseumData,
  buildSearchIndex as loaderBuildSearchIndex,
  allMemories as loaderAllMemories,
  type MuseumData,
  type TimelineEntry,
  type MemoryCardSmall,
  type WallItem,
  type Observation,
  type Evidence,
  type Book,
  type Performance,
  type SpecialExhibit,
  type StudioCaseItem,
  type Cassette,
  type Song,
  type Cabinet,
  type Polaroid,
  type MapPin,
  type Star,
  type Letter,
  type SearchItem,
  type MemoryCard,
} from "./museumDataLoader";

// Re-export all types for compatibility
export type {
  TimelineEntry,
  MemoryCardSmall,
  WallItem,
  Observation,
  Evidence,
  Book,
  Performance,
  SpecialExhibit,
  StudioCaseItem,
  Cassette,
  Song,
  Cabinet,
  Polaroid,
  MapPin,
  Star,
  Letter,
  SearchItem,
  MemoryCard,
};

/* ---------- Live data bindings (refreshed on `moc-data-changed`) ---------- */

let d: MuseumData = getMuseumData();

/* Gallery 1 */
export let timeline: TimelineEntry[] = d.gallery1?.timeline ?? [];
export let memoryCards: MemoryCardSmall[] = d.gallery1?.memoryCards ?? [];
export let gallery1PortraitImage: string | null = d.gallery1?.portraitImage ?? null;
export let gallery1DrawerNote: string = d.gallery1?.drawerNote ?? "";

/* Gallery 2 */
export let becameWalls: WallItem[] = d.gallery2?.walls ?? [];
export let mirrorLines: string[] = d.gallery2?.mirrorLines ?? [];

/* Gallery 3 (observations) */
export let observations: Observation[] = d.gallery2?.observations ?? [];
export let secretObservation: { title: string; text: string } = d.gallery2?.secretObservation ?? { title: "", text: "" };

/* Gallery 4 (evidence) */
export let evidence: Evidence[] = d.gallery3?.evidence ?? [];
export let laughCounter: { label: string; value: string }[] = d.gallery3?.laughCounter ?? [];
export let glassCaseText: string = d.gallery3?.glassCaseText ?? "";
export let glassCaseDescription: string = d.gallery3?.glassCaseDescription ?? "";

/* Gallery 5 (dance studio) */
export let danceStudio = d.gallery4 ?? { performances: [], specialExhibits: [], studioCase: [] };
export let performances: Performance[] = d.gallery4?.performances ?? [];
export let specialExhibits: SpecialExhibit[] = d.gallery4?.specialExhibits ?? [];
export let studioCase: StudioCaseItem[] = d.gallery4?.studioCase ?? [];
export let studioHiddenNote: string = d.gallery4?.hiddenNote ?? "";
export let hiddenCompartmentNote: string = d.gallery4?.hiddenCompartmentNote ?? "";

/* Gallery 6 (sound) */
export let cassettes: Cassette[] = d.gallery5?.cassettes ?? [];
export let songs: Song[] = d.gallery5?.songs ?? [];
export let silenceBoothLabel: string = d.gallery5?.silenceBoothLabel ?? "";
export let laughExhibitLabel: string = d.gallery5?.laughExhibitLabel ?? "";

/* Gallery 8 (thank you) */
export let thankYouNotes: string[] = d.gallery6?.thankYouNotes ?? [];
export let gratitudeEnvelope: string[] = d.gallery6?.envelopeText ?? [];

/* Gallery 7 (little things) */
export let cabinets: Cabinet[] = d.gallery7?.cabinets ?? [];
export let randomDrawerNotes: string[] = d.gallery7?.drawerNotes ?? [];

/* Gallery 8 (photo room) */
export let polaroids: Polaroid[] = d.gallery8?.polaroids ?? [];

/* Gallery 10 (compliments) */
export let compliments: string[] = d.gallery8?.compliments ?? [];

/* Gallery 9 (map) */
export let mapPins: MapPin[] = d.gallery9?.mapPins ?? [];

/* Gallery 10 (constellation) */
export let stars: Star[] = d.gallery10?.stars ?? [];
export let brightestStarText: string = d.gallery10?.brightestStarText ?? "";

/* Gallery 11 (letters) */
export let letters: Letter[] = d.gallery11?.letters ?? [];
export let hiddenLetterText: string = d.gallery11?.hiddenLetterText ?? "";
export let hiddenGalleryPassword: string = d.gallery11?.password ?? "";

/* Gallery 12 (future wing) */
export let futureLabels: { title: string; status: string }[] = d.gallery12?.futureLabels ?? [];
export let futureFrameLabel: string = d.gallery12?.futureFrameLabel ?? "";

/* Finale */
export let corridorFrames: string[] = d.finale?.corridorFrames ?? [];
export let epilogueLines: string[] = d.finale?.epilogueLines ?? [];
export let postCreditsLetter: string[] = d.finale?.postCreditsLetter ?? [];
export let creditsCards: { role: string; name: string }[] = d.finale?.creditsCards ?? [];

/* Guide + museum meta */
export let birdFacts: string[] = d.guide?.birdFacts ?? [];
export let museumRules: string[] = d.museum?.rules ?? [];
export let dearChickoLetter: string[] = d.museum?.dearChickoLetter ?? [];

/* Global assets */
export let birdLogoImage: string | null = d.assets?.birdLogo ?? null;
export let hallwayBackgroundImage: string | null = d.assets?.hallwayBackground ?? null;
export let entranceCardImage: string | null = d.assets?.entranceCardImage ?? null;
export let guestbookHeaderImage: string | null = d.assets?.guestbookHeaderImage ?? null;

/* ---------- Refresh mechanism ---------- */
function refreshBindings() {
  d = getMuseumData();
  timeline = d.gallery1?.timeline ?? [];
  memoryCards = d.gallery1?.memoryCards ?? [];
  gallery1PortraitImage = d.gallery1?.portraitImage ?? null;
  gallery1DrawerNote = d.gallery1?.drawerNote ?? "";
  becameWalls = d.gallery2?.walls ?? [];
  mirrorLines = d.gallery2?.mirrorLines ?? [];
  observations = d.gallery2?.observations ?? [];
  secretObservation = d.gallery2?.secretObservation ?? { title: "", text: "" };
  evidence = d.gallery3?.evidence ?? [];
  laughCounter = d.gallery3?.laughCounter ?? [];
  glassCaseText = d.gallery3?.glassCaseText ?? "";
  glassCaseDescription = d.gallery3?.glassCaseDescription ?? "";
  danceStudio = d.gallery4 ?? { performances: [], specialExhibits: [], studioCase: [] };
  performances = d.gallery4?.performances ?? [];
  specialExhibits = d.gallery4?.specialExhibits ?? [];
  studioCase = d.gallery4?.studioCase ?? [];
  studioHiddenNote = d.gallery4?.hiddenNote ?? "";
  hiddenCompartmentNote = d.gallery4?.hiddenCompartmentNote ?? "";
  cassettes = d.gallery5?.cassettes ?? [];
  songs = d.gallery5?.songs ?? [];
  silenceBoothLabel = d.gallery5?.silenceBoothLabel ?? "";
  laughExhibitLabel = d.gallery5?.laughExhibitLabel ?? "";
  thankYouNotes = d.gallery6?.thankYouNotes ?? [];
  gratitudeEnvelope = d.gallery6?.envelopeText ?? [];
  cabinets = d.gallery7?.cabinets ?? [];
  randomDrawerNotes = d.gallery7?.drawerNotes ?? [];
  polaroids = d.gallery8?.polaroids ?? [];
  compliments = d.gallery8?.compliments ?? [];
  mapPins = d.gallery9?.mapPins ?? [];
  stars = d.gallery10?.stars ?? [];
  brightestStarText = d.gallery10?.brightestStarText ?? "";
  letters = d.gallery11?.letters ?? [];
  hiddenLetterText = d.gallery11?.hiddenLetterText ?? "";
  hiddenGalleryPassword = d.gallery11?.password ?? "";
  futureLabels = d.gallery12?.futureLabels ?? [];
  futureFrameLabel = d.gallery12?.futureFrameLabel ?? "";
  corridorFrames = d.finale?.corridorFrames ?? [];
  epilogueLines = d.finale?.epilogueLines ?? [];
  postCreditsLetter = d.finale?.postCreditsLetter ?? [];
  creditsCards = d.finale?.creditsCards ?? [];
  birdFacts = d.guide?.birdFacts ?? [];
  museumRules = d.museum?.rules ?? [];
  dearChickoLetter = d.museum?.dearChickoLetter ?? [];
  birdLogoImage = d.assets?.birdLogo ?? null;
  hallwayBackgroundImage = d.assets?.hallwayBackground ?? null;
  entranceCardImage = d.assets?.entranceCardImage ?? null;
  guestbookHeaderImage = d.assets?.guestbookHeaderImage ?? null;
}

if (typeof window !== "undefined") {
  window.addEventListener("moc-data-changed", refreshBindings);
  // Also refresh when returning to the tab (e.g., after editing in another tab)
  window.addEventListener("focus", refreshBindings);
}

/* ---------- Search index & memory pool (delegated to loader) ---------- */
export function buildSearchIndex(): SearchItem[] {
  return loaderBuildSearchIndex();
}

export function allMemories(): MemoryCard[] {
  return loaderAllMemories();
}
