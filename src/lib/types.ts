// Lightweight structural mirrors of the Prisma models.
//
// These exist so the codebase type-checks cleanly even before `prisma generate`
// has run (e.g. in CI/offline). Each interface is a *subset* of the corresponding
// Prisma model, so a Prisma result (the superset, incl. createdAt/updatedAt) is
// always assignable to it. Once the real client is generated, Prisma's own types
// take over at the query sites and these simply annotate the iteration callbacks.

export interface HeroSlideT {
  id: string;
  imageUrl: string;
  fileId: string | null;
  title: string;
  subtitle: string | null;
  alt: string;
  order: number;
  active: boolean;
}

export interface StatT {
  id: string;
  label: string;
  value: number;
  suffix: string;
  order: number;
}

export interface ServiceT {
  id: string;
  name: string;
  description: string;
  number: string;
  order: number;
}

export interface ProjectImageT {
  id: string;
  projectId: string;
  url: string;
  fileId: string | null;
  alt: string;
  role: string;
  order: number;
}

export interface ProjectT {
  id: string;
  title: string;
  category: string;
  description: string;
  type: string | null;
  location: string | null;
  scope: string | null;
  year: number | null;
  order: number;
  published: boolean;
  images: ProjectImageT[];
}

export interface SiteContentT {
  key: string;
  value: string;
  type: string;
}

export interface InquiryT {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  projectType: string | null;
  message: string | null;
  read: boolean;
  archived: boolean;
  createdAt: Date;
}
