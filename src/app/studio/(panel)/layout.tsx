import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import StudioNav from '@/components/studio/StudioNav';
import '../studio.css';

export default async function StudioLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // The login page has its own full-screen layout; it sits at /studio/login and
  // is excluded from this shell by rendering its own markup. If somehow an
  // unauthenticated request reaches here, middleware already redirected — this
  // is a belt-and-suspenders guard.
  if (!session) redirect('/studio/login');

  const unread = await prisma.inquiry.count({ where: { read: false, archived: false } });
  const who = session.user?.email || 'Admin';

  return (
    <div className="studio-root">
      <div className="studio-shell">
        <StudioNav who={who} unread={unread} />
        <main className="studio-main">{children}</main>
      </div>
    </div>
  );
}
