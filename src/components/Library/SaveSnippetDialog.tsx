'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { listCategories } from '@/lib/snippetStorage';

interface Props {
  open: boolean;
  defaultName?: string;
  onCancel: () => void;
  onSave: (name: string, category: string) => void;
}

export default function SaveSnippetDialog({ open, defaultName, onCancel, onSave }: Props) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Üldine');
  const [existing, setExisting] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      setName(defaultName ?? '');
      setCategory('Üldine');
      setExisting(listCategories());
    }
  }, [open, defaultName]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onCancel}
    >
      <div
        className="w-[380px] rounded-xl bg-white p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-semibold">Salvesta valem</h3>
          <button
            type="button"
            onClick={onCancel}
            className="rounded p-1 text-neutral-500 hover:bg-neutral-100"
          >
            <X size={16} />
          </button>
        </div>

        <label className="mb-2 block text-xs font-medium text-neutral-600">
          Nimi
          <input
            autoFocus
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && name.trim()) onSave(name, category);
              if (e.key === 'Escape') onCancel();
            }}
            placeholder="nt Ruudu pindala"
            className="mt-1 w-full rounded border border-neutral-300 px-3 py-1.5 text-sm outline-none focus:border-matcha-400"
          />
        </label>

        <label className="mb-4 block text-xs font-medium text-neutral-600">
          Kategooria
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            list="snippet-categories"
            placeholder="nt Geomeetria"
            className="mt-1 w-full rounded border border-neutral-300 px-3 py-1.5 text-sm outline-none focus:border-matcha-400"
          />
          <datalist id="snippet-categories">
            {existing.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </label>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100"
          >
            Tühista
          </button>
          <button
            type="button"
            onClick={() => onSave(name, category)}
            disabled={!name.trim()}
            className="rounded bg-matcha-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-matcha-700 disabled:opacity-40"
          >
            Salvesta
          </button>
        </div>
      </div>
    </div>
  );
}
