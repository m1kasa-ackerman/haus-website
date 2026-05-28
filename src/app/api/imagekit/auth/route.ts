import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getUploadAuthParams, isImageKitConfigured } from '@/lib/imagekit';

// The browser calls this right before uploading directly to ImageKit.
// Only authenticated studio users may obtain upload credentials.
export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (!isImageKitConfigured()) {
    return NextResponse.json({ error: 'ImageKit is not configured' }, { status: 503 });
  }

  const authParams = getUploadAuthParams();
  return NextResponse.json({
    ...authParams,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
  });
}
