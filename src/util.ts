import uuid from 'uuid/v1';
import { SHA256 } from 'crypto-js';

export function generateUuid() {
  return uuid();
}

export function hashToString(data: string) {
  return SHA256(data).toString();
}
