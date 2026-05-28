'use client';

import { useState } from 'react';
import { useFormStatus, useFormState } from 'react-dom';
import { submitInquiry, type ContactState } from '@/app/actions/contact';
import { sanitizeInline } from '@/lib/utils';

const initialState: ContactState = { ok: false };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="form-submit" disabled={pending}>
      {pending ? 'Sending…' : 'Send message'}
    </button>
  );
}

export default function Contact({
  eyebrow,
  headline,
  paragraph,
  location,
  instagram,
  instagramUrl,
  email,
  phone
}: {
  eyebrow: string;
  headline: string;
  paragraph: string;
  location: string;
  instagram: string;
  instagramUrl: string;
  email: string;
  phone: string;
}) {
  const [state, formAction] = useFormState(submitInquiry, initialState);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const markError = (name: string, value: string, validator: (v: string) => boolean) =>
    touched[name] && !validator(value) ? ' error' : '';

  return (
    <section className="contact-section" id="contact">
      <div className="contact-inner">
        <div className="contact-copy r">
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="h2" dangerouslySetInnerHTML={{ __html: sanitizeInline(headline) }} />
          <p className="body-txt">{paragraph}</p>

          {location && (
            <div className="contact-detail">
              <div className="contact-detail-icon">📍</div>
              <div>
                <div className="contact-detail-lbl">Studio location</div>
                <div className="contact-detail-val">{location}</div>
              </div>
            </div>
          )}
          {instagram && (
            <div
              className="contact-detail"
              style={location ? { borderTop: 'none', marginTop: 0, paddingTop: 12 } : undefined}
            >
              <div className="contact-detail-icon">📸</div>
              <div>
                <div className="contact-detail-lbl">Instagram</div>
                <div className="contact-detail-val">
                  <a href={instagramUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                    {instagram}
                  </a>
                </div>
              </div>
            </div>
          )}
          {email && (
            <div className="contact-detail" style={{ borderTop: 'none', marginTop: 0, paddingTop: 12 }}>
              <div className="contact-detail-icon">✉️</div>
              <div>
                <div className="contact-detail-lbl">Email</div>
                <div className="contact-detail-val">
                  <a href={`mailto:${email}`} style={{ color: 'inherit', textDecoration: 'none' }}>{email}</a>
                </div>
              </div>
            </div>
          )}
          {phone && (
            <div className="contact-detail" style={{ borderTop: 'none', marginTop: 0, paddingTop: 12 }}>
              <div className="contact-detail-icon">📞</div>
              <div>
                <div className="contact-detail-lbl">Phone</div>
                <div className="contact-detail-val">
                  <a href={`tel:${phone}`} style={{ color: 'inherit', textDecoration: 'none' }}>{phone}</a>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="r d1">
          <div className="form-wrap">
            {state.ok ? (
              <div className="success-msg">
                <div className="success-icon">✦</div>
                <div className="success-title">Message received</div>
                <div className="success-body">
                  Thank you for reaching out. Haneesha will be in touch with you within 24 hours to
                  discuss your project.
                </div>
              </div>
            ) : (
              <form action={formAction} noValidate>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="firstName">First name</label>
                    <input
                      className={`form-input${markError('first_name', '', () => true)}`}
                      type="text" id="firstName" name="first_name" placeholder="Priya"
                      required onBlur={() => setTouched((t) => ({ ...t, first_name: true }))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="lastName">Last name</label>
                    <input
                      className="form-input" type="text" id="lastName" name="last_name"
                      placeholder="Sharma" required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="email">Email address</label>
                  <input className="form-input" type="email" id="email" name="email" placeholder="priya@email.com" required />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="phone">Phone number</label>
                  <input className="form-input" type="tel" id="phone" name="phone" placeholder="+91 98765 43210" required />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="projectType">Type of project</label>
                  <select className="form-input" id="projectType" name="project_type">
                    <option value="">Select a type…</option>
                    <option value="Residential — Full home">Residential — Full home</option>
                    <option value="Residential — Single room">Residential — Single room</option>
                    <option value="Turnkey project">Turnkey project</option>
                    <option value="Commercial space">Commercial space</option>
                    <option value="Consultation only">Consultation only</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 24 }}>
                  <label className="form-label" htmlFor="message">Tell us about your space</label>
                  <textarea
                    className="form-input" id="message" name="message" rows={3}
                    placeholder="Brief description of what you're imagining…"
                    style={{ resize: 'vertical', minHeight: 90 }}
                  />
                </div>

                <SubmitButton />
                {state.error && <p className="form-error-msg">{state.error}</p>}
                <p className="form-note">Your details are only shared with Haneesha. No spam, ever.</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
