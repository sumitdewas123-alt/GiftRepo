/**
 * Curator Activator — handles all three entry points:
 * 1. Secret key combination: Ctrl+Shift+C
 * 2. Visiting /curator route
 * 3. Adding ?curator=true to URL
 *
 * Visitors should never know Curator Mode exists.
 * The public museum experience remains exactly the same.
 */
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useCurator } from "./CuratorContext";

export default function CuratorActivator() {
  const [location, navigate] = useLocation();
  const { isCurator, setIsCurator } = useCurator();
  const [isCuratorRoute, setIsCuratorRoute] = useState(false);

  useEffect(() => {
    // Check for /curator route
    if (location === "/curator") {
      setIsCurator(true);
      setIsCuratorRoute(true);
      // Don't redirect — show curator mode at /curator
      return;
    }
  }, [location, setIsCurator]);

  useEffect(() => {
    // Check for ?curator=true query param (must be explicitly "true" or "1")
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const v = params.get("curator");
      if (v === "true" || v === "1") {
        setIsCurator(true);
      }
    }
  }, [location, setIsCurator]);

  useEffect(() => {
    // Secret key combination: Ctrl+Shift+C
    const onKey = (e: KeyboardEvent) => {
      // Ignore when typing in form fields
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) return;

      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "c") {
        e.preventDefault();
        setIsCurator(!isCurator);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isCurator, setIsCurator]);

  // If we're on /curator route, show curator mode
  if (isCuratorRoute) {
    return null; // CuratorMode component handles rendering
  }

  return null; // No visible UI for visitors
}
