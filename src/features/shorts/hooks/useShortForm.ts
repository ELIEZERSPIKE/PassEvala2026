// features/shorts/hooks/useShortForm.ts
import { useState } from 'react';
import { Short, ShortPayload, ShortUpdatePayload } from '../types/short';

export const useShortForm = (initial?: Short) => {
  const isEdit = !!initial;

  const [form, setForm] = useState({
    text: initial?.text ?? '',
    status: initial?.status ?? 'draft',
    video: null as File | null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof typeof form, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};
    if (!isEdit && !form.video) newErrors.video = 'Une vidéo est requise';
    if (form.video && form.video.size > 100 * 1024 * 1024) {
      newErrors.video = 'La vidéo ne doit pas dépasser 100 Mo';
    }
    setErrors(newErrors);
    return newErrors;
  };

  const reset = () => {
    setForm({ text: '', status: 'draft', video: null });
    setErrors({});
  };

  const getPayload = (): ShortPayload | ShortUpdatePayload => {
    if (isEdit) {
      const payload: ShortUpdatePayload = {
        text: form.text,
        status: form.status as 'draft' | 'published' | 'archived',
      };
      if (form.video) payload.video = form.video;
      return payload;
    }
    if (!form.video) throw new Error('Une vidéo est requise');
    return {
      text: form.text || undefined,
      video: form.video,
    };
  };

  return {
    form,
    errors,
    isEdit,
    handleChange,
    validate,
    reset,
    getPayload,
  };
};