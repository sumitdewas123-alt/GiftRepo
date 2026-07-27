# Phase 2 Environmental Detail Map

## Approach
Create a `RoomEnvironment` component that layers ambient details on top of RoomSection.
Each gallery gets a unique environmental profile based on its theme.

## Gallery Environment Assignments

| Gallery | Theme | Environment Details |
|---|---|---|
| G1: Timeline | Old school archive/study | Grandfather clock, desk lamp, stacked books, old window with curtain, chalkboard corner |
| G2: Became | Brighter room, mirrors | Sunlight rays, glass reflections, wooden shelves, reading lamp, small plant |
| G3: Observations | Photo gallery, frames | Museum display cases, spotlight beams, velvet rope, glass reflections |
| G4: Library | Library, books, chairs | Bookshelves, stacked books, reading lamps, fireplace, stone walls, wood ceiling |
| G5: Sound | Cassette wall, audio | Hanging lights, acoustic panels, microphone stand, cassette display, warm glow |
| G6: Thank You | Sacred, quiet, notes | Candles, old window, hanging dried flowers, stone bench, gentle light |
| G7: Little Things | Cabinets, drawers | Wooden shelves, old keys, museum boxes, reading lamp, small plants |
| G8: Photos | Polaroids on strings | Window light, hanging photos, curtain, museum bench, warm glow |
| G9: Map | Explorer aesthetic | Old globe, compass, maps on wall, wooden table, hanging lamp |
| G10: Compliments | Warm notes | Fireplace, candles, wooden bench, old paintings, warm light |
| G11: Constellation | Stars, night sky | Dark room, star projections, telescope silhouette, ceiling lights |
| G12: Hidden | Letters, dark wood | Old desk, rain window, wax seals, quill, fireplace glow |
| G13: Future | White, bright, wind | Minimal — large windows, wind curtain movement, white walls, single plant |
| FinalRoom | Quiet, garden | Window, bench, plants, garden view, single light |

## Implementation Strategy
1. Create RoomEnvironment component with all ambient elements
2. Modify RoomSection to accept environment props
3. Each gallery passes its environment config to RoomSection
4. All elements are CSS-only, zero external assets, no layout changes
