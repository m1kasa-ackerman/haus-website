'use client';

import { Suspense } from 'react';
import { useFormState } from 'react-dom';
import { useSearchParams } from 'next/navigation';
import { loginAction, type LoginState } from './actions';
import { SubmitButton } from '@/components/studio/Buttons';
import '../studio.css';

function LoginForm() {
  const [state, formAction] = useFormState<LoginState, FormData>(loginAction, {});
  const params = useSearchParams();
  const callbackUrl = params.get('callbackUrl') || '/studio';

  return (
    <div className="studio-root">
      <div className="login-wrap">
        <div className="login-card">
          <div className="login-brand">
            Haus <sub>Studio</sub>
          </div>
          <div className="login-tag">Sign in to manage your site</div>

          {state.error && <div className="flash flash-err">{state.error}</div>}

          <form action={formAction}>
            <input type="hidden" name="callbackUrl" value={callbackUrl} />
            <div className="f-group">
              <label className="f-label" htmlFor="email">Email</label>
              <input className="f-input" type="email" id="email" name="email" required autoComplete="email" autoFocus />
            </div>
            <div className="f-group">
              <label className="f-label" htmlFor="password">Password</label>
              <input className="f-input" type="password" id="password" name="password" required autoComplete="current-password" />
            </div>
            <SubmitButton className="btn btn-gold btn-block">Sign in</SubmitButton>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
