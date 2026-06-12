import { ChangeEvent, DragEvent, useRef } from "react";

interface BonPlanImageUploadProps {
  preview: string;                  // URL ou Base64 pour afficher l'image
  error?: string;                   // Message d'erreur éventuel (ex: taille trop grande)
  onFileSelect: (file: File) => void; // Callback quand une image est sélectionnée
  onFileRemove: () => void;         // Callback quand l'image est supprimée
}

export default function BonPlanImageUpload({
  preview,
  error,
  onFileSelect,
  onFileRemove,
}: BonPlanImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Déclenche le clic sur le vrai input hidden
  const handleZoneClick = () => {
    fileInputRef.current?.click();
  };

  // Gestion de la sélection classique via explorateur de fichiers
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  // Gestion du Drag & Drop : Empêche le navigateur d'ouvrir l'image
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      // On s'assure que c'est bien une image
      if (files[0].type.startsWith("image/")) {
        onFileSelect(files[0]);
      }
    }
  };

  return (
    <div className="w-full">
      {/* Input de fichier masqué pour styliser la zone librement */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {preview ? (
        /* --- VUE PRÉVISUALISATION --- */
        <div className="relative rounded-lg border border-gray-200 bg-gray-50 p-2">
          <img
            src={preview}
            alt="Aperçu du bon plan"
            className="h-48 w-full rounded-md object-cover"
          />
          
          {/* Bouton pour supprimer ou changer l'image */}
          <button
            type="button"
            onClick={onFileRemove}
            className="absolute top-4 right-4 rounded-full bg-red-600 p-2 text-white shadow-md hover:bg-red-700 transition-colors focus:outline-none"
            title="Supprimer l'image"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
          </button>
        </div>
      ) : (
        /* --- VUE ZONE DE TÉLÉVERSEMENT (VIDE) --- */
        <div
          onClick={handleZoneClick}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center cursor-pointer transition-colors ${
            error
              ? "border-red-300 bg-red-50 hover:bg-red-100"
              : "border-gray-300 bg-gray-50 hover:bg-gray-100 focus:border-teal-400"
          }`}
        >
          {/* Icône de téléversement */}
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          
          <div className="mt-2 flex text-sm text-gray-600">
            <span className="font-semibold text-teal-600 hover:text-teal-700">
              Télécharger un fichier
            </span>
            <p className="pl-1">ou glisser-déposer</p>
          </div>
          <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP jusqu'à 3 Mo</p>
        </div>
      )}

      {/* Affichage de l'erreur liée au fichier */}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}