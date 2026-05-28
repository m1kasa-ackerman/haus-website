import Link from 'next/link';
import { prisma } from '@/lib/db';
import { reorderProjects } from '../../actions';
import ProjectsList from '@/components/studio/ProjectsList';
import type { ProjectT, ProjectImageT } from '@/lib/types';
type ProjectWithImages = ProjectT;

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { order: 'asc' },
    include: { images: { orderBy: { order: 'asc' } } }
  });

  return (
    <>
      <div className="studio-head">
        <div>
          <h1>Projects</h1>
          <p className="sub">Your portfolio case studies. Drag to reorder; click to edit.</p>
        </div>
        <Link href="/studio/projects/new" className="btn btn-gold">+ New project</Link>
      </div>

      {projects.length === 0 ? (
        <div className="empty">
          <div className="ico">▦</div>
          No projects yet.
          <div style={{ marginTop: 16 }}>
            <Link href="/studio/projects/new" className="btn btn-gold">Add your first project</Link>
          </div>
        </div>
      ) : (
        <ProjectsList
          projects={projects.map((p: ProjectWithImages) => ({
            id: p.id,
            title: p.title,
            category: p.category,
            published: p.published,
            imageCount: p.images.length,
            thumb: p.images.find((i: ProjectImageT) => i.role === 'hero')?.url ?? p.images[0]?.url ?? ''
          }))}
          reorder={async (ids: string[]) => {
            'use server';
            await reorderProjects(ids);
          }}
        />
      )}
    </>
  );
}
