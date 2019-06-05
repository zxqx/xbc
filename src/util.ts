import uuid from 'uuid/v1';
import { SHA256 } from 'crypto-js';
import { ec as EC } from 'elliptic';

const ec = new EC('secp256k1');

export function generateUuid() {
  return uuid();
}

export function hashToString(data: string) {
  return SHA256(data).toString();
}

export function generateKeyPair() {
  return ec.genKeyPair();
}

export function getKeyFromPublic(address: string) {
  return ec.keyFromPublic(address, 'hex');
}
