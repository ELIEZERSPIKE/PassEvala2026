import { useState } from 'react';
import { UsefulNumberPayload } from '../types/usefulNumber';

const defaultValues: UsefulNumberPayload = {
  name: '',
  phone_number: '',
  color_tag: null,
};

export const useNumberForm = (initial?: Partial<UsefulNumberPayload>) => {
  const [form, setForm] = useState<UsefulNumberPayload>({ ...defaultValues, ...initial });
  const [errors, setErrors] = useState<Partial<Record<keyof UsefulNumberPayload, string>>>({});

  const handleChange = (field: keyof UsefulNumberPayload, value: string | null) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof UsefulNumberPayload, string>> = {};
    if (!form.name.trim()) newErrors.name = 'Le nom est requis.';
    if (!form.phone_number.trim()) newErrors.phone_number = 'Le numéro est requis.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const reset = () => setForm({ ...defaultValues, ...initial });

  return { form, errors, handleChange, validate, reset };
};