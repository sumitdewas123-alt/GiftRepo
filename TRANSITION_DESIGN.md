# Transition Space System Design

## Philosophy
The museum should feel like walking through a real building. Each gallery is a "room" and between rooms there should be corridors, hallways, and architectural elements that create physical separation. The visitor should feel like they're traveling through space.

## Approach: CSS-only architectural transitions
- No new routes or pages
- Wrap each gallery with a transition zone above and below
- Use CSS gradients, pseudo-elements, and fixed-position overlays
- Leverage existing color tokens and animation system
- Add environmental storytelling elements

## Transition Components

### 1. MuseumCorridor (between galleries)
- Full-width section with wooden floor effect (CSS gradient)
- Warm overhead lighting (radial gradient cones)
- Floating dust particles (reuse AmbientEffects pattern locally)
- Wall details: framed quotes, small exhibits, plaques
- Arched doorway CSS shapes at top and bottom
- IntersectionObserver-triggered fade-in

### 2. Specific Corridors (themed per location)
Each corridor has a unique identity:
- **Welcome Corridor** (after landing strip → Gallery 1): "The Promenade"
  - Museum directory, brass map, first arched doorway
- **Corridor 1→2**: "The Reading Nook"
  - Small bookshelf detail, warm lamp glow, quiet bench
- **Corridor 2→3**: "The Gallery of Small Frames"  
  - Tiny framed photographs on walls, museum labels
- **Corridor 3→4**: "The Curator's Passage"
  - Museum signage, directional arrows, old windows
- **Corridor 4→5**: "The Sound Room Antechamber"
  - Warm acoustic wood panels, subtle reverb feel
- **Corridor 5→6**: "The Garden Threshold"
  - Plant motifs, natural light, birds on windowsill
- **Corridor 6→7**: "The Memory Hall"
  - Corkboard with pinned notes, string connections
- **Corridor 7→8**: "The Photograph Gallery"
  - Empty frames waiting for content, soft spotlight
- **Corridor 8→9**: "The Cartographer's Corner"
  - Old maps, compass roses, navigational charts
- **Corridor 9→10**: "The Whispering Wall"
  - Textured wall with whispered quotes
- **Corridor 10→11**: "The Observatory Entrance"
  - Star motifs, telescope silhouette, dark transition
- **Corridor 11→12**: "The Hidden Door"
  - Locked door, keyhole, mysterious glow
- **Corridor 12→13**: "The Final Approach"
  - Long corridor, single light, anticipation
- **Post-Final** (FinalRoom → Guestbook): "The Exit Hall"
  - Coat rack, mirror, farewell sign

### 3. Architectural Elements (reusable)
- `ArchedDoorway`: CSS arch shape at corridor entry/exit
- `WoodenFloor`: CSS wood plank pattern
- `OverheadLight`: Radial gradient light cone
- `WallFrame`: Small framed item (quote, exhibit, note)
- `MuseumSign`: Brass direction sign
- `DustMotes`: Local floating dust (lighter than global)
- `WindowGlow`: Simulated window light on wall

### 4. Integration Strategy
In Home.tsx, wrap each gallery section with:
```
<Corridor variant="..." above />
<Gallery />
<Corridor variant="..." below />
```

Or better: Create a `<Corridor>` component that sits between galleries as a standalone section.

### 5. Visual Language
- Warm browns, golds, creams (matching existing palette)
- Darker than galleries (corridors are transition spaces)
- Pinspot lighting effect on corridor details
- Scroll-triggered reveal animations
- Subtle parallax on wall details
- Ambient dust (lighter count than main canvas)
- Occasional bird appearances
- Hidden notes in corridors (clickable)
