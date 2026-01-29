import * as crypto from 'crypto';
import { COOKIE_SECRET } from 'src/env';

export function verifySignedUserId(signedCookie: string): number | null {
  if (!signedCookie) {
    return null
  }

  const [idPart, signature] = signedCookie.split('.');
  if (!idPart || !signature || signature.length !== 64) {
    return null;
  }

  // Проверяем, что idPart — это число (защита от инъекций)
  if (!/^\d+$/.test(idPart)) {
    return null;
  }

  const expectedSignature = crypto
    .createHmac('sha256', COOKIE_SECRET)
    .update(idPart)
    .digest('hex');

  // Защита от timing-атак
  const safeEqual = crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );

  return safeEqual ? parseInt(idPart, 10) : null;
}