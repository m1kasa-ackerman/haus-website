'use client';

import { useState } from 'react';
import { saveHeroSlide, deleteHeroSlide } from '@/app/studio/actions';
import ImageUploader from './ImageUploader';

interface Slide {
  id: string;
  imageUrl: string;
  fileId: string | null;
  title: string;
  subtitle: string | null;
  alt: string;
  order: number;
  active: boolean;
}

function SlideForm({ slide, index }: { slide?: Slide; index: number }) {
  const [imageUrl, setImageUrl] = useState(slide?.imageUrl ?? '');
  const [fileId, setFileId] = useState(slide?.fileId ?? '');
  const [busy, setBusy] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    formData.set('imageUrl', imageUrl);
    formData.set('fileId', fileId);
    setBusy(true);
    setFlash(null);
    try {
      await saveHeroSlide(formData);
      setFlash('Saved.');
      setTimeout(() => setFlash(null), 3000);
    } catch (e) {
      setFlash((e as Error).message || 'Could not save.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="s-card">
      {flash && <div className="flash flash-ok" style={{ marginBottom: 14 }}>{flash}</div>}
      <form action={handleSubmit}>
        {slide && <input type="hidden" name="id" value={slide.id} />}

        <ImageUploader
          label={`Slide image${slide ? '' : ' (required)'}`}
          value={imageUrl}
          onChange={(img) => {
            setImageUrl(img.url);
            setFileId(img.fileId ?? '');
          }}
        />

        <div className="f-row">
          <div className="f-group">
            <label className="f-label">Title</label>
            <input className="f-input" name="title" defaultValue={slide?.title ?? ''} placeholder="Living Spaces" required />
          </div>
          <div className="f-group">
            <label className="f-label">Subtitle / label</label>
            <input className="f-input" name="subtitle" defaultValue={slide?.subtitle ?? ''} placeholder="01 / 03" />
          </div>
        </div>

        <div className="f-row">
          <div className="f-group">
            <label className="f-label">Alt text (accessibility)</label>
            <input className="f-input" name="alt" defaultValue={slide?.alt ?? ''} placeholder="Elegant living room" />
          </div>
          <div className="f-group">
            <label className="f-label">Order</label>
            <input className="f-input" name="order" type="number" defaultValue={slide?.order ?? index} />
          </div>
        </div>

        <div className="f-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 13.5, cursor: 'pointer' }}>
            <input type="checkbox" name="active" defaultChecked={slide?.active ?? true} />
            Show this slide on the site
          </label>
        </div>

        <div className="row-actions">
          <button type="submit" className="btn btn-gold" disabled={busy || !imageUrl}>
            {busy ? 'Saving…' : slide ? 'Save slide' : 'Add slide'}
          </button>
          {slide && (
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={async () => {
                if (!confirm('Delete this slide?')) return;
                setBusy(true);
                try {
                  await deleteHeroSlide(slide.id);
                } finally {
                  setBusy(false);
                }
              }}
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default function HeroSlidesManager({ slides }: { slides: Slide[] }) {
  return (
    <div>
      {slides.map((s, i) => (
        <SlideForm key={s.id} slide={s} index={i} />
      ))}
      <h2 style={{ fontFamily: 'var(--s-serif)', fontWeight: 400, fontSize: 22, margin: '28px 0 14px' }}>
        Add a slide
      </h2>
      <SlideForm index={slides.length} />
    </div>
  );
}
