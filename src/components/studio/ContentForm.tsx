'use client';

import { useState } from 'react';
import { saveContent } from '@/app/studio/actions';
import ImageUploader, { type UploadedImage } from './ImageUploader';

export interface ContentField {
  key: string;
  label: string;
  value: string;
  type?: 'text' | 'textarea' | 'richtext' | 'url' | 'image';
  hint?: string;
  placeholder?: string;
  // For image fields, the companion key that stores the ImageKit fileId.
  fileIdKey?: string;
  fileIdValue?: string;
}

export default function ContentForm({ fields }: { fields: ContentField[] }) {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(
      fields.flatMap((f) =>
        f.type === 'image' && f.fileIdKey
          ? [[f.key, f.value], [f.fileIdKey, f.fileIdValue ?? '']]
          : [[f.key, f.value]]
      )
    )
  );
  const [busy, setBusy] = useState(false);
  const [flash, setFlash] = useState<{ ok: boolean; msg: string } | null>(null);

  const set = (key: string, v: string) => setValues((p) => ({ ...p, [key]: v }));

  async function handleSave() {
    setBusy(true);
    setFlash(null);
    try {
      await saveContent(values);
      setFlash({ ok: true, msg: 'Saved. Your live site is updated.' });
    } catch {
      setFlash({ ok: false, msg: 'Could not save. Please try again.' });
    } finally {
      setBusy(false);
      setTimeout(() => setFlash(null), 4000);
    }
  }

  return (
    <div>
      {flash && <div className={`flash ${flash.ok ? 'flash-ok' : 'flash-err'}`}>{flash.msg}</div>}

      <div className="s-card">
        {fields.map((f) => {
          if (f.type === 'image') {
            return (
              <ImageUploader
                key={f.key}
                label={f.label}
                value={values[f.key]}
                onChange={(img: UploadedImage) => {
                  set(f.key, img.url);
                  if (f.fileIdKey) set(f.fileIdKey, img.fileId ?? '');
                }}
              />
            );
          }
          return (
            <div className="f-group" key={f.key}>
              <label className="f-label">{f.label}</label>
              {f.type === 'textarea' || f.type === 'richtext' ? (
                <textarea
                  className="f-textarea"
                  value={values[f.key]}
                  placeholder={f.placeholder}
                  onChange={(e) => set(f.key, e.target.value)}
                />
              ) : (
                <input
                  className="f-input"
                  value={values[f.key]}
                  placeholder={f.placeholder}
                  onChange={(e) => set(f.key, e.target.value)}
                />
              )}
              {f.hint && <div className="f-hint">{f.hint}</div>}
              {f.type === 'richtext' && (
                <div className="f-hint">
                  Tip: wrap a word in <code>&lt;em&gt;word&lt;/em&gt;</code> for the italic gold
                  accent, and use <code>&lt;br&gt;</code> for a line break.
                </div>
              )}
            </div>
          );
        })}
        <button className="btn btn-gold" onClick={handleSave} disabled={busy}>
          {busy ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </div>
  );
}
