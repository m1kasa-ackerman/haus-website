'use client';

import { useFormStatus } from 'react-dom';
import { useState } from 'react';

export function SubmitButton({
  children = 'Save',
  className = 'btn btn-gold'
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={className} disabled={pending}>
      {pending ? 'Saving…' : children}
    </button>
  );
}

export function DeleteButton({
  action,
  confirmText = 'Delete this item? This cannot be undone.',
  label = 'Delete',
  className = 'btn btn-danger btn-sm'
}: {
  action: () => Promise<void>;
  confirmText?: string;
  label?: string;
  className?: string;
}) {
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      className={className}
      disabled={busy}
      onClick={async () => {
        if (!confirm(confirmText)) return;
        setBusy(true);
        try {
          await action();
        } finally {
          setBusy(false);
        }
      }}
    >
      {busy ? '…' : label}
    </button>
  );
}

export function ActionButton({
  action,
  label,
  busyLabel = '…',
  className = 'btn btn-ghost btn-sm'
}: {
  action: () => Promise<void>;
  label: string;
  busyLabel?: string;
  className?: string;
}) {
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      className={className}
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        try {
          await action();
        } finally {
          setBusy(false);
        }
      }}
    >
      {busy ? busyLabel : label}
    </button>
  );
}
