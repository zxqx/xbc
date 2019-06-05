import { ec as EC } from 'elliptic';

const ec = new EC('secp256k1');

export type Signature = EC.Signature;

export default class Wallet {
  balance: number;
  keyPair: EC.KeyPair;
  publicKey: string;

  constructor() {
    this.balance = 0;
    this.keyPair = ec.genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode('hex', false).toString();
  }

  sign(data: string) {
    return this.keyPair.sign(data);
  }
}
