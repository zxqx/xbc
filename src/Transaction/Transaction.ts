import uuid from 'uuid/v1';
import Wallet, { Signature } from '../Wallet';
import { hashToString } from '../util';

interface TransactionProps {
  senderWallet: Wallet;
  recipientAddress: string;
  amount: number;
}

interface TransactionInput {
  timestamp: number;
  amount: number;
  address: string;
  signature: Signature;
}

interface TransactionOutput {
  amount: number;
  address: string;
}

export default class Transaction {
  id: string;
  input: TransactionInput;
  outputs: TransactionOutput[];

  constructor({ senderWallet, recipientAddress, amount }: TransactionProps) {
    const { balance, publicKey } = senderWallet;

    if (amount > balance) {
      throw new Error('Amount exceeds sender balance');
    }

    this.id = uuid();

    this.outputs = [
      {
        amount: balance - amount,
        address: publicKey,
      },
      {
        amount,
        address: recipientAddress,
      },
    ];

    this.input = {
      timestamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(hashToString(JSON.stringify(this.outputs))),
    };
  }
}
