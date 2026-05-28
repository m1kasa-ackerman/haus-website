'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveProject, deleteProject } from '@/app/studio/actions';
import ImageUploader from './ImageUploader';

interface ImageItem {
  id?: string;
  url: string;
  fileId: string | null;
  alt: string;
  role: string; // 'hero' | 'small'
  order: number;
}

export interface ProjectInput {
  id?: string;
  title: string;
  category: string;
  description: string;
  type: string;
  location: string;
  scope: string;
  year: number | null;
  order: number;
  published: boolean;
  videoUrl: string | null;
  images: ImageItem[];
}

const empty: ProjectInput = {
  title: '',
  category: '',
  description: '',
  type: '',
  location: '',
  scope: '',
  year: null,
  order: 0,
  published: true,
  videoUrl: null,
  images: []
};

export default function ProjectEditor({ initial }: { initial?: ProjectInput }) {
  const router = useRouter();
  const [p, setP] = useState<ProjectInput>(initial ?? empty);
  const [busy, setBusy] = useState(false);
  const [flash, setFlash] = useState<{ ok: boolean; msg: string } | null>(null);

  const heroImg = p.images.find((i) => i.role === 'hero');
  const smalls = p.images.filter((i) => i.role === 'small');

  const set = <K extends keyof ProjectInput>(k: K, v: ProjectInput[K]) =>
    setP((prev) => ({ ...prev, [k]: v }));

  function setHero(url: string, fileId: string | null) {
    setP((prev) => {
      const others = prev.images.filter((i) => i.role !== 'hero');
      const existingHero = prev.images.find((i) => i.role === 'hero');
      return {
        ...prev,
        images: [
          { ...(existingHero ?? {}), url, fileId, alt: existingHero?.alt ?? prev.title, role: 'hero', order: 0, id: existingHero?.id },
          ...others
        ]
      };
    });
  }

  function addSmall(url: string, fileId: string | null) {
    setP((prev) => ({
      ...prev,
      images: [
        ...prev.images,
        { url, fileId, alt: prev.title, role: 'small', order: prev.images.length }
      ]
    }));
  }

  function removeImage(target: ImageItem) {
    setP((prev) => ({ ...prev, images: prev.images.filter((i) => i !== target) }));
  }

  function updateAlt(target: ImageItem, alt: string) {
    setP((prev) => ({ ...prev, images: prev.images.map((i) => (i === target ? { ...i, alt } : i)) }));
  }

  async function handleSave() {
    if (!p.title.trim() || !p.category.trim() || !p.description.trim()) {
      setFlash({ ok: false, msg: 'Title, category and description are required.' });
      return;
    }
    if (!heroImg) {
      setFlash({ ok: false, msg: 'Please add a main (hero) image.' });
      return;
    }
    setBusy(true);
    setFlash(null);
    try {
      const reordered = [
        ...(heroImg ? [{ ...heroImg, order: 0 }] : []),
        ...smalls.map((s, idx) => ({ ...s, order: idx + 1 }))
      ];
      const res = await saveProject({
        id: p.id,
        title: p.title,
        category: p.category,
        description: p.description,
        type: p.type,
        location: p.location,
        scope: p.scope,
        year: p.year,
        order: p.order,
        published: p.published,
        videoUrl: p.videoUrl || null,
        images: reordered
      });
      setFlash({ ok: true, msg: 'Saved.' });
      if (!p.id && res.id) {
        router.push('/studio/projects');
      } else {
        router.refresh();
      }
    } catch {
      setFlash({ ok: false, msg: 'Could not save the project.' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      {flash && <div className={`flash ${flash.ok ? 'flash-ok' : 'flash-err'}`}>{flash.msg}</div>}

      <div className="s-card">
        <div className="f-group">
          <label className="f-label">Project title</label>
          <input className="f-input" value={p.title} onChange={(e) => set('title', e.target.value)} placeholder="Quiet Luxury" />
          <div className="f-hint">Wrap a word in <code>&lt;em&gt;…&lt;/em&gt;</code> for the italic accent.</div>
        </div>

        <div className="f-row">
          <div className="f-group">
            <label className="f-label">Category / tag</label>
            <input className="f-input" value={p.category} onChange={(e) => set('category', e.target.value)} placeholder="Residential" />
          </div>
          <div className="f-group">
            <label className="f-label">Order</label>
            <input className="f-input" type="number" value={p.order} onChange={(e) => set('order', parseInt(e.target.value) || 0)} />
          </div>
        </div>

        <div className="f-group">
          <label className="f-label">Description</label>
          <textarea className="f-textarea" value={p.description} onChange={(e) => set('description', e.target.value)} />
        </div>

        <div className="f-row-3">
          <div className="f-group">
            <label className="f-label">Type</label>
            <input className="f-input" value={p.type} onChange={(e) => set('type', e.target.value)} placeholder="3 BHK Apartment" />
          </div>
          <div className="f-group">
            <label className="f-label">Location</label>
            <input className="f-input" value={p.location} onChange={(e) => set('location', e.target.value)} placeholder="Hyderabad" />
          </div>
          <div className="f-group">
            <label className="f-label">Scope</label>
            <input className="f-input" value={p.scope} onChange={(e) => set('scope', e.target.value)} placeholder="Full turnkey" />
          </div>
        </div>

        <div className="f-group">
          <label className="f-label">Video tour URL <span style={{fontWeight:400,textTransform:'none',letterSpacing:0}}>(optional)</span></label>
          <input
            className="f-input"
            value={p.videoUrl ?? ''}
            onChange={(e) => set('videoUrl', e.target.value || null)}
            placeholder="YouTube, Vimeo, or .mp4 URL"
          />
          <div className="f-hint">Paste a YouTube or Vimeo link to add a video tour. Shown inside the portfolio popup.</div>
        </div>

        <div className="f-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 13.5, cursor: 'pointer' }}>
            <input type="checkbox" checked={p.published} onChange={(e) => set('published', e.target.checked)} />
            Published (visible on the live site)
          </label>
        </div>
      </div>

      <h2 style={{ fontFamily: 'var(--s-serif)', fontWeight: 400, fontSize: 22, margin: '24px 0 14px' }}>Main image</h2>
      <div className="s-card">
        <ImageUploader
          label="Hero image (large, shown first)"
          value={heroImg?.url}
          onChange={(img) => setHero(img.url, img.fileId)}
        />
        {heroImg && (
          <div className="f-group">
            <label className="f-label">Hero image alt text</label>
            <input className="f-input" value={heroImg.alt} onChange={(e) => updateAlt(heroImg, e.target.value)} />
          </div>
        )}
      </div>

      <h2 style={{ fontFamily: 'var(--s-serif)', fontWeight: 400, fontSize: 22, margin: '24px 0 14px' }}>
        Gallery images
      </h2>
      <div className="s-card">
        {smalls.length > 0 && (
          <div className="s-grid cols-2" style={{ marginBottom: 18 }}>
            {smalls.map((img, idx) => (
              <div key={img.id ?? `new-${idx}`} className="row-item" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={img.alt} style={{ width: '100%', height: 130, objectFit: 'cover', borderRadius: 8, marginBottom: 10 }} />
                <input
                  className="f-input"
                  value={img.alt}
                  placeholder="Alt text"
                  onChange={(e) => updateAlt(img, e.target.value)}
                  style={{ marginBottom: 8 }}
                />
                <button type="button" className="btn btn-danger btn-sm" onClick={() => removeImage(img)}>Remove</button>
              </div>
            ))}
          </div>
        )}
        <ImageUploader
          label="Add a gallery image"
          value=""
          onChange={(img) => addSmall(img.url, img.fileId)}
        />
        <div className="f-hint">Add up to a few supporting images. The first two appear beside the main image on the site.</div>
      </div>

      <div className="row-actions" style={{ marginTop: 20 }}>
        <button className="btn btn-gold" onClick={handleSave} disabled={busy}>
          {busy ? 'Saving…' : 'Save project'}
        </button>
        <a href="/studio/projects" className="btn btn-ghost">Cancel</a>
        {p.id && (
          <button
            className="btn btn-danger btn-sm"
            style={{ marginLeft: 'auto' }}
            onClick={async () => {
              if (!confirm('Delete this project and all its images? This cannot be undone.')) return;
              setBusy(true);
              try {
                await deleteProject(p.id!);
                router.push('/studio/projects');
              } finally {
                setBusy(false);
              }
            }}
          >
            Delete project
          </button>
        )}
      </div>
    </div>
  );
}
