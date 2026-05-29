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

function pad(n: number) { return String(n).padStart(2, '0'); }

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

// ─── Dark immersive modal ──────────────────────────────────────
function DarkModal({ project, onClose }: { project: ProjectData; onClose: () => void }) {
  const [imgIdx, setImgIdx] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);

  const images = [...project.images].sort((a, b) =>
    a.role === 'hero' ? -1 : b.role === 'hero' ? 1 : 0
  );
  const cur = images[imgIdx];
  const titlePlain = project.title.replace(/<[^>]+>/g, '').toUpperCase();

  const prev = useCallback(() => setImgIdx(i => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setImgIdx(i => (i + 1) % images.length), [images.length]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { if (zoomed) setZoomed(false); else if (videoOpen) setVideoOpen(false); else onClose(); }
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', fn);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', fn); };
  }, [zoomed, videoOpen, onClose, prev, next]);

  const embedUrl = project.videoUrl ? getEmbedUrl(project.videoUrl) : null;
  const isDirectVideo = project.videoUrl && !embedUrl && /\.(mp4|webm)$/i.test(project.videoUrl);

  return (
    <>
      {zoomed && cur && <ZoomOverlay src={cur.url} alt={cur.alt} onClose={() => setZoomed(false)} />}

      <div className="dm-wrap" onClick={onClose}>
        <div className="dm-modal" onClick={e => e.stopPropagation()}>

          {/* Background image — full bleed, fades on change */}
          {cur && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={cur.id}
              className="dm-bg-img"
              src={cur.url}
              alt={cur.alt}
              onClick={() => setZoomed(true)}
            />
          )}

          {/* Gradient veils for text readability */}
          <div className="dm-veil-left" />
          <div className="dm-veil-bottom" />

          {/* Close button */}
          <button className="dm-close" onClick={onClose} aria-label="Close">×</button>

          {/* Left glass panel */}
          <div className="dm-panel">
            <div>
              <span className="dm-cat">{project.category}</span>
              <h2 className="dm-title">{titlePlain}</h2>
              <p className="dm-desc">{project.description}</p>
            </div>

            <div className="dm-specs">
              {project.type && (
                <div className="dm-spec">
                  <span className="dm-sk">Type</span>
                  <span className="dm-sv">{project.type}</span>
                </div>
              )}
              {project.location && (
                <div className="dm-spec">
                  <span className="dm-sk">Location</span>
                  <span className="dm-sv">{project.location}</span>
                </div>
              )}
              {project.scope && (
                <div className="dm-spec">
                  <span className="dm-sk">Scope</span>
                  <span className="dm-sv">{project.scope}</span>
                </div>
              )}
            </div>

            <div className="dm-panel-foot">
              <button className="dm-cta" onClick={() => setZoomed(true)}>
                EXPLORE PROJECT <span className="dm-cta-arr">→</span>
              </button>
              {(embedUrl || isDirectVideo) && (
                <button className="dm-video-btn" onClick={() => setVideoOpen(v => !v)}>
                  ▶ {videoOpen ? 'CLOSE VIDEO' : 'VIDEO TOUR'}
                </button>
              )}
            </div>
          </div>

          {/* Prev / Next arrows — right side */}
          {images.length > 1 && (
            <div className="dm-arrows">
              <button className="dm-arr dm-arr-prev" onClick={prev} aria-label="Previous">‹</button>
              <button className="dm-arr dm-arr-next" onClick={next} aria-label="Next">›</button>
            </div>
          )}

          {/* Bottom bar: dots + counter */}
          <div className="dm-footer">
            {images.length > 1 && (
              <div className="dm-dots">
                {images.map((_, i) => (
                  <button
                    key={i}
                    className={`dm-dot${i === imgIdx ? ' active' : ''}`}
                    onClick={() => setImgIdx(i)}
                    aria-label={`Image ${i + 1}`}
                  />
                ))}
              </div>
            )}
            <span className="dm-counter">{pad(imgIdx + 1)} / {pad(images.length)}</span>
            <span className="dm-zoom-hint">Click image to zoom</span>
          </div>

          {/* Video panel — slides up from bottom */}
          {videoOpen && (embedUrl || isDirectVideo) && (
            <div className="dm-video-panel" onClick={e => e.stopPropagation()}>
              <div className="dm-video-header">
                <span className="dm-video-label">▶ VIDEO TOUR</span>
                <button className="dm-video-close" onClick={() => setVideoOpen(false)}>×</button>
              </div>
              {embedUrl ? (
                <iframe src={embedUrl} className="dm-video-frame" allow="autoplay; fullscreen" allowFullScreen title="Video tour" />
              ) : (
                <video className="dm-video-frame" controls src={project.videoUrl!} />
              )}
            </div>
          )}

        </div>
      </div>
    </>
  );
}

// ─── Dark project tile ─────────────────────────────────────────
function DarkTile({ project, index, onClick }: { project: ProjectData; index: number; onClick: () => void }) {
  const hero = project.images.find(i => i.role === 'hero') ?? project.images[0];
  const plain = project.title.replace(/<[^>]+>/g, '').toUpperCase();
  return (
    <div
      className="dk-tile"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
    >
      {hero && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={hero.url} alt={hero.alt} className="dk-tile-img" />
      )}
      <div className="dk-tile-overlay" />
      <div className="dk-tile-body">
        <span className="dk-tile-idx">{pad(index + 1)}</span>
        <div className="dk-tile-text">
          <span className="dk-tile-cat">{project.category}</span>
          <h3 className="dk-tile-name">{plain}</h3>
        </div>
        <span className="dk-tile-cta">View →</span>
      </div>
      <div className="dk-tile-line" />
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
        {projects.map((p, i) => (
          <DarkTile key={p.id} project={p} index={i} onClick={() => setSelected(p)} />
        ))}
      </div>

      {selected && <DarkModal project={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
