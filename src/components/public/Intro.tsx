'use client';

import { useEffect, useState } from 'react';

export default function Intro({
  hello,
  brandName,
  brandSub
}: {
  hello: string;
  brandName: string;
  brandSub: string;
}) {
  const [show, setShow] = useState(false);
  const [helloVisible, setHelloVisible] = useState(false);
  const [brandVisible, setBrandVisible] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [exit, setExit] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem('hausIntroPlayed')) return;

    setShow(true);
    document.body.style.overflow = 'hidden';

    const timers = [
      setTimeout(() => setHelloVisible(true), 600),
      setTimeout(() => setHelloVisible(false), 2400),
      setTimeout(() => setBrandVisible(true), 3200),
      setTimeout(() => {
        setZoom(true);
        setExit(true);
      }, 4600),
      setTimeout(() => {
        setShow(false);
        document.body.style.overflow = '';
        sessionStorage.setItem('hausIntroPlayed', 'true');
      }, 6200)
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  if (!show) return null;

  return (
    <div id="intro" className={exit ? 'exit' : ''}>
      <div className="intro-hello" style={{ opacity: helloVisible ? 1 : 0 }}>
        {hello}
      </div>
      <div className={`intro-brand${brandVisible ? ' visible' : ''}${zoom ? ' zoom' : ''}`}>
        <div className="intro-brand-name">{brandName}</div>
        <div className="intro-brand-sub">{brandSub}</div>
      </div>
    </div>
  );
}
