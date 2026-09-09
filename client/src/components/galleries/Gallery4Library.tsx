/* Spec — Gallery 5: The Dance Studio of Her Story. A preserved dance studio after
 * hours. Reserved chairs, "The Performances That Became Memories" archival wall,
 * vintage projector viewing experience, glass display case of studio artifacts,
 * hidden rehearsal-diary details. Keeps the museum's warm archival aesthetic. */
import { useMemo, useState } from "react";
import RoomSection from "@/components/RoomSection";
import { danceStudio, performances, specialExhibits, studioCase, type Performance, type SpecialExhibit, type HiddenDetail } from "@/lib/museumData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useMuseum } from "@/contexts/MuseumContext";

const LIBRARY_BG = "/manus-storage/library-room_435da104.png";

/* ---------- video helpers: MP4 upload / YouTube / Drive ---------- */
function toEmbedUrl(video: string | null): { kind: "file" | "iframe" | "none"; src: string } {
  if (!video) return { kind: "none", src: "" };
  const v = video.trim();
  // YouTube — watch, share, shorts, embed
  const yt = v.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
  if (yt) return { kind: "iframe", src: `https://www.youtube.com/embed/${yt[1]}?autoplay=1&rel=0&modestbranding=1` };
  // Google Drive — file link
  const gd = v.match(/drive\.google\.com\/(?:file\/d\/([-\w]{10,})|open\?id=([-\w]{10,}))/);
  if (gd) return { kind: "iframe", src: `https://drive.google.com/file/d/${gd[1] || gd[2]}/preview` };
  // Uploaded data URL or direct file path
  return { kind: "file", src: v };
}

/* ---------- one archival frame on the performance wall ---------- */
function PerformanceFrame({ p, index, onOpen }: { p: Performance; index: number; onOpen: (p: Performance) => void }) {
  return (
    <button
      onClick={() => onOpen(p)}
      aria-label={`Open performance: ${p.title}`}
      className="group relative flex flex-col border-4 border-[#8a6a38] bg-[#241a0e]/90 p-2 text-left shadow-xl backdrop-blur-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-[#c9a45c] hover:shadow-[0_0_35px_rgba(201,164,92,0.35)] focus:outline-none focus:ring-2 focus:ring-[#c9a45c]"
      style={{ transform: `rotate(${(index % 3) - 1}deg)` }}
    >
      {/* ornate inner frame line */}
      <div className="pointer-events-none absolute inset-1 border border-[#c9a45c]/30" aria-hidden="true" />
      {/* thumbnail or archival placeholder */}
      <div className="relative flex h-32 w-full items-center justify-center overflow-hidden bg-gradient-to-b from-[#1a130a] to-[#2c2113] md:h-36">
        {p.thumbnail ? (
          <img src={p.thumbnail} alt={`Still from ${p.title}`} className="h-full w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105" style={{ filter: "sepia(0.25) contrast(0.95)" }} />
        ) : (
          <div className="flex flex-col items-center gap-1 text-[#c9a45c]/50">
            <span className="text-3xl" aria-hidden="true">💃</span>
            <span className="font-display text-[9px] tracking-[0.25em]">ARCHIVAL FOOTAGE</span>
          </div>
        )}
        {/* film grain vignette */}
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(20,14,6,0.55) 100%)" }} aria-hidden="true" />
        {/* play hint */}
        {(p.video || p.thumbnail) && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e8cd8c]/70 bg-[#140e06]/70 text-[#e8cd8c]">▶</div>
          </div>
        )}
      </div>
      {/* brass plaque */}
      <div className="mt-2 border-t border-[#c9a45c]/25 px-1 pt-2">
        <p className="font-display text-[10px] tracking-[0.2em] text-[#c9a45c]">{p.year}</p>
        <p className="mt-0.5 font-display text-sm leading-snug text-[#e8d9b5]">{p.title}</p>
        {p.description && <p className="mt-1 line-clamp-2 font-body text-xs italic leading-relaxed text-[#d8c9a5]/75">{p.description}</p>}
      </div>
    </button>
  );
}

export default function Gallery5DanceStudio() {
  const [selected, setSelected] = useState<Performance | null>(null);
  const [selectedExhibit, setSelectedExhibit] = useState<SpecialExhibit | null>(null);
  const [selectedDiary, setSelectedDiary] = useState<HiddenDetail | null>(null);
  const [opens, setOpens] = useState(0);
  const { booksGlow } = useMuseum();
  const g = danceStudio;

  // New museum data stores hidden details as individual items. These fallbacks
  // keep older imported backups fully compatible until they are edited again.
  const hiddenDetails: HiddenDetail[] = g.hiddenDetails ?? [
    { id: "legacy-diary", kind: "diary", emoji: "📓", label: "a rehearsal diary, left open…", note: g.hiddenNote || "" },
    { id: "legacy-compartment", kind: "compartment", emoji: "🩰", label: "something behind the fourth frame…", note: g.hiddenCompartmentNote || "" },
    { id: "legacy-schedule", kind: "schedule", emoji: "🗓️", label: "a folded schedule…", note: g.scheduleNote || "" },
    { id: "legacy-hairpin", kind: "hairpin", emoji: "📎", label: "something small on the floor…", note: g.hairpinNote || "" },
  ];
  const hiddenDetailsEnabled = g.hiddenDetailsEnabled !== false;
  const studioCaseEnabled = g.studioCaseEnabled !== false;
  const compartmentDetail = hiddenDetails.find((detail) => detail.kind === "compartment");

  const openFrame = (p: Performance) => {
    setSelectedExhibit(null);
    setSelected(p);
    const n = opens + 1;
    setOpens(n);
    if (n === 4 && hiddenDetailsEnabled && compartmentDetail?.note) {
      toast(`${compartmentDetail.emoji} ${compartmentDetail.label}`, { description: compartmentDetail.note, duration: 9000 });
    }
  };

  const openSpecialExhibit = (exhibit: SpecialExhibit) => {
    if (!exhibit.youtubeUrl) {
      toast("🎞️ " + exhibit.label, { description: exhibit.note, duration: 6000 });
      return;
    }
    setSelected(null);
    setSelectedExhibit(exhibit);
  };

  const projectorVideo = selectedExhibit?.youtubeUrl ?? selected?.video ?? null;
  const embed = useMemo(() => toEmbedUrl(projectorVideo), [projectorVideo]);
  const closeProjector = () => {
    setSelected(null);
    setSelectedExhibit(null);
  };

  return (
    <RoomSection id="gallery-5" plaque="gallery five" title={g.roomTitle} subtitle={g.roomSubtitle} bgImage={LIBRARY_BG}>
      {/* Reserved chairs (kept) with dance quote */}
      <div className="mx-auto mb-8 flex max-w-2xl flex-wrap items-center justify-center gap-4">
        <div className="border border-[#c9a45c]/40 bg-[#241a0e]/85 px-5 py-3 text-center backdrop-blur-sm">
          <span className="text-2xl" aria-hidden="true">🪑</span>
          <p className="mt-1 font-hand text-lg text-[#e8cd8c]">{g.reservedChairLeft}</p>
        </div>
        <p className="max-w-[14rem] text-center font-hand text-lg text-[#d8c9a5]">"{g.reservedChairQuote}"</p>
        <div className="border border-[#c9a45c]/40 bg-[#241a0e]/85 px-5 py-3 text-center backdrop-blur-sm">
          <span className="text-2xl" aria-hidden="true">🪑</span>
          <p className="mt-1 font-hand text-lg text-[#e8cd8c]">{g.reservedChairRight}</p>
        </div>
      </div>

      {/* Centerpiece — Dances That Told Your Story */}
      <div className="mx-auto mb-10 max-w-2xl border border-[#c9a45c]/35 bg-[#241a0e]/85 p-6 text-center backdrop-blur-sm">
        <p className="font-display text-sm tracking-[0.3em] text-[#c9a45c]">— {g.centerpieceTitle.toUpperCase()} —</p>
        <p className="mt-3 font-body text-sm italic leading-relaxed text-[#d8c9a5]">{g.centerpieceText}</p>
        {/* ballet barre motif */}
        <div className="mx-auto mt-4 flex max-w-xs items-center gap-1" aria-hidden="true">
          <div className="h-2 w-2 rounded-full bg-[#c9a45c]/60" />
          <div className="h-0.5 flex-1 bg-gradient-to-r from-[#c9a45c]/60 via-[#c9a45c]/25 to-[#c9a45c]/60" />
          <div className="h-2 w-2 rounded-full bg-[#c9a45c]/60" />
        </div>
        <p className="mt-1 font-hand text-sm text-[#c9a45c]/60">the barre, polished by years of practice</p>
      </div>

      {/* The Performances That Became Memories — the wooden archival wall */}
      <div className="mx-auto max-w-4xl">
        <div
          className={`relative rounded-sm p-5 shadow-2xl backdrop-blur-sm transition-shadow duration-1000 md:p-8 ${booksGlow ? "shadow-[0_0_60px_rgba(201,164,92,0.6)]" : ""}`}
          style={{
            background: "linear-gradient(180deg, rgba(58,44,24,0.92) 0%, rgba(44,33,19,0.94) 100%)",
            backgroundImage: "repeating-linear-gradient(90deg, rgba(20,14,6,0.18) 0px, rgba(20,14,6,0.18) 2px, transparent 2px, transparent 84px), linear-gradient(180deg, rgba(58,44,24,0.92) 0%, rgba(44,33,19,0.94) 100%)",
          }}
        >
          <p className="mb-1 text-center font-display text-sm tracking-[0.3em] text-[#c9a45c]">— {g.wallTitle.toUpperCase()} —</p>
          <p className="mb-5 text-center font-hand text-base text-[#c9a45c]/70">{g.wallHint}</p>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3" role="list" aria-label="Archived performances">
            {performances.map((p, i) => (
              <PerformanceFrame key={p.id} p={p} index={i} onOpen={openFrame} />
            ))}
          </div>
          {/* wooden dance floor strip + mirror reflection */}
          <div className="mt-6 h-3 rounded-b-sm" style={{ background: "repeating-linear-gradient(90deg, #4a3820 0px, #4a3820 46px, #3a2c18 46px, #3a2c18 92px)" }} aria-hidden="true" />
          <div className="h-8 opacity-25" style={{ background: "linear-gradient(180deg, rgba(232,205,140,0.35), transparent)", transform: "scaleY(-1)" }} aria-hidden="true" title="the studio mirror still remembers" />
        </div>
      </div>

      {/* Special Exhibits */}
      <div className="mx-auto mt-10 max-w-4xl">
        <p className="gold-rule justify-center font-display text-xs tracking-[0.3em] text-[#c9a45c]">SPECIAL EXHIBITS</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {specialExhibits.map((sx, i) => (
            <button
              key={sx.id}
              onClick={() => openSpecialExhibit(sx)}
              className="border border-[#c9a45c]/35 bg-[#241a0e]/85 p-4 text-left backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#c9a45c] focus:outline-none focus:ring-2 focus:ring-[#c9a45c]"
              style={{ transform: `rotate(${(i % 3) - 1}deg)`, animation: `floatSlow ${6 + (i % 3)}s ease-in-out infinite` }}
              aria-label={sx.youtubeUrl ? `Watch special exhibit: ${sx.label}` : `Read special exhibit: ${sx.label}`}
            >
              <p className="font-display text-[10px] tracking-[0.25em] text-[#c9a45c]">COLLECTION {String(i + 1).padStart(2, "0")}</p>
              <p className="mt-1 font-hand text-lg leading-snug text-[#e8cd8c]">{sx.label}</p>
              <p className="mt-1 font-body text-xs italic leading-relaxed text-[#d8c9a5]/70">{sx.note}</p>
              {sx.youtubeUrl && <p className="mt-2 font-display text-[9px] tracking-[0.2em] text-[#c9a45c]/60">▶ WATCH THIS COLLECTION</p>}
            </button>
          ))}
        </div>
      </div>

      {/* Glass display case — studio artifacts */}
      {studioCaseEnabled && studioCase.length > 0 && <div className="mx-auto mt-10 max-w-4xl">
        <p className="gold-rule justify-center font-display text-xs tracking-[0.3em] text-[#c9a45c]">THE STUDIO CASE</p>
        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3">
          {studioCase.map((item) => (
            <button
              key={item.id}
              onClick={() => toast(`${item.emoji} ${item.label}`, { description: item.note, duration: 7000 })}
              className="relative border border-[#c9a45c]/30 bg-[#1c1409]/80 p-4 text-center backdrop-blur-sm transition-all duration-300 hover:border-[#c9a45c]/70 focus:outline-none focus:ring-2 focus:ring-[#c9a45c]"
              aria-label={`Examine: ${item.label}`}
            >
              {/* glass reflection */}
              <div className="pointer-events-none absolute inset-0 opacity-20" style={{ background: "linear-gradient(115deg, transparent 30%, rgba(232,217,181,0.5) 45%, transparent 60%)" }} aria-hidden="true" />
              <span className="text-3xl" aria-hidden="true">{item.emoji}</span>
              <p className="mt-2 font-display text-[11px] tracking-[0.15em] text-[#e8d9b5]">{item.label.toUpperCase()}</p>
            </button>
          ))}
        </div>
        <p className="mt-3 text-center font-hand text-base text-[#c9a45c]/70">tap the glass gently · the artifacts are older than they look</p>
      </div>}

      {/* Hidden details — each item can be added, removed, or assigned a behavior in Curator Mode */}
      {hiddenDetailsEnabled && hiddenDetails.some((detail) => detail.kind !== "compartment") && (
        <div className="mx-auto mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-4">
          {hiddenDetails.filter((detail) => detail.kind !== "compartment").map((detail) => (
            <button
              key={detail.id}
              onClick={() => detail.kind === "diary" ? setSelectedDiary(detail) : toast(`${detail.emoji} ${detail.label}`, { description: detail.note, duration: 8000 })}
              className="font-hand text-lg text-[#c9a45c]/75 underline decoration-dotted underline-offset-4 transition-colors hover:text-[#e8cd8c] focus:outline-none focus:ring-2 focus:ring-[#c9a45c]"
              aria-label={`Open hidden detail: ${detail.label}`}
            >
              {detail.emoji} {detail.label}
            </button>
          ))}
        </div>
      )}

      {/* Rehearsal diary dialog */}
      <Dialog open={!!selectedDiary} onOpenChange={(open) => !open && setSelectedDiary(null)}>
        <DialogContent className="max-w-md border-[oklch(0.72_0.09_80/50%)] bg-[#f8f2e2] text-[#3d3020]">
          <DialogHeader>
            <DialogTitle className="room-title text-xl">{selectedDiary?.label || "The Rehearsal Diary"}</DialogTitle>
            <DialogDescription className="plaque !text-[10px]">found beneath the ballet barre · entry undated</DialogDescription>
          </DialogHeader>
          <div className="border-l-2 border-[#a83226]/40 pl-4">
            <p className="font-hand text-2xl leading-relaxed text-[#5a4327]">"{selectedDiary?.note}"</p>
          </div>
          <p className="text-right font-hand text-base text-[#8a6a38]">— the audience of one</p>
        </DialogContent>
      </Dialog>

      {/* The vintage projector viewing experience — shared screen, independent data sources */}
      <Dialog open={!!selected || !!selectedExhibit} onOpenChange={(open) => !open && closeProjector()}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto border-[oklch(0.72_0.09_80/50%)] bg-[#140e06] p-0 text-[#e8d9b5]">
          <div style={{ animation: "fadeUp 0.5s cubic-bezier(0.23,1,0.32,1) both" }}>
            {/* stage curtains */}
            <div className="relative flex items-stretch">
              <div className="w-6 shrink-0 md:w-10" style={{ background: "repeating-linear-gradient(90deg, #5a1f18 0px, #7a2c20 7px, #5a1f18 14px)" }} aria-hidden="true" />
              <div className="min-w-0 flex-1 px-5 py-5 md:px-7">
                <DialogHeader>
                  <p className="font-display text-[10px] tracking-[0.3em] text-[#c9a45c]">
                    {selectedExhibit
                      ? `FROM THE SPECIAL COLLECTION · EXHIBIT ${String(specialExhibits.findIndex((item) => item.id === selectedExhibit.id) + 1).padStart(2, "0")}`
                      : `FROM THE PERFORMANCE ARCHIVE · REEL ${selected ? String(performances.findIndex((item) => item.id === selected.id) + 1).padStart(2, "0") : "—"}`}
                  </p>
                  <DialogTitle className="font-display text-2xl leading-snug text-[#e8cd8c]">{selectedExhibit?.label || selected?.title}</DialogTitle>
                  <DialogDescription className="font-body text-xs italic text-[#d8c9a5]/80">
                    {selectedExhibit ? selectedExhibit.note : `${selected?.year || ""}${selected?.location ? ` · ${selected.location}` : ""}`}
                  </DialogDescription>
                </DialogHeader>

                {/* the archival screen */}
                <div className="relative mt-4 border-4 border-[#8a6a38] bg-black shadow-[0_0_45px_rgba(201,164,92,0.2)]">
                  <div className="pointer-events-none absolute inset-0 z-10 border border-[#c9a45c]/25" aria-hidden="true" />
                  <div className="aspect-video w-full">
                    {embed.kind === "iframe" && (
                      <iframe
                        src={embed.src}
                        title={selectedExhibit?.label || selected?.title || "Museum exhibit"}
                        className="h-full w-full"
                        allow="autoplay; encrypted-media; picture-in-picture"
                        allowFullScreen
                      />
                    )}
                    {embed.kind === "file" && (
                      <video src={embed.src} className="h-full w-full" controls autoPlay poster={selected?.thumbnail || undefined} style={{ filter: "sepia(0.08)" }} />
                    )}
                    {embed.kind === "none" && (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-b from-[#1a130a] to-[#0c0803]">
                        {selected?.thumbnail ? (
                          <img src={selected.thumbnail} alt={`Still from ${selected.title}`} className="h-full w-full object-contain" style={{ filter: "sepia(0.2)" }} />
                        ) : (
                          <>
                            <span className="text-4xl" aria-hidden="true">🎞️</span>
                            <p className="font-display text-[10px] tracking-[0.3em] text-[#c9a45c]/70">REEL PRESERVED · FOOTAGE PENDING ACQUISITION</p>
                            <p className="font-hand text-lg text-[#d8c9a5]/70">the projector hums, waiting for its film</p>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  {/* projector light beam bottom */}
                  <div className="pointer-events-none absolute -bottom-1 left-1/2 h-1 w-2/3 -translate-x-1/2 opacity-60" style={{ background: "linear-gradient(90deg, transparent, #e8cd8c, transparent)" }} aria-hidden="true" />
                </div>
                <p className="mt-2 text-center font-hand text-sm text-[#c9a45c]/60">restored from the private collection · projector no. 5</p>

                {/* archival plaques */}
                {selectedExhibit?.note && (
                  <div className="mt-4 border border-[#c9a45c]/25 bg-[#241a0e]/70 p-4">
                    <p className="plaque !text-[9px] !text-[#c9a45c]">special exhibit note</p>
                    <p className="mt-1 font-body text-sm italic leading-relaxed text-[#d8c9a5]">{selectedExhibit.note}</p>
                  </div>
                )}
                {selected?.description && (
                  <div className="mt-4 border border-[#c9a45c]/25 bg-[#241a0e]/70 p-4">
                    <p className="plaque !text-[9px] !text-[#c9a45c]">exhibit description</p>
                    <p className="mt-1 font-body text-sm italic leading-relaxed text-[#d8c9a5]">{selected.description}</p>
                  </div>
                )}
                {selected?.memory && (
                  <div className="mt-3 border border-[#c9a45c]/25 bg-[#241a0e]/70 p-4">
                    <p className="plaque !text-[9px] !text-[#c9a45c]">a memory, preserved</p>
                    <p className="mt-1 font-hand text-xl leading-relaxed text-[#e8cd8c]">{selected.memory}</p>
                  </div>
                )}
                {selected?.quote && (
                  <p className="mt-3 text-center font-hand text-lg text-[#d8c9a5]">"{selected.quote}"</p>
                )}
                {selected?.curatorNote && (
                  <p className="mt-3 text-right font-body text-xs italic text-[#c9a45c]/70">curator's note — {selected.curatorNote}</p>
                )}
              </div>
              <div className="w-6 shrink-0 md:w-10" style={{ background: "repeating-linear-gradient(90deg, #5a1f18 0px, #7a2c20 7px, #5a1f18 14px)" }} aria-hidden="true" />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </RoomSection>
  );
}
