import { prisma } from '@/lib/db';
import { getSiteContentMap, content } from '@/lib/utils';
import type { HeroSlideT, StatT, ServiceT, ProjectT, ProjectImageT } from '@/lib/types';

import Intro from '@/components/public/Intro';
import ScrollEffects from '@/components/public/ScrollEffects';
import Navbar from '@/components/public/Navbar';
import Hero from '@/components/public/Hero';
import Stats from '@/components/public/Stats';
import About from '@/components/public/About';
import Portfolio from '@/components/public/Portfolio';
import Services from '@/components/public/Services';
import Marquee from '@/components/public/Marquee';
import Contact from '@/components/public/Contact';
import Footer from '@/components/public/Footer';

// Always render fresh content (admin edits show immediately).
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [c, heroSlides, stats, projects, services] = await Promise.all([
    getSiteContentMap(),
    prisma.heroSlide.findMany({ where: { active: true }, orderBy: { order: 'asc' } }),
    prisma.stat.findMany({ orderBy: { order: 'asc' } }),
    prisma.project.findMany({
      where: { published: true },
      orderBy: { order: 'asc' },
      include: { images: { orderBy: { order: 'asc' } } }
    }),
    prisma.service.findMany({ orderBy: { order: 'asc' } })
  ]);

  return (
    <>
      <Intro
        hello={content(c, 'intro_hello', 'Hello, we are')}
        brandName={content(c, 'intro_brand_name', 'Haus')}
        brandSub={content(c, 'intro_brand_sub', 'Design Studio')}
      />
      <ScrollEffects />

      <div className="bg-fixed" aria-hidden="true">
        <div className="bg-wm">HAUS</div>
      </div>

      <div className="frame">
        <Navbar
          logoMain={content(c, 'logo_main', 'Haus')}
          logoSub={content(c, 'logo_sub', 'Design Studio')}
        />

        <Hero
          slides={heroSlides.map((s: HeroSlideT) => ({
            id: s.id,
            imageUrl: s.imageUrl,
            title: s.title,
            subtitle: s.subtitle,
            alt: s.alt
          }))}
          eyebrow={content(c, 'hero_eyebrow', 'Haus Design Studio  ·  Hyderabad')}
          headline={content(c, 'hero_headline', 'Where spaces<br>become <em>stories</em>')}
          description={content(c, 'hero_description', '')}
        />

        <Stats
          stats={stats.map((s: StatT) => ({ id: s.id, label: s.label, value: s.value, suffix: s.suffix }))}
          tagline={content(c, 'stats_tagline', '')}
          paragraph={content(c, 'stats_paragraph', '')}
        />

        <About
          eyebrow={content(c, 'about_eyebrow', 'The designer')}
          headline={content(c, 'about_headline', 'Designing <em>from</em><br>the inside out')}
          bioP1={content(c, 'about_bio_p1', '')}
          bioP2={content(c, 'about_bio_p2', '')}
          photoUrl={content(c, 'about_photo_url', '/images/seed/04-haneesha-principal-designer-at-haus.jpeg')}
          badgeText={content(c, 'about_badge_text', 'Principal\nDesigner')}
        />

        <Portfolio
          projects={projects.map((p: ProjectT) => ({
            id: p.id,
            title: p.title,
            category: p.category,
            description: p.description,
            type: p.type,
            location: p.location,
            scope: p.scope,
            videoUrl: p.videoUrl,
            images: p.images.map((i: ProjectImageT) => ({ id: i.id, url: i.url, alt: i.alt, role: i.role }))
          }))}
          eyebrow={content(c, 'portfolio_eyebrow', 'Selected work')}
          headline={content(c, 'portfolio_headline', 'Impressions that <em>endure</em>')}
          linkLabel={content(c, 'portfolio_link_label', 'See all on Instagram →')}
          linkUrl={content(c, 'portfolio_link_url', 'https://www.instagram.com/hausbyhaneesha/')}
        />

        <Services
          services={services.map((s: ServiceT) => ({
            id: s.id,
            number: s.number,
            name: s.name,
            description: s.description
          }))}
          eyebrow={content(c, 'services_eyebrow', 'What we do')}
          headline={content(c, 'services_headline', 'Elevate your <em>space</em>')}
        />

        <Marquee
          text={content(c, 'marquee_text', "Let's build your Haus")}
          orbText={content(c, 'marquee_orb_text', 'START\nHERE')}
        />

        <Contact
          eyebrow={content(c, 'contact_eyebrow', 'Get in touch')}
          headline={content(c, 'contact_headline', "Let's talk about<br>your <em>space</em>")}
          paragraph={content(c, 'contact_paragraph', '')}
          location={content(c, 'contact_location', 'Hyderabad, India')}
          instagram={content(c, 'contact_instagram', '@hausbyhaneesha')}
          instagramUrl={content(c, 'contact_instagram_url', 'https://www.instagram.com/hausbyhaneesha/')}
          email={content(c, 'contact_email', '')}
          phone={content(c, 'contact_phone', '')}
        />

        <Footer
          logoMain={content(c, 'logo_main', 'Haus')}
          logoSub={content(c, 'logo_sub', 'Design Studio')}
          instagram={content(c, 'contact_instagram', '@hausbyhaneesha')}
          instagramUrl={content(c, 'contact_instagram_url', 'https://www.instagram.com/hausbyhaneesha/')}
          location={content(c, 'contact_location', 'Hyderabad, India')}
          email={content(c, 'contact_email', '')}
          phone={content(c, 'contact_phone', '')}
          ctaText={content(c, 'footer_cta_text', '')}
          copyright={content(c, 'footer_copyright', '© Haus Design Studio. All rights reserved.')}
        />
      </div>
    </>
  );
}
