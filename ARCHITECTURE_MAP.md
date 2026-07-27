# Museum of Chicko — Architecture Map

## Current Layout (Home.tsx rendering order)
1. Entrance (full-screen dialog → enters museum)
2. Welcome landing strip (60vh section with title)
3. FeaturedMemory
4. Gallery1Timeline (tone: parchment)
5. Gallery2Observations
6. Gallery2Became (wait - is this same as Observations?)
7. Gallery3Evidence
8. Gallery4Library
9. Gallery5Sound
10. Gallery6ThankYou
11. Gallery7LittleThings
12. Gallery8Photos
13. Gallery9Map
14. Gallery10Compliments
15. Gallery11Constellation
16. Gallery12Hidden
17. Gallery13Future
18. FinalRoom
19. Guestbook
20. MuseumFooter

## Overlay components (always visible)
- AmbientEffects (canvas: dust, leaves, rain)
- EasterEggs
- ControlDock
- ArchiveSearch
- AchievementsPanel
- GuideBird

## RoomSection pattern
Each gallery wraps content in RoomSection which:
- Provides IntersectionObserver for visit tracking
- Has tone variants: cream, parchment, walnut, night
- Supports bgImage overlays
- Has plaque + room-title + subtitle header
- Fades in on scroll

## Gallery IDs (for ROOM_IDS in context)
intro-hall, gallery-1 through gallery-13, final-room

## Transition Points (14 total gaps to fill)
Between: FeaturedMemory → Gallery1
Between: Gallery1 → Gallery2
Between: Gallery2 → Gallery3
Between: Gallery3 → Gallery4
Between: Gallery4 → Gallery5
Between: Gallery5 → Gallery6
Between: Gallery6 → Gallery7
Between: Gallery7 → Gallery8
Between: Gallery8 → Gallery9
Between: Gallery9 → Gallery10
Between: Gallery10 → Gallery11
Between: Gallery11 → Gallery12
Between: Gallery12 → Gallery13
Between: Gallery13 → FinalRoom
Between: FinalRoom → Guestbook
