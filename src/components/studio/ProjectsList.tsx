'use client';

import Link from 'next/link';
import { useState } from 'react';

interface ProjectRow {
  id: string;
  title: string;
  category: string;
  published: boolean;
  imageCount: number;
  thumb: string;
}

export default function ProjectsList({
  projects,
  reorder
}: {
  projects: ProjectRow[];
  reorder: (ids: string[]) => Promise<void>;
}) {
  const [items, setItems] = useState(projects);
  const [dragId, setDragId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function onDrop(targetId: string) {
    if (!dragId || dragId === targetId) return;
    const next = [...items];
    const from = next.findIndex((i) => i.id === dragId);
    const to = next.findIndex((i) => i.id === targetId);
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setItems(next);
    setDragId(null);
    persist(next.map((i) => i.id));
  }

  async function persist(ids: string[]) {
    setSaving(true);
    try {
      await reorder(ids);
    } finally {
      setSaving(false);
    }
  }

  // Strip <em> tags for plain-text display in the list.
  const plain = (s: string) => s.replace(/<[^>]+>/g, '');

  return (
    <div>
      {saving && <div className="flash flash-ok">Saving order…</div>}
      {items.map((p) => (
        <div
          key={p.id}
          className="row-item"
          draggable
          onDragStart={() => setDragId(p.id)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => onDrop(p.id)}
          style={{ opacity: dragId === p.id ? 0.5 : 1 }}
        >
          <span className="row-handle" title="Drag to reorder">⠿</span>
          {p.thumb ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="row-thumb" src={p.thumb} alt={plain(p.title)} />
          ) : (
            <div className="row-thumb" style={{ display: 'grid', placeItems: 'center', color: 'var(--s-muted)', fontSize: 10 }}>No image</div>
          )}
          <div className="row-body">
            <div className="row-title">{plain(p.title) || 'Untitled'}</div>
            <div className="row-meta">
              {p.category} · {p.imageCount} image{p.imageCount === 1 ? '' : 's'}
              {!p.published && ' · Draft'}
            </div>
          </div>
          <div className="row-actions">
            <Link href={`/studio/projects/${p.id}`} className="btn btn-ghost btn-sm">Edit</Link>
          </div>
        </div>
      ))}
    </div>
  );
}
