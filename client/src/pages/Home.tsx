/*
 * THE MUSEUM OF CHICKO — main promenade.
 * Gilded Archive style: entrance sequence → intro hall → featured memory →
 * 13 galleries → final room → guestbook → footer. Ambient layers on top.
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
      <EasterEggs />
      <ControlDock />
      <ArchiveSearch />
      <AchievementsPanel />
      <GuideBird />

      <main id="main">
        {/* Welcome landing strip after intro */}
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

        <FeaturedMemory />
        <Gallery1Timeline />
        <Gallery2Observations />
        <Gallery3Evidence />
        <Gallery4Library />
        <Gallery5Sound />
        <Gallery6ThankYou />
        <Gallery7LittleThings />
        <Gallery8Photos />
        <Gallery9Map />
        <Gallery10Compliments />
        <Gallery11Constellation />
        <Gallery12Hidden />
        <Gallery13Future />
        <FinalRoom onLastExhibit={() => setLastExhibitOpen(true)} />
        <Guestbook />
      </main>

      <MuseumFooter />

      {lastExhibitOpen && <LastExhibit onClose={() => setLastExhibitOpen(false)} />}
    </div>
  );
}
