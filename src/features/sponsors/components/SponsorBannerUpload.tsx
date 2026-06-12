import { useRef, useState, ChangeEvent, DragEvent } from "react";

interface SponsorBannerUploadProps {
  preview: string;
  error?: string;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
}

export default function SponsorBannerUpload({ preview, error, onFileSelect, onFileRemove }: SponsorBannerUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function processFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    onFileSelect(file);
  }

  return (
    <div className="flex flex-col gap-1">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
        className="hidden"
      />

      {preview ? (
        <div className="relative overflow-hidden rounded-lg border border-gray-200">
          <img src={preview} alt="Aperçu" className="h-32 w-full object-cover" />
          <button
            type="button"
            onClick={() => { onFileRemove(); if (fileInputRef.current) fileInputRef.current.value = ""; }}
            className="absolute right-2 top-2 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-red-600 hover:bg-red-50"
          >
            Supprimer
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); const file = e.dataTransfer.files?.[0]; if (file) processFile(file); }}
          className={[
            "flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed p-8 transition-colors",
            isDragging ? "border-blue-400 bg-blue-50" : "border-gray-300 bg-gray-50 hover:bg-gray-100",
            error ? "border-red-300 bg-red-50" : "",
          ].join(" ")}
        >
          <span className="text-sm text-gray-600">Cliquez ou glissez une image ici</span>
          <span className="text-xs text-gray-400">PNG, JPG, WEBP — max 3 Mo</span>
        </div>
      )}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}