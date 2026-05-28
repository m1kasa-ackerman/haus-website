import { sanitizeInline } from '@/lib/utils';

export interface ServiceData {
  id: string;
  number: string;
  name: string;
  description: string;
}

export default function Services({
  services,
  eyebrow,
  headline
}: {
  services: ServiceData[];
  eyebrow: string;
  headline: string;
}) {
  return (
    <section className="services" id="services">
      <div className="svc-hdr">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="h2" dangerouslySetInnerHTML={{ __html: sanitizeInline(headline) }} />
      </div>
      <div className="svc-grid">
        {services.map((s, i) => (
          <div className={`svc-card r${i ? ` d${Math.min(i, 3)}` : ''}`} key={s.id}>
            <p className="svc-n">{s.number}</p>
            <h3 className="svc-name">{s.name}</h3>
            <p className="svc-desc">{s.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
