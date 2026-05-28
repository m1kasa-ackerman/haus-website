'use client';

import { useEffect, useRef } from 'react';
import { sanitizeInline } from '@/lib/utils';

export interface ProjectImageData {
  id: string;
  url: string;
  alt: string;
  role: string;
}
export interface ProjectData {
  id: string;
  title: string;
  category: string;
  description: string;
  type: string | null;
  location: string | null;
  scope: string | null;
  images: ProjectImageData[];
}

function TiltImage({ src, alt, cls }: { src: string; alt: string; cls: string }) {
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = ref.current;
    if (!img) return;
    const onMove = (e: MouseEvent) => {
      const r = img.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 14;
      const y = ((e.clientY - r.top) / r.height - 0.5) * 14;
      img.style.transition = 'transform .1s ease';
      img.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${-y}deg) scale(1.04)`;
    };
    const onLeave = () => {
      img.style.transition = 'transform .5s ease';
      img.style.transform = '';
    };
    img.addEventListener('mousemove', onMove);
    img.addEventListener('mouseleave', onLeave);
    return () => {
      img.removeEventListener('mousemove', onMove);
      img.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div className="g-cell">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={ref} className={cls} src={src} alt={alt} />
    </div>
  );
}

export default function Portfolio({
  projects,
  eyebrow,
  headline,
  linkLabel,
  linkUrl
}: {
  projects: ProjectData[];
  eyebrow: string;
  headline: string;
  linkLabel: string;
  linkUrl: string;
}) {
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

      {projects.map((p, idx) => {
        const hero = p.images.find((i) => i.role === 'hero') ?? p.images[0];
        const smalls = p.images.filter((i) => i !== hero).slice(0, 2);
        return (
          <div className="project r" key={p.id}>
            <div className="p-idx">{String(idx + 1).padStart(2, '0')}</div>
            <div className="p-info">
              <p className="p-tag">{p.category}</p>
              <h3
                className="p-name"
                dangerouslySetInnerHTML={{ __html: sanitizeInline(p.title) }}
              />
              <p className="p-desc">{p.description}</p>
              <div className="p-meta">
                {p.type && (
                  <div className="meta">
                    <span className="mk">Type</span>
                    <span className="mv">{p.type}</span>
                  </div>
                )}
                {p.location && (
                  <div className="meta">
                    <span className="mk">Location</span>
                    <span className="mv">{p.location}</span>
                  </div>
                )}
                {p.scope && (
                  <div className="meta">
                    <span className="mk">Scope</span>
                    <span className="mv">{p.scope}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="gallery">
              {hero && <TiltImage src={hero.url} alt={hero.alt} cls="g-hero" />}
              {smalls.map((img) => (
                <TiltImage key={img.id} src={img.url} alt={img.alt} cls="g-sm" />
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
