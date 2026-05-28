import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import ProjectEditor, { type ProjectInput } from '@/components/studio/ProjectEditor';
import type { ProjectImageT } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function EditProjectPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
    include: { images: { orderBy: { order: 'asc' } } }
  });

  if (!project) notFound();

  const initial: ProjectInput = {
    id: project.id,
    title: project.title,
    category: project.category,
    description: project.description,
    type: project.type ?? '',
    location: project.location ?? '',
    scope: project.scope ?? '',
    year: project.year,
    videoUrl: project.videoUrl ?? null,
    order: project.order,
    published: project.published,
    images: project.images.map((i: ProjectImageT) => ({
      id: i.id,
      url: i.url,
      fileId: i.fileId,
      alt: i.alt,
      role: i.role,
      order: i.order
    }))
  };

  return (
    <>
      <Link href="/studio/projects" className="studio-back">← Back to projects</Link>
      <div className="studio-head">
        <div>
          <h1>Edit project</h1>
          <p className="sub">{project.title.replace(/<[^>]+>/g, '')}</p>
        </div>
      </div>
      <ProjectEditor initial={initial} />
    </>
  );
}
