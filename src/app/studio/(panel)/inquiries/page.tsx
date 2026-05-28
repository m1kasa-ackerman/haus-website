import { prisma } from '@/lib/db';
import { markInquiryRead, archiveInquiry, deleteInquiry } from '../../actions';
import { ActionButton, DeleteButton } from '@/components/studio/Buttons';
import type { InquiryT } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function InquiriesPage({
  searchParams
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const { view } = await searchParams;
  const showArchived = view === 'archived';

  const inquiries = await prisma.inquiry.findMany({
    where: { archived: showArchived },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <>
      <div className="studio-head">
        <div>
          <h1>Inquiries</h1>
          <p className="sub">Contact-form submissions. New ones are also emailed to you.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <a href="/studio/inquiries" className={`btn btn-sm ${!showArchived ? 'btn-gold' : 'btn-ghost'}`}>Inbox</a>
          <a href="/studio/inquiries?view=archived" className={`btn btn-sm ${showArchived ? 'btn-gold' : 'btn-ghost'}`}>Archived</a>
        </div>
      </div>

      {inquiries.length === 0 ? (
        <div className="empty">
          <div className="ico">✉</div>
          {showArchived ? 'No archived inquiries.' : 'No inquiries yet.'}
        </div>
      ) : (
        inquiries.map((inq: InquiryT) => (
          <div className={`inq${inq.read || showArchived ? '' : ' unread'}`} key={inq.id}>
            <div className="inq-top">
              <div className="inq-name">
                {!inq.read && !showArchived && <span className="inq-dot" />}
                {inq.firstName} {inq.lastName}
              </div>
              <div className="inq-date">
                {new Date(inq.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
              </div>
            </div>

            <div className="inq-contacts">
              <a href={`mailto:${inq.email}`}>✉ {inq.email}</a>
              <a href={`tel:${inq.phone}`}>📞 {inq.phone}</a>
            </div>

            {inq.projectType && <span className="inq-tag">{inq.projectType}</span>}
            {inq.message && <div className="inq-msg">{inq.message}</div>}

            <div className="inq-actions">
              <a href={`mailto:${inq.email}?subject=Re: Your inquiry to Haus Design Studio`} className="btn btn-gold btn-sm">Reply</a>
              {!showArchived && (
                <ActionButton
                  label={inq.read ? 'Mark unread' : 'Mark read'}
                  action={async () => {
                    'use server';
                    await markInquiryRead(inq.id, !inq.read);
                  }}
                />
              )}
              <ActionButton
                label={showArchived ? 'Restore' : 'Archive'}
                action={async () => {
                  'use server';
                  await archiveInquiry(inq.id, !showArchived);
                }}
              />
              <DeleteButton
                label="Delete"
                confirmText="Permanently delete this inquiry?"
                action={async () => {
                  'use server';
                  await deleteInquiry(inq.id);
                }}
              />
            </div>
          </div>
        ))
      )}
    </>
  );
}
