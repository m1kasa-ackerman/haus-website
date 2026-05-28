'use server';

import { z } from 'zod';
import { prisma } from '@/lib/db';
import { sendInquiryEmail, isResendConfigured } from '@/lib/resend';

const schema = z.object({
  firstName: z.string().trim().min(1, 'First name is required').max(80),
  lastName: z.string().trim().min(1, 'Last name is required').max(80),
  email: z.string().trim().email('Enter a valid email').max(160),
  phone: z
    .string()
    .trim()
    .regex(/^[\d\s+\-()]{7,}$/, 'Enter a valid phone number'),
  projectType: z.string().trim().max(120).optional().or(z.literal('')),
  message: z.string().trim().max(4000).optional().or(z.literal(''))
});

export interface ContactState {
  ok: boolean;
  error?: string;
}

export async function submitInquiry(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  const raw = {
    firstName: String(formData.get('first_name') ?? ''),
    lastName: String(formData.get('last_name') ?? ''),
    email: String(formData.get('email') ?? ''),
    phone: String(formData.get('phone') ?? ''),
    projectType: String(formData.get('project_type') ?? ''),
    message: String(formData.get('message') ?? '')
  };

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Please check your details.' };
  }
  const data = parsed.data;

  try {
    // 1. Persist the inquiry.
    await prisma.inquiry.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        projectType: data.projectType || null,
        message: data.message || null
      }
    });

    // 2. Notify Haneesha (don't fail the submission if email is unconfigured/errors).
    if (isResendConfigured()) {
      try {
        await sendInquiryEmail(data);
      } catch (err) {
        console.error('Inquiry email failed (saved to DB anyway):', err);
      }
    }

    return { ok: true };
  } catch (err) {
    console.error('Inquiry save failed:', err);
    return { ok: false, error: 'Something went wrong. Please try again.' };
  }
}
