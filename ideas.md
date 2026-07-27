# The Museum of Chicko — Design Brainstorm

## Three Stylistic Approaches

### 1. The Gilded Archive
A candlelit, old-world museum: deep walnut wood, brass plaques, parchment labels, and gold pin-spot lighting on every frame. Feels like walking through a private collection at dusk.
**Probability:** 0.07

### 2. Paper Lantern Minimal
A bright, airy Japanese-paper aesthetic — washi textures, ink-brush accents, generous whitespace, muted sage and cream. Feels like a quiet gallery on a rainy morning.
**Probability:** 0.03

### 3. The Velvet Nocturne
A dark, theatrical museum-at-midnight with velvet navy walls, moonlight beams, and glowing exhibit cases. Feels like a secret after-hours visit.
**Probability:** 0.02

---

## CHOSEN: The Gilded Archive

**Design Movement:** Romantic Museology — the intersection of 19th-century cabinet-of-curiosities interiors, Studio Ghibli warmth, and modern editorial web design (Apple-smooth motion, Notion restraint).

### Core Principles
1. **Light is the narrator.** Warm pin-spot gradients, vignettes, and glow define hierarchy — not borders or boxes.
2. **Everything is an artifact.** Every content block is presented as a museum object: framed, labeled with a brass/parchment plaque, and given breathing room.
3. **Slow reverence, fast response.** Ambient/scene animations are slow and cinematic (1–3s fades); UI interactions stay snappy (<300ms).
4. **Paper and wood, never plastic.** Textures (paper grain, wood, subtle noise) on every surface; no flat, sterile panels.

### Color Philosophy
The palette is candlelight on old paper. Base tones are warm creams (#F5EFE3) and parchment (#EFE6D4) for "day," and deep espresso/walnut (#211A12, #2C2318) for "night" and the entrance hallway. Gold (#C9A45C) is the single accent — used as light, not decoration: pin-spots, frame edges, plaque borders. Muted forest green and oxblood appear sparingly in gallery accents (library, evidence room). The emotional intent: warmth, permanence, being held.

### Layout Paradigm
**A promenade, not a grid.** The site is one continuous vertical walk (single-page scroll with room-by-room sections plus an entrance overlay sequence). Rooms alternate wall tones and asymmetric compositions: exhibits hang off-center, labels sit beside artifacts like real museum placards, timelines run down one wall. A slim fixed "museum directory" rail (desktop) / drawer (mobile) allows jumping between rooms.

### Signature Elements
1. **The Brass Plaque** — every room and exhibit gets a small engraved-style label (serif small-caps, thin gold border, paper texture).
2. **Pin-spot light cones** — radial warm gradients above frames and titles, dimming with day/night mode.
3. **Hanging polaroids & taped paper** — photos hang from strings or are taped with washi tape, slightly rotated, casting soft shadows.

### Interaction Philosophy
Interactions feel like touching real objects: frames tilt subtly on hover, books slide off shelves, drawers open. Nothing bounces or flashes. Clicks reward with quiet detail — a note unfolding, a light warming. The guide bird appears gently in corners.

### Animation
- Room titles fade in over 1.2s with slight upward drift when the room scrolls into view.
- Entrance sequence: black → ambient hum → lights "switch on" via expanding radial gradients (2.5s) → doors open.
- Hover: frames scale 1.02 + shadow deepen, 200ms ease-out.
- Ambient layers (dust, leaves, rain) are canvas-based, low particle counts, respect prefers-reduced-motion.
- Page transitions between overlay states: 600ms cross-fade.

### Typography System
- **Display:** "Cormorant Garamond" (600/700) — museum titles, room names, letters.
- **Labels/small-caps:** "Cormorant Garamond" with letter-spacing for plaques.
- **Body:** "EB Garamond" (400/500) for narrative text.
- **Handwritten:** "Caveat" for sticky notes, polaroid captions, letters.
- Hierarchy: enormous room titles (clamp 3–6rem), small-caps plaque labels (0.75rem, tracked +0.2em), comfortable 1.125rem body.

### Brand Essence
A hand-built museum of one friendship — for one visitor only — because the most ordinary moments deserve curation. Personality: tender, wry, timeless.

### Brand Voice
Quiet, sincere, with a smile hiding in the corner. Headlines read like exhibit placards; microcopy like margin notes.
- Example: "Exhibit 7-C: The Chai Incident of a Tuesday."
- Example: "Please do not touch the memories. (Touching encouraged.)"

### Wordmark & Logo
Wordmark: "THE MUSEUM OF CHICKO" in tracked small-caps Cormorant, stacked, with a thin double-rule above and below like an engraved plaque. Mark: a minimal gold line-art bird perched on a picture frame (the guide bird doubles as the logo), on transparent background.

### Signature Brand Color
**Candle Gold — #C9A45C** (oklch ≈ 0.73 0.09 80). Used exclusively for light, accents, and the wordmark rule lines.
