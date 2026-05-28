'use client';

import { useEffect, useRef, useState } from 'react';
import { sanitizeInline } from '@/lib/utils';

export interface StatData {
  id: string;
  label: string;
  value: number;
  suffix: string;
}

function Counter({ target }: { target: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const duration = 1800;
          const start = performance.now();
          const tick = (now: number) => {
            const t = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            setVal(Math.round(eased * target));
            if (t < 1) requestAnimationFrame(tick);
            else setVal(target);
          };
          requestAnimationFrame(tick);
          io.unobserve(e.target);
        });
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target]);

  return <span ref={ref} className="cnt">{val}</span>;
}

export default function Stats({
  stats,
  tagline,
  paragraph
}: {
  stats: StatData[];
  tagline: string;
  paragraph: string;
}) {
  return (
    <section className="stats" id="stats">
      <div className="stats-nums">
        {stats.map((s, i) => (
          <div className={`stat r${i ? ` d${i}` : ''}`} key={s.id}>
            <div className="stat-val">
              <Counter target={s.value} />
              <span className="stat-sfx">{s.suffix}</span>
            </div>
            <div className="stat-lbl">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="stats-divider" />

      <div className="stats-copy r d1">
        <div className="gold-pip" />
        <p
          className="stats-tagline"
          dangerouslySetInnerHTML={{ __html: sanitizeInline(tagline) }}
        />
        <p className="stats-para">{paragraph}</p>
      </div>
    </section>
  );
}
