'use server';

import { signIn } from '@/lib/auth';
import { AuthError } from 'next-auth';

export interface LoginState {
  error?: string;
}

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get('email') || '');
  const password = String(formData.get('password') || '');
  const callbackUrl = String(formData.get('callbackUrl') || '/studio');

  try {
    await signIn('credentials', { email, password, redirectTo: callbackUrl });
    return {};
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: 'Invalid email or password.' };
    }
    // signIn throws a redirect on success — re-throw so Next can handle it.
    throw err;
  }
}
