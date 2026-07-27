/* Spec — Gallery 6: The Sound Room. Cassette wall (Laugh/Advice/Random/Late Night/Books),
 * songs, Silence Booth, Your Laugh oscilloscope, Archivist feather when all heard. */
import { useState } from "react";
import RoomSection from "@/components/RoomSection";
import { cassettes, songs, silenceBoothLabel, laughExhibitLabel } from "@/lib/museumData";
import { useMuseum } from "@/contexts/MuseumContext";
import { soundEngine } from "@/lib/soundEngine";
import { Play, Check } from "lucide-react";
import { toast } from "sonner";

const SOUND_BG = "/manus-storage/sound-room_86c493c6.png";
const BIRD = "/manus-storage/logo-bird_bdea2d3a.png";

export default function Gallery6Sound() {
  const { songsHeard, markSongHeard, award, soundOn, toggleSound } = useMuseum();
  const [nowPlaying, setNowPlaying] = useState<string | null>(null);
  const allIds = [...cassettes.map((c) => c.id), ...songs.map((s) => s.id)];

  const listen = (id: string) => {
    if (!soundOn) { soundEngine.start(); toggleSound(); }
    soundEngine.chime();
    setNowPlaying(id);
    markSongHeard(id);
    const next = new Set(songsHeard); next.add(id);
    if (allIds.every((x) => next.has(x))) {
      award("listener");
      toast("🪶 The lights dim. The Archivist drops a tiny feather.", { description: "\"Thank you for listening.\"", duration: 8000 });
    }
  };

  return (
    <RoomSection id="gallery-6" plaque="gallery six" title="The Sound Room" subtitle={"Close your eyes. Some memories are easier to hear."} bgImage={SOUND_BG}>
      {/* Cassette wall */}
      <div className="mx-auto max-w-4xl">
        <p className="gold-rule justify-center font-display text-xs tracking-[0.3em] text-[#c9a45c]">STATION ONE · VOICE NOTES</p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          {cassettes.map((c) => {
            const heard = songsHeard.has(c.id);
            const playing = nowPlaying === c.id;
            return (
              <button
                key={c.id}
                onClick={() => listen(c.id)}
                aria-label={`Play cassette: ${c.label}`}
                className={`group w-40 border border-[#c9a45c]/40 bg-gradient-to-b from-[#3a3226] to-[#241a0e] p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#c9a45c] focus:outline-none focus:ring-2 focus:ring-[#c9a45c] ${playing ? "shadow-[0_0_25px_rgba(201,164,92,0.3)]" : ""}`}
              >
                <div className="mx-auto flex h-10 w-24 items-center justify-around rounded-sm border border-[#c9a45c]/40 bg-[#171208] px-2" aria-hidden="true">
                  <span className={`h-4 w-4 rounded-full border border-[#c9a45c]/60 ${playing ? "animate-spin" : ""}`} style={{ borderTopColor: "#e8cd8c" }} />
                  <span className={`h-4 w-4 rounded-full border border-[#c9a45c]/60 ${playing ? "animate-spin" : ""}`} style={{ borderTopColor: "#e8cd8c" }} />
                </div>
                <p className="mt-2 font-hand text-xl text-[#e8cd8c]">"{c.label}" {heard && "✓"}</p>
                <p className="mt-1 font-body text-xs italic leading-snug text-[#d8c9a5]">{c.why}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Songs */}
      <div className="mx-auto mt-10 grid max-w-4xl gap-4 md:grid-cols-2">
        <p className="gold-rule justify-center font-display text-xs tracking-[0.3em] text-[#c9a45c] md:col-span-2">STATION TWO · SONGS</p>
        {songs.map((s) => {
          const heard = songsHeard.has(s.id);
          const playing = nowPlaying === s.id;
          return (
            <div key={s.id} className={`group relative border border-[#c9a45c]/40 bg-[#241a0e]/85 p-5 backdrop-blur-sm transition-all duration-300 hover:border-[#c9a45c] ${playing ? "shadow-[0_0_25px_rgba(201,164,92,0.25)]" : ""}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="room-title text-lg text-[#efe2c2]">{s.title}</h3>
                  <p className="mt-0.5 font-display text-xs tracking-[0.2em] text-[#c9a45c]/80">{s.vibe.toUpperCase()}</p>
                </div>
                <button
                  onClick={() => listen(s.id)}
                  aria-label={heard ? `${s.title} — heard` : `Listen to ${s.title}`}
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#c9a45c] ${heard ? "border-[#c9a45c] bg-[#c9a45c]/25 text-[#e8cd8c]" : "border-[#c9a45c]/50 text-[#c9a45c] hover:bg-[#c9a45c]/15"}`}
                >
                  {heard && !playing ? <Check size={16} /> : <Play size={16} />}
                </button>
              </div>
              <p className="mt-3 font-body text-sm italic leading-relaxed text-[#d8c9a5]">{s.why}</p>
              {s.spotifyLink && (
                <a
                  href={s.spotifyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="mt-2 inline-flex items-center gap-1.5 font-display text-[10px] tracking-[0.2em] text-[#1DB954] transition-colors hover:text-[#1ed760] focus:outline-none focus:ring-2 focus:ring-[#c9a45c]"
                >
                  ♫ OPEN ON SPOTIFY ↗
                </a>
              )}
              {playing && (
                <div className="mt-3 flex h-6 items-end gap-1" aria-hidden="true">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <span key={i} className="w-1 rounded-t bg-[#c9a45c]/70" style={{ animation: `vis 0.9s ease-in-out ${i * 0.06}s infinite alternate`, height: "20%" }} />
                  ))}
                  <style>{`@keyframes vis { from { height: 15%; } to { height: 100%; } }`}</style>
                </div>
              )}
            </div>
          );
        })}

        {/* Silence booth + laugh oscilloscope */}
        <div className="flex flex-col items-center justify-center border border-dashed border-[#c9a45c]/50 bg-[#171208]/80 p-6 text-center backdrop-blur-sm">
          <p className="font-display text-xs tracking-[0.3em] text-[#c9a45c]">STATION THREE · THE SILENCE BOOTH</p>
          <div className="mt-3 text-3xl" aria-hidden="true">🌧️</div>
          <p className="mt-3 font-body italic leading-relaxed text-[#d8c9a5]">"{silenceBoothLabel}"</p>
          <p className="mt-1 font-hand text-base text-[#c9a45c]/70">no music. only rain. (try the rain button, top right)</p>
        </div>
        <div className="flex flex-col items-center justify-center border border-[#c9a45c]/40 bg-[#241a0e]/85 p-6 text-center backdrop-blur-sm">
          <p className="font-display text-xs tracking-[0.3em] text-[#c9a45c]">STATION FOUR · YOUR LAUGH</p>
          <svg viewBox="0 0 200 40" className="mt-4 w-full max-w-[16rem]" aria-hidden="true">
            <path d="M0,20 Q10,5 20,20 T40,20 Q45,2 55,20 T75,20 Q82,35 90,20 T110,20 Q118,4 128,20 T148,20 Q155,32 162,20 T182,20 Q190,10 200,20" fill="none" stroke="#c9a45c" strokeWidth="1.5">
              <animate attributeName="stroke-opacity" values="0.4;1;0.4" dur="2.5s" repeatCount="indefinite" />
            </path>
          </svg>
          <p className="mt-3 font-body italic leading-relaxed text-[#d8c9a5]">"{laughExhibitLabel}"</p>
        </div>
      </div>
      <p className="mt-8 text-center font-display text-xs tracking-[0.25em] text-[#c9a45c]/70">
        LISTEN TO EVERYTHING — THE ARCHIVIST IS WAITING WITH A FEATHER
      </p>
    </RoomSection>
  );
}
