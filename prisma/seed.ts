// Seeds the database with the initial content extracted from the V1 HTML.
// Idempotent: safe to run multiple times — uses upsert / clears + recreates collections.
// Run with: npm run db:seed

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // ─── Admin ───────────────────────────────────────────────────
  const email = (process.env.ADMIN_EMAIL || 'admin@haus.local').trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'changeme';
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.admin.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash, name: 'Haneesha' }
  });
  console.log(`✓ Admin upserted: ${email}`);

  // ─── Hero slides ─────────────────────────────────────────────
  await prisma.heroSlide.deleteMany({});
  await prisma.heroSlide.createMany({
    data: [
      {
        imageUrl: '/images/seed/01-living-room-haus-design-studio.jpeg',
        title: 'The Warmth Within',
        subtitle: '01 / 03',
        alt: 'Living room — Haus Design Studio',
        order: 0
      },
      {
        imageUrl: '/images/seed/02-dining-room-haus-design-studio.jpeg',
        title: 'Gold & Gravity',
        subtitle: '02 / 03',
        alt: 'Dining room — Haus Design Studio',
        order: 1
      },
      {
        imageUrl: '/images/seed/03-playschool-haus-design-studio.jpeg',
        title: 'Little Worlds',
        subtitle: '03 / 03',
        alt: 'Playschool — Haus Design Studio',
        order: 2
      }
    ]
  });
  console.log('✓ 3 Hero slides seeded');

  // ─── Stats ───────────────────────────────────────────────────
  await prisma.stat.deleteMany({});
  await prisma.stat.createMany({
    data: [
      { label: 'Projects completed', value: 12, suffix: '+', order: 0 },
      { label: 'Years of experience', value: 6, suffix: '+', order: 1 },
      { label: 'Sq. ft. thoughtfully designed', value: 50, suffix: 'K+ sqft', order: 2 }
    ]
  });
  console.log('✓ 3 Stats seeded');

  // ─── Services ────────────────────────────────────────────────
  await prisma.service.deleteMany({});
  await prisma.service.createMany({
    data: [
      {
        number: '01',
        name: 'Interior Design',
        description:
          'Full-scope residential design from concept to completion — spatial planning, material selection, furniture curation, lighting design, and final styling. Every room, considered whole.',
        order: 0
      },
      {
        number: '02',
        name: 'Turnkey Projects',
        description:
          "We handle everything — design, procurement, execution, and handover. You walk into your finished space without having to manage a single contractor.",
        order: 1
      },
      {
        number: '03',
        name: 'Space Planning',
        description:
          'Before aesthetics comes architecture of living. We optimize how your space works — flow, light, proportion, function — and then make it beautiful on top of that.',
        order: 2
      },
      {
        number: '04',
        name: 'Commercial Design',
        description:
          'Offices, hospitality venues, schools, and retail spaces — we bring the same warmth and attention to commercial environments that we bring to homes.',
        order: 3
      }
    ]
  });
  console.log('✓ 4 Services seeded');

  // ─── Projects (with images) ─────────────────────────────────
  await prisma.project.deleteMany({}); // cascades to ProjectImage

  await prisma.project.create({
    data: {
      title: 'The Warmth Within',
      category: 'Residential · Living Room',
      description:
        'A sprawling luxury living room designed around texture and warmth — travertine wall panels, cove-lit wood ceilings, leather sofas, and handpicked wood accents that make a large space feel intimately human.',
      type: 'Luxury Residential',
      location: 'Hyderabad',
      scope: 'Full Interior Design',
      year: 2024,
      order: 0,
      images: {
        create: [
          { url: '/images/seed/05-living-room-wide-view.jpeg', alt: 'Living room — wide view', role: 'hero', order: 0 },
          { url: '/images/seed/06-living-room-seating-detail.jpeg', alt: 'Living room — seating detail', role: 'small', order: 1 },
          { url: '/images/seed/07-living-room-ceiling-lighting.jpeg', alt: 'Living room — ceiling & lighting', role: 'small', order: 2 }
        ]
      }
    }
  });

  await prisma.project.create({
    data: {
      title: 'Gold & <em>Gravity</em>',
      category: 'Residential · Dining Room',
      description:
        'A dining room that commands the room. A geometric bronze mirror ceiling reflects a crystal chandelier over a marble oval table — a space built for dinners that linger long after the meal ends.',
      type: 'Luxury Residential',
      location: 'Hyderabad',
      scope: 'Full Interior Design',
      year: 2024,
      order: 1,
      images: {
        create: [
          { url: '/images/seed/08-dining-room-main-view.jpeg', alt: 'Dining room — main view', role: 'hero', order: 0 },
          { url: '/images/seed/09-dining-room-table-detail.jpeg', alt: 'Dining room — table detail', role: 'small', order: 1 },
          { url: '/images/seed/10-dining-room-chandelier.jpeg', alt: 'Dining room — chandelier', role: 'small', order: 2 }
        ]
      }
    }
  });

  await prisma.project.create({
    data: {
      title: 'Little Worlds, Big <em>Imagination</em>',
      category: 'Commercial · Playschool',
      description:
        'A full playschool environment designed to spark curiosity at every turn — organic tree structures, rainbow floor maps, animal murals, ball pits, and learning zones that make every corner an adventure.',
      type: 'Commercial / Educational',
      location: 'Hyderabad',
      scope: 'Full Commercial Design',
      year: 2023,
      order: 2,
      images: {
        create: [
          { url: '/images/seed/11-playschool-main-space.jpeg', alt: 'Playschool — main space', role: 'hero', order: 0 },
          { url: '/images/seed/12-playschool-play-zone.jpeg', alt: 'Playschool — play zone', role: 'small', order: 1 },
          { url: '/images/seed/13-playschool-reading-corner.jpeg', alt: 'Playschool — reading corner', role: 'small', order: 2 }
        ]
      }
    }
  });
  console.log('✓ 3 Projects (with 9 images) seeded');

  // ─── SiteContent (catch-all editable strings) ───────────────
  const siteContentEntries: { key: string; value: string; type: string }[] = [
    // Intro
    { key: 'intro_hello', value: 'Hello, we are', type: 'text' },
    { key: 'intro_brand_name', value: 'Haus', type: 'text' },
    { key: 'intro_brand_sub', value: 'Design Studio', type: 'text' },

    // Nav / Logo
    { key: 'logo_main', value: 'Haus', type: 'text' },
    { key: 'logo_sub', value: 'Design Studio', type: 'text' },

    // Hero copy
    { key: 'hero_eyebrow', value: 'Haus Design Studio  ·  Hyderabad', type: 'text' },
    { key: 'hero_headline', value: 'Where spaces<br>become <em>stories</em>', type: 'richtext' },
    { key: 'hero_description', value: 'Crafting luxury residences and vibrant commercial interiors that feel inevitable — as if they were always meant to be yours.', type: 'text' },

    // Stats section copy
    { key: 'stats_tagline', value: 'Every detail is <em>chosen</em>,<br>every space is <em>felt</em>.', type: 'richtext' },
    { key: 'stats_paragraph', value: 'Haus is built on the belief that your home should feel like you — only more beautiful. We bring together material richness, spatial clarity, and a deep understanding of how people actually live.', type: 'text' },

    // About section
    { key: 'about_eyebrow', value: 'The designer', type: 'text' },
    { key: 'about_headline', value: 'Designing <em>from</em><br>the inside out', type: 'richtext' },
    { key: 'about_bio_p1', value: 'Haneesha founded Haus with one intention — to make every space feel like it was always meant to be that way. With over 6 years of practice and 50,000+ sq. ft. of designed space across luxury residences and commercial interiors, she brings an eye for materials, a love of crafted detail, and a process that keeps you at the centre.', type: 'text' },
    { key: 'about_bio_p2', value: 'From warm travertine walls and cove-lit wood ceilings to the gold-mirrored drama of a dining room — every Haus project begins with listening, and ends with a space that surprises you with how perfectly it fits.', type: 'text' },
    { key: 'about_photo_url', value: '/images/seed/04-haneesha-principal-designer-at-haus.jpeg', type: 'image_url' },
    { key: 'about_photo_fileid', value: '', type: 'image_fileid' },
    { key: 'about_badge_text', value: 'Principal\nDesigner', type: 'text' },

    // Portfolio header
    { key: 'portfolio_eyebrow', value: 'Selected work', type: 'text' },
    { key: 'portfolio_headline', value: 'Impressions that <em>endure</em>', type: 'richtext' },
    { key: 'portfolio_link_label', value: 'See all on Instagram →', type: 'text' },
    { key: 'portfolio_link_url', value: 'https://www.instagram.com/hausbyhaneesha/', type: 'url' },

    // Services header
    { key: 'services_eyebrow', value: 'What we do', type: 'text' },
    { key: 'services_headline', value: 'Elevate your <em>space</em>', type: 'richtext' },

    // Marquee
    { key: 'marquee_text', value: "Let's build your Haus", type: 'text' },
    { key: 'marquee_orb_text', value: 'START\nHERE', type: 'text' },

    // Contact section
    { key: 'contact_eyebrow', value: 'Get in touch', type: 'text' },
    { key: 'contact_headline', value: "Let's talk about<br>your <em>space</em>", type: 'richtext' },
    { key: 'contact_paragraph', value: "Whether you have a clear vision or just a feeling — we'd love to hear about your project. Fill in the form and Haneesha will get back to you within 24 hours.", type: 'text' },
    { key: 'contact_location', value: 'Hyderabad, India', type: 'text' },
    { key: 'contact_instagram', value: '@hausbyhaneesha', type: 'text' },
    { key: 'contact_instagram_url', value: 'https://www.instagram.com/hausbyhaneesha/', type: 'url' },
    { key: 'contact_email', value: '', type: 'text' },
    { key: 'contact_phone', value: '', type: 'text' },

    // Footer
    { key: 'footer_cta_text', value: 'Have a space in mind? Fill in the contact form and Haneesha will reach out within 24 hours.', type: 'text' },
    { key: 'footer_copyright', value: '© Haus Design Studio 2025. All rights reserved.', type: 'text' }
  ];

  for (const entry of siteContentEntries) {
    await prisma.siteContent.upsert({
      where: { key: entry.key },
      update: { value: entry.value, type: entry.type },
      create: entry
    });
  }
  console.log(`✓ ${siteContentEntries.length} SiteContent entries seeded`);

  console.log('\n✨ Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
