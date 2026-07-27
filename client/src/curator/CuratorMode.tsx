/**
 * Curator Mode — Full editing interface for all 13 galleries.
 * Accessible via: Ctrl+Shift+C, /curator route, or ?curator=true
 * Preserves all existing animations, navigation, and design.
 */
import { useState, useCallback, useRef, useEffect } from "react";
import { useCurator } from "./CuratorContext";
import { useImageUpload } from "./useImageUpload";
import RichTextEditor from "./RichTextEditor";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { MuseumData, TimelineEntry, MemoryCardSmall, WallItem, Observation, Evidence, Book, Cassette, Song, Cabinet, Polaroid, MapPin, Star, Letter, FutureLabel } from "@/lib/museumDataLoader";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

// Gallery tab definitions
const GALLERY_TABS = [
  { id: 1, name: "G1: The Girl I Met" },
  { id: 2, name: "G2: Person You Became" },
  { id: 3, name: "G3: Things You Never Notice" },
  { id: 4, name: "G4: Evidence Room" },
  { id: 5, name: "G5: Library of Us" },
  { id: 6, name: "G6: Sound Room" },
  { id: 7, name: "G7: Little Things" },
  { id: 8, name: "G8: Thank You" },
  { id: 9, name: "G9: Map of Memories" },
  { id: 10, name: "G10: Constellation" },
  { id: 11, name: "G11: Letters" },
  { id: 12, name: "G12: Future Wing" },
  { id: 13, name: "G13: Ending & Finale" },
  { id: 0, name: "🏛 Museum Meta" },
];

function ImageUploader({ initialImage, onImageChange, label }: { initialImage: string | null; onImageChange: (img: string | null) => void; label: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(initialImage);

  useEffect(() => { setPreview(initialImage); }, [initialImage]);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const raw = e.target?.result as string;
      // Resize large images to keep the museum JSON light (max 1200px, JPEG q0.85)
      const img = new Image();
      img.onload = () => {
        const MAX = 1200;
        if (img.width <= MAX && img.height <= MAX && raw.length < 700_000) {
          setPreview(raw);
          onImageChange(raw);
          return;
        }
        const scale = Math.min(MAX / img.width, MAX / img.height, 1);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) { setPreview(raw); onImageChange(raw); return; }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const keepPng = file.type === "image/png" && raw.length < 500_000;
        const result = keepPng ? canvas.toDataURL("image/png") : canvas.toDataURL("image/jpeg", 0.85);
        setPreview(result);
        onImageChange(result);
      };
      img.onerror = () => { setPreview(raw); onImageChange(raw); };
      img.src = raw;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-gray-600">{label}</label>
      <div className="flex items-center gap-3">
        {preview && (
          <img src={preview} alt={label} className="w-16 h-16 object-cover rounded border border-gray-300" />
        )}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="px-3 py-1 text-xs bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded transition-colors"
          >
            {preview ? "Replace" : "Upload"}
          </button>
          {preview && (
            <button
              type="button"
              onClick={() => { setPreview(null); onImageChange(null); }}
              className="px-3 py-1 text-xs bg-red-50 hover:bg-red-100 border border-red-300 rounded transition-colors"
            >
              Remove
            </button>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
        />
      </div>
    </div>
  );
}

function EditableField({ label, value, onChange, type = "text", multiline = false, placeholder, rows = 3 }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; multiline?: boolean; placeholder?: string; rows?: number;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-gray-600">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 resize-y"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
      )}
    </div>
  );
}

function KeywordsEditor({ keywords, onChange }: { keywords: string[]; onChange: (kws: string[]) => void }) {
  const [text, setText] = useState(keywords.join(", "));
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-gray-600">Keywords</label>
      <input
        type="text"
        value={text}
        onChange={(e) => { setText(e.target.value); onChange(e.target.value.split(",").map((s) => s.trim()).filter(Boolean)); }}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
        placeholder="keyword1, keyword2, keyword3"
      />
    </div>
  );
}

function SectionHeader({ title, onReset, actionButtons }: { title: string; onReset?: () => void; actionButtons?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4 pb-2 border-b border-amber-200">
      <h3 className="text-lg font-semibold text-amber-900">{title}</h3>
      <div className="flex gap-2 items-center">
        {actionButtons}
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="px-2 py-1 text-xs bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}

// ============ GALLERY EDITORS ============

function Gallery1Editor() {
  const { data, setData, save } = useCurator();
  const g1 = data.gallery1;

  const updateTimeline = (timeline: TimelineEntry[]) => {
    setData((prev) => ({ ...prev, gallery1: { ...prev.gallery1, timeline } }));
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(g1.timeline);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    updateTimeline(items);
  };

  const addTimelineEntry = () => {
    const newEntry: TimelineEntry = { year: "", title: "", text: "", keywords: [], image: null };
    updateTimeline([...g1.timeline, newEntry]);
  };

  const removeTimelineEntry = (idx: number) => {
    updateTimeline(g1.timeline.filter((_, i) => i !== idx));
  };

  const updateMemoryCard = (idx: number, field: keyof MemoryCardSmall, value: string | string[]) => {
    const cards = [...g1.memoryCards];
    cards[idx] = { ...cards[idx], [field]: value };
    setData((prev) => ({ ...prev, gallery1: { ...prev.gallery1, memoryCards: cards } }));
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Gallery 1: The Girl I Met — Timeline & Memory Cards" />
      
      {/* Timeline Editor with Drag & Drop */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700 flex items-center justify-between">
          <span>Timeline Entries (drag to reorder)</span>
          <button type="button" onClick={addTimelineEntry} className="px-3 py-1 text-xs bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded">
            + Add Event
          </button>
        </h4>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="timeline">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-3">
                {g1.timeline.map((entry, idx) => (
                  <Draggable key={`tl-${idx}`} draggableId={`tl-${idx}`} index={idx}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`p-4 bg-white rounded-lg border shadow-sm transition-all ${snapshot.isDragging ? "shadow-lg border-amber-400" : "border-gray-200"}`}
                      >
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <EditableField label="Year" value={entry.year} onChange={(v) => {
                            const items = [...g1.timeline];
                            items[idx] = { ...items[idx], year: v };
                            updateTimeline(items);
                          }} />
                          <EditableField label="Title" value={entry.title} onChange={(v) => {
                            const items = [...g1.timeline];
                            items[idx] = { ...items[idx], title: v };
                            updateTimeline(items);
                          }} />
                        </div>
                        <EditableField label="Description" value={entry.text} onChange={(v) => {
                          const items = [...g1.timeline];
                          items[idx] = { ...items[idx], text: v };
                          updateTimeline(items);
                        }} multiline />
                        <KeywordsEditor keywords={entry.keywords} onChange={(kws) => {
                          const items = [...g1.timeline];
                          items[idx] = { ...items[idx], keywords: kws };
                          updateTimeline(items);
                        }} />
                        <ImageUploader initialImage={entry.image} onImageChange={(img) => {
                          const items = [...g1.timeline];
                          items[idx] = { ...items[idx], image: img };
                          updateTimeline(items);
                        }} label="Timeline Image" />
                        <div className="flex justify-end mt-2">
                          <button
                            type="button"
                            onClick={() => removeTimelineEntry(idx)}
                            className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {/* Memory Cards */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700">Memory Cards</h4>
        {g1.memoryCards.map((card, idx) => (
          <div key={card.no} className="p-3 bg-white rounded-lg border border-gray-200 space-y-2">
            <EditableField label="Card Label" value={card.no} onChange={(v) => updateMemoryCard(idx, "no", v)} />
            <EditableField label="Text" value={card.text} onChange={(v) => updateMemoryCard(idx, "text", v)} multiline />
            <KeywordsEditor keywords={card.keywords} onChange={(kws) => updateMemoryCard(idx, "keywords", kws)} />
          </div>
        ))}
      </div>

      {/* Portrait Image */}
      <div className="p-3 bg-white rounded-lg border border-gray-200">
        <ImageUploader initialImage={g1.portraitImage} onImageChange={(img) => {
          setData((prev) => ({ ...prev, gallery1: { ...prev.gallery1, portraitImage: img } }));
        }} label="Gallery Portrait" />
      </div>

      {/* Drawer Note */}
      <div className="p-3 bg-white rounded-lg border border-gray-200">
        <EditableField label="Drawer Note" value={g1.drawerNote} onChange={(v) => {
          setData((prev) => ({ ...prev, gallery1: { ...prev.gallery1, drawerNote: v } }));
        }} multiline />
      </div>
    </div>
  );
}

function Gallery2Editor() {
  const { data, setData } = useCurator();
  const g2 = data.gallery2;

  const updateWalls = (walls: WallItem[]) => {
    setData((prev) => ({ ...prev, gallery2: { ...prev.gallery2, walls } }));
  };

  const updateObservations = (obs: Observation[]) => {
    setData((prev) => ({ ...prev, gallery2: { ...prev.gallery2, observations: obs } }));
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Gallery 2: The Person You Became — Walls, Mirror, Observations" />
      
      {/* Walls */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-gray-700">Walls</h4>
        {g2.walls.map((wall, idx) => (
          <div key={wall.id} className="p-4 bg-white rounded-lg border border-gray-200 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <EditableField label="ID" value={wall.id} onChange={(v) => {
                const w = [...g2.walls]; w[idx] = { ...w[idx], id: v }; updateWalls(w);
              }} />
              <EditableField label="Title" value={wall.title} onChange={(v) => {
                const w = [...g2.walls]; w[idx] = { ...w[idx], title: v }; updateWalls(w);
              }} />
            </div>
            <EditableField label="Subtitle" value={wall.subtitle} onChange={(v) => {
              const w = [...g2.walls]; w[idx] = { ...w[idx], subtitle: v }; updateWalls(w);
            }} />
            <EditableField label="Lines (one per line)" value={wall.lines.join("\n")} onChange={(v) => {
              const w = [...g2.walls]; w[idx] = { ...w[idx], lines: v.split("\n") }; updateWalls(w);
            }} multiline rows={5} />
            {wall.closing && (
              <EditableField label="Closing" value={wall.closing} onChange={(v) => {
                const w = [...g2.walls]; w[idx] = { ...w[idx], closing: v }; updateWalls(w);
              }} />
            )}
            <KeywordsEditor keywords={wall.keywords} onChange={(kws) => {
              const w = [...g2.walls]; w[idx] = { ...w[idx], keywords: kws }; updateWalls(w);
            }} />
          </div>
        ))}
      </div>

      {/* Mirror Lines */}
      <div className="p-4 bg-white rounded-lg border border-gray-200 space-y-3">
        <h4 className="text-sm font-semibold text-gray-700">Mirror Lines</h4>
        <EditableField
          label="Mirror Lines (one per line)"
          value={g2.mirrorLines.join("\n")}
          onChange={(v) => {
            setData((prev) => ({ ...prev, gallery2: { ...prev.gallery2, mirrorLines: v.split("\n").filter(Boolean) } }));
          }}
          multiline
          rows={8}
        />
      </div>

      {/* Observations */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700">Observations & Frames</h4>
        {g2.observations.map((obs, idx) => (
          <div key={obs.id} className="p-3 bg-white rounded-lg border border-gray-200 space-y-2">
            <div className="grid grid-cols-2 gap-3">
              <EditableField label="Frame" value={obs.frame} onChange={(v) => {
                const o = [...g2.observations]; o[idx] = { ...o[idx], frame: v }; updateObservations(o);
              }} />
              <EditableField label="ID" value={obs.id} onChange={(v) => {
                const o = [...g2.observations]; o[idx] = { ...o[idx], id: v }; updateObservations(o);
              }} />
            </div>
            <EditableField label="Observation Text" value={obs.text} onChange={(v) => {
              const o = [...g2.observations]; o[idx] = { ...o[idx], text: v }; updateObservations(o);
            }} multiline />
            <KeywordsEditor keywords={obs.keywords} onChange={(kws) => {
              const o = [...g2.observations]; o[idx] = { ...o[idx], keywords: kws }; updateObservations(o);
            }} />
          </div>
        ))}
      </div>

      {/* Secret Observation */}
      <div className="p-4 bg-white rounded-lg border border-gray-200 space-y-3">
        <h4 className="text-sm font-semibold text-gray-700">Secret Observation</h4>
        <EditableField label="Title" value={g2.secretObservation.title} onChange={(v) => {
          setData((prev) => ({ ...prev, gallery2: { ...prev.gallery2, secretObservation: { ...prev.gallery2.secretObservation, title: v } } }));
        }} />
        <EditableField label="Text" value={g2.secretObservation.text} onChange={(v) => {
          setData((prev) => ({ ...prev, gallery2: { ...prev.gallery2, secretObservation: { ...prev.gallery2.secretObservation, text: v } } }));
        }} multiline />
      </div>
    </div>
  );
}

function Gallery3Editor() {
  const { data, setData } = useCurator();
  const g3 = data.gallery3;

  return (
    <div className="space-y-6">
      <SectionHeader title="Gallery 3: The Evidence Room — Sections, Screenshots, Notes, Photos" />
      
      {/* Evidence Items */}
      {g3.evidence.map((ev, idx) => (
        <div key={ev.id} className="p-4 bg-white rounded-lg border border-gray-200 space-y-3">
          <h4 className="text-sm font-semibold text-gray-700">{ev.title}</h4>
          <div className="grid grid-cols-2 gap-3">
            <EditableField label="Section" value={ev.section} onChange={(v) => {
              const items = [...g3.evidence]; items[idx] = { ...items[idx], section: v };
              setData((prev) => ({ ...prev, gallery3: { ...prev.gallery3, evidence: items } }));
            }} />
            <EditableField label="Type" value={ev.type} onChange={(v) => {
              const items = [...g3.evidence]; items[idx] = { ...items[idx], type: v as any };
              setData((prev) => ({ ...prev, gallery3: { ...prev.gallery3, evidence: items } }));
            }} />
          </div>
          <EditableField label="Title" value={ev.title} onChange={(v) => {
            const items = [...g3.evidence]; items[idx] = { ...items[idx], title: v };
            setData((prev) => ({ ...prev, gallery3: { ...prev.gallery3, evidence: items } }));
          }} />
          <EditableField label="Caption" value={ev.caption} onChange={(v) => {
            const items = [...g3.evidence]; items[idx] = { ...items[idx], caption: v };
            setData((prev) => ({ ...prev, gallery3: { ...prev.gallery3, evidence: items } }));
          }} />
          <EditableField label="Context/Notes" value={ev.context} onChange={(v) => {
            const items = [...g3.evidence]; items[idx] = { ...items[idx], context: v };
            setData((prev) => ({ ...prev, gallery3: { ...prev.gallery3, evidence: items } }));
          }} multiline />
          <div className="grid grid-cols-3 gap-3">
            <EditableField label="Pin Top" value={ev.pin.top} onChange={(v) => {
              const items = [...g3.evidence]; items[idx] = { ...items[idx], pin: { ...items[idx].pin, top: v } };
              setData((prev) => ({ ...prev, gallery3: { ...prev.gallery3, evidence: items } }));
            }} />
            <EditableField label="Pin Left" value={ev.pin.left} onChange={(v) => {
              const items = [...g3.evidence]; items[idx] = { ...items[idx], pin: { ...items[idx].pin, left: v } };
              setData((prev) => ({ ...prev, gallery3: { ...prev.gallery3, evidence: items } }));
            }} />
            <EditableField label="Pin Rotate" value={String(ev.pin.rotate)} onChange={(v) => {
              const items = [...g3.evidence]; items[idx] = { ...items[idx], pin: { ...items[idx].pin, rotate: parseFloat(v) } };
              setData((prev) => ({ ...prev, gallery3: { ...prev.gallery3, evidence: items } }));
            }} />
          </div>
          <KeywordsEditor keywords={ev.keywords} onChange={(kws) => {
            const items = [...g3.evidence]; items[idx] = { ...items[idx], keywords: kws };
            setData((prev) => ({ ...prev, gallery3: { ...prev.gallery3, evidence: items } }));
          }} />
          <ImageUploader initialImage={ev.image} onImageChange={(img) => {
            const items = [...g3.evidence]; items[idx] = { ...items[idx], image: img };
            setData((prev) => ({ ...prev, gallery3: { ...prev.gallery3, evidence: items } }));
          }} label="Evidence Photo/Screenshot" />
        </div>
      ))}

      {/* Laugh Counter */}
      <div className="p-4 bg-white rounded-lg border border-gray-200 space-y-3">
        <h4 className="text-sm font-semibold text-gray-700">Laugh Counter Stats</h4>
        {g3.laughCounter.map((item, idx) => (
          <div key={idx} className="grid grid-cols-2 gap-3">
            <EditableField label="Label" value={item.label} onChange={(v) => {
              const items = [...g3.laughCounter]; items[idx] = { ...items[idx], label: v };
              setData((prev) => ({ ...prev, gallery3: { ...prev.gallery3, laughCounter: items } }));
            }} />
            <EditableField label="Value" value={item.value} onChange={(v) => {
              const items = [...g3.laughCounter]; items[idx] = { ...items[idx], value: v };
              setData((prev) => ({ ...prev, gallery3: { ...prev.gallery3, laughCounter: items } }));
            }} />
          </div>
        ))}
      </div>

      {/* Glass Case */}
      <div className="p-4 bg-white rounded-lg border border-gray-200 space-y-3">
        <h4 className="text-sm font-semibold text-gray-700">Glass Case Text</h4>
        <EditableField label="Title" value={g3.glassCaseText} onChange={(v) => {
          setData((prev) => ({ ...prev, gallery3: { ...prev.gallery3, glassCaseText: v } }));
        }} />
        <EditableField label="Description" value={g3.glassCaseDescription} onChange={(v) => {
          setData((prev) => ({ ...prev, gallery3: { ...prev.gallery3, glassCaseDescription: v } }));
        }} multiline />
      </div>
    </div>
  );
}

function Gallery4Editor() {
  const { data, setData } = useCurator();
  const g4 = data.gallery4;

  return (
    <div className="space-y-6">
      <SectionHeader title="Gallery 4: The Library of Us — Books, Quotes, Annotations" />
      
      {/* Books */}
      {g4.books.map((book, idx) => (
        <div key={book.id} className="p-4 bg-white rounded-lg border border-gray-200 space-y-3">
          <h4 className="text-sm font-semibold text-gray-700">{book.title}</h4>
          <div className="grid grid-cols-2 gap-3">
            <EditableField label="Title" value={book.title} onChange={(v) => {
              const items = [...g4.books]; items[idx] = { ...items[idx], title: v };
              setData((prev) => ({ ...prev, gallery4: { ...prev.gallery4, books: items } }));
            }} />
            <EditableField label="By" value={book.by} onChange={(v) => {
              const items = [...g4.books]; items[idx] = { ...items[idx], by: v };
              setData((prev) => ({ ...prev, gallery4: { ...prev.gallery4, books: items } }));
            }} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <EditableField label="Color" value={book.color} onChange={(v) => {
              const items = [...g4.books]; items[idx] = { ...items[idx], color: v };
              setData((prev) => ({ ...prev, gallery4: { ...prev.gallery4, books: items } }));
            }} type="color" />
            <EditableField label="Quote" value={book.quote} onChange={(v) => {
              const items = [...g4.books]; items[idx] = { ...items[idx], quote: v };
              setData((prev) => ({ ...prev, gallery4: { ...prev.gallery4, books: items } }));
            }} />
          </div>
          <EditableField label="Note/Annotation" value={book.note} onChange={(v) => {
            const items = [...g4.books]; items[idx] = { ...items[idx], note: v };
            setData((prev) => ({ ...prev, gallery4: { ...prev.gallery4, books: items } }));
          }} multiline />
          <KeywordsEditor keywords={book.keywords} onChange={(kws) => {
            const items = [...g4.books]; items[idx] = { ...items[idx], keywords: kws };
            setData((prev) => ({ ...prev, gallery4: { ...prev.gallery4, books: items } }));
          }} />
          <ImageUploader initialImage={book.coverImage} onImageChange={(img) => {
            const items = [...g4.books]; items[idx] = { ...items[idx], coverImage: img };
            setData((prev) => ({ ...prev, gallery4: { ...prev.gallery4, books: items } }));
          }} label="Book Cover Image" />
        </div>
      ))}

      {/* Quote Wall */}
      <div className="p-4 bg-white rounded-lg border border-gray-200 space-y-3">
        <h4 className="text-sm font-semibold text-gray-700">Quote Wall</h4>
        {g4.quoteWall.map((item, idx) => (
          <div key={idx} className="space-y-2">
            <EditableField label="Quote" value={item.quote} onChange={(v) => {
              const items = [...g4.quoteWall]; items[idx] = { ...items[idx], quote: v };
              setData((prev) => ({ ...prev, gallery4: { ...prev.gallery4, quoteWall: items } }));
            }} multiline />
            <EditableField label="Why" value={item.why} onChange={(v) => {
              const items = [...g4.quoteWall]; items[idx] = { ...items[idx], why: v };
              setData((prev) => ({ ...prev, gallery4: { ...prev.gallery4, quoteWall: items } }));
            }} />
          </div>
        ))}
      </div>

      {/* Hidden Note */}
      <div className="p-4 bg-white rounded-lg border border-gray-200 space-y-3">
        <h4 className="text-sm font-semibold text-gray-700">Library Notes</h4>
        <EditableField label="Hidden Note" value={g4.hiddenNote} onChange={(v) => {
          setData((prev) => ({ ...prev, gallery4: { ...prev.gallery4, hiddenNote: v } }));
        }} multiline />
        <EditableField label="Reserved Chair Text" value={g4.reservedChairText} onChange={(v) => {
          setData((prev) => ({ ...prev, gallery4: { ...prev.gallery4, reservedChairText: v } }));
        }} multiline />
        <EditableField label="Hidden Compartment Note" value={g4.hiddenCompartmentNote} onChange={(v) => {
          setData((prev) => ({ ...prev, gallery4: { ...prev.gallery4, hiddenCompartmentNote: v } }));
        }} multiline />
      </div>
    </div>
  );
}

function Gallery5Editor() {
  const { data, setData } = useCurator();
  const g5 = data.gallery5;

  return (
    <div className="space-y-6">
      <SectionHeader title="Gallery 5: The Sound Room — Cassettes, Songs, Spotify Links" />
      
      {/* Cassettes */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700">Cassettes</h4>
        {g5.cassettes.map((cassette, idx) => (
          <div key={cassette.id} className="p-4 bg-white rounded-lg border border-gray-200 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <EditableField label="Label" value={cassette.label} onChange={(v) => {
                const items = [...g5.cassettes]; items[idx] = { ...items[idx], label: v };
                setData((prev) => ({ ...prev, gallery5: { ...prev.gallery5, cassettes: items } }));
              }} />
              <EditableField label="ID" value={cassette.id} onChange={(v) => {
                const items = [...g5.cassettes]; items[idx] = { ...items[idx], id: v };
                setData((prev) => ({ ...prev, gallery5: { ...prev.gallery5, cassettes: items } }));
              }} />
            </div>
            <EditableField label="Why" value={cassette.why} onChange={(v) => {
              const items = [...g5.cassettes]; items[idx] = { ...items[idx], why: v };
              setData((prev) => ({ ...prev, gallery5: { ...prev.gallery5, cassettes: items } }));
            }} multiline />
            <KeywordsEditor keywords={cassette.keywords} onChange={(kws) => {
              const items = [...g5.cassettes]; items[idx] = { ...items[idx], keywords: kws };
              setData((prev) => ({ ...prev, gallery5: { ...prev.gallery5, cassettes: items } }));
            }} />
          </div>
        ))}
      </div>

      {/* Songs */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700">Songs</h4>
        {g5.songs.map((song, idx) => (
          <div key={song.id} className="p-4 bg-white rounded-lg border border-gray-200 space-y-3">
            <EditableField label="Title" value={song.title} onChange={(v) => {
              const items = [...g5.songs]; items[idx] = { ...items[idx], title: v };
              setData((prev) => ({ ...prev, gallery5: { ...prev.gallery5, songs: items } }));
            }} />
            <div className="grid grid-cols-2 gap-3">
              <EditableField label="Vibe" value={song.vibe} onChange={(v) => {
                const items = [...g5.songs]; items[idx] = { ...items[idx], vibe: v };
                setData((prev) => ({ ...prev, gallery5: { ...prev.gallery5, songs: items } }));
              }} />
              <EditableField label="Spotify Link" value={song.spotifyLink || ""} onChange={(v) => {
                const items = [...g5.songs]; items[idx] = { ...items[idx], spotifyLink: v || null };
                setData((prev) => ({ ...prev, gallery5: { ...prev.gallery5, songs: items } }));
              }} placeholder="https://open.spotify.com/..." />
            </div>
            <EditableField label="Why it reminds me of you" value={song.why} onChange={(v) => {
              const items = [...g5.songs]; items[idx] = { ...items[idx], why: v };
              setData((prev) => ({ ...prev, gallery5: { ...prev.gallery5, songs: items } }));
            }} multiline />
            <KeywordsEditor keywords={song.keywords} onChange={(kws) => {
              const items = [...g5.songs]; items[idx] = { ...items[idx], keywords: kws };
              setData((prev) => ({ ...prev, gallery5: { ...prev.gallery5, songs: items } }));
            }} />
          </div>
        ))}
      </div>

      {/* Labels */}
      <div className="p-4 bg-white rounded-lg border border-gray-200 space-y-3">
        <h4 className="text-sm font-semibold text-gray-700">Room Labels</h4>
        <EditableField label="Silence Booth Label" value={g5.silenceBoothLabel} onChange={(v) => {
          setData((prev) => ({ ...prev, gallery5: { ...prev.gallery5, silenceBoothLabel: v } }));
        }} multiline />
        <EditableField label="Laugh Exhibit Label" value={g5.laughExhibitLabel} onChange={(v) => {
          setData((prev) => ({ ...prev, gallery5: { ...prev.gallery5, laughExhibitLabel: v } }));
        }} multiline />
      </div>
    </div>
  );
}

function Gallery6Editor() {
  const { data, setData } = useCurator();
  const g6 = data.gallery6;

  return (
    <div className="space-y-6">
      <SectionHeader title="Gallery 6: Thank You Notes & Gratitude Envelope" />
      
      {/* Thank You Notes */}
      <div className="p-4 bg-white rounded-lg border border-gray-200 space-y-3">
        <h4 className="text-sm font-semibold text-gray-700">Thank You Notes ({g6.thankYouNotes.length} notes)</h4>
        <EditableField
          label="Notes (one per line)"
          value={g6.thankYouNotes.join("\n")}
          onChange={(v) => {
            setData((prev) => ({ ...prev, gallery6: { ...prev.gallery6, thankYouNotes: v.split("\n").filter(Boolean) } }));
          }}
          multiline
          rows={20}
        />
      </div>

      {/* Envelope Text */}
      <div className="p-4 bg-white rounded-lg border border-gray-200 space-y-3">
        <h4 className="text-sm font-semibold text-gray-700">Gratitude Envelope</h4>
        <EditableField
          label="Envelope Lines (one per line)"
          value={g6.envelopeText.join("\n")}
          onChange={(v) => {
            setData((prev) => ({ ...prev, gallery6: { ...prev.gallery6, envelopeText: v.split("\n").filter(Boolean) } }));
          }}
          multiline
          rows={6}
        />
      </div>
    </div>
  );
}

function Gallery7Editor() {
  const { data, setData } = useCurator();
  const g7 = data.gallery7;

  return (
    <div className="space-y-6">
      <SectionHeader title="Gallery 7: The Little Things Room — Cabinets & Notes" />
      
      {/* Cabinets */}
      {g7.cabinets.map((cab, idx) => (
        <div key={cab.id} className="p-4 bg-white rounded-lg border border-gray-200 space-y-3">
          <h4 className="text-sm font-semibold text-gray-700">{cab.label}</h4>
          <div className="grid grid-cols-2 gap-3">
            <EditableField label="Emoji" value={cab.emoji} onChange={(v) => {
              const items = [...g7.cabinets]; items[idx] = { ...items[idx], emoji: v };
              setData((prev) => ({ ...prev, gallery7: { ...prev.gallery7, cabinets: items } }));
            }} />
            <EditableField label="Label" value={cab.label} onChange={(v) => {
              const items = [...g7.cabinets]; items[idx] = { ...items[idx], label: v };
              setData((prev) => ({ ...prev, gallery7: { ...prev.gallery7, cabinets: items } }));
            }} />
          </div>
          <EditableField label="Contents" value={cab.contents} onChange={(v) => {
            const items = [...g7.cabinets]; items[idx] = { ...items[idx], contents: v };
            setData((prev) => ({ ...prev, gallery7: { ...prev.gallery7, cabinets: items } }));
          }} />
          <EditableField label="Explanation" value={cab.explanation} onChange={(v) => {
            const items = [...g7.cabinets]; items[idx] = { ...items[idx], explanation: v };
            setData((prev) => ({ ...prev, gallery7: { ...prev.gallery7, cabinets: items } }));
          }} multiline />
          {cab.extra && (
            <EditableField label="Extra Note" value={cab.extra} onChange={(v) => {
              const items = [...g7.cabinets]; items[idx] = { ...items[idx], extra: v };
              setData((prev) => ({ ...prev, gallery7: { ...prev.gallery7, cabinets: items } }));
            }} />
          )}
          <div className="flex items-center gap-3">
            <label className="text-xs font-medium text-gray-600 flex items-center gap-2">
              <input
                type="checkbox"
                checked={cab.locked || false}
                onChange={(e) => {
                  const items = [...g7.cabinets]; items[idx] = { ...items[idx], locked: e.target.checked };
                  setData((prev) => ({ ...prev, gallery7: { ...prev.gallery7, cabinets: items } }));
                }}
              />
              Locked
            </label>
          </div>
          <KeywordsEditor keywords={cab.keywords} onChange={(kws) => {
            const items = [...g7.cabinets]; items[idx] = { ...items[idx], keywords: kws };
            setData((prev) => ({ ...prev, gallery7: { ...prev.gallery7, cabinets: items } }));
          }} />
        </div>
      ))}

      {/* Drawer Notes */}
      <div className="p-4 bg-white rounded-lg border border-gray-200 space-y-3">
        <h4 className="text-sm font-semibold text-gray-700">Drawer Notes</h4>
        <EditableField
          label="Notes (one per line)"
          value={g7.drawerNotes.join("\n")}
          onChange={(v) => {
            setData((prev) => ({ ...prev, gallery7: { ...prev.gallery7, drawerNotes: v.split("\n").filter(Boolean) } }));
          }}
          multiline
          rows={8}
        />
      </div>
    </div>
  );
}

function Gallery8Editor() {
  const { data, setData } = useCurator();
  const g8 = data.gallery8;

  return (
    <div className="space-y-6">
      <SectionHeader title="Gallery 8: Polaroids, Captions & Compliments" />
      
      {/* Polaroids */}
      {g8.polaroids.map((pol, idx) => (
        <div key={pol.id} className="p-4 bg-white rounded-lg border border-gray-200 space-y-3">
          <h4 className="text-sm font-semibold text-gray-700">{pol.caption}</h4>
          <div className="grid grid-cols-2 gap-3">
            <EditableField label="Caption" value={pol.caption} onChange={(v) => {
              const items = [...g8.polaroids]; items[idx] = { ...items[idx], caption: v };
              setData((prev) => ({ ...prev, gallery8: { ...prev.gallery8, polaroids: items } }));
            }} />
            <EditableField label="Back Text" value={pol.back} onChange={(v) => {
              const items = [...g8.polaroids]; items[idx] = { ...items[idx], back: v };
              setData((prev) => ({ ...prev, gallery8: { ...prev.gallery8, polaroids: items } }));
            }} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <EditableField label="Hue" value={String(pol.hue)} onChange={(v) => {
              const items = [...g8.polaroids]; items[idx] = { ...items[idx], hue: parseInt(v) || 0 };
              setData((prev) => ({ ...prev, gallery8: { ...prev.gallery8, polaroids: items } }));
            }} type="number" />
          </div>
          <KeywordsEditor keywords={pol.keywords} onChange={(kws) => {
            const items = [...g8.polaroids]; items[idx] = { ...items[idx], keywords: kws };
            setData((prev) => ({ ...prev, gallery8: { ...prev.gallery8, polaroids: items } }));
          }} />
          <ImageUploader initialImage={pol.image} onImageChange={(img) => {
            const items = [...g8.polaroids]; items[idx] = { ...items[idx], image: img };
            setData((prev) => ({ ...prev, gallery8: { ...prev.gallery8, polaroids: items } }));
          }} label="Polaroid Photo" />
        </div>
      ))}

      {/* Compliments */}
      <div className="p-4 bg-white rounded-lg border border-gray-200 space-y-3">
        <h4 className="text-sm font-semibold text-gray-700">Compliments ({g8.compliments.length})</h4>
        <EditableField
          label="Compliments (one per line)"
          value={g8.compliments.join("\n")}
          onChange={(v) => {
            setData((prev) => ({ ...prev, gallery8: { ...prev.gallery8, compliments: v.split("\n").filter(Boolean) } }));
          }}
          multiline
          rows={15}
        />
      </div>
    </div>
  );
}

function Gallery9Editor() {
  const { data, setData } = useCurator();
  const g9 = data.gallery9;

  return (
    <div className="space-y-6">
      <SectionHeader title="Gallery 9: Map of Memories — Locations & Memories" />
      
      {g9.mapPins.map((pin, idx) => (
        <div key={pin.id} className="p-4 bg-white rounded-lg border border-gray-200 space-y-3">
          <h4 className="text-sm font-semibold text-gray-700">{pin.place}</h4>
          <div className="grid grid-cols-3 gap-3">
            <EditableField label="Place" value={pin.place} onChange={(v) => {
              const items = [...g9.mapPins]; items[idx] = { ...items[idx], place: v };
              setData((prev) => ({ ...prev, gallery9: { ...prev.gallery9, mapPins: items } }));
            }} />
            <EditableField label="X Position" value={String(pin.x)} onChange={(v) => {
              const items = [...g9.mapPins]; items[idx] = { ...items[idx], x: parseFloat(v) || 0 };
              setData((prev) => ({ ...prev, gallery9: { ...prev.gallery9, mapPins: items } }));
            }} type="number" />
            <EditableField label="Y Position" value={String(pin.y)} onChange={(v) => {
              const items = [...g9.mapPins]; items[idx] = { ...items[idx], y: parseFloat(v) || 0 };
              setData((prev) => ({ ...prev, gallery9: { ...prev.gallery9, mapPins: items } }));
            }} type="number" />
          </div>
          <EditableField label="Memory" value={pin.memory} onChange={(v) => {
            const items = [...g9.mapPins]; items[idx] = { ...items[idx], memory: v };
            setData((prev) => ({ ...prev, gallery9: { ...prev.gallery9, mapPins: items } }));
          }} multiline />
          <div className="grid grid-cols-2 gap-3">
            <EditableField label="Date Label" value={pin.date} onChange={(v) => {
              const items = [...g9.mapPins]; items[idx] = { ...items[idx], date: v };
              setData((prev) => ({ ...prev, gallery9: { ...prev.gallery9, mapPins: items } }));
            }} />
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={pin.future || false}
                  onChange={(e) => {
                    const items = [...g9.mapPins]; items[idx] = { ...items[idx], future: e.target.checked };
                    setData((prev) => ({ ...prev, gallery9: { ...prev.gallery9, mapPins: items } }));
                  }}
                />
                Future Location
              </label>
            </div>
          </div>
          <KeywordsEditor keywords={pin.keywords} onChange={(kws) => {
            const items = [...g9.mapPins]; items[idx] = { ...items[idx], keywords: kws };
            setData((prev) => ({ ...prev, gallery9: { ...prev.gallery9, mapPins: items } }));
          }} />
          <ImageUploader initialImage={pin.image} onImageChange={(img) => {
            const items = [...g9.mapPins]; items[idx] = { ...items[idx], image: img };
            setData((prev) => ({ ...prev, gallery9: { ...prev.gallery9, mapPins: items } }));
          }} label="Location Photo" />
        </div>
      ))}
    </div>
  );
}

function Gallery10Editor() {
  const { data, setData } = useCurator();
  const g10 = data.gallery10;

  return (
    <div className="space-y-6">
      <SectionHeader title="Gallery 10: Constellation Room — Star Memories" />
      
      {g10.stars.map((star, idx) => (
        <div key={star.id} className="p-4 bg-white rounded-lg border border-gray-200 space-y-3">
          <div className="grid grid-cols-4 gap-3">
            <EditableField label="ID" value={star.id} onChange={(v) => {
              const items = [...g10.stars]; items[idx] = { ...items[idx], id: v };
              setData((prev) => ({ ...prev, gallery10: { ...prev.gallery10, stars: items } }));
            }} />
            <EditableField label="X" value={String(star.x)} onChange={(v) => {
              const items = [...g10.stars]; items[idx] = { ...items[idx], x: parseFloat(v) || 0 };
              setData((prev) => ({ ...prev, gallery10: { ...prev.gallery10, stars: items } }));
            }} type="number" />
            <EditableField label="Y" value={String(star.y)} onChange={(v) => {
              const items = [...g10.stars]; items[idx] = { ...items[idx], y: parseFloat(v) || 0 };
              setData((prev) => ({ ...prev, gallery10: { ...prev.gallery10, stars: items } }));
            }} type="number" />
            <EditableField label="Size" value={String(star.size)} onChange={(v) => {
              const items = [...g10.stars]; items[idx] = { ...items[idx], size: parseInt(v) || 2 };
              setData((prev) => ({ ...prev, gallery10: { ...prev.gallery10, stars: items } }));
            }} type="number" />
          </div>
          <EditableField label="Star Memory" value={star.memory} onChange={(v) => {
            const items = [...g10.stars]; items[idx] = { ...items[idx], memory: v };
            setData((prev) => ({ ...prev, gallery10: { ...prev.gallery10, stars: items } }));
          }} />
          <KeywordsEditor keywords={star.keywords} onChange={(kws) => {
            const items = [...g10.stars]; items[idx] = { ...items[idx], keywords: kws };
            setData((prev) => ({ ...prev, gallery10: { ...prev.gallery10, stars: items } }));
          }} />
        </div>
      ))}

      <div className="p-4 bg-white rounded-lg border border-gray-200 space-y-3">
        <h4 className="text-sm font-semibold text-gray-700">Brightest Star Text</h4>
        <EditableField label="Text" value={g10.brightestStarText} onChange={(v) => {
          setData((prev) => ({ ...prev, gallery10: { ...prev.gallery10, brightestStarText: v } }));
        }} multiline />
      </div>
    </div>
  );
}

function Gallery11Editor() {
  const { data, setData } = useCurator();
  const g11 = data.gallery11;

  return (
    <div className="space-y-6">
      <SectionHeader title="Gallery 11: Letters Never Sent" />
      
      {g11.letters.map((letter, idx) => (
        <div key={letter.id} className="p-4 bg-white rounded-lg border border-gray-200 space-y-3">
          <h4 className="text-sm font-semibold text-gray-700">{letter.title}</h4>
          <EditableField label="Title" value={letter.title} onChange={(v) => {
            const items = [...g11.letters]; items[idx] = { ...items[idx], title: v };
            setData((prev) => ({ ...prev, gallery11: { ...prev.gallery11, letters: items } }));
          }} />
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">Letter Body (Rich Text)</label>
            <RichTextEditor
              value={letter.body}
              onChange={(body) => {
                const items = [...g11.letters]; items[idx] = { ...items[idx], body };
                setData((prev) => ({ ...prev, gallery11: { ...prev.gallery11, letters: items } }));
              }}
              placeholder="Write your letter..."
            />
          </div>
          <KeywordsEditor keywords={letter.keywords} onChange={(kws) => {
            const items = [...g11.letters]; items[idx] = { ...items[idx], keywords: kws };
            setData((prev) => ({ ...prev, gallery11: { ...prev.gallery11, letters: items } }));
          }} />
        </div>
      ))}

      <div className="p-4 bg-white rounded-lg border border-gray-200 space-y-3">
        <h4 className="text-sm font-semibold text-gray-700">Hidden Letter Text</h4>
        <EditableField label="Text" value={g11.hiddenLetterText} onChange={(v) => {
          setData((prev) => ({ ...prev, gallery11: { ...prev.gallery11, hiddenLetterText: v } }));
        }} multiline />
      </div>

      <div className="p-4 bg-white rounded-lg border border-gray-200 space-y-3">
        <h4 className="text-sm font-semibold text-gray-700">Gallery Password</h4>
        <EditableField label="Password" value={g11.password} onChange={(v) => {
          setData((prev) => ({ ...prev, gallery11: { ...prev.gallery11, password: v } }));
        }} />
      </div>
    </div>
  );
}

function Gallery12Editor() {
  const { data, setData } = useCurator();
  const g12 = data.gallery12;

  return (
    <div className="space-y-6">
      <SectionHeader title="Gallery 12: The Future Wing — Future Exhibits" />
      
      <div className="space-y-3">
        {g12.futureLabels.map((item, idx) => (
          <div key={idx} className="p-3 bg-white rounded-lg border border-gray-200 space-y-2">
            <div className="grid grid-cols-2 gap-3">
              <EditableField label="Title" value={item.title} onChange={(v) => {
                const items = [...g12.futureLabels]; items[idx] = { ...items[idx], title: v };
                setData((prev) => ({ ...prev, gallery12: { ...prev.gallery12, futureLabels: items } }));
              }} />
              <EditableField label="Status" value={item.status} onChange={(v) => {
                const items = [...g12.futureLabels]; items[idx] = { ...items[idx], status: v };
                setData((prev) => ({ ...prev, gallery12: { ...prev.gallery12, futureLabels: items } }));
              }} />
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-white rounded-lg border border-gray-200 space-y-3">
        <h4 className="text-sm font-semibold text-gray-700">Future Frame Label</h4>
        <EditableField label="Label" value={g12.futureFrameLabel} onChange={(v) => {
          setData((prev) => ({ ...prev, gallery12: { ...prev.gallery12, futureFrameLabel: v } }));
        }} multiline />
      </div>
    </div>
  );
}

function Gallery13Editor() {
  const { data, setData } = useCurator();
  const finale = data.finale;

  return (
    <div className="space-y-6">
      <SectionHeader title="Gallery 13: Ending Text & Finale" />
      
      {/* Corridor Frames */}
      <div className="p-4 bg-white rounded-lg border border-gray-200 space-y-3">
        <h4 className="text-sm font-semibold text-gray-700">Corridor Frames</h4>
        <EditableField
          label="Frames (one per line)"
          value={finale.corridorFrames.join("\n")}
          onChange={(v) => {
            setData((prev) => ({ ...prev, finale: { ...prev.finale, corridorFrames: v.split("\n").filter(Boolean) } }));
          }}
          multiline
          rows={7}
        />
      </div>

      {/* Epilogue Lines */}
      <div className="p-4 bg-white rounded-lg border border-gray-200 space-y-3">
        <h4 className="text-sm font-semibold text-gray-700">Epilogue Lines</h4>
        <EditableField
          label="Lines (one per line)"
          value={finale.epilogueLines.join("\n")}
          onChange={(v) => {
            setData((prev) => ({ ...prev, finale: { ...prev.finale, epilogueLines: v.split("\n").filter(Boolean) } }));
          }}
          multiline
          rows={5}
        />
      </div>

      {/* Post Credits Letter */}
      <div className="p-4 bg-white rounded-lg border border-gray-200 space-y-3">
        <h4 className="text-sm font-semibold text-gray-700">Post Credits Letter</h4>
        <RichTextEditor
          value={finale.postCreditsLetter}
          onChange={(body) => {
            setData((prev) => ({ ...prev, finale: { ...prev.finale, postCreditsLetter: body } }));
          }}
          placeholder="Write the post credits letter..."
        />
      </div>

      {/* Credits Cards */}
      <div className="p-4 bg-white rounded-lg border border-gray-200 space-y-3">
        <h4 className="text-sm font-semibold text-gray-700">Credits</h4>
        {finale.creditsCards.map((card, idx) => (
          <div key={idx} className="grid grid-cols-2 gap-3">
            <EditableField label="Role" value={card.role} onChange={(v) => {
              const items = [...finale.creditsCards]; items[idx] = { ...items[idx], role: v };
              setData((prev) => ({ ...prev, finale: { ...prev.finale, creditsCards: items } }));
            }} />
            <EditableField label="Name" value={card.name} onChange={(v) => {
              const items = [...finale.creditsCards]; items[idx] = { ...items[idx], name: v };
              setData((prev) => ({ ...prev, finale: { ...prev.finale, creditsCards: items } }));
            }} />
          </div>
        ))}
      </div>

      {/* Guide Bird */}
      <div className="p-4 bg-white rounded-lg border border-gray-200 space-y-3">
        <h4 className="text-sm font-semibold text-gray-700">The Archivist (Guide Bird)</h4>
        <EditableField
          label="Bird Facts (one per line)"
          value={data.guide.birdFacts.join("\n")}
          onChange={(v) => {
            setData((prev) => ({ ...prev, guide: { ...prev.guide, birdFacts: v.split("\n").filter(Boolean) } }));
          }}
          multiline
          rows={10}
        />
      </div>
    </div>
  );
}

function MuseumMetaEditor() {
  const { data, setData } = useCurator();
  const meta = data.museum;

  return (
    <div className="space-y-6">
      <SectionHeader title="Museum Metadata — Welcome, Rules, Dear Chicko Letter" />
      
      {/* Welcome Section */}
      <div className="p-4 bg-white rounded-lg border border-gray-200 space-y-3">
        <h4 className="text-sm font-semibold text-gray-700">Welcome Landing Strip</h4>
        <EditableField label="Museum Title" value={meta.welcomeTitle} onChange={(v) => {
          setData((prev) => ({ ...prev, museum: { ...prev.museum, welcomeTitle: v } }));
        }} />
        <EditableField label="Subtitle" value={meta.welcomeSubtitle} onChange={(v) => {
          setData((prev) => ({ ...prev, museum: { ...prev.museum, welcomeSubtitle: v } }));
        }} multiline />
        <EditableField label="Tagline" value={meta.welcomeTagline} onChange={(v) => {
          setData((prev) => ({ ...prev, museum: { ...prev.museum, welcomeTagline: v } }));
        }} />
      </div>

      {/* Museum Rules */}
      <div className="p-4 bg-white rounded-lg border border-gray-200 space-y-3">
        <h4 className="text-sm font-semibold text-gray-700">Museum Rules</h4>
        <EditableField
          label="Rules (one per line)"
          value={meta.rules.join("\n")}
          onChange={(v) => {
            setData((prev) => ({ ...prev, museum: { ...prev.museum, rules: v.split("\n").filter(Boolean) } }));
          }}
          multiline
          rows={8}
        />
      </div>

      {/* Dear Chicko Letter */}
      <div className="p-4 bg-white rounded-lg border border-gray-200 space-y-3">
        <h4 className="text-sm font-semibold text-gray-700">Dear Chicko Letter (Intro Hall)</h4>
        <RichTextEditor
          value={meta.dearChickoLetter}
          onChange={(body) => {
            setData((prev) => ({ ...prev, museum: { ...prev.museum, dearChickoLetter: body } }));
          }}
          placeholder="Write the Dear Chicko letter..."
        />
      </div>

      {/* Guestbook */}
      <div className="p-4 bg-white rounded-lg border border-gray-200 space-y-3">
        <h4 className="text-sm font-semibold text-gray-700">Guestbook Settings</h4>
        <EditableField label="Title" value={data.guestbook.title} onChange={(v) => {
          setData((prev) => ({ ...prev, guestbook: { ...prev.guestbook, title: v } }));
        }} />
        <EditableField label="Subtitle" value={data.guestbook.subtitle} onChange={(v) => {
          setData((prev) => ({ ...prev, guestbook: { ...prev.guestbook, subtitle: v } }));
        }} multiline />
        <EditableField label="Placeholder" value={data.guestbook.placeholder} onChange={(v) => {
          setData((prev) => ({ ...prev, guestbook: { ...prev.guestbook, placeholder: v } }));
        }} />
      </div>

      {/* Metadata */}
      <div className="p-4 bg-white rounded-lg border border-gray-200 space-y-3">
        <h4 className="text-sm font-semibold text-gray-700">Museum Metadata</h4>
        <div className="grid grid-cols-2 gap-3">
          <EditableField label="Curator Name" value={data.metadata.curatorName} onChange={(v) => {
            setData((prev) => ({ ...prev, metadata: { ...prev.metadata, curatorName: v } }));
          }} />
          <EditableField label="Visitor Name" value={data.metadata.visitorName} onChange={(v) => {
            setData((prev) => ({ ...prev, metadata: { ...prev.metadata, visitorName: v } }));
          }} />
        </div>
      </div>
    </div>
  );
}

// ============ MAIN CURATOR MODE COMPONENT ============

export default function CuratorMode() {
  const {
    isCurator, setIsCurator, data, setData, save, undo, redo, canUndo, canRedo,
    resetAll, exportData, importData,
    activeGallery, setActiveGallery,
  } = useCurator();

  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");

  // Keyboard shortcuts inside Curator Mode: Ctrl+Z undo, Ctrl+Y / Ctrl+Shift+Z redo, Ctrl+S save
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const inEditor = target.isContentEditable || target.tagName === "INPUT" || target.tagName === "TEXTAREA";
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        save();
        toast.success("Museum data saved!", { duration: 2000 });
        return;
      }
      if (inEditor) return; // don't hijack undo inside text fields
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === "z") {
        e.preventDefault();
        undo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === "y" || (e.shiftKey && e.key.toLowerCase() === "z"))) {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo, save]);

  const handleSave = useCallback(() => {
    setSaveStatus("saving");
    save();
    setSaveStatus("saved");
    toast.success("Museum data saved successfully!", { duration: 3000 });
    setTimeout(() => setSaveStatus("idle"), 2000);
  }, [save]);

  const handleImport = useCallback(() => {
    const success = importData(importText);
    if (success) {
      toast.success("Museum data imported successfully!", { duration: 3000 });
      setShowImport(false);
      setImportText("");
    } else {
      toast.error("Invalid museum data file. Please check the JSON format.", { duration: 5000 });
    }
  }, [importData, importText]);

  if (!isCurator) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-white overflow-y-auto">
      {/* Curator Mode Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-amber-900 to-amber-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold">🏛 Curator Mode</h1>
            <span className="text-xs bg-amber-700 px-2 py-0.5 rounded-full">Edit without touching code</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={undo}
              disabled={!canUndo}
              className="px-3 py-1.5 text-sm bg-white/10 hover:bg-white/20 disabled:opacity-30 rounded transition-colors"
              title="Undo (Ctrl+Z)"
            >
              ↩ Undo
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className="px-3 py-1.5 text-sm bg-white/10 hover:bg-white/20 disabled:opacity-30 rounded transition-colors"
              title="Redo (Ctrl+Y)"
            >
              ↪ Redo
            </button>
            <button
              onClick={handleSave}
              className={`px-4 py-1.5 text-sm font-medium rounded transition-colors ${
                saveStatus === "saved" ? "bg-green-500 text-white" :
                saveStatus === "saving" ? "bg-amber-500 text-white" :
                "bg-white text-amber-900 hover:bg-amber-50"
              }`}
            >
              {saveStatus === "saved" ? "✓ Saved" : saveStatus === "saving" ? "Saving..." : "💾 Save"}
            </button>
            <button
              onClick={exportData}
              className="px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 rounded transition-colors"
              title="Export Museum Backup"
            >
              📤 Export
            </button>
            <button
              onClick={() => setShowImport(!showImport)}
              className="px-3 py-1.5 text-sm bg-purple-500 hover:bg-purple-600 rounded transition-colors"
            >
              📥 Import
            </button>
            <button
              onClick={() => {
                const backupFirst = window.confirm(
                  "Reset the whole museum to its original content?\n\nClick OK to first download a backup, then reset.\nClick Cancel to abort."
                );
                if (!backupFirst) return;
                exportData(); // safety: always back up before destroying
                resetAll();
                toast.success("Museum reset to defaults. A backup was downloaded first.", { duration: 4000 });
              }}
              className="px-3 py-1.5 text-sm bg-red-500 hover:bg-red-600 rounded transition-colors"
              title="Reset all data to default (a backup is exported first)"
            >
              🗑 Reset
            </button>
            <button
              onClick={() => {
                // Leave curator mode: clean the URL and restore the public museum
                const url = new URL(window.location.href);
                url.searchParams.delete("curator");
                const path = url.pathname === "/curator" ? "/" : url.pathname;
                window.history.replaceState({}, "", path + url.search);
                setIsCurator(false);
                toast.info("Curator Mode closed. The museum looks untouched.", { duration: 2500 });
              }}
              className="px-3 py-1.5 text-sm bg-gray-500 hover:bg-gray-600 rounded transition-colors"
            >
              ✕ Exit
            </button>
          </div>
        </div>

        {/* Gallery Tabs */}
        <div className="max-w-7xl mx-auto px-4 pb-3 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {GALLERY_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveGallery(tab.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded whitespace-nowrap transition-colors ${
                  activeGallery === tab.id
                    ? "bg-white text-amber-900"
                    : "bg-white/10 hover:bg-white/20 text-white"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Import Modal */}
      <AnimatePresence>
        {showImport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] bg-black/50 flex items-center justify-center"
          >
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 shadow-2xl">
              <h3 className="text-lg font-semibold mb-3">Import Museum Data</h3>
              <p className="text-sm text-gray-600 mb-3">Paste your museum backup JSON below, or use the file picker.</p>
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder='Paste museum JSON here...'
                rows={10}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 font-mono"
              />
              <div className="flex justify-between mt-3">
                <label className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded cursor-pointer border border-gray-300">
                  Choose File
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => setImportText(ev.target?.result as string);
                        reader.readAsText(file);
                      }
                    }}
                  />
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setShowImport(false); setImportText(""); }}
                    className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleImport}
                    disabled={!importText.trim()}
                    className="px-4 py-2 text-sm bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded"
                  >
                    Import
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gallery Editor Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeGallery}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeGallery === 1 && <Gallery1Editor />}
            {activeGallery === 2 && <Gallery2Editor />}
            {activeGallery === 3 && <Gallery3Editor />}
            {activeGallery === 4 && <Gallery4Editor />}
            {activeGallery === 5 && <Gallery5Editor />}
            {activeGallery === 6 && <Gallery6Editor />}
            {activeGallery === 7 && <Gallery7Editor />}
            {activeGallery === 8 && <Gallery8Editor />}
            {activeGallery === 9 && <Gallery9Editor />}
            {activeGallery === 10 && <Gallery10Editor />}
            {activeGallery === 11 && <Gallery11Editor />}
            {activeGallery === 12 && <Gallery12Editor />}
            {activeGallery === 13 && <Gallery13Editor />}
            {activeGallery === 0 && <MuseumMetaEditor />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating preview hint */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => {
            const url = new URL(window.location.href);
            url.searchParams.delete("curator");
            window.open(url.toString(), "_blank");
          }}
          className="px-4 py-2 text-sm bg-amber-600 hover:bg-amber-700 text-white rounded-full shadow-lg transition-colors"
        >
          👁 Preview Museum
        </button>
      </div>
    </div>
  );
}
