import { generateKeyPair } from '../util';
import { KeyPair } from '../index.d';

export default class Wallet {
  balance: number;
  keyPair: KeyPair;
  publicKey: string;

  constructor() {
    this.balance = 0;
    this.keyPair = generateKeyPair();
    this.publicKey = this.keyPair.getPublic().encode('hex', false).toString();
  }

  sign(data: string) {
    return this.keyPair.sign(data);
  }
}
