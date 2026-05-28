import { getSiteContentMap, content } from '@/lib/utils';
import ContentForm, { type ContentField } from '@/components/studio/ContentForm';

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  const c = await getSiteContentMap();

  const fields: ContentField[] = [
    {
      key: 'about_photo_url',
      label: 'Designer photo',
      value: content(c, 'about_photo_url'),
      type: 'image',
      fileIdKey: 'about_photo_fileid',
      fileIdValue: content(c, 'about_photo_fileid'),
      hint: 'A portrait of Haneesha (portrait orientation works best — 3:4).'
    },
    { key: 'about_eyebrow', label: 'Eyebrow', value: content(c, 'about_eyebrow'), type: 'text' },
    { key: 'about_headline', label: 'Headline', value: content(c, 'about_headline'), type: 'richtext' },
    { key: 'about_bio_p1', label: 'Bio — paragraph 1', value: content(c, 'about_bio_p1'), type: 'textarea' },
    { key: 'about_bio_p2', label: 'Bio — paragraph 2', value: content(c, 'about_bio_p2'), type: 'textarea' },
    {
      key: 'about_badge_text',
      label: 'Photo badge text',
      value: content(c, 'about_badge_text'),
      type: 'textarea',
      hint: 'Small badge over the photo. Put each line on its own line (e.g. "Principal" then "Designer").'
    }
  ];

  return (
    <>
      <div className="studio-head">
        <div>
          <h1>About &amp; photo</h1>
          <p className="sub">The about section — your bio and designer portrait.</p>
        </div>
      </div>
      <ContentForm fields={fields} />
    </>
  );
}
