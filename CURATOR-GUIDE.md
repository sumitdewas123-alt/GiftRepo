# Curator Mode — The Museum of Chicko

A hidden editing layer built into the museum. It lets you personalize every gallery **without touching a single TypeScript file**. Visitors will never know it exists.

---

## 1. How to Enter Curator Mode

There are three secret entrances. Use whichever you prefer:

| Method | How |
| --- | --- |
| **Secret key combination** | Press `Ctrl + Shift + C` anywhere in the museum |
| **Hidden route** | Visit `yoursite.com/curator` |
| **Query parameter** | Add `?curator=true` to any museum URL |

To leave, click **✕ Exit** in the curator header (or press `Ctrl + Shift + C` again). The museum instantly looks untouched. Curator Mode is **never remembered between visits** — a visitor who opens the site normally will always see the plain museum.

## 2. Where the Content Lives

All editable content lives in JSON — no code involved:

- **`client/src/lib/museum.json`** — the default museum content, bundled with the app. This is the "factory copy."
- **Browser storage (`moc-museum-data`)** — your live working copy. Every edit you save is written here, and the whole museum reads from it at runtime.
- **`client/src/lib/museumDataLoader.ts`** — the loader that merges the two (your saved edits win). You never need to open this file.

The old `museumData.ts` is now just a thin bridge that re-exports the JSON-backed data, so every gallery, the archive search, the entrance letter and the finale all read from the same single source.

### Making edits permanent in the repository

Browser storage is per-device. To bake your customized museum into the deployed site for everyone:

1. In Curator Mode, click **📤 Export** to download `museum-backup-YYYY-MM-DD.json`.
2. Replace the contents of `client/src/lib/museum.json` with that file.
3. Commit and redeploy. Done — still zero TypeScript edited.

## 3. What You Can Edit

Each gallery has its own tab in the curator header:

| Tab | Editable content |
| --- | --- |
| G1 The Girl I Met | Timeline entries (year, title, description, image, drag to reorder, add/delete), memory cards, portrait image, drawer note |
| G2 Person You Became | Walls, mirror text, observations & portraits with captions |
| G3 Things You Never Notice | Observation frames (10 + bonus frame) |
| G4 Evidence Room | Evidence sections, captions, context notes, photos, laugh-counter stats |
| G5 Library of Us | Books, spines, quotes, cover images, margin annotations |
| G6 Sound Room | Cassettes, songs, Spotify links, why-it-matters notes |
| G7 Little Things | Cabinet contents, explanations, random drawer notes |
| G8 Thank You | All 99 gratitude notes |
| G9 Map of Memories | Map pins (place, date, memory, image, position) |
| G10 Constellation | Star memories (name, memory, position) |
| G11 Letters | All 12 sealed letters with rich text bodies, hidden letter, gallery password |
| G12 Future Wing | Future exhibit labels |
| G13 Ending & Finale | Ending text, corridor frames, epilogue lines, post-credits letter, credits |
| 🏛 Museum Meta | Welcome text, entrance letter, featured memory, guestbook prompts |

## 4. Images

Every image slot supports **Upload**, **Replace**, **Remove**, and an **instant preview** thumbnail. Uploaded images are automatically resized (max 1200 px) and stored inside the museum JSON as data URLs, so they travel with your backups — no separate asset folder to manage, and references update automatically everywhere the image appears.

## 5. Rich Text (Letters & Notes)

Letters and long notes use a rich text editor supporting **bold**, *italic*, paragraphs, line breaks (Shift+Enter), quote blocks, and bulleted/numbered lists. Formatting is preserved in the museum exactly as you write it.

## 6. Timeline Editor

In Gallery 1 you can drag entries to reorder them, add a new event, delete an event, change years/titles/descriptions, and attach an image per year. The public timeline updates instantly.

## 7. Live Preview

Every edit updates the museum in real time behind the editor. Use the **👁 Preview Museum** button (bottom-right) to open the public museum in a new tab and walk through it as a visitor would.

## 8. Safety Net

| Feature | Details |
| --- | --- |
| **Undo / Redo** | Toolbar buttons, or `Ctrl+Z` / `Ctrl+Y` (up to 50 steps) |
| **Save** | 💾 button or `Ctrl+S` |
| **Reset** | Restores the factory museum.json — a backup is automatically downloaded first |
| **Export Museum** | Downloads a dated JSON backup of everything, including images |
| **Import Museum** | Paste JSON or choose a backup file to restore |

## 9. Guarantees

- The public museum design, animations, corridors, easter eggs, and navigation are 100% unchanged.
- Visitors can never trigger or see Curator Mode; it activates only via the three explicit secret entrances and is never persisted.
- The museum and the curator interface read and write the exact same data source, so what you edit is exactly what visitors see.

*You are no longer editing code. You are curating an exhibition.*
