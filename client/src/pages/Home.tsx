/*
 * THE MUSEUM OF CHICKO — main promenade.
 * Gilded Archive style: entrance sequence → intro hall → featured memory →
 * 13 galleries with transition corridors between each → final room → guestbook → footer.
 * Ambient layers on top. Corridors create the feeling of walking through a real museum.
 */
import { useState } from "react";
import { useMuseum } from "@/contexts/MuseumContext";
import Entrance from "@/components/Entrance";
import ControlDock from "@/components/ControlDock";
import AmbientEffects from "@/components/AmbientEffects";
import EasterEggs from "@/components/EasterEggs";
import GuideBird from "@/components/GuideBird";
import AchievementsPanel from "@/components/AchievementsPanel";
import ArchiveSearch from "@/components/ArchiveSearch";
import FeaturedMemory from "@/components/FeaturedMemory";
import Guestbook from "@/components/Guestbook";
import MuseumFooter from "@/components/MuseumFooter";
import LastExhibit from "@/components/LastExhibit";
import MuseumCorridor from "@/components/MuseumCorridor";
import MuseumWall from "@/components/MuseumWall";
import MuseumMasonry from "@/components/MuseumMasonry";
import MuseumProgressIndicator from "@/components/MuseumProgressIndicator";
import MuseumAmbientOverlay from "@/components/MuseumAmbientOverlay";
import Gallery1Timeline from "@/components/galleries/Gallery1Timeline";
import Gallery2Observations from "@/components/galleries/Gallery2Observations";
import Gallery3Evidence from "@/components/galleries/Gallery3Evidence";
import Gallery4Library from "@/components/galleries/Gallery4Library";
import Gallery5Sound from "@/components/galleries/Gallery5Sound";
import Gallery6ThankYou from "@/components/galleries/Gallery6ThankYou";
import Gallery7LittleThings from "@/components/galleries/Gallery7LittleThings";
import Gallery8Photos from "@/components/galleries/Gallery8Photos";
import Gallery9Map from "@/components/galleries/Gallery9Map";
import Gallery10Compliments from "@/components/galleries/Gallery10Compliments";
import Gallery11Constellation from "@/components/galleries/Gallery11Constellation";
import Gallery12Hidden from "@/components/galleries/Gallery12Hidden";
import Gallery13Future from "@/components/galleries/Gallery13Future";
import FinalRoom from "@/components/galleries/FinalRoom";

export default function Home() {
  const { entered, setEntered, markVisited } = useMuseum();
  const [lastExhibitOpen, setLastExhibitOpen] = useState(false);

  // allow direct entry via ?inside=1 (also used for QA previews)
  if (!entered && typeof window !== "undefined" && new URLSearchParams(window.location.search).has("inside")) {
    setEntered(true);
  }

  if (!entered) {
    return (
      <Entrance
        onComplete={() => {
          markVisited("intro-hall");
          setEntered(true);
          window.scrollTo({ top: 0 });
        }}
      />
    );
  }

  return (
    <div className="min-h-screen" style={{ animation: "fadeIn 1.2s ease both" }}>
      {/* skip link for keyboard users */}
      <a
        href="#gallery-1"
        className="sr-only z-[100] rounded bg-card px-4 py-2 font-display text-sm focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to first gallery
      </a>

      <AmbientEffects />
      <MuseumAmbientOverlay />
      <MuseumProgressIndicator />
      <EasterEggs />
      <ControlDock />
      <ArchiveSearch />
      <AchievementsPanel />
      <GuideBird />

      <main id="main">
        {/* ========== WELCOME LANDING STRIP ========== */}
        <section className="paper-texture relative flex min-h-[60vh] flex-col items-center justify-center bg-background px-6 py-24 text-center" aria-label="Museum welcome">
          <img src="/manus-storage/logo-bird_bdea2d3a.png" alt="" className="h-16 w-16" style={{ animation: "floatSlow 5s ease-in-out infinite" }} />
          <p className="plaque mt-6">now entering the permanent collection</p>
          <h1 className="room-title pinspot mt-6 text-4xl md:text-6xl">The Museum of Chicko</h1>
          <p className="mt-4 max-w-xl font-body text-lg italic text-muted-foreground">
            A collection of moments, memories, stories and little pieces of life that only exist because you were part of it.
          </p>
          <p className="mt-8 font-hand text-xl text-[oklch(0.6_0.08_78)]">walk slowly. the rooms are in no hurry.</p>
          <div className="mt-6 animate-bounce text-2xl text-[oklch(0.6_0.08_78)]" aria-hidden="true">↓</div>
        </section>

        {/* ========== TRANSITION: Welcome → Promenade → Gallery 1 ========== */}
        <MuseumMasonry type="arch-top" label="gallery one" />
        <MuseumCorridor variant="welcome-promenade" />
        <MuseumWall variant="warm" quote="Some beginnings change everything without saying a word." plaque="the promenade" />
        <MuseumMasonry type="column-pair" />

        {/* ========== GALLERY 1: The Girl I Met ========== */}
        <Gallery1Timeline />

        {/* ========== TRANSITION: Gallery 1 → Gallery 2 ========== */}
        <MuseumMasonry type="molding" />
        <MuseumCorridor variant="reading-nook" />
        <MuseumWall variant="warm" quote="She reads the pages you leave open." plaque="reading corner" />
        <MuseumMasonry type="arch-top" label="gallery two" />

        {/* ========== GALLERY 2: The Person You Became ========== */}
        <Gallery2Observations />

        {/* ========== TRANSITION: Gallery 2 → Gallery 3 ========== */}
        <MuseumMasonry type="molding" />
        <MuseumCorridor variant="frame-gallery" />
        <MuseumWall variant="cool" quote="Small frames hold the loudest truths." plaque="frame gallery" />
        <MuseumMasonry type="arch-top" label="gallery three" />

        {/* ========== GALLERY 3: The Evidence ========== */}
        <Gallery3Evidence />

        {/* ========== TRANSITION: Gallery 3 → Gallery 4 ========== */}
        <MuseumMasonry type="molding" />
        <MuseumCorridor variant="curators-passage" />
        <MuseumWall variant="warm" quote="The curator never left this corridor." plaque="curator's passage" />
        <MuseumMasonry type="arch-top" label="gallery four" />

        {/* ========== GALLERY 4: The Library ========== */}
        <Gallery4Library />

        {/* ========== TRANSITION: Gallery 4 → Gallery 5 ========== */}
        <MuseumMasonry type="molding" />
        <MuseumCorridor variant="acoustic-chamber" />
        <MuseumWall variant="dark" quote="The walls remember every song." plaque="acoustic chamber" />
        <MuseumMasonry type="arch-top" label="gallery five" />

        {/* ========== GALLERY 5: The Sound Room ========== */}
        <Gallery5Sound />

        {/* ========== TRANSITION: Gallery 5 → Gallery 6 ========== */}
        <MuseumMasonry type="molding" />
        <MuseumCorridor variant="garden-threshold" />
        <MuseumWall variant="garden" quote="Sunlight finds its way through every window." plaque="garden threshold" />
        <MuseumMasonry type="arch-top" label="gallery six" />

        {/* ========== GALLERY 6: Thank You ========== */}
        <Gallery6ThankYou />

        {/* ========== TRANSITION: Gallery 6 → Gallery 7 ========== */}
        <MuseumMasonry type="molding" />
        <MuseumCorridor variant="memory-hall" />
        <MuseumWall variant="warm" quote="Every pin on this wall is a Tuesday." plaque="memory hall" />
        <MuseumMasonry type="arch-top" label="gallery seven" />

        {/* ========== GALLERY 7: Little Things ========== */}
        <Gallery7LittleThings />

        {/* ========== TRANSITION: Gallery 7 → Gallery 8 ========== */}
        <MuseumMasonry type="molding" />
        <MuseumCorridor variant="photo-gallery" />
        <MuseumWall variant="cool" quote="The best photographs are the ones you feel." plaque="photograph gallery" />
        <MuseumMasonry type="arch-top" label="gallery eight" />

        {/* ========== GALLERY 8: Photos ========== */}
        <Gallery8Photos />

        {/* ========== TRANSITION: Gallery 8 → Gallery 9 ========== */}
        <MuseumMasonry type="molding" />
        <MuseumCorridor variant="cartographers-corner" />
        <MuseumWall variant="warm" quote="Every path leads somewhere she was." plaque="cartographer's corner" />
        <MuseumMasonry type="arch-top" label="gallery nine" />

        {/* ========== GALLERY 9: The Map ========== */}
        <Gallery9Map />

        {/* ========== TRANSITION: Gallery 9 → Gallery 10 ========== */}
        <MuseumMasonry type="molding" />
        <MuseumCorridor variant="whispering-wall" />
        <MuseumWall variant="dark" quote="The wall has been waiting to say this." plaque="whispering wall" />
        <MuseumMasonry type="arch-top" label="gallery ten" />

        {/* ========== GALLERY 10: Compliments ========== */}
        <Gallery10Compliments />

        {/* ========== TRANSITION: Gallery 10 → Gallery 11 ========== */}
        <MuseumMasonry type="molding" />
        <MuseumCorridor variant="observatory-entrance" />
        <MuseumWall variant="dark" quote="Look up. The stars have names for you." plaque="observatory entrance" />
        <MuseumMasonry type="arch-top" label="gallery eleven" />

        {/* ========== GALLERY 11: Constellation ========== */}
        <Gallery11Constellation />

        {/* ========== TRANSITION: Gallery 11 → Gallery 12 ========== */}
        <MuseumMasonry type="molding" />
        <MuseumCorridor variant="hidden-door" />
        <MuseumWall variant="dark" quote="Some doors only open when you stop looking." plaque="hidden door" />
        <MuseumMasonry type="arch-top" label="gallery twelve" />

        {/* ========== GALLERY 12: Hidden ========== */}
        <Gallery12Hidden />

        {/* ========== TRANSITION: Gallery 12 → Gallery 13 ========== */}
        <MuseumMasonry type="molding" />
        <MuseumCorridor variant="final-approach" />
        <MuseumWall variant="warm" quote="One more room. Then the exit." plaque="final approach" />
        <MuseumMasonry type="arch-top" label="gallery thirteen" />

        {/* ========== GALLERY 13: The Future ========== */}
        <Gallery13Future />

        {/* ========== TRANSITION: Gallery 13 → Final Room ========== */}
        <MuseumMasonry type="column-pair" />
        <MuseumWall variant="dark" quote="The last room is always the quietest." plaque="before the final hall" />
        <MuseumMasonry type="arch-top" label="final hall" />

        {/* ========== FINAL ROOM ========== */}
        <FinalRoom onLastExhibit={() => setLastExhibitOpen(true)} />

        {/* ========== TRANSITION: Final Room → Exit Hall → Guestbook ========== */}
        <MuseumMasonry type="molding" />
        <MuseumCorridor variant="exit-hall" direction="returning" />
        <MuseumWall variant="warm" quote="The museum stays open. You may leave when ready." plaque="exit hall" />

        {/* ========== GUESTBOOK ========== */}
        <Guestbook />
      </main>

      <MuseumFooter />

      {lastExhibitOpen && <LastExhibit onClose={() => setLastExhibitOpen(false)} />}
    </div>
  );
}
