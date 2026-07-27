/**
 * Curator Mode Context — manages curator state, undo/redo stack, and data mutations.
 * All gallery edits go through this context. Changes are saved to localStorage.
 */
import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { getMuseumData, saveMuseumData, resetMuseumData, exportMuseumData, importMuseumData, defaultMuseumData, type MuseumData } from "@/lib/museumDataLoader";

/** Notify the public museum (compat layer + open tabs) that data changed. */
function notifyDataChanged() {
  try { window.dispatchEvent(new Event("moc-data-changed")); } catch { /* ignore */ }
}

interface CuratorContextValue {
  isCurator: boolean;
  setIsCurator: (v: boolean) => void;
  // Current working copy of museum data
  data: MuseumData;
  setData: (updater: (prev: MuseumData) => MuseumData) => void;
  // Refresh from storage
  refreshData: () => void;
  // Save to localStorage
  save: () => void;
  // Undo/Redo
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  // Reset
  resetSection: (key: keyof MuseumData) => void;
  resetAll: () => void;
  // Export/Import
  exportData: () => void;
  importData: (json: string) => boolean;
  // Active gallery tab
  activeGallery: number;
  setActiveGallery: (n: number) => void;
}

const CuratorCtx = createContext<CuratorContextValue | null>(null);

export function CuratorProvider({ children }: { children: React.ReactNode }) {
  // Curator mode is NEVER persisted — it only activates via an explicit trigger
  // (secret key combo, /curator route, or ?curator=true) so visitors never see it.
  const [isCurator, setIsCurator] = useState(false);
  const [data, setDataState] = useState<MuseumData>(() => getMuseumData());
  const [activeGallery, setActiveGallery] = useState(1);
  const undoStackRef = useRef<MuseumData[]>([]);
  const redoStackRef = useRef<MuseumData[]>([]);

  const persistCuratorMode = useCallback((v: boolean) => {
    setIsCurator(v);
    // Clean up any legacy persisted flag so curator mode never leaks to visitors
    try { localStorage.removeItem("moc-curator-mode"); } catch { /* ignore */ }
    if (v) {
      // Entering curator mode: refresh working copy from storage
      setDataState(getMuseumData());
    }
  }, []);

  const save = useCallback(() => {
    setDataState((prev) => {
      saveMuseumData(prev);
      notifyDataChanged();
      return prev;
    });
  }, []);

  const refreshData = useCallback(() => {
    setDataState(getMuseumData());
    undoStackRef.current = [];
    redoStackRef.current = [];
  }, []);

  const [historyVersion, setHistoryVersion] = useState(0);

  const setData = useCallback((updater: (prev: MuseumData) => MuseumData) => {
    setDataState((prev) => {
      const next = updater(prev);
      undoStackRef.current = [...undoStackRef.current.slice(-50), prev];
      redoStackRef.current = [];
      // Live preview: persist immediately so the public museum reflects edits instantly
      saveMuseumData(next);
      notifyDataChanged();
      return next;
    });
    setHistoryVersion((v) => v + 1);
  }, []);

  const undo = useCallback(() => {
    setDataState((prev) => {
      if (undoStackRef.current.length === 0) return prev;
      const prevEntry = undoStackRef.current[undoStackRef.current.length - 1];
      undoStackRef.current = undoStackRef.current.slice(0, -1);
      redoStackRef.current = [...redoStackRef.current, prev];
      saveMuseumData(prevEntry);
      notifyDataChanged();
      return prevEntry;
    });
    setHistoryVersion((v) => v + 1);
  }, []);

  const redo = useCallback(() => {
    setDataState((prev) => {
      if (redoStackRef.current.length === 0) return prev;
      const nextEntry = redoStackRef.current[redoStackRef.current.length - 1];
      redoStackRef.current = redoStackRef.current.slice(0, -1);
      undoStackRef.current = [...undoStackRef.current, prev];
      saveMuseumData(nextEntry);
      notifyDataChanged();
      return nextEntry;
    });
    setHistoryVersion((v) => v + 1);
  }, []);

  // historyVersion is referenced so canUndo/canRedo re-evaluate after each history change
  void historyVersion;
  const canUndo = undoStackRef.current.length > 0;
  const canRedo = redoStackRef.current.length > 0;

  const resetSection = useCallback((key: keyof MuseumData) => {
    setDataState((prev) => {
      // Restore this section from the pristine bundled JSON defaults
      const defaults = defaultMuseumData as MuseumData;
      const updated = { ...prev, [key]: JSON.parse(JSON.stringify(defaults[key])) };
      undoStackRef.current = [...undoStackRef.current.slice(-50), prev];
      redoStackRef.current = [];
      saveMuseumData(updated);
      notifyDataChanged();
      return updated;
    });
    setHistoryVersion((v) => v + 1);
  }, []);

  const resetAll = useCallback(() => {
    setDataState((prev) => {
      undoStackRef.current = [...undoStackRef.current.slice(-50), prev];
      redoStackRef.current = [];
      resetMuseumData();
      notifyDataChanged();
      return getMuseumData();
    });
    setHistoryVersion((v) => v + 1);
  }, []);

  const exportData = useCallback(() => {
    const json = exportMuseumData();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `museum-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const importDataFn = useCallback((json: string) => {
    const result = importMuseumData(json);
    if (result) {
      setDataState((prev) => {
        undoStackRef.current = [...undoStackRef.current.slice(-50), prev];
        redoStackRef.current = [];
        return result;
      });
      notifyDataChanged();
      setHistoryVersion((v) => v + 1);
      return true;
    }
    return false;
  }, []);

  const value = useMemo<CuratorContextValue>(() => ({
    isCurator,
    setIsCurator: persistCuratorMode,
    data,
    setData,
    refreshData,
    save,
    undo,
    redo,
    canUndo,
    canRedo,
    resetSection,
    resetAll,
    exportData,
    importData: importDataFn,
    activeGallery,
    setActiveGallery,
  }), [isCurator, persistCuratorMode, data, setData, refreshData, save, undo, redo, canUndo, canRedo, resetSection, resetAll, exportData, importDataFn, activeGallery, historyVersion]);

  return <CuratorCtx.Provider value={value}>{children}</CuratorCtx.Provider>;
}

export function useCurator() {
  const ctx = useContext(CuratorCtx);
  if (!ctx) throw new Error("useCurator must be used within CuratorProvider");
  return ctx;
}
