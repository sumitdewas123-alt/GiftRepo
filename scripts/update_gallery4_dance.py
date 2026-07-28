#!/usr/bin/env python3
"""One-off migration: transform gallery4 (Library of Us) into the Dance Studio of Her Story."""
import json

PATH = "client/src/lib/museum.json"

d = json.load(open(PATH))

d["gallery4"] = {
    "roomTitle": "The Dance Studio of Her Story",
    "roomSubtitle": "Some stories are written with words. Yours was often written with movement.",
    "wallTitle": "The Performances That Became Memories",
    "wallHint": "open a frame \u00b7 the projector still works",
    "centerpieceTitle": "Dances That Told Your Story",
    "centerpieceText": "Dance was never just a hobby. It became another language \u2014 another way she expressed joy, discipline, confidence and emotion. Someone carefully preserved years of performances here. Walk slowly.",
    "reservedChairQuote": "Some stories are written with words. Yours was often written with movement.",
    "reservedChairLeft": "Reserved for Chicko",
    "reservedChairRight": "Reserved for the Audience of One",
    "performances": [
        {
            "id": "perf-1",
            "title": "The First Performance",
            "year": "2016",
            "description": "The lights were too bright and the music started half a beat early. None of it mattered once you began.",
            "location": "School Annual Day",
            "memory": "You said you were nervous. Nobody in the audience could tell.",
            "curatorNote": "Archived from memory. The recording is imperfect; the moment was not.",
            "quote": "",
            "thumbnail": None,
            "video": None,
            "videoType": "none",
            "keywords": ["first performance", "dance", "school", "2016"]
        },
        {
            "id": "perf-2",
            "title": "The One With The Red Dupatta",
            "year": "2018",
            "description": "A classical piece that somehow made a crowded hall feel completely silent.",
            "location": "College Cultural Fest",
            "memory": "The spin at the end \u2014 the whole row stood up. You didn't see it. You never looked at the audience.",
            "curatorNote": "",
            "quote": "",
            "thumbnail": None,
            "video": None,
            "videoType": "none",
            "keywords": ["classical", "dance", "college", "2018"]
        },
        {
            "id": "perf-3",
            "title": "The Living Room Rehearsal",
            "year": "2020",
            "description": "Lockdown edition. Furniture pushed aside. A phone propped against a stack of books served as the only camera.",
            "location": "Home",
            "memory": "Proof that a stage is optional. The dancing never was.",
            "curatorNote": "The most honest recording in this collection.",
            "quote": "",
            "thumbnail": None,
            "video": None,
            "videoType": "none",
            "keywords": ["lockdown", "home", "rehearsal", "2020"]
        },
        {
            "id": "perf-4",
            "title": "The Wedding Sangeet Surprise",
            "year": "2022",
            "description": "Three weeks of secret practice for four minutes that stole the entire evening.",
            "location": "A cousin's wedding",
            "memory": "Aunties asked for choreography lessons afterwards. You laughed for ten minutes.",
            "curatorNote": "",
            "quote": "",
            "thumbnail": None,
            "video": None,
            "videoType": "none",
            "keywords": ["sangeet", "wedding", "dance", "2022"]
        },
        {
            "id": "perf-5",
            "title": "The One She Doesn't Know I Saved",
            "year": "2023",
            "description": "An unguarded moment. Music playing, nobody supposed to be watching. The best performances rarely have an audience.",
            "location": "Undisclosed",
            "memory": "Filed under: evidence that joy has a body language.",
            "curatorNote": "This frame stays slightly crooked on purpose.",
            "quote": "",
            "thumbnail": None,
            "video": None,
            "videoType": "none",
            "keywords": ["candid", "secret", "dance", "2023"]
        },
        {
            "id": "perf-6",
            "title": "Still Dancing",
            "year": "Today",
            "description": "The most recent entry in a collection that refuses to close.",
            "location": "Everywhere",
            "memory": "The acquisition department reports no plans to stop.",
            "curatorNote": "",
            "quote": "",
            "thumbnail": None,
            "video": None,
            "videoType": "none",
            "keywords": ["dance", "today", "ongoing"]
        }
    ],
    "specialExhibits": [
        {"id": "sx-1", "label": "First Performance", "performanceId": "perf-1", "note": "Where the language was first spoken in public."},
        {"id": "sx-2", "label": "Favorite Performance", "performanceId": "perf-2", "note": "By unanimous vote of a jury of one."},
        {"id": "sx-3", "label": "Most Emotional Performance", "performanceId": "perf-4", "note": "Nobody remembers the decorations. Everybody remembers the dance."},
        {"id": "sx-4", "label": "The One She Doesn't Know I Saved", "performanceId": "perf-5", "note": "Shhh."},
        {"id": "sx-5", "label": "Every Performance Together", "performanceId": "", "note": "A standing exhibit. It grows every year."},
        {"id": "sx-6", "label": "Performances That Made Me Proud", "performanceId": "", "note": "Curatorial note: all of them. This label is a formality."}
    ],
    "studioCase": [
        {"id": "sc-1", "emoji": "\U0001FA70", "label": "The Dance Shoes", "note": "Worn soft at exactly the places hard work lives."},
        {"id": "sc-2", "emoji": "\U0001F39F\uFE0F", "label": "Backstage Pass", "note": "Access: everywhere. Expiry: never."},
        {"id": "sc-3", "emoji": "\U0001F3C5", "label": "Medals & Ribbons", "note": "The shiny ones matter less than the practice bruises that earned them."},
        {"id": "sc-4", "emoji": "\U0001F4D3", "label": "Rehearsal Notebook", "note": "Counts written in the margins. 5-6-7-8, repeated like a prayer."},
        {"id": "sc-5", "emoji": "\U0001F4CB", "label": "Old Performance Programs", "note": "Her name, printed small, in evenings that felt enormous."},
        {"id": "sc-6", "emoji": "\U0001F3B5", "label": "Music Cue Sheet", "note": "Highlighted, annotated, memorised anyway."}
    ],
    "hiddenNote": "You never looked at the audience. You just danced.",
    "hiddenCompartmentNote": "Behind the fourth frame, tucked into the ballet barre, there's a note. It says: \"This studio was never really about the steps.\"",
    "hairpinNote": "A forgotten hairpin, catalogued with full museum honours. Exhibit condition: bent. Sentimental value: priceless.",
    "scheduleNote": "A folded performance schedule. Every entry circled. Someone never intended to miss a single one."
}

json.dump(d, open(PATH, "w"), indent=2, ensure_ascii=False)
print("gallery4 replaced. performances:", len(d["gallery4"]["performances"]))
