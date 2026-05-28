import { getSiteContentMap, content } from '@/lib/utils';
import ContentForm, { type ContentField } from '@/components/studio/ContentForm';

export const dynamic = 'force-dynamic';

export default async function FooterContactPage() {
  const c = await getSiteContentMap();

  const contactFields: ContentField[] = [
    { key: 'contact_eyebrow', label: 'Contact eyebrow', value: content(c, 'contact_eyebrow'), type: 'text' },
    { key: 'contact_headline', label: 'Contact headline', value: content(c, 'contact_headline'), type: 'richtext' },
    { key: 'contact_paragraph', label: 'Contact paragraph', value: content(c, 'contact_paragraph'), type: 'textarea' },
    { key: 'contact_location', label: 'Studio location', value: content(c, 'contact_location'), type: 'text' },
    { key: 'contact_email', label: 'Email address', value: content(c, 'contact_email'), type: 'text', placeholder: 'hello@hausbyhaneesha.com', hint: 'Shown in contact + footer. Leave blank to hide.' },
    { key: 'contact_phone', label: 'Phone number', value: content(c, 'contact_phone'), type: 'text', placeholder: '+91 …', hint: 'Shown in contact + footer. Leave blank to hide.' },
    { key: 'contact_instagram', label: 'Instagram handle', value: content(c, 'contact_instagram'), type: 'text' },
    { key: 'contact_instagram_url', label: 'Instagram URL', value: content(c, 'contact_instagram_url'), type: 'url' }
  ];

  const footerFields: ContentField[] = [
    { key: 'footer_cta_text', label: 'Footer call-to-action text', value: content(c, 'footer_cta_text'), type: 'textarea' },
    { key: 'footer_copyright', label: 'Copyright line', value: content(c, 'footer_copyright'), type: 'text' }
  ];

  const heroFields: ContentField[] = [
    { key: 'hero_eyebrow', label: 'Hero eyebrow', value: content(c, 'hero_eyebrow'), type: 'text' },
    { key: 'hero_headline', label: 'Hero headline', value: content(c, 'hero_headline'), type: 'richtext' },
    { key: 'hero_description', label: 'Hero description', value: content(c, 'hero_description'), type: 'textarea' }
  ];

  const sectionFields: ContentField[] = [
    { key: 'stats_tagline', label: 'Stats tagline', value: content(c, 'stats_tagline'), type: 'richtext' },
    { key: 'stats_paragraph', label: 'Stats paragraph', value: content(c, 'stats_paragraph'), type: 'textarea' },
    { key: 'portfolio_eyebrow', label: 'Portfolio eyebrow', value: content(c, 'portfolio_eyebrow'), type: 'text' },
    { key: 'portfolio_headline', label: 'Portfolio headline', value: content(c, 'portfolio_headline'), type: 'richtext' },
    { key: 'portfolio_link_label', label: 'Portfolio link label', value: content(c, 'portfolio_link_label'), type: 'text' },
    { key: 'portfolio_link_url', label: 'Portfolio link URL', value: content(c, 'portfolio_link_url'), type: 'url' },
    { key: 'services_eyebrow', label: 'Services eyebrow', value: content(c, 'services_eyebrow'), type: 'text' },
    { key: 'services_headline', label: 'Services headline', value: content(c, 'services_headline'), type: 'richtext' },
    { key: 'marquee_text', label: 'Marquee text', value: content(c, 'marquee_text'), type: 'text' },
    { key: 'logo_main', label: 'Logo (main)', value: content(c, 'logo_main'), type: 'text' },
    { key: 'logo_sub', label: 'Logo (subtitle)', value: content(c, 'logo_sub'), type: 'text' }
  ];

  return (
    <>
      <div className="studio-head">
        <div>
          <h1>Contact &amp; footer</h1>
          <p className="sub">Your contact details and all the section headings across the site.</p>
        </div>
      </div>

      <h2 style={{ fontFamily: 'var(--s-serif)', fontWeight: 400, fontSize: 22, margin: '6px 0 14px' }}>Contact details</h2>
      <ContentForm fields={contactFields} />

      <h2 style={{ fontFamily: 'var(--s-serif)', fontWeight: 400, fontSize: 22, margin: '28px 0 14px' }}>Footer</h2>
      <ContentForm fields={footerFields} />

      <h2 style={{ fontFamily: 'var(--s-serif)', fontWeight: 400, fontSize: 22, margin: '28px 0 14px' }}>Hero copy</h2>
      <ContentForm fields={heroFields} />

      <h2 style={{ fontFamily: 'var(--s-serif)', fontWeight: 400, fontSize: 22, margin: '28px 0 14px' }}>
        Other section headings
      </h2>
      <ContentForm fields={sectionFields} />
    </>
  );
}
