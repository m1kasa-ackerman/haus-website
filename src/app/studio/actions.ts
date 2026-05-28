'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { deleteImageKitFile } from '@/lib/imagekit';
import type { ProjectImageT } from '@/lib/types';

// ─── Guard ───────────────────────────────────────────────────────
async function requireAuth() {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');
}

function revalidateSite() {
  revalidatePath('/');
}

// ═══════════════════════════════════════════════════════════════
//  SITE CONTENT (catch-all key/value)
// ═══════════════════════════════════════════════════════════════
export async function saveContent(entries: Record<string, string>) {
  await requireAuth();
  await Promise.all(
    Object.entries(entries).map(([key, value]) =>
      prisma.siteContent.upsert({
        where: { key },
        update: { value },
        create: { key, value, type: 'text' }
      })
    )
  );
  revalidateSite();
  return { ok: true };
}

// ═══════════════════════════════════════════════════════════════
//  STATS
// ═══════════════════════════════════════════════════════════════
export async function saveStat(form: FormData) {
  await requireAuth();
  const id = String(form.get('id') || '');
  const data = {
    label: String(form.get('label') || '').trim(),
    value: parseInt(String(form.get('value') || '0'), 10) || 0,
    suffix: String(form.get('suffix') || '+').trim(),
    order: parseInt(String(form.get('order') || '0'), 10) || 0
  };
  if (id) await prisma.stat.update({ where: { id }, data });
  else await prisma.stat.create({ data });
  revalidateSite();
  revalidatePath('/studio/stats');
}

export async function deleteStat(id: string) {
  await requireAuth();
  await prisma.stat.delete({ where: { id } });
  revalidateSite();
  revalidatePath('/studio/stats');
}

// ═══════════════════════════════════════════════════════════════
//  SERVICES
// ═══════════════════════════════════════════════════════════════
export async function saveService(form: FormData) {
  await requireAuth();
  const id = String(form.get('id') || '');
  const data = {
    number: String(form.get('number') || '').trim(),
    name: String(form.get('name') || '').trim(),
    description: String(form.get('description') || '').trim(),
    order: parseInt(String(form.get('order') || '0'), 10) || 0
  };
  if (id) await prisma.service.update({ where: { id }, data });
  else await prisma.service.create({ data });
  revalidateSite();
  revalidatePath('/studio/services');
}

export async function deleteService(id: string) {
  await requireAuth();
  await prisma.service.delete({ where: { id } });
  revalidateSite();
  revalidatePath('/studio/services');
}

// ═══════════════════════════════════════════════════════════════
//  HERO SLIDES
// ═══════════════════════════════════════════════════════════════
export async function saveHeroSlide(form: FormData) {
  await requireAuth();
  const id = String(form.get('id') || '');
  const data = {
    imageUrl: String(form.get('imageUrl') || '').trim(),
    fileId: String(form.get('fileId') || '').trim() || null,
    title: String(form.get('title') || '').trim(),
    subtitle: String(form.get('subtitle') || '').trim() || null,
    alt: String(form.get('alt') || '').trim() || String(form.get('title') || '').trim(),
    order: parseInt(String(form.get('order') || '0'), 10) || 0,
    active: form.get('active') === 'on' || form.get('active') === 'true'
  };
  if (!data.imageUrl) throw new Error('An image is required for a hero slide.');

  if (id) {
    // If image was replaced, delete the old ImageKit file.
    const existing = await prisma.heroSlide.findUnique({ where: { id } });
    if (existing && existing.fileId && existing.fileId !== data.fileId) {
      await deleteImageKitFile(existing.fileId);
    }
    await prisma.heroSlide.update({ where: { id }, data });
  } else {
    await prisma.heroSlide.create({ data });
  }
  revalidateSite();
  revalidatePath('/studio/hero');
}

export async function deleteHeroSlide(id: string) {
  await requireAuth();
  const slide = await prisma.heroSlide.findUnique({ where: { id } });
  if (slide?.fileId) await deleteImageKitFile(slide.fileId);
  await prisma.heroSlide.delete({ where: { id } });
  revalidateSite();
  revalidatePath('/studio/hero');
}

// ═══════════════════════════════════════════════════════════════
//  PROJECTS
// ═══════════════════════════════════════════════════════════════
interface ProjectImageInput {
  id?: string;
  url: string;
  fileId?: string | null;
  alt: string;
  role: string;
  order: number;
}

export async function saveProject(payload: {
  id?: string;
  title: string;
  category: string;
  description: string;
  type?: string;
  location?: string;
  scope?: string;
  year?: number | null;
  videoUrl?: string | null;
  order?: number;
  published?: boolean;
  images: ProjectImageInput[];
}) {
  await requireAuth();
  const base = {
    title: payload.title.trim(),
    category: payload.category.trim(),
    description: payload.description.trim(),
    type: payload.type?.trim() || null,
    location: payload.location?.trim() || null,
    scope: payload.scope?.trim() || null,
    year: payload.year ?? null,
    videoUrl: payload.videoUrl ?? null,
    order: payload.order ?? 0,
    published: payload.published ?? true
  };

  let projectId = payload.id;

  if (projectId) {
    await prisma.project.update({ where: { id: projectId }, data: base });

    // Reconcile images: delete removed ones (and their ImageKit files), upsert the rest.
    const existing = await prisma.projectImage.findMany({ where: { projectId } });
    const keptIds = new Set(payload.images.filter((i) => i.id).map((i) => i.id));
    const removed = existing.filter((e: ProjectImageT) => !keptIds.has(e.id));
    await Promise.all(removed.map((r: ProjectImageT) => deleteImageKitFile(r.fileId)));
    if (removed.length) {
      await prisma.projectImage.deleteMany({ where: { id: { in: removed.map((r: ProjectImageT) => r.id) } } });
    }
    for (const img of payload.images) {
      if (img.id) {
        await prisma.projectImage.update({
          where: { id: img.id },
          data: { url: img.url, alt: img.alt, role: img.role, order: img.order, fileId: img.fileId ?? null }
        });
      } else {
        await prisma.projectImage.create({
          data: { projectId, url: img.url, alt: img.alt, role: img.role, order: img.order, fileId: img.fileId ?? null }
        });
      }
    }
  } else {
    const created = await prisma.project.create({
      data: {
        ...base,
        images: {
          create: payload.images.map((i) => ({
            url: i.url,
            alt: i.alt,
            role: i.role,
            order: i.order,
            fileId: i.fileId ?? null
          }))
        }
      }
    });
    projectId = created.id;
  }

  revalidateSite();
  revalidatePath('/studio/projects');
  return { ok: true, id: projectId };
}

export async function deleteProject(id: string) {
  await requireAuth();
  const images = await prisma.projectImage.findMany({ where: { projectId: id } });
  await Promise.all(images.map((i: ProjectImageT) => deleteImageKitFile(i.fileId)));
  await prisma.project.delete({ where: { id } }); // cascades images in DB
  revalidateSite();
  revalidatePath('/studio/projects');
}

export async function reorderProjects(orderedIds: string[]) {
  await requireAuth();
  await Promise.all(
    orderedIds.map((id, idx) => prisma.project.update({ where: { id }, data: { order: idx } }))
  );
  revalidateSite();
  revalidatePath('/studio/projects');
}

// ═══════════════════════════════════════════════════════════════
//  INQUIRIES
// ═══════════════════════════════════════════════════════════════
export async function markInquiryRead(id: string, read: boolean) {
  await requireAuth();
  await prisma.inquiry.update({ where: { id }, data: { read } });
  revalidatePath('/studio/inquiries');
  revalidatePath('/studio');
}

export async function archiveInquiry(id: string, archived: boolean) {
  await requireAuth();
  await prisma.inquiry.update({ where: { id }, data: { archived } });
  revalidatePath('/studio/inquiries');
  revalidatePath('/studio');
}

export async function deleteInquiry(id: string) {
  await requireAuth();
  await prisma.inquiry.delete({ where: { id } });
  revalidatePath('/studio/inquiries');
  revalidatePath('/studio');
}

// ═══════════════════════════════════════════════════════════════
//  AUTH
// ═══════════════════════════════════════════════════════════════
export async function studioSignOut() {
  const { signOut } = await import('@/lib/auth');
  await signOut({ redirect: false });
  redirect('/studio/login');
}
