'use client';

import { useRef, useState } from 'react';

export interface UploadedImage {
  url: string;
  fileId: string | null;
}

// Uploads a file directly to ImageKit from the browser. The signed token comes
// from our /api/imagekit/auth endpoint (admin-only). On success returns the
// hosted URL + fileId. If ImageKit isn't configured yet, surfaces a clear note.
export default function ImageUploader({
  value,
  onChange,
  folder = '/haus',
  label = 'Image'
}: {
  value?: string;
  onChange: (img: UploadedImage) => void;
  folder?: string;
  label?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState(value || '');
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError(null);
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5 MB.');
      return;
    }
    setBusy(true);
    try {
      // 1. Get signed upload params.
      const authRes = await fetch('/api/imagekit/auth');
      if (authRes.status === 503) {
        setError(
          'ImageKit is not configured yet. Add your ImageKit keys to the environment to enable uploads.'
        );
        setBusy(false);
        return;
      }
      if (!authRes.ok) throw new Error('Could not get upload authorization.');
      const authParams = await authRes.json();

      // 2. Upload directly to ImageKit.
      const fd = new FormData();
      fd.append('file', file);
      fd.append('fileName', `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`);
      fd.append('publicKey', authParams.publicKey);
      fd.append('signature', authParams.signature);
      fd.append('expire', authParams.expire);
      fd.append('token', authParams.token);
      fd.append('folder', folder);
      fd.append('useUniqueFileName', 'true');

      const upRes = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
        method: 'POST',
        body: fd
      });
      const upData = await upRes.json();
      if (!upRes.ok) throw new Error(upData?.message || 'Upload failed.');

      setPreview(upData.url);
      onChange({ url: upData.url, fileId: upData.fileId });
    } catch (err) {
      setError((err as Error).message || 'Upload failed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="f-group">
      <span className="f-label">{label}</span>
      <div className="uploader">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="uploader-preview" src={preview} alt="Preview" />
        ) : (
          <div className="uploader-preview" style={{ display: 'grid', placeItems: 'center', color: 'var(--s-muted)', fontSize: 11 }}>
            No image
          </div>
        )}
        <div
          className={`uploader-drop${busy ? ' busy' : ''}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files?.[0];
            if (f) handleFile(f);
          }}
        >
          <div className="big">{busy ? 'Uploading…' : 'Click or drop to upload'}</div>
          <div className="small">JPG / PNG / WebP · up to 5 MB</div>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
      </div>
      {error && <div className="uploader-warn" style={{ marginTop: 10 }}>{error}</div>}
    </div>
  );
}
