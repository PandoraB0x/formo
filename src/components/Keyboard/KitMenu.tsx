'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Pencil, Plus, Trash2, Type } from 'lucide-react';
import type { Kit } from '@/lib/keyboardPrefs';
import {
  getActiveKitId,
  getKits,
  saveKits,
  setActiveKitId,
} from '@/lib/keyboardPrefs';
import { emit, on } from '@/lib/events';
import { useLang } from '@/i18n/useLang';

interface Props {
  email: string;
  defaultGroups: string[];
  onEditKit: (kitId: string) => void;
  onClose: () => void;
}

export default function KitMenu({ email, defaultGroups, onEditKit, onClose }: Props) {
  const { t } = useLang();
  const [kits, setKits] = useState<Kit[]>([]);
  const [activeId, setActiveIdState] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sync = () => {
      setKits(getKits(email));
      setActiveIdState(getActiveKitId(email));
    };
    sync();
    return on('formo:kits', sync);
  }, [email]);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) onClose();
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('mousedown', onDown);
    window.addEventListener('keydown', onEsc);
    return () => {
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('keydown', onEsc);
    };
  }, [onClose]);

  const select = (id: string | null) => {
    setActiveKitId(email, id);
    emit('formo:kits');
    onClose();
  };

  const create = () => {
    const name = window.prompt(t.keyboard.kitNamePrompt)?.trim();
    if (!name) return;
    const id = `kit_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const newKit: Kit = { id, name, groups: [...defaultGroups] };
    const next = [...kits, newKit];
    saveKits(email, next);
    setActiveKitId(email, id);
    emit('formo:kits');
    onClose();
  };

  const rename = (kit: Kit) => {
    const name = window.prompt(t.keyboard.kitRenamePrompt, kit.name)?.trim();
    if (!name || name === kit.name) return;
    const next = kits.map((k) => (k.id === kit.id ? { ...k, name } : k));
    saveKits(email, next);
    emit('formo:kits');
  };

  const remove = (kit: Kit) => {
    if (!window.confirm(t.keyboard.kitDeleteConfirm(kit.name))) return;
    const next = kits.filter((k) => k.id !== kit.id);
    saveKits(email, next);
    if (activeId === kit.id) setActiveKitId(email, null);
    emit('formo:kits');
  };

  return (
    <div
      ref={menuRef}
      className="absolute left-2 top-full z-50 mt-1 w-72 overflow-hidden rounded-md border border-neutral-200 bg-white py-1 shadow-lg"
    >
      <button
        type="button"
        onClick={() => select(null)}
        className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs transition hover:bg-neutral-50 ${
          activeId === null ? 'font-medium text-matcha-700' : 'text-neutral-700'
        }`}
      >
        <span className="flex w-3 justify-center">
          {activeId === null ? <Check size={12} /> : null}
        </span>
        {t.keyboard.kitAll}
      </button>
      {kits.length > 0 && <div className="my-1 border-t border-neutral-100" />}
      {kits.map((kit) => (
        <div
          key={kit.id}
          className={`group flex items-center gap-0.5 pr-1 text-xs ${
            activeId === kit.id ? 'bg-matcha-50' : ''
          }`}
        >
          <button
            type="button"
            onClick={() => select(kit.id)}
            className={`flex flex-1 items-center gap-2 px-3 py-2 text-left transition hover:bg-neutral-50 ${
              activeId === kit.id ? 'font-medium text-matcha-700' : 'text-neutral-700'
            }`}
          >
            <span className="flex w-3 justify-center">
              {activeId === kit.id ? <Check size={12} /> : null}
            </span>
            <span className="truncate">{kit.name}</span>
            <span className="ml-auto text-[10px] text-neutral-400">
              {kit.groups.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => onEditKit(kit.id)}
            className="rounded p-1.5 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
            title={t.keyboard.kitEdit}
          >
            <Pencil size={11} />
          </button>
          <button
            type="button"
            onClick={() => rename(kit)}
            className="rounded p-1.5 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
            title={t.keyboard.kitRename}
          >
            <Type size={11} />
          </button>
          <button
            type="button"
            onClick={() => remove(kit)}
            className="rounded p-1.5 text-neutral-400 transition hover:bg-red-50 hover:text-red-600"
            title={t.keyboard.kitDelete}
          >
            <Trash2 size={11} />
          </button>
        </div>
      ))}
      <div className="my-1 border-t border-neutral-100" />
      <button
        type="button"
        onClick={create}
        className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-matcha-700 transition hover:bg-matcha-50"
      >
        <Plus size={12} />
        {t.keyboard.kitCreate}
      </button>
    </div>
  );
}
