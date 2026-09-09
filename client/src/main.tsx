import { createRoot } from "react-dom/client";
import { hydrateMuseumData } from "./lib/museumDataLoader";
import "./index.css";

async function startMuseum() {
  // Uploaded audio can exceed localStorage limits, so restore the durable
  // IndexedDB curator data before any gallery module reads its live bindings.
  await hydrateMuseumData();
  const { default: App } = await import("./App");
  createRoot(document.getElementById("root")!).render(<App />);
}

void startMuseum();
