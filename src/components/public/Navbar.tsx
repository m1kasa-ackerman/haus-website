'use client';

import { useState } from 'react';

export default function Navbar({ logoMain, logoSub }: { logoMain: string; logoSub: string }) {
  const [open, setOpen] = useState(false);

  const links = [
    { href: '#about', label: 'About' },
    { href: '#portfolio', label: 'Portfolio' },
    { href: '#services', label: 'Services' }
  ];

  return (
    <>
      <nav className="site-nav" id="top">
        <div className="logo">
          {logoMain} <sub>{logoSub}</sub>
        </div>
        <ul className="nav-links">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
        </ul>
        <a href="#contact" className="nav-pill">
          Get in touch
        </a>
        <button
          className={`nav-burger${open ? ' open' : ''}`}
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      <div className={`mobile-menu${open ? ' open' : ''}`}>
        {links.map((l) => (
          <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
            {l.label}
          </a>
        ))}
        <a href="#contact" className="pill" onClick={() => setOpen(false)}>
          Get in touch
        </a>
      </div>
    </>
  );
}
