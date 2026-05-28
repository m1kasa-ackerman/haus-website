'use client';

import { useEffect, useRef } from 'react';

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Skip on touch devices.
    if (window.matchMedia('(hover:none)').matches) return;

    const cursor = cursorRef.current!;
    const label = labelRef.current!;
    let cx = window.innerWidth / 2;
    let cy = window.innerHeight / 2;
    let ox = cx;
    let oy = cy;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      cx = e.clientX;
      cy = e.clientY;
    };
    const loop = () => {
      ox += (cx - ox) * 0.12;
      oy += (cy - oy) * 0.12;
      cursor.style.left = ox + 'px';
      cursor.style.top = oy + 'px';
      raf = requestAnimationFrame(loop);
    };
    document.addEventListener('mousemove', onMove);
    loop();

    const setCursor = (state: '' | 'expand' | 'shrink', text = '') => {
      cursor.classList.remove('expand', 'shrink');
      if (state) cursor.classList.add(state);
      label.textContent = text;
    };

    // Bind hover behaviours to existing DOM elements.
    const bind = (selector: string, enter: () => void) => {
      const els = Array.from(document.querySelectorAll(selector));
      const leave = () => setCursor('', '');
      els.forEach((el) => {
        el.addEventListener('mouseenter', enter);
        el.addEventListener('mouseleave', leave);
      });
      return () => els.forEach((el) => {
        el.removeEventListener('mouseenter', enter);
        el.removeEventListener('mouseleave', leave);
      });
    };

    const unbinders = [
      bind('.gallery img, .hero-slide img', () => setCursor('expand', 'VIEW')),
      bind('a[href="#contact"], .form-submit, .nav-pill', () => setCursor('expand', 'TALK')),
      bind('.nav-links a', () => setCursor('shrink', '')),
      bind('.hero-orb, .mq-orb, .ft-btn', () => setCursor('shrink', ''))
    ];

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('mousemove', onMove);
      unbinders.forEach((u) => u());
    };
  }, []);

  return (
    <div className="cursor" ref={cursorRef}>
      <div className="cursor-ring">
        <span className="cursor-label" ref={labelRef} />
      </div>
    </div>
  );
}
