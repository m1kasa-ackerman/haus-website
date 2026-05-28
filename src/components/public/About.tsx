import { sanitizeInline } from '@/lib/utils';

export default function About({
  eyebrow,
  headline,
  bioP1,
  bioP2,
  photoUrl,
  badgeText
}: {
  eyebrow: string;
  headline: string;
  bioP1: string;
  bioP2: string;
  photoUrl: string;
  badgeText: string;
}) {
  return (
    <section className="about" id="about">
      <div className="about-img-wrap r">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="about-img" src={photoUrl} alt="Haneesha — principal designer at Haus" />
        <div className="about-badge">
          <span>
            {badgeText.split('\n').map((line, i, arr) => (
              <span key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
          </span>
        </div>
      </div>
      <div>
        <p className="eyebrow r">{eyebrow}</p>
        <h2 className="h2 r d1" dangerouslySetInnerHTML={{ __html: sanitizeInline(headline) }} />
        <p className="body-txt r d2">{bioP1}</p>
        <p className="body-txt r d2">{bioP2}</p>
        <a href="#contact" className="cta-link r d3">
          Work with Haneesha →
        </a>
      </div>
    </section>
  );
}
