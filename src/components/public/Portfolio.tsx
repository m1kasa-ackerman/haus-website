'use client';

import { useState, useEffect, useCallback } from 'react';
import { sanitizeInline } from '@/lib/utils';

export interface ProjectImageData { id: string; url: string; alt: string; role: string; }
export interface ProjectData {
  id: string; title: string; category: string; description: string;
  type: string | null; location: string | null; scope: string | null;
  videoUrl?: string | null;
  images: ProjectImageData[];
}

// ─── Video embed helper ────────────────────────────────────────
function getEmbedUrl(url: string): string | null {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?rel=0&modestbranding=1`;
  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}?dnt=1`;
  return null;
}

// ─── Zoom overlay ──────────────────────────────────────────────
function ZoomOverlay({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);
  return (
    <div className="zoom-bg" onClick={onClose}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="zoom-img" src={src} alt={alt} onClick={e => e.stopPropagation()} />
      <button className="zoom-close" onClick={onClose} aria-label="Close zoom">×</button>
    </div>
  );
}

// ─── Project modal ─────────────────────────────────────────────
function ProjectModal({ project, onClose }: { project: ProjectData; onClose: () => void }) {
  const [imgIdx, setImgIdx] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const images = [...project.images].sort((a, b) =>
    a.role === 'hero' ? -1 : b.role === 'hero' ? 1 : 0
  );
  const cur = images[imgIdx];

  const prev = useCallback(() => setImgIdx(i => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setImgIdx(i => (i + 1) % images.length), [images.length]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { if (zoomed) setZoomed(false); else onClose(); }
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', fn);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', fn);
    };
  }, [zoomed, onClose, prev, next]);

  const embedUrl = project.videoUrl ? getEmbedUrl(project.videoUrl) : null;
  const isDirectVideo = project.videoUrl && !embedUrl && /\.(mp4|webm)$/i.test(project.videoUrl);

  return (
    <>
      {zoomed && cur && <ZoomOverlay src={cur.url} alt={cur.alt} onClose={() => setZoomed(false)} />}
      <div className="modal-bg" onClick={onClose}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>

          {/* Left — project info */}
          <div className="modal-info">
            <span className="modal-cat">{project.category}</span>
            <h2 className="modal-title" dangerouslySetInnerHTML={{ __html: sanitizeInline(project.title) }} />
            <p className="modal-desc">{project.description}</p>
            <div className="modal-meta">
              {project.type     && <div className="meta"><span className="mk">Type</span><span className="mv">{project.type}</span></div>}
              {project.location && <div className="meta"><span className="mk">Location</span><span className="mv">{project.location}</span></div>}
              {project.scope    && <div className="meta"><span className="mk">Scope</span><span className="mv">{project.scope}</span></div>}
            </div>
          </div>

          {/* Right — image carousel + optional video */}
          <div className="modal-right">
            <div className="modal-viewer">
              {cur && (
                <div className="modal-img-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="modal-img" src={cur.url} alt={cur.alt} onClick={() => setZoomed(true)} />
                  {images.length > 1 && (
                    <>
                      <button className="modal-nav modal-nav-prev" onClick={prev} aria-label="Previous">‹</button>
                      <button className="modal-nav modal-nav-next" onClick={next} aria-label="Next">›</button>
                    </>
                  )}
                  <span className="modal-zoom-hint">Click to zoom</span>
                </div>
              )}
              {images.length > 1 && (
                <div className="modal-dots">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      className={`modal-dot${i === imgIdx ? ' active' : ''}`}
                      onClick={() => setImgIdx(i)}
                      aria-label={`Image ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {(embedUrl || isDirectVideo) && (
              <div className="modal-video">
                <div className="modal-video-label">▶ Video tour</div>
                {embedUrl ? (
                  <iframe src={embedUrl} className="modal-video-frame" allow="autoplay; fullscreen" allowFullScreen title="Project video" />
                ) : (
                  <video className="modal-video-frame" controls src={project.videoUrl!} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Project tile ──────────────────────────────────────────────
function ProjectTile({ project, onClick }: { project: ProjectData; onClick: () => void }) {
  const hero = project.images.find(i => i.role === 'hero') ?? project.images[0];
  const plain = project.title.replace(/<[^>]+>/g, '');
  return (
    <div
      className="port-tile"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
      aria-label={`View project: ${plain}`}
    >
      {hero && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={hero.url} alt={hero.alt} className="port-tile-img" />
      )}
      <div className="port-tile-overlay" />
      <div className="port-tile-info">
        <span className="port-tile-cat">{project.category}</span>
        <h3 className="port-tile-name">{plain}</h3>
        <span className="port-tile-cta">View project →</span>
      </div>
    </div>
  );
}

// ─── Main export ───────────────────────────────────────────────
export default function Portfolio({
  projects, eyebrow, headline, linkLabel, linkUrl
}: {
  projects: ProjectData[];
  eyebrow: string; headline: string; linkLabel: string; linkUrl: string;
}) {
  const [selected, setSelected] = useState<ProjectData | null>(null);

  return (
    <section className="portfolio" id="portfolio">
      <div className="port-hdr">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="h2" dangerouslySetInnerHTML={{ __html: sanitizeInline(headline) }} />
        </div>
        <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="port-hdr-link">
          {linkLabel}
        </a>
      </div>

      <div className="port-tiles">
        {projects.map(p => (
          <ProjectTile key={p.id} project={p} onClick={() => setSelected(p)} />
        ))}
      </div>

      {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
