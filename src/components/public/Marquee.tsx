'use client';

import { useRef } from 'react';

export default function Marquee({ text, orbText }: { text: string; orbText: string }) {
  const trackRef = useRef<HTMLDivElement>(null);

  const pause = () => {
    if (trackRef.current) trackRef.current.style.animationPlayState = 'paused';
  };
  const play = () => {
    if (trackRef.current) trackRef.current.style.animationPlayState = 'running';
  };

  return (
    <div className="marquee-wrap" onMouseEnter={pause} onMouseLeave={play}>
      <div className="mq-track" aria-hidden="true" ref={trackRef}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div className="mq-item" key={i}>
            {text} <span className="mq-pip" />
          </div>
        ))}
      </div>
      <div className="mq-orb-wrap">
        <a href="#contact" className="mq-orb" aria-label="Start your project">
          <span>
            {orbText.split('\n').map((line, i, arr) => (
              <span key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
          </span>
        </a>
      </div>
    </div>
  );
}
