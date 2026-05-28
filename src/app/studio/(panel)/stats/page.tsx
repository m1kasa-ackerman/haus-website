import { prisma } from '@/lib/db';
import { saveStat, deleteStat } from '../../actions';
import { SubmitButton, DeleteButton } from '@/components/studio/Buttons';
import type { StatT } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function StatsPage() {
  const stats = await prisma.stat.findMany({ orderBy: { order: 'asc' } });

  return (
    <>
      <div className="studio-head">
        <div>
          <h1>Stats</h1>
          <p className="sub">
            The headline numbers shown on the homepage (e.g. &quot;12+ projects&quot;). The number
            counts up when scrolled into view.
          </p>
        </div>
      </div>

      {stats.map((s: StatT) => (
        <div className="s-card" key={s.id}>
          <form action={saveStat}>
            <input type="hidden" name="id" value={s.id} />
            <div className="f-row-3">
              <div className="f-group">
                <label className="f-label">Number</label>
                <input className="f-input" name="value" type="number" defaultValue={s.value} required />
              </div>
              <div className="f-group">
                <label className="f-label">Suffix</label>
                <input className="f-input" name="suffix" defaultValue={s.suffix} placeholder="+ or K+ sqft" />
              </div>
              <div className="f-group">
                <label className="f-label">Order</label>
                <input className="f-input" name="order" type="number" defaultValue={s.order} />
              </div>
            </div>
            <div className="f-group">
              <label className="f-label">Label</label>
              <input className="f-input" name="label" defaultValue={s.label} required />
            </div>
            <div className="row-actions">
              <SubmitButton>Save</SubmitButton>
              <DeleteButton
                action={async () => {
                  'use server';
                  await deleteStat(s.id);
                }}
              />
            </div>
          </form>
        </div>
      ))}

      <h2 style={{ fontFamily: 'var(--s-serif)', fontWeight: 400, fontSize: 22, margin: '28px 0 14px' }}>
        Add a stat
      </h2>
      <div className="s-card">
        <form action={saveStat}>
          <div className="f-row-3">
            <div className="f-group">
              <label className="f-label">Number</label>
              <input className="f-input" name="value" type="number" placeholder="12" required />
            </div>
            <div className="f-group">
              <label className="f-label">Suffix</label>
              <input className="f-input" name="suffix" defaultValue="+" />
            </div>
            <div className="f-group">
              <label className="f-label">Order</label>
              <input className="f-input" name="order" type="number" defaultValue={stats.length} />
            </div>
          </div>
          <div className="f-group">
            <label className="f-label">Label</label>
            <input className="f-input" name="label" placeholder="Projects completed" required />
          </div>
          <SubmitButton>Add stat</SubmitButton>
        </form>
      </div>
    </>
  );
}
