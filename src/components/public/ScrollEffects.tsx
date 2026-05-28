'use client';

import { useEffect } from 'react';

// Handles two scroll effects from the original site:
//  1. ".r" elements reveal (fade + slide up) when they enter the viewport.
//  2. The document body background smoothly shifts colour per visible section.
export default function ScrollEffects() {
  useEffect(() => {
    // ── Reveal ──
    const revEls = document.querySelectorAll('.r');
    const ro = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('v');
            ro.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -36px 0px' }
    );
    revEls.forEach((el) => ro.observe(el));

    // ── Body background per section ──
    document.body.style.background = 'var(--cream)';
    const secBg: Record<string, string> = {
      stats: '#1a1f36',
      about: '#ffffff',
      portfolio: '#1a1f36',
      services: '#f0ebe3',
      contact: '#ffffff'
    };
    const bgObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio > 0.4) {
            const c = secBg[(e.target as HTMLElement).id];
            if (c) {
              document.body.style.transition = 'background 0.9s ease';
              document.body.style.background = c;
            }
          }
        });
      },
      { threshold: 0.4 }
    );
    document
      .querySelectorAll('#stats,#about,#portfolio,#services,#contact')
      .forEach((el) => bgObs.observe(el));

    return () => {
      ro.disconnect();
      bgObs.disconnect();
    };
  }, []);

  return null;
}
