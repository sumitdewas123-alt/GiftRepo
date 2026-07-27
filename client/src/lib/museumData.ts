/*
 * THE MUSEUM OF CHICKO — content data layer.
 * Customized per the master creative specification (THEMUSEUMOFCHICKO.pdf).
 * Curator: "Weak Memory". Visitor: Chicko. Guide: The Archivist (a robin).
 * Personal motifs: books, dentistry, "Tough Guy", "Weak Memory", "It's my destiny",
 * trust, introversion, quiet resilience, Tuesdays with Morrie, 25 Chapters of You.
 */

/* ---------- Gallery 1: The Girl I Met — timeline & memory cards ---------- */
export interface TimelineEntry {
  year: string;
  title: string;
  text: string;
  keywords: string[];
}
export const timeline: TimelineEntry[] = [
  {
    year: "2015",
    title: "The First Page",
    text: "Somewhere in this year, an ordinary conversation happened. Neither of us knew it was the first page.",
    keywords: ["met", "first", "beginning", "2015"],
  },
  {
    year: "2016",
    title: "Becoming Friends",
    text: "Small talk retired early. In its place: book arguments, inside jokes, and the discovery that silence with the right person is its own language.",
    keywords: ["friends", "jokes", "books"],
  },
  {
    year: "2018",
    title: "The Chapters In Between",
    text: "Exams, doubts, growing pains — and through all of it, the conversations kept finding their way back.",
    keywords: ["exams", "growing", "conversations"],
  },
  {
    year: "2020",
    title: "The Distance Test",
    text: "The world went quiet; the friendship didn't. Voice notes, late-night calls, and the stubborn refusal to let a good thing gather dust.",
    keywords: ["distance", "calls", "voice notes"],
  },
  {
    year: "2022",
    title: "The Becoming Years",
    text: "You started turning into the person children smile at before opening their mouths. I mostly just watched, impressed and unsurprised.",
    keywords: ["dentist", "dentistry", "becoming"],
  },
  {
    year: "2024",
    title: "Still Here",
    text: "More books. More chai. More 'It's my destiny.' The archive kept growing without either of us trying.",
    keywords: ["destiny", "books", "chai"],
  },
  {
    year: "Today",
    title: "The Permanent Collection",
    text: "Still collecting. The museum's acquisition department reports no plans to stop.",
    keywords: ["now", "present", "today"],
  },
];

export interface MemoryCardSmall {
  no: string;
  text: string;
  keywords: string[];
}
export const memoryCards: MemoryCardSmall[] = [
  { no: "Memory 001", text: "The first conversation. Not because it was extraordinary. Because neither of us knew it was the first page.", keywords: ["first", "conversation"] },
  { no: "Memory 002", text: "The first time I realised — \"You're different.\"", keywords: ["different", "realised"] },
  { no: "Memory 003", text: "The first inside joke.", keywords: ["joke", "inside joke"] },
  { no: "Memory 004", text: "The first time you made me laugh so hard I still remember it.", keywords: ["laugh", "funny"] },
  { no: "Memory 005", text: "The first book recommendation.", keywords: ["books", "recommendation"] },
  { no: "Memory 006", text: "The first disagreement.", keywords: ["fight", "disagreement", "argument"] },
  { no: "Memory 007", text: "The first birthday I celebrated with you.", keywords: ["birthday", "celebrate"] },
];

/* ---------- Gallery 2: The Person You Became — four walls ---------- */
export interface WallItem {
  id: string;
  title: string;
  subtitle: string;
  lines: string[];
  closing?: string;
  keywords: string[];
}
export const becameWalls: WallItem[] = [
  {
    id: "wall-reader",
    title: "The Reader",
    subtitle: "Wall One",
    lines: [
      "Books You Recommended Me.",
      "Books I Recommended You.",
      "Books We Still Need To Read.",
      "Somewhere between all three shelves, a friendship kept annotating itself.",
    ],
    closing: "\"Tuesdays with Morrie\" sits here, spine soft from being talked about more than read.",
    keywords: ["books", "reading", "reader", "tuesdays with morrie"],
  },
  {
    id: "wall-dentist",
    title: "The Dentist",
    subtitle: "Wall Two",
    lines: [
      "Small dentist tools. A white coat. A tiny ceramic tooth.",
      "Somewhere along the way...",
      "you became the person children smile at before saying",
      "\"Open your mouth.\"",
    ],
    keywords: ["dentist", "dentistry", "tooth", "doctor"],
  },
  {
    id: "wall-toughguy",
    title: "Tough Guy",
    subtitle: "Wall Three",
    lines: [
      "\"I don't need help.\"",
      "\"I'll manage.\"",
      "\"I'm fine.\"",
    ],
    closing: "Yet somehow... you always let the people you love worry anyway.",
    keywords: ["tough guy", "tough", "fine", "manage"],
  },
  {
    id: "wall-strength",
    title: "Quiet Strength",
    subtitle: "Wall Four",
    lines: [
      "You stayed.",
      "You kept trying.",
      "You read another page.",
      "You took another exam.",
      "You kept showing up.",
    ],
    closing: "That's strength too.",
    keywords: ["strength", "resilience", "exam", "trying"],
  },
];

export const mirrorLines: string[] = [
  "You genuinely become happier around books.",
  "You remember little details about people, even when you pretend not to.",
  "Your smile isn't ordinary. It never was.",
  "You're kinder than your own description of yourself.",
  "You carry more than you tell anyone.",
  "You trust slowly — and completely.",
  "You make quiet rooms feel safer.",
  "You keep showing up. That's rarer than you think.",
];

/* ---------- Gallery 3: The Things You Never Notice About Yourself ---------- */
export interface Observation {
  id: string;
  frame: string;
  text: string;
  keywords: string[];
}
export const observations: Observation[] = [
  { id: "obs-1", frame: "Frame 01", text: "You genuinely become happier around books.", keywords: ["books", "happy", "reading"] },
  { id: "obs-2", frame: "Frame 02", text: "You always underestimate yourself.", keywords: ["underestimate", "yourself"] },
  { id: "obs-3", frame: "Frame 03", text: "You call yourself difficult. But the people who love you never describe you that way.", keywords: ["difficult"] },
  { id: "obs-4", frame: "Frame 04", text: "You remember little details about people. Even when you pretend not to.", keywords: ["details", "remember"] },
  { id: "obs-5", frame: "Frame 05", text: "You carry more than you tell anyone.", keywords: ["carry", "quiet"] },
  { id: "obs-6", frame: "Frame 06", text: "When life gets overwhelming... you disappear instead of asking for help.", keywords: ["overwhelmed", "disappear", "help"] },
  { id: "obs-7", frame: "Frame 07", text: "You apologise for existing more than you should.", keywords: ["apologise", "sorry"] },
  { id: "obs-8", frame: "Frame 08", text: "You trust slowly. But once you do... you trust completely.", keywords: ["trust"] },
  { id: "obs-9", frame: "Frame 09", text: "You think your smile is ordinary. It isn't.", keywords: ["smile"] },
  { id: "obs-10", frame: "Frame 10", text: "You think your life isn't interesting. Meanwhile... someone built an entire museum from it.", keywords: ["life", "interesting", "museum"] },
];
export const secretObservation = {
  title: "One More Thing.",
  text: "You never really realise the effect you have on people. Maybe that's why kindness comes so naturally to you.",
};

/* ---------- Gallery 4: The Evidence Room — sections ---------- */
export interface Evidence {
  id: string;
  section: string;
  title: string;
  caption: string;
  context: string;
  keywords: string[];
  pin: { top: string; left: string; rotate: number };
  type: "photo" | "note" | "chat" | "meme" | "audio";
}
export const evidence: Evidence[] = [
  { id: "ev-books", section: "Books", type: "photo", title: "Section: Books", caption: "Recommendations, quotes, reading progress.", context: "Everything book related. Photos of covers, dog-eared pages, and reading progress reports delivered like breaking news. Verdict: guilty of turning every conversation literary.", keywords: ["books", "quotes", "reading"], pin: { top: "8%", left: "6%", rotate: -3 } },
  { id: "ev-chats", section: "Random Chats", type: "chat", title: "Section: Random Chats", caption: "\"Weak Memory.\" \"Tough Guy.\" \"It's my destiny.\"", context: "Funny screenshots, memes, emoji wars, and three legendary recurring phrases. Each one now has its own catalog number and, apparently, its own museum wing.", keywords: ["chats", "weak memory", "tough guy", "destiny", "memes", "funny"], pin: { top: "12%", left: "40%", rotate: 2 } },
  { id: "ev-voice", section: "Voice Notes", type: "audio", title: "Section: Voice Notes", caption: "Press play. Old cassette animation included.", context: "Rambling voice notes about absolutely nothing that somehow made entire days better. Duration: minutes. Importance: immeasurable.", keywords: ["voice", "audio", "cassette"], pin: { top: "45%", left: "12%", rotate: -2 } },
  { id: "ev-trips", section: "Trips", type: "photo", title: "Section: Trips", caption: "Maps, routes, tickets, dream destinations.", context: "Photos, travel tickets, and routes traced across maps — plus a growing list of places that exist so far only in conversation.", keywords: ["trips", "travel", "tickets", "maps"], pin: { top: "50%", left: "48%", rotate: 3 } },
  { id: "ev-food", section: "Food", type: "note", title: "Section: Food", caption: "Things she loves. Things she hates. Strong opinions throughout.", context: "Restaurants, coffee, snacks — a complete taxonomy of likes and dislikes, defended with the passion of a national cause.", keywords: ["food", "coffee", "snacks", "restaurants"], pin: { top: "20%", left: "72%", rotate: -1 } },
  { id: "ev-debates", section: "The Great Debates", type: "meme", title: "Section: The Great Debates", caption: "Movies. Books. Food. Random opinions.", context: "Funny disagreements, thoroughly documented. Historians note that nobody ever won, and the friendship somehow always did.", keywords: ["debates", "fight", "disagreement", "movies", "opinions"], pin: { top: "60%", left: "75%", rotate: 2 } },
];

export const laughCounter = [
  { label: "Conversations survived", value: "10,000+" },
  { label: "Books discussed", value: "Hundreds" },
  { label: "Bad jokes tolerated", value: "Uncountable" },
  { label: "Nicknames invented", value: "Several (two legendary)" },
  { label: "Photos clicked", value: "Enough" },
  { label: "Years known", value: "A decade and counting" },
];

/* ---------- Gallery 5: The Library of Us ---------- */
export interface Book {
  id: string;
  title: string;
  by: string;
  color: string;
  note: string;
  quote: string;
  keywords: string[];
}
export const books: Book[] = [
  { id: "bk-1", title: "Tuesdays with Morrie", by: "The one that mattered", color: "#5d4a2f", note: "This wasn't just another recommendation. It became part of our conversations. Some books stay on shelves. Others quietly become part of friendships.", quote: "\"Some books stay on shelves. Others quietly become part of friendships.\"", keywords: ["tuesdays with morrie", "books", "morrie"] },
  { id: "bk-2", title: "The Ones You Suggested", by: "Suggested by you", color: "#3f4a3a", note: "I complained about the first fifty pages of at least two of them. You told me to trust you. I did. They're still on my shelf, spines broken from rereading.", quote: "\"Trust me. Page fifty-one changes everything.\"", keywords: ["books", "suggestion", "reading"] },
  { id: "bk-3", title: "The Ones You Gifted", by: "Given, not lent", color: "#6b3226", note: "Inscribed on the first pages with messages that will not be reproduced here, because some things belong only to their reader.", quote: "\"For the shelf you're always building.\"", keywords: ["gift", "books", "birthday"] },
  { id: "bk-4", title: "The Ones Discussed for Hours", by: "A joint obsession", color: "#42423a", note: "Started reading together, finished talking instead. Every single time. Ten chapters in two years. A record.", quote: "\"Same time next week? We'll definitely read this time.\"", keywords: ["books", "discussed", "hours"] },
  { id: "bk-5", title: "Margin Notes, Vol. I", by: "Annotated heavily", color: "#57422b", note: "A borrowed book returned with pencil notes in the margins — a whole second conversation hidden inside the first.", quote: "\"Look at page 89. That's SO us.\"", keywords: ["books", "notes", "margins"] },
  { id: "bk-6", title: "25 Chapters of You", by: "Borrower: Chicko · Returned: Never", color: "#4d3550", note: "A missing book. It has clearly been borrowed. The library card in the physical copy knows the whole story.", quote: "\"Returned: Never.\"", keywords: ["25 chapters", "borrowed", "library card"] },
];

export const quoteWall: { quote: string; why: string }[] = [
  { quote: "\"Once you learn how to die, you learn how to live.\"", why: "Because we talked about this one until the chai went cold." },
  { quote: "\"You're different.\"", why: "Said once, casually. Remembered permanently." },
  { quote: "\"It's my destiny.\"", why: "Your official explanation for everything difficult. I still think it was bad luck." },
  { quote: "\"One more chapter.\"", why: "The biggest lie either of us has ever told, repeatedly, at 1 a.m." },
  { quote: "\"Some conversations are just books with two authors.\"", why: "The note that sits between two reserved chairs in this library." },
  { quote: "\"Trust me, read it.\"", why: "Four words that have shaped entire months of my life." },
];

export const libraryHiddenNote = "Every friendship has its own language. Ours just happened to include books.";

/* ---------- Gallery 6: The Sound Room — cassettes & songs ---------- */
export interface Cassette {
  id: string;
  label: string;
  why: string;
  keywords: string[];
}
export const cassettes: Cassette[] = [
  { id: "cs-laugh", label: "Laugh", why: "If happiness had a sound, this would be one version of it.", keywords: ["laugh", "audio", "voice"] },
  { id: "cs-advice", label: "Advice", why: "Delivered reluctantly, worded perfectly, remembered for years.", keywords: ["advice", "voice"] },
  { id: "cs-random", label: "Random", why: "Four minutes. Subject: nothing. Importance: everything.", keywords: ["random", "voice"] },
  { id: "cs-latenight", label: "Late Night", why: "The conversations that only exist after midnight, when honesty gets easier.", keywords: ["late night", "midnight", "voice"] },
  { id: "cs-books", label: "Books", why: "Reviews, arguments, and at least one dramatic reading of a favourite paragraph.", keywords: ["books", "voice"] },
];

export interface Song {
  id: string;
  title: string;
  vibe: string;
  why: string;
  keywords: string[];
}
export const songs: Song[] = [
  { id: "sg-1", title: "Track 01 — The Rainy Day Song", vibe: "soft piano, slow", why: "Why it reminds me of you: it sounds exactly like the evenings we did nothing, and it was somehow the best part of the month.", keywords: ["song", "rain", "piano", "music"] },
  { id: "sg-2", title: "Track 02 — The Study Session Loop", vibe: "lo-fi, endless", why: "Where I first heard it: exam season. When I think of it: your occasional sigh over another page.", keywords: ["song", "study", "music", "exam"] },
  { id: "sg-3", title: "Track 03 — The One Sent at Midnight", vibe: "quiet, aching", why: "No message. Just the link. Sometimes a song says the thing neither person knows how to.", keywords: ["song", "midnight", "music"] },
  { id: "sg-4", title: "Track 04 — The Birthday Song (Off-Key Version)", vibe: "chaotic, heartfelt", why: "Performed annually, always terribly, always meant completely.", keywords: ["birthday", "song", "music"] },
];

export const silenceBoothLabel = "Some of our best conversations weren't filled with words.";
export const laughExhibitLabel = "If happiness had a sound, this would be one version of it.";

/* ---------- Gallery 8: Thank You notes (100) ---------- */
export const thankYouNotes: string[] = [
  "Thank you for staying.", "Thank you for trusting me.", "Thank you for making me read another book.",
  "Thank you for every random conversation.", "Thank you for making ordinary days memorable.", "Thank you for making me laugh.",
  "Thank you for arguing about books.", "Thank you for always caring more than you admit.", "Thank you for being honest.",
  "Thank you for letting me know the real you.", "Thank you for growing beside me.", "Thank you for every chapter.",
  "Thank you for listening.", "Thank you for the 2 a.m. replies.", "Thank you for remembering the small things.",
  "Thank you for the book recommendations that changed entire months.", "Thank you for never saying 'I told you so' out loud.",
  "Thank you for the voice notes.", "Thank you for showing up.", "Thank you for the honesty, even when it stung.",
  "Thank you for the silence that never felt awkward.", "Thank you for defending me when I wasn't in the room.",
  "Thank you for the birthday calls.", "Thank you for the long walks.", "Thank you for asking 'have you eaten?'",
  "Thank you for the memes at the exact right moment.", "Thank you for being stubborn about the right things.",
  "Thank you for letting me be wrong safely.", "Thank you for waiting.", "Thank you for the second chances.",
  "Thank you for celebrating my small wins like they were big.", "Thank you for the reality checks.",
  "Thank you for the borrowed books that came back annotated.", "Thank you for laughing until we couldn't breathe.",
  "Thank you for never keeping score.", "Thank you for saying 'call me when you reach home'.",
  "Thank you for the inside jokes nobody else gets.", "Thank you for making ordinary days feel curated.",
  "Thank you for forgiving fast.", "Thank you for noticing when I went quiet.",
  "Thank you for the pep talks disguised as roasts.", "Thank you for keeping my secrets like heirlooms.",
  "Thank you for growing, and letting me watch.", "Thank you for the patience I didn't deserve.",
  "Thank you for every 'one more chapter'.", "Thank you for the courage, borrowed freely.",
  "Thank you for being exactly, stubbornly you.", "Thank you for making this museum possible.",
  "Thank you for the difficult conversations.", "Thank you for never pretending with me.",
  "Thank you for calling yourself tough and being gentle anyway.", "Thank you for blaming destiny and trying again anyway.",
  "Thank you for reading the books I couldn't stop talking about.", "Thank you for every recommendation I pretended to be skeptical about.",
  "Thank you for the quiet company.", "Thank you for understanding without needing explanations.",
  "Thank you for the trust — I know what it costs you.", "Thank you for opening up slowly and completely.",
  "Thank you for the study sessions where nothing got studied.", "Thank you for surviving every exam season with me.",
  "Thank you for becoming a dentist and staying a reader.", "Thank you for the strong opinions about food.",
  "Thank you for every 'it's my destiny' moment.", "Thank you for every 'I'm fine' that you let me question.",
  "Thank you for never making kindness look like effort.", "Thank you for the little details you pretend not to remember.",
  "Thank you for the plans, kept and unkept.", "Thank you for the dreams shared out loud.",
  "Thank you for the disagreements that ended in laughter.", "Thank you for tolerating the nicknames.",
  "Thank you for inventing better ones.", "Thank you for the photographs I pretended to hate.",
  "Thank you for the ones I secretly kept.", "Thank you for the coffee opinions.",
  "Thank you for every 'read this and tell me what you think'.", "Thank you for actually telling me what you think.",
  "Thank you for the resilience you never call resilience.", "Thank you for the quiet victories.",
  "Thank you for every restart after every setback.", "Thank you for being safe to be unimpressive around.",
  "Thank you for the standards you hold quietly.", "Thank you for never asking me to be anyone else.",
  "Thank you for the way you love people carefully.", "Thank you for the way you notice everything.",
  "Thank you for pretending my jokes are tolerable.", "Thank you for the ones you actually laughed at.",
  "Thank you for every ordinary Tuesday.", "Thank you for every extraordinary ordinary day.",
  "Thank you for the friendship that never needed performing.", "Thank you for a decade of pages.",
  "Thank you for the chapters still unwritten.", "Thank you for being the reason ordinary moments became exhibits.",
  "Thank you for the warmth you think you hide.", "Thank you for the strength you think is stubbornness.",
  "Thank you for the softness you think is weakness.", "Thank you for every time you stayed anyway.",
  "Thank you for being deeply, quietly, unmistakably you.", "Thank you for reading this far.",
  "Thank you for everything the other ninety-nine notes couldn't hold.",
];

export const gratitudeEnvelope = [
  "You once asked me why I notice so many little things about you.",
  "The answer is simple.",
  "Because you've spent years quietly becoming one of the people I pay the most attention to.",
  "And somewhere along the way, noticing stopped being something I tried to do.",
  "It just became natural.",
];

/* ---------- Gallery 7: The Little Things Room — cabinets ---------- */
export interface Cabinet {
  id: string;
  emoji: string;
  label: string;
  contents: string;
  explanation: string;
  extra?: string;
  locked?: boolean;
  keywords: string[];
}
export const cabinets: Cabinet[] = [
  { id: "cab-tough", emoji: "🥊", label: "Tough Guy Cabinet", contents: "A tiny boxing glove.", explanation: "Claims to be unbreakable. Evidence suggests otherwise.", keywords: ["tough guy", "boxing"] },
  { id: "cab-memory", emoji: "📓", label: "Weak Memory Cabinet", contents: "A notebook full of reminders.", explanation: "One page says: \"Remember to remember.\"", keywords: ["weak memory", "notebook", "reminders"] },
  { id: "cab-destiny", emoji: "✨", label: "Destiny Cabinet", contents: "A glass jar of tiny stars.", explanation: "Every time life became difficult, someone blamed destiny.", extra: "\"I still think it was bad luck.\"", keywords: ["destiny", "stars", "jar"] },
  { id: "cab-reading", emoji: "📚", label: "Reading Habit Cabinet", contents: "Books stacked everywhere. Some upside down.", explanation: "Bookmarks sticking out at every angle. Buys books faster than any human could read them. Calls it an investment.", keywords: ["books", "reading", "habit"] },
  { id: "cab-introvert", emoji: "🎧", label: "Introvert Cabinet", contents: "Noise-cancelling headphones. A blanket. Tea. Books.", explanation: "Recharges best in quiet places.", keywords: ["introvert", "quiet", "tea", "headphones"] },
  { id: "cab-trust", emoji: "🔒", label: "Trust Cabinet", contents: "A locked wooden box.", explanation: "It cannot be opened at first. Keep exploring the museum.", extra: "\"Some locks aren't meant to keep people out. They're meant to protect what's inside.\"", locked: true, keywords: ["trust", "locked", "box"] },
];

export const randomDrawerNotes: string[] = [
  "You smile differently when you're excited.",
  "You read the last page too quickly.",
  "You worry about everyone.",
  "You apologise too much.",
  "You defend your food opinions like a lawyer.",
  "You say 'it's my destiny' and then fight destiny anyway.",
  "You pretend not to care about compliments. You keep them all.",
  "You get quieter when something matters more.",
];

/* ---------- Gallery 9: Map of Memories ---------- */
export interface MapPin {
  id: string;
  place: string;
  x: number;
  y: number;
  memory: string;
  date: string;
  future?: boolean;
  keywords: string[];
}
export const mapPins: MapPin[] = [
  { id: "mp-1", place: "First Place We Met", x: 66, y: 47, memory: "Funny how ordinary places become landmarks once enough memories happen there.", date: "Where it began", keywords: ["met", "first", "place"] },
  { id: "mp-2", place: "First Café", x: 68, y: 50, memory: "The bill, the photo, the conversation, what you ordered — all archived. The inside joke stays classified.", date: "Recurring landmark", keywords: ["cafe", "coffee", "food"] },
  { id: "mp-3", place: "First Bookstore", x: 64, y: 43, memory: "Books bought, recommendations exchanged, wallets harmed. We are no longer allowed to make eye contact with the bestseller table.", date: "Scene of the raid", keywords: ["books", "bookstore"] },
  { id: "mp-4", place: "The Trips", x: 60, y: 52, memory: "Routes traced between cities, each stop with its own photos and little stories. The best wrong turns in recorded history.", date: "Various", keywords: ["trips", "travel", "route"] },
  { id: "mp-5", place: "Japan", x: 85, y: 40, memory: "Reserved.", date: "Still waiting", future: true, keywords: ["japan", "travel", "future"] },
  { id: "mp-6", place: "Iceland", x: 42, y: 22, memory: "Reserved.", date: "Still waiting", future: true, keywords: ["iceland", "travel", "future"] },
  { id: "mp-7", place: "Kerala, again", x: 67, y: 55, memory: "Reserved.", date: "Still waiting", future: true, keywords: ["kerala", "travel", "future"] },
  { id: "mp-8", place: "The Mountain Café", x: 70, y: 38, memory: "Reserved.", date: "Still waiting", future: true, keywords: ["mountain", "cafe", "future"] },
  { id: "mp-9", place: "The Book Fair", x: 63, y: 46, memory: "Reserved.", date: "Still waiting", future: true, keywords: ["book fair", "books", "future"] },
];

/* ---------- Gallery 10: Constellation Room stars ---------- */
export interface Star {
  id: string;
  x: number;
  y: number;
  size: number;
  memory: string;
  keywords: string[];
}
export const stars: Star[] = [
  { id: "st-1", x: 15, y: 25, size: 3, memory: "The day you trusted me.", keywords: ["trust"] },
  { id: "st-2", x: 30, y: 15, size: 2, memory: "The first birthday.", keywords: ["birthday"] },
  { id: "st-3", x: 45, y: 30, size: 4, memory: "The first recommendation.", keywords: ["books", "recommendation"] },
  { id: "st-4", x: 60, y: 18, size: 2, memory: "The biggest laugh.", keywords: ["laugh", "funny"] },
  { id: "st-5", x: 75, y: 28, size: 3, memory: "The hardest conversation.", keywords: ["conversation", "hard"] },
  { id: "st-6", x: 25, y: 48, size: 2, memory: "The first \"Weak Memory.\"", keywords: ["weak memory"] },
  { id: "st-7", x: 50, y: 55, size: 3, memory: "The first \"Tough Guy.\"", keywords: ["tough guy"] },
  { id: "st-8", x: 70, y: 50, size: 2, memory: "The book that changed everything.", keywords: ["books", "changed"] },
  { id: "st-9", x: 85, y: 42, size: 3, memory: "The day you believed in yourself.", keywords: ["believed", "confidence"] },
  { id: "st-10", x: 38, y: 70, size: 2, memory: "The day you almost didn't.", keywords: ["almost", "doubt"] },
  { id: "st-11", x: 62, y: 72, size: 3, memory: "Every 'text me when you're home.' All of them. Filed here.", keywords: ["home", "care"] },
  { id: "st-12", x: 12, y: 65, size: 2, memory: "The moment this friendship became a load-bearing wall.", keywords: ["friendship"] },
];

export const brightestStarText = "The brightest memories usually felt completely ordinary while they were happening.";

/* ---------- Gallery 11: Letters Never Sent — 12 envelopes ---------- */
export interface Letter {
  id: string;
  title: string;
  body: string[];
  keywords: string[];
}
export const letters: Letter[] = [
  { id: "lt-1", title: "If I Had Said This Earlier", body: [
    "There are sentences I drafted a hundred times and never sent. Most of them were just this: I noticed. I always noticed.",
    "The way you show up tired and still show up. The way you make caring look accidental.",
    "If I had said this earlier, maybe you'd have believed it sooner. So here it is now, in ink, where it can't be unsaid.",
  ], keywords: ["letter", "earlier", "unsaid"] },
  { id: "lt-2", title: "When I Was Proud Of You", body: [
    "Every exam you passed while insisting you'd fail. Every patient who left your chair less afraid than they arrived.",
    "I never made a speech about it. You'd have hated a speech.",
    "But for the record, kept safely in this museum: I was proud. Loudly, silently proud.",
  ], keywords: ["proud", "exam", "dentist", "letter"] },
  { id: "lt-3", title: "When You Thought You Failed", body: [
    "You called it failure. I watched the same event and saw someone getting back up before the dust settled.",
    "You blamed destiny that day. I still think it was bad luck.",
    "Either way — you kept going. This letter exists so that version of you is never forgotten.",
  ], keywords: ["failed", "failure", "destiny", "letter"] },
  { id: "lt-4", title: "When You Didn't Believe Yourself", body: [
    "You have a habit of trusting everyone's judgment except your own.",
    "So borrow mine: you are more capable than your worst day told you.",
    "Keep this letter for the next time you forget. Knowing you, that's soon.",
  ], keywords: ["believe", "doubt", "letter"] },
  { id: "lt-5", title: "When You Called Yourself Difficult", body: [
    "You said it like a confession. Like a warning label.",
    "But the people who love you have never once used that word.",
    "Careful is not difficult. Guarded is not difficult. You are not difficult. You are worth the patience — and it isn't even that much patience.",
  ], keywords: ["difficult", "letter"] },
  { id: "lt-6", title: "When You Trusted Me", body: [
    "I know what trust costs you. I know it isn't given — it's lent, carefully, and watched.",
    "So when you handed it over, I understood what I was holding.",
    "I still do. Some locks protect what's inside. Thank you for opening this one.",
  ], keywords: ["trust", "letter"] },
  { id: "lt-7", title: "When You Were Quiet", body: [
    "Your silences have dialects. I've learned most of them.",
    "The tired one. The overwhelmed one. The one that means 'ask me again, gently.'",
    "For all the times I read them right — good. For the times I missed — this letter is the apology.",
  ], keywords: ["quiet", "silence", "letter"] },
  { id: "lt-8", title: "When I Wanted To Make You Smile", body: [
    "Which was often. Which was always, honestly.",
    "Every bad joke, every meme sent at surgical timing, every 'read this' — all of it had one job.",
    "Your real smile — the one you think is ordinary — was worth every terrible pun it cost.",
  ], keywords: ["smile", "jokes", "letter"] },
  { id: "lt-9", title: "When We Didn't Talk", body: [
    "There were gaps. Life does that.",
    "But the friendship never felt paused to me — just quietly holding its page, like a bookmark.",
    "We always picked up mid-sentence. We always will.",
  ], keywords: ["gap", "distance", "letter"] },
  { id: "lt-10", title: "On Your Birthday", body: [
    "Every year I try to find the words, and every year they come out as cake and bad singing.",
    "This year they came out as a museum.",
    "Happy Birthday, Chicko. The exhibits were never about the past. They were about you.",
  ], keywords: ["birthday", "letter"] },
  { id: "lt-11", title: "For Every Version of You I Haven't Met Yet", body: [
    "To the you of next year, and the one after: I hope you're still reading too many books.",
    "I hope you've stopped apologising for existing. I hope you trust a little faster — or don't, and stay exactly as careful as you are.",
    "Whoever you become, this museum has already reserved a wing.",
  ], keywords: ["future", "versions", "letter"] },
  { id: "lt-12", title: "Always", body: [
    "No occasion for this one. No date. No reason.",
    "Just the standing fact, filed under permanent records:",
    "Whatever chapter, whatever year, whatever mood — always.",
  ], keywords: ["always", "letter"] },
];

export const hiddenLetterText = "The rest of the story still hasn't been written.";

/* ---------- Gallery 12: The Future Wing ---------- */
export const futureLabels: { title: string; status: string }[] = [
  { title: "Exhibit 2032", status: "Not collected yet." },
  { title: "Shared Bookstore", status: "Coming Soon." },
  { title: "Another Random Laugh", status: "Pending." },
  { title: "The Next Recommendation", status: "Unknown." },
  { title: "Another Birthday", status: "Reserved." },
  { title: "Another Trip", status: "Awaiting confirmation." },
  { title: "Another Chapter", status: "To be written." },
];
export const futureFrameLabel = "Reserved for the version of you that neither of us has met yet.";

/* ---------- Finale ---------- */
export const corridorFrames: string[] = [
  "You laughed here.",
  "You trusted here.",
  "You grew here.",
  "You forgave here.",
  "You kept going.",
  "You stayed.",
  "You became yourself.",
];

export const epilogueLines: string[] = [
  "Some museums are built to preserve history.",
  "This one was built to remember gratitude.",
  "Thank you for unknowingly leaving so many beautiful things behind.",
  "Happy Birthday, Chicko.",
];

export const postCreditsLetter: string[] = [
  "Dear Chicko,",
  "Museums usually preserve history. This one was never really about history.",
  "It was about gratitude. About all the ordinary conversations, random jokes, books, difficult days, tiny victories, and little moments that quietly became part of my life because you were there.",
  "You once told me that memories fade. Maybe they do.",
  "That's exactly why I built this place. Not so we'd never forget. But so that years from now, if either of us ever wondered whether those ordinary moments mattered... there would be somewhere we could come back to and smile.",
  "Happy Birthday.",
  "Love, Weak Memory",
];

export const creditsCards: { role: string; name: string }[] = [
  { role: "Curator", name: "Weak Memory" },
  { role: "Permanent Visitor", name: "Chicko" },
  { role: "Museum Guide", name: "The Archivist" },
  { role: "Collection", name: "Every ordinary moment that quietly became unforgettable." },
  { role: "Status", name: "Open." },
];

/* ---------- The Archivist (guide robin) ---------- */
export const birdFacts: string[] = [
  "Look closer.",
  "You almost missed something.",
  "Some memories hide.",
  "The drawers open, you know.",
  "Try lifting things. Gently.",
  "The mirror in Gallery Two isn't an ordinary mirror.",
  "There's a locked box in the Little Things Room. Keep walking.",
  "The brightest star waits until you've seen every room.",
  "Some stories are hidden on purpose.",
  "I am the guide. Not the exhibit.",
];

/* ---------- Museum Rules (per spec) ---------- */
export const museumRules: string[] = [
  "Walk slowly.",
  "Read everything.",
  "Smile whenever possible.",
  "Cry only if absolutely necessary.",
  "Feel free to revisit your favourite exhibits.",
  "Some memories are interactive.",
  "Some memories interact with you.",
  "The exit exists. The memories don't.",
];

/* ---------- The Dear Chicko letter (intro hall, Lift Plaque) ---------- */
export const dearChickoLetter: string[] = [
  "Dear Chicko,",
  "If you're reading this... then congratulations.",
  "None of these exhibits exist because I wanted to remember everything. They exist because you made ordinary moments worth remembering.",
  "Don't worry. Entry is free. Photography is allowed. Smiling is encouraged. Crying... also allowed.",
  "Over the next few rooms you'll see photographs, conversations, books, tiny moments, and memories. Most of them probably seemed ordinary when they happened.",
  "That's the funny thing about ordinary moments. You rarely realize they're becoming memories.",
  "This museum isn't here to tell you who you are. You already know that better than anyone.",
  "It's simply here to show you what it looked like from where I was standing.",
  "So... take your time. Look closely. Some exhibits are louder than others. Some are hiding. And a few... only appear if you're curious enough to find them.",
  "Happy Birthday. ❤️",
  "Signed, Weak Memory",
];

/* ---------- Searchable index for Archive Search ---------- */
export interface SearchItem {
  id: string;
  gallery: string;
  galleryAnchor: string;
  title: string;
  snippet: string;
  keywords: string[];
}
export function buildSearchIndex(): SearchItem[] {
  const items: SearchItem[] = [];
  timeline.forEach((t) => items.push({ id: `tl-${t.year}`, gallery: "Gallery 1 · The Girl I Met", galleryAnchor: "gallery-1", title: `${t.year} — ${t.title}`, snippet: t.text, keywords: t.keywords }));
  memoryCards.forEach((m) => items.push({ id: m.no, gallery: "Gallery 1 · The Girl I Met", galleryAnchor: "gallery-1", title: m.no, snippet: m.text, keywords: m.keywords }));
  becameWalls.forEach((w) => items.push({ id: w.id, gallery: "Gallery 2 · The Person You Became", galleryAnchor: "gallery-2", title: w.title, snippet: w.lines.join(" "), keywords: w.keywords }));
  observations.forEach((o) => items.push({ id: o.id, gallery: "Gallery 3 · The Things You Never Notice", galleryAnchor: "gallery-3", title: o.frame, snippet: o.text, keywords: o.keywords }));
  evidence.forEach((e) => items.push({ id: e.id, gallery: "Gallery 4 · The Evidence Room", galleryAnchor: "gallery-4", title: e.title, snippet: e.context, keywords: e.keywords }));
  books.forEach((b) => items.push({ id: b.id, gallery: "Gallery 5 · The Library of Us", galleryAnchor: "gallery-5", title: b.title, snippet: b.note, keywords: b.keywords }));
  cassettes.forEach((c) => items.push({ id: c.id, gallery: "Gallery 6 · The Sound Room", galleryAnchor: "gallery-6", title: `Cassette: ${c.label}`, snippet: c.why, keywords: c.keywords }));
  songs.forEach((s) => items.push({ id: s.id, gallery: "Gallery 6 · The Sound Room", galleryAnchor: "gallery-6", title: s.title, snippet: s.why, keywords: s.keywords }));
  cabinets.forEach((c) => items.push({ id: c.id, gallery: "Gallery 7 · The Little Things Room", galleryAnchor: "gallery-7", title: c.label, snippet: c.explanation, keywords: c.keywords }));
  mapPins.forEach((m) => items.push({ id: m.id, gallery: "Gallery 9 · The Map of Memories", galleryAnchor: "gallery-9", title: m.place, snippet: m.memory, keywords: m.keywords }));
  stars.forEach((s) => items.push({ id: s.id, gallery: "Gallery 10 · The Constellation Room", galleryAnchor: "gallery-10", title: "A star-memory", snippet: s.memory, keywords: s.keywords }));
  letters.forEach((l) => items.push({ id: l.id, gallery: "Gallery 11 · Letters Never Sent", galleryAnchor: "gallery-11", title: l.title, snippet: l.body[0], keywords: l.keywords }));
  return items;
}

/* ---------- Memories pool for featured/random ---------- */
export interface MemoryCard {
  title: string;
  text: string;
  gallery: string;
  anchor: string;
}
export function allMemories(): MemoryCard[] {
  const pool: MemoryCard[] = [];
  timeline.forEach((t) => pool.push({ title: `${t.year} — ${t.title}`, text: t.text, gallery: "The Girl I Met", anchor: "gallery-1" }));
  memoryCards.forEach((m) => pool.push({ title: m.no, text: m.text, gallery: "The Girl I Met", anchor: "gallery-1" }));
  observations.forEach((o) => pool.push({ title: o.frame, text: o.text, gallery: "The Things You Never Notice", anchor: "gallery-3" }));
  evidence.forEach((e) => pool.push({ title: e.title, text: e.context, gallery: "The Evidence Room", anchor: "gallery-4" }));
  books.forEach((b) => pool.push({ title: b.title, text: b.note, gallery: "The Library of Us", anchor: "gallery-5" }));
  stars.forEach((s) => pool.push({ title: "A star-memory", text: s.memory, gallery: "The Constellation Room", anchor: "gallery-10" }));
  return pool;
}

/* ---------- Compliments (mirror & machine reuse) ---------- */
export interface Polaroid {
  id: string;
  caption: string;
  back: string;
  hue: number;
  keywords: string[];
}
export const polaroids: Polaroid[] = [
  { id: "ph-1", caption: "the laughing one", back: "I don't remember the joke. I remember not being able to breathe.", hue: 35, keywords: ["photo", "laugh"] },
  { id: "ph-2", caption: "the first café", back: "The order was judged. The conversation outlasted the café's opening hours.", hue: 25, keywords: ["cafe", "photo", "coffee"] },
  { id: "ph-3", caption: "the trip", back: "We got lost for two hours. Best wrong turn in recorded history.", hue: 200, keywords: ["trip", "travel", "photo"] },
  { id: "ph-4", caption: "birthday no. ?", back: "The cake was average. The company carried the entire event.", hue: 320, keywords: ["birthday", "cake", "photo"] },
  { id: "ph-5", caption: "the study disaster", back: "Two textbooks open. Zero pages read. One friendship maintained.", hue: 120, keywords: ["study", "photo", "exam"] },
  { id: "ph-6", caption: "monsoon walk", back: "One umbrella. Two people. Physics was not on our side.", hue: 210, keywords: ["rain", "walk", "photo"] },
  { id: "ph-7", caption: "the bookstore raid", back: "Went in for one book. Left with nine. Support group pending.", hue: 45, keywords: ["books", "photo", "bookstore"] },
  { id: "ph-8", caption: "the quiet evening", back: "No photo does this one justice. Filed under: you had to be there.", hue: 270, keywords: ["evening", "photo", "quiet"] },
];

export const compliments: string[] = [
  "You make people feel safe.", "You notice little things nobody else does.", "You're kinder than you think.",
  "You're stronger than you realise.", "Your laugh is a public service.", "You give the best book recommendations.",
  "You make ordinary days feel important.", "You listen like it's an art form.", "Rooms are warmer with you in them.",
  "You keep promises like they're sacred.", "Your stubbornness is secretly loyalty.", "You make hard days survivable.",
  "You remember what people say. That's rare.", "You're the friend people hope to find.", "Your advice ages well.",
  "You're braver than your doubts.", "You turn small moments into stories.", "You care in ways words can't hold.",
  "You're impossible to replace.", "Your patience deserves a medal.", "You make people want to be better.",
  "You've never once been boring.", "Your heart works overtime, quietly.", "You're the calm in other people's storms.",
  "You see people. Really see them.", "You're proof that gentle is not weak.", "You'd be the first pick, every time.",
  "You make silence comfortable.", "You hold people up without them noticing.", "Your smile fixes minor emergencies.",
  "You forgive like it costs nothing.", "You're wiser than you give yourself credit for.",
  "Your loyalty could move tectonic plates.", "You're someone's favourite hello.", "You're nobody's second choice.",
  "You make growing up feel less terrifying.", "You're the reason this museum exists.",
];
