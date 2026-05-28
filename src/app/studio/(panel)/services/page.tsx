import { prisma } from '@/lib/db';
import { saveService, deleteService } from '../../actions';
import { SubmitButton, DeleteButton } from '@/components/studio/Buttons';
import type { ServiceT } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function ServicesPage() {
  const services = await prisma.service.findMany({ orderBy: { order: 'asc' } });

  return (
    <>
      <div className="studio-head">
        <div>
          <h1>Services</h1>
          <p className="sub">The &quot;What we do&quot; cards on your homepage.</p>
        </div>
      </div>

      {services.map((s: ServiceT) => (
        <div className="s-card" key={s.id}>
          <form action={saveService}>
            <input type="hidden" name="id" value={s.id} />
            <div className="f-row">
              <div className="f-group">
                <label className="f-label">Number</label>
                <input className="f-input" name="number" defaultValue={s.number} placeholder="01" required />
              </div>
              <div className="f-group">
                <label className="f-label">Order</label>
                <input className="f-input" name="order" type="number" defaultValue={s.order} />
              </div>
            </div>
            <div className="f-group">
              <label className="f-label">Service name</label>
              <input className="f-input" name="name" defaultValue={s.name} required />
            </div>
            <div className="f-group">
              <label className="f-label">Description</label>
              <textarea className="f-textarea" name="description" defaultValue={s.description} required />
            </div>
            <div className="row-actions">
              <SubmitButton>Save</SubmitButton>
              <DeleteButton
                action={async () => {
                  'use server';
                  await deleteService(s.id);
                }}
              />
            </div>
          </form>
        </div>
      ))}

      <h2 style={{ fontFamily: 'var(--s-serif)', fontWeight: 400, fontSize: 22, margin: '28px 0 14px' }}>
        Add a service
      </h2>
      <div className="s-card">
        <form action={saveService}>
          <div className="f-row">
            <div className="f-group">
              <label className="f-label">Number</label>
              <input className="f-input" name="number" placeholder="05" required />
            </div>
            <div className="f-group">
              <label className="f-label">Order</label>
              <input className="f-input" name="order" type="number" defaultValue={services.length} />
            </div>
          </div>
          <div className="f-group">
            <label className="f-label">Service name</label>
            <input className="f-input" name="name" placeholder="Interior Styling" required />
          </div>
          <div className="f-group">
            <label className="f-label">Description</label>
            <textarea className="f-textarea" name="description" placeholder="What this service includes…" required />
          </div>
          <SubmitButton>Add service</SubmitButton>
        </form>
      </div>
    </>
  );
}
