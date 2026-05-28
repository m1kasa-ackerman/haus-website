'use client';

import { useEffect, useRef, useState } from 'react';
import { sanitizeInline } from '@/lib/utils';

export interface HeroSlideData {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string | null;
  alt: string;
}

const DURATION = 5500;

export default function Hero({
  slides,
  eyebrow,
  headline,
  description
}: {
  slides: HeroSlideData[];
  eyebrow: string;
  headline: string;
  description: string;
}) {
  const [current, setCurrent] = useState(0);
  const [progressKey, setProgressKey] = useState(0); // forces the bar to restart
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  const count = slides.length;

  const go = (n: number) => {
    setCurrent(((n % count) + count) % count);
    setProgressKey((k) => k + 1);
  };

  const startTimer = () => {
    stopTimer();
    if (count <= 1) return;
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % count);
      setProgressKey((k) => k + 1);
    }, DURATION);
  };
  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    startTimer();
    return stopTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  // Parallax: translate slide images at 28% of scroll speed while in view.
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const onScroll = () => {
      const s = window.scrollY;
      if (s < window.innerHeight) {
        hero.querySelectorAll<HTMLImageElement>('.hero-slide img').forEach((img) => {
          img.style.transform = `translateY(${s * 0.28}px)`;
        });
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (count === 0) return null;

  return (
    <section className="hero" id="heroSection" ref={heroRef}>
      <div className="hero-slides">
        {slides.map((s, i) => (
          <div className={`hero-slide${i === current ? ' active' : ''}`} key={s.id}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.imageUrl} alt={s.alt} />
          </div>
        ))}
      </div>

      <div className="hero-veil" />

      <div className="hero-body">
        <p className="hero-eye">{eyebrow}</p>
        <h1 className="hero-h1" dangerouslySetInnerHTML={{ __html: sanitizeInline(headline) }} />
        <p className="hero-desc">{description}</p>
      </div>

      <a href="#portfolio" className="hero-orb" aria-label="View our work">
        <span className="orb-txt">
          View
          <br />
          Work
        </span>
      </a>

      <div className="hero-progress">
        <div
          key={progressKey}
          className="hero-progress-fill"
          style={{
            width: '100%',
            transition: `width ${DURATION}ms linear`,
            animation: 'none'
          }}
          ref={(el) => {
            // Restart trick: set to 0 then to 100% on next frame.
            if (!el) return;
            el.style.transition = 'none';
            el.style.width = '0%';
            requestAnimationFrame(() =>
              requestAnimationFrame(() => {
                el.style.transition = `width ${DURATION}ms linear`;
                el.style.width = '100%';
              })
            );
          }}
        />
      </div>

      <div className="hero-dots">
        {slides.map((s, i) => (
          <button
            key={s.id}
            className={`hero-dot${i === current ? ' active' : ''}`}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => {
              stopTimer();
              go(i);
              startTimer();
            }}
          />
        ))}
      </div>

      <div className="hero-slide-meta">
        {slides.map((s, i) => (
          <div className={`hsm-item${i === current ? ' active' : ''}`} key={s.id}>
            <span className="hsm-num">{s.subtitle ?? `0${i + 1} / 0${count}`}</span>
            <span className="hsm-name">{s.title}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
