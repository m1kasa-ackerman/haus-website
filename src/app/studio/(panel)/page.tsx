import Link from 'next/link';
import { prisma } from '@/lib/db';
import type { InquiryT } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const [projects, hero, services, stats, unread, totalInq, recent] = await Promise.all([
    prisma.project.count(),
    prisma.heroSlide.count(),
    prisma.service.count(),
    prisma.stat.count(),
    prisma.inquiry.count({ where: { read: false, archived: false } }),
    prisma.inquiry.count({ where: { archived: false } }),
    prisma.inquiry.findMany({ where: { archived: false }, orderBy: { createdAt: 'desc' }, take: 5 })
  ]);

  const tiles = [
    { href: '/studio/inquiries', ico: '✉', name: 'Inquiries', desc: 'Contact-form submissions', count: totalInq, highlight: unread },
    { href: '/studio/projects', ico: '▦', name: 'Projects', desc: 'Portfolio case studies', count: projects },
    { href: '/studio/hero', ico: '❖', name: 'Hero slides', desc: 'Homepage slideshow', count: hero },
    { href: '/studio/services', ico: '☰', name: 'Services', desc: 'What you offer', count: services },
    { href: '/studio/stats', ico: '▲', name: 'Stats', desc: 'Headline numbers', count: stats },
    { href: '/studio/about', ico: '✎', name: 'About & photo', desc: 'Bio + designer photo', count: null },
    { href: '/studio/footer', ico: '⌂', name: 'Contact & footer', desc: 'Email, phone, socials', count: null }
  ];

  return (
    <>
      <div className="studio-head">
        <div>
          <h1>Welcome back</h1>
          <p className="sub">
            Everything on your live site is editable here. Changes publish instantly.
          </p>
        </div>
        <Link href="/" target="_blank" className="btn btn-ghost">View live site ↗</Link>
      </div>

      {unread > 0 && (
        <div className="flash flash-ok">
          You have <strong>{unread}</strong> new {unread === 1 ? 'inquiry' : 'inquiries'}.{' '}
          <Link href="/studio/inquiries" style={{ textDecoration: 'underline' }}>View now →</Link>
        </div>
      )}

      <div className="dash-grid">
        {tiles.map((t) => (
          <Link key={t.href} href={t.href} className="dash-tile">
            <div className="t-ico">{t.ico}</div>
            <div className="t-name">{t.name}</div>
            <div className="t-desc">{t.desc}</div>
            {t.count !== null && (
              <div className="t-count">
                {t.count}
                {t.highlight ? <span style={{ fontSize: 14, color: 'var(--s-gold)' }}> · {t.highlight} new</span> : null}
              </div>
            )}
          </Link>
        ))}
      </div>

      <h2 style={{ fontFamily: 'var(--s-serif)', fontWeight: 400, fontSize: 24, margin: '32px 0 16px' }}>
        Recent inquiries
      </h2>
      {recent.length === 0 ? (
        <div className="s-card" style={{ color: 'var(--s-muted)', fontSize: 13.5 }}>
          No inquiries yet. They&apos;ll appear here when someone submits the contact form.
        </div>
      ) : (
        recent.map((inq: InquiryT) => (
          <div className={`inq${inq.read ? '' : ' unread'}`} key={inq.id}>
            <div className="inq-top">
              <div className="inq-name">
                {!inq.read && <span className="inq-dot" />}
                {inq.firstName} {inq.lastName}
              </div>
              <div className="inq-date">{new Date(inq.createdAt).toLocaleDateString()}</div>
            </div>
            <div className="inq-contacts">
              <a href={`mailto:${inq.email}`}>{inq.email}</a>
              <a href={`tel:${inq.phone}`}>{inq.phone}</a>
            </div>
            {inq.projectType && <span className="inq-tag">{inq.projectType}</span>}
          </div>
        ))
      )}
    </>
  );
}
