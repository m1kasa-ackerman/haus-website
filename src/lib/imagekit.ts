import ImageKit from 'imagekit';

// Server-side ImageKit instance. Uses private key — never expose to client.
let _imagekit: ImageKit | null = null;

export function getImageKit(): ImageKit {
  if (_imagekit) return _imagekit;
  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;
  if (!publicKey || !privateKey || !urlEndpoint) {
    throw new Error(
      'ImageKit env vars missing. Set IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT.'
    );
  }
  _imagekit = new ImageKit({ publicKey, privateKey, urlEndpoint });
  return _imagekit;
}

// Returns the signed token/expire/signature the browser needs to upload directly.
export function getUploadAuthParams() {
  return getImageKit().getAuthenticationParameters();
}

// Delete an asset from ImageKit by fileId. Swallows "not found" so callers
// can delete DB rows even if the remote file was already gone.
export async function deleteImageKitFile(fileId: string | null | undefined) {
  if (!fileId) return;
  try {
    await getImageKit().deleteFile(fileId);
  } catch (err) {
    console.warn(`ImageKit delete failed for ${fileId}:`, (err as Error).message);
  }
}

export const isImageKitConfigured = () =>
  Boolean(
    process.env.IMAGEKIT_PUBLIC_KEY &&
      process.env.IMAGEKIT_PRIVATE_KEY &&
      process.env.IMAGEKIT_URL_ENDPOINT
  );
