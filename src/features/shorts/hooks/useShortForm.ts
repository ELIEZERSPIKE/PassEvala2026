import { useState } from 'react';
import { Short, ShortPayload, ShortStatus, ShortUpdatePayload } from '../types/short';

interface ShortFormState {
  text: string;
  video: File | null;
  status: ShortStatus;
}

export const useShortForm = (initial?: Short) => {
  const [form, setForm] = useState<ShortFormState>({
    text: initial?.text ?? '',
    video: null,
    status: initial?.status ?? 'draft',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ShortFormState, string>>>({});

  const handleChange = (field: keyof ShortFormState, value: string | File | null) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validate = (isEdit = false): boolean => {
    const newErrors: Partial<Record<keyof ShortFormState, string>> = {};
    if (!isEdit && !form.video) newErrors.video = 'Une vidéo est requise.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const reset = () => setForm({ text: '', video: null, status: 'draft' });

  const toCreatePayload = (): ShortPayload => ({
    text: form.text || null,
    video: form.video!,
  });

  const toUpdatePayload = (): ShortUpdatePayload => ({
    text: form.text || null,
    status: form.status,
    ...(form.video ? { video: form.video } : {}),
  });

  return { form, errors, handleChange, validate, reset, toCreatePayload, toUpdatePayload };
};