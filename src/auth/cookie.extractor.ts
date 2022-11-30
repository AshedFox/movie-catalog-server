import { Request } from 'express';

export function refreshTokenExtractor(req: Request): string | null {
  if (req && req.signedCookies) {
    return req.signedCookies['X-REFRESH-TOKEN'];
  }
  return null;
}

export function accessTokenExtractor(req: Request): string | null {
  if (req && req.signedCookies) {
    return req.signedCookies['X-ACCESS-TOKEN'];
  }
  return null;
}
