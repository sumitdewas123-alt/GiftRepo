/* Gilded Archive — footer: QR code for sharing, museum clock easter egg, credits */
import { useEffect, useState } from "react";
import { useMuseum } from "@/contexts/MuseumContext";
import { soundEngine } from "@/lib/soundEngine";
import { toast } from "sonner";

export default function MuseumFooter() {
  const { altTrack, toggleTrack } = useMuseum();
  const [url, setUrl] = useState("");
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    setUrl(window.location.href.split("#")[0]);
    const iv = setInterval(() => setTime(new Date()), 30000);
    return () => clearInterval(iv);
  }, []);

  const clickClock = () => {
    const next = !altTrack;
    toggleTrack();
    soundEngine.setTrack(next ? "nocturne" : "gallery");
    soundEngine.chime();
    toast(next ? "🕰️ The museum clock chimes… a different melody drifts through the halls." : "🕰️ The clock settles. The usual soundtrack returns.");
  };

  const qrSrc = url
    ? `https://api.qrserver.com/v1/create-qr-code/?size=180x180&color=5a4327&bgcolor=f5efe3&data=${encodeURIComponent(url)}`
    : "";

  return (
    <footer className="paper-texture border-t border-border bg-[oklch(0.28_0.03_60)] py-16 text-[#d8c9a5]" aria-label="Museum exit">
      <div className="container">
        <div className="grid gap-10 text-center md:grid-cols-3 md:text-left">
          <div>
            <img src="/manus-storage/logo-bird_bdea2d3a.png" alt="Museum of Chicko emblem" className="mx-auto mb-3 h-12 w-12 md:mx-0" />
            <p className="font-display text-lg tracking-[0.2em] text-[#efe2c2]">THE MUSEUM OF CHICKO</p>
            <p className="mt-1 font-body text-sm italic">Since 2015 · Admission: one smile</p>
            <button
              onClick={clickClock}
              aria-label="The museum clock — click to change the soundtrack"
              title="The museum clock (try clicking it)"
              className="mt-4 inline-flex items-center gap-2 border border-[#c9a45c]/40 px-4 py-2 font-display text-sm tracking-widest text-[#e8cd8c] transition-all duration-200 hover:bg-[#c9a45c]/15 focus:outline-none focus:ring-2 focus:ring-[#c9a45c] active:scale-[0.97]"
            >
              🕰️ {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </button>
          </div>
          <div className="flex flex-col items-center justify-center">
            {qrSrc && (
              <div className="border-4 border-[#c9a45c]/50 bg-[#f5efe3] p-2 shadow-lg">
                <img src={qrSrc} alt="QR code linking to The Museum of Chicko" width={140} height={140} loading="lazy" />
              </div>
            )}
            <p className="mt-3 max-w-[14rem] text-center font-hand text-lg">scan to carry the museum in your pocket</p>
          </div>
          <div className="flex flex-col justify-center md:items-end">
            <p className="plaque !border-[#c9a45c]/40 !bg-transparent !text-[#c9a45c]">visitor information</p>
            <ul className="mt-3 space-y-1 font-body text-sm italic md:text-right">
              <li>Open: always, especially at 2 a.m.</li>
              <li>Exit: through the gift shop of your own memories.</li>
              <li>Lost &amp; Found: everything important was kept.</li>
            </ul>
            <p className="mt-4 font-body text-xs opacity-60">Built with an unreasonable amount of love.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
