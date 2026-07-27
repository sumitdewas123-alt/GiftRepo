/**
 * Image upload utility — converts files to base64 data URLs for JSON storage.
 * Used throughout Curator Mode for gallery images.
 */
import { useCallback, useState } from "react";

export function useImageUpload(initialValue: string | null = null) {
  const [image, setImage] = useState<string | null>(initialValue);
  const [preview, setPreview] = useState<string | null>(initialValue);

  const handleUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setImage(dataUrl);
      setPreview(dataUrl);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleRemove = useCallback(() => {
    setImage(null);
    setPreview(null);
  }, []);

  const handleReplace = useCallback((file: File) => {
    handleUpload(file);
  }, [handleUpload]);

  return { image, preview, handleUpload, handleRemove, handleReplace, setPreview };
}

// Utility: convert file to base64
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
