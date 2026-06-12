import { useState, ChangeEvent, FormEvent } from "react";
import { getImageUrl } from '../../../utils/imageUtils';
import SponsorBannerUpload from "./SponsorBannerUpload";
import { useSponsorMutation } from "../hooks/useSponsorMutation";

export interface Sponsor {
  id: number;
  name: string;
  company_location: string | null;
  address: string | null;
  email: string | null;
  phone: string | null;
  website_url: string | null;
  is_active: boolean;
  banner_url?: string | null;
  created_at: string;
  updated_at: string;
}

interface SponsorFormProps {
  sponsor?: Sponsor;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const EMPTY_FORM = { name: "", company_location: "", address: "", email: "", phone: "", website_url: "", is_active: true };

export default function SponsorForm({ sponsor, onSuccess, onCancel }: SponsorFormProps) {
  const isEditMode = Boolean(sponsor?.id);
  const { createSponsor, updateSponsor, loading, error: apiError, validationErrors } = useSponsorMutation();

  const [fields, setFields] = useState({
    name: sponsor?.name ?? "",
    company_location: sponsor?.company_location ?? "",
    address: sponsor?.address ?? "",
    email: sponsor?.email ?? "",
    phone: sponsor?.phone ?? "",
    website_url: sponsor?.website_url ?? "",
    is_active: sponsor?.is_active ?? true,
  });
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>(sponsor?.banner_url ? getImageUrl(sponsor.banner_url) : "");
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setFields((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }

  function handleFileSelect(file: File) {
    if (file.size > 3 * 1024 * 1024) {
      setLocalErrors({ banner: "La bannière ne doit pas dépasser 3 Mo." });
      return;
    }
    setBannerFile(file);
    setLocalErrors({});
    const reader = new FileReader();
    reader.onload = (e) => setBannerPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!fields.name.trim()) {
      setLocalErrors({ name: "Le nom du sponsor est obligatoire." });
      return;
    }

    const formData = new FormData();
    Object.keys(fields).forEach((key) => {
      const val = fields[key as keyof typeof fields];
      if (key === "is_active") formData.append(key, val ? "1" : "0");
      else formData.append(key, String(val ?? ""));
    });

    if (bannerFile) formData.append("banner", bannerFile);
    if (isEditMode && !bannerFile && !bannerPreview && sponsor?.banner_url) {
      formData.append('_clear_banner', '1');
    }
    if (isEditMode) formData.append("_method", "PUT");

    const result = isEditMode 
      ? await updateSponsor(sponsor!.id, formData)
      : await createSponsor(formData);

    if (result) onSuccess?.();
  }

  const activeErrors = { ...localErrors, ...validationErrors };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {apiError && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{apiError}</div>}

      <div className="grid gap-4">
        <div>
          <label className="text-sm font-medium text-gray-600">Nom du sponsor *</label>
          <input type="text" name="name" value={fields.name} onChange={handleChange} className="w-full rounded-lg border px-3 py-2 text-sm outline-none border-gray-200 focus:border-teal-400" />
          {activeErrors.name && <p className="text-xs text-red-600 mt-1">{activeErrors.name}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Ville / Localisation</label>
            <input type="text" name="company_location" value={fields.company_location ?? ""} onChange={handleChange} className="w-full rounded-lg border px-3 py-2 text-sm border-gray-200" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Adresse</label>
            <input type="text" name="address" value={fields.address ?? ""} onChange={handleChange} className="w-full rounded-lg border px-3 py-2 text-sm border-gray-200" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Email</label>
            <input type="email" name="email" value={fields.email ?? ""} onChange={handleChange} className="w-full rounded-lg border px-3 py-2 text-sm border-gray-200" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Téléphone</label>
            <input type="text" name="phone" value={fields.phone ?? ""} onChange={handleChange} className="w-full rounded-lg border px-3 py-2 text-sm border-gray-200" />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Site web</label>
          <input type="url" name="website_url" value={fields.website_url ?? ""} onChange={handleChange} className="w-full rounded-lg border px-3 py-2 text-sm border-gray-200" />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-400 uppercase text-xs tracking-wider block mb-2">Bannière</label>
          <SponsorBannerUpload preview={bannerPreview} error={activeErrors.banner} onFileSelect={handleFileSelect} onFileRemove={() => { setBannerFile(null); setBannerPreview(""); }} />
        </div>

        <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
          <input type="checkbox" name="is_active" checked={fields.is_active} onChange={handleChange} className="h-4 w-4 text-teal-600" />
          <div>
            <span className="text-sm font-medium text-gray-800">Sponsor actif</span>
            <p className="text-xs text-gray-500">Visible dans la sidebar du site</p>
          </div>
        </label>
      </div>

      <div className="flex justify-end gap-3 border-t pt-4">
        {onCancel && <button type="button" onClick={onCancel} disabled={loading} className="rounded-lg border px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">Annuler</button>}
        <button type="submit" disabled={loading} className="rounded-lg bg-teal-600 px-5 py-2 text-sm font-medium text-white hover:bg-teal-700">{loading ? "Enregistrement..." : isEditMode ? "Mettre à jour" : "Créer le sponsor"}</button>
      </div>
    </form>
  );
}