import { Request } from 'express';

export function cookieExtractor(req: Request): string | null {
  if (req && req.signedCookies) {
    return req.signedCookies['X-REFRESH-TOKEN'];
  }
  return null;
}
