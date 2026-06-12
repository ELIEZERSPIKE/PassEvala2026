import { useState, ChangeEvent, FormEvent } from "react";
import { getImageUrl } from '../../../utils/imageUtils';
import BonPlanImageUpload from "./BonPlanImageUpload";
import { useBonPlanMutation } from "../hooks/useBonPlanmutation";

export interface BonPlan {
  id: number;
  title: string;
  description: string | null;
  category: string | null;
  image_path: string | null;
  created_at: string;
  updated_at: string;
}

interface BonPlanFormProps {
  bonPlan?: BonPlan;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function BonPlanForm({ bonPlan, onSuccess, onCancel }: BonPlanFormProps) {
  const isEditMode = Boolean(bonPlan?.id);
  const { createBonPlan, updateBonPlan, loading, error: apiError, validationErrors } = useBonPlanMutation();

  const [fields, setFields] = useState({
    title: bonPlan?.title ?? "",
    description: bonPlan?.description ?? "",
    category: bonPlan?.category ?? "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(bonPlan?.image_path ? getImageUrl(bonPlan.image_path) : "");
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
  }

  function handleFileSelect(file: File) {
    if (file.size > 3 * 1024 * 1024) {
      setLocalErrors({ image_path: "L'image ne doit pas dépasser 3 Mo." });
      return;
    }
    setImageFile(file);
    setLocalErrors({});
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // Validation locale basée sur votre 'required' Laravel
    if (!fields.title.trim()) {
      setLocalErrors({ title: "Le titre du bon plan est obligatoire." });
      return;
    }

    const formData = new FormData();
    Object.keys(fields).forEach((key) => {
      const val = fields[key as keyof typeof fields];
      formData.append(key, String(val ?? ""));
    });

    if (imageFile) {
      formData.append("image_path", imageFile);
    }

    // Gestion de la suppression de l'image en mode édition si vidée
    if (isEditMode && !imageFile && !imagePreview && bonPlan?.image_path) {
      formData.append('_clear_image', '1');
    }

    // Simulation du PUT avec FormData pour Laravel
    if (isEditMode) {
      formData.append("_method", "PUT");
    }

    const result = isEditMode
      ? await updateBonPlan(bonPlan!.id, formData)
      : await createBonPlan(formData);

    if (result) onSuccess?.();
  }

  const activeErrors = { ...localErrors, ...validationErrors };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {apiError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {apiError}
        </div>
      )}

      <div className="grid gap-4">
        {/* Champ Titre */}
        <div>
          <label className="text-sm font-medium text-gray-600">Titre du bon plan *</label>
          <input
            type="text"
            name="title"
            value={fields.title}
            onChange={handleChange}
            className="w-full rounded-lg border px-3 py-2 text-sm outline-none border-gray-200 focus:border-teal-400"
          />
          {activeErrors.title && <p className="text-xs text-red-600 mt-1">{activeErrors.title}</p>}
        </div>

        {/* Champ Catégorie */}
        <div>
          <label className="text-sm font-medium text-gray-600">Catégorie</label>
          <input
            type="text"
            name="category"
            value={fields.category}
            onChange={handleChange}
            className="w-full rounded-lg border px-3 py-2 text-sm border-gray-200 outline-none focus:border-teal-400"
          />
          {activeErrors.category && <p className="text-xs text-red-600 mt-1">{activeErrors.category}</p>}
        </div>

        {/* Champ Description */}
        <div>
          <label className="text-sm font-medium text-gray-600">Description</label>
          <textarea
            name="description"
            value={fields.description}
            onChange={handleChange}
            rows={4}
            className="w-full rounded-lg border px-3 py-2 text-sm border-gray-200 outline-none focus:border-teal-400 resize-none"
          />
          {activeErrors.description && <p className="text-xs text-red-600 mt-1">{activeErrors.description}</p>}
        </div>

        {/* Composant d'illustration / Image */}
        <div>
          <label className="text-sm font-medium text-gray-400 uppercase text-xs tracking-wider block mb-2">Image d'illustration</label>
          <BonPlanImageUpload
            preview={imagePreview}
            error={activeErrors.image_path}
            onFileSelect={handleFileSelect}
            onFileRemove={() => { setImageFile(null); setImagePreview(""); }}
          />
        </div>
      </div>

      {/* Actions du formulaire */}
      <div className="flex justify-end gap-3 border-t pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            Annuler
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-teal-600 px-5 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50"
        >
          {loading ? "Enregistrement..." : isEditMode ? "Mettre à jour" : "Créer le bon plan"}
        </button>
      </div>
    </form>
  );
}