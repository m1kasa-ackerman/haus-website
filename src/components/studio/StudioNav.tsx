'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { studioSignOut } from '@/app/studio/actions';

const NAV = [
  { href: '/studio', label: 'Dashboard', ico: '◆', exact: true },
  { href: '/studio/inquiries', label: 'Inquiries', ico: '✉' },
  { href: '/studio/projects', label: 'Projects', ico: '▦' },
  { href: '/studio/hero', label: 'Hero slides', ico: '❖' },
  { href: '/studio/about', label: 'About & photo', ico: '✎' },
  { href: '/studio/services', label: 'Services', ico: '☰' },
  { href: '/studio/stats', label: 'Stats', ico: '▲' },
  { href: '/studio/footer', label: 'Contact & footer', ico: '⌂' }
];

export default function StudioNav({
  who,
  unread
}: {
  who: string;
  unread: number;
}) {
  const pathname = usePathname();

  const isActive = (item: (typeof NAV)[number]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <aside className="studio-side">
      <div className="studio-brand">
        Haus <sub>Studio</sub>
      </div>
      <div className="studio-brand-tag">Content manager</div>

      <nav className="studio-nav">
        {NAV.map((item) => (
          <Link key={item.href} href={item.href} className={isActive(item) ? 'active' : ''}>
            <span className="ico">{item.ico}</span>
            {item.label}
            {item.href === '/studio/inquiries' && unread > 0 && (
              <span className="badge">{unread}</span>
            )}
          </Link>
        ))}
      </nav>

      <div className="studio-side-foot">
        <div className="who">{who}</div>
        <form action={studioSignOut}>
          <button type="submit" className="btn btn-ghost btn-sm btn-block">Sign out</button>
        </form>
        <Link
          href="/"
          target="_blank"
          className="btn btn-ghost btn-sm btn-block"
          style={{ marginTop: 8 }}
        >
          View live site ↗
        </Link>
      </div>
    </aside>
  );
}
