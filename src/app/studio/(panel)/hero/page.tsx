import { prisma } from '@/lib/db';
import HeroSlidesManager from '@/components/studio/HeroSlidesManager';
import type { HeroSlideT } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function HeroPage() {
  const slides = await prisma.heroSlide.findMany({ orderBy: { order: 'asc' } });

  return (
    <>
      <div className="studio-head">
        <div>
          <h1>Hero slides</h1>
          <p className="sub">
            The full-screen slideshow at the top of your homepage. Slides auto-rotate; order
            controls the sequence.
          </p>
        </div>
      </div>
      <HeroSlidesManager
        slides={slides.map((s: HeroSlideT) => ({
          id: s.id,
          imageUrl: s.imageUrl,
          fileId: s.fileId,
          title: s.title,
          subtitle: s.subtitle,
          alt: s.alt,
          order: s.order,
          active: s.active
        }))}
      />
    </>
  );
}
