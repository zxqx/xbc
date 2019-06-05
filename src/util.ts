import { SHA256 } from 'crypto-js';

export function hashToString(data: string) {
  return SHA256(data).toString();
}
