export default function Footer({
  logoMain,
  logoSub,
  instagram,
  instagramUrl,
  location,
  email,
  phone,
  ctaText,
  copyright
}: {
  logoMain: string;
  logoSub: string;
  instagram: string;
  instagramUrl: string;
  location: string;
  email: string;
  phone: string;
  ctaText: string;
  copyright: string;
}) {
  return (
    <footer className="site-footer">
      <div className="ft-grid">
        <div>
          <div className="ft-logo">{logoMain}</div>
          <div className="ft-sub">{logoSub}</div>
          <div className="ft-info">
            <div className="ft-key">Instagram</div>
            <div className="ft-val">
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer">{instagram}</a>
            </div>
            {email && (
              <>
                <div className="ft-key">Email</div>
                <div className="ft-val"><a href={`mailto:${email}`}>{email}</a></div>
              </>
            )}
            {phone && (
              <>
                <div className="ft-key">Phone</div>
                <div className="ft-val"><a href={`tel:${phone}`}>{phone}</a></div>
              </>
            )}
            <div className="ft-key">Location</div>
            <div className="ft-val">{location}</div>
          </div>
        </div>

        <div>
          <div className="ft-col-ttl">Navigation</div>
          <ul className="ft-links">
            <li><a href="#about">About Haneesha</a></li>
            <li><a href="#portfolio">Portfolio</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>

        <div>
          <div className="ft-col-ttl">Start a project</div>
          <p className="ft-cta-txt">{ctaText}</p>
          <a href="#contact" className="ft-btn">Get in touch</a>
        </div>
      </div>
      <div className="ft-bottom">
        <span className="ft-copy">{copyright}</span>
        <a href="#top" className="ft-top-link">Back to top ↑</a>
      </div>
    </footer>
  );
}
