import Wallet from '../Wallet';
import { generateUuid, hashToString, getKeyFromPublicAddress, log } from '../util';
import { Signature } from '../index.d';

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
    if (amount > senderWallet.balance) {
      throw new Error('Amount exceeds sender balance');
    }

    this.id = generateUuid();

    this.outputs = [
      Transaction.createSenderOutput(senderWallet, amount),
      Transaction.createRecipientOutput(recipientAddress, amount),
    ];

    this.input = this.createInput(senderWallet);

    log('Created transaction', this);
  }

  private static createSenderOutput({ balance, publicKey }: Wallet, amount: number) {
    return {
      amount: balance - amount,
      address: publicKey,
    };
  }

  private static createRecipientOutput(address: string, amount: number) {
    return {
      amount,
      address,
    };
  }

  private createInput(senderWallet: Wallet) {
    return {
      timestamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(hashToString(JSON.stringify(this.outputs))),
    };
  }

  verify() {
    return getKeyFromPublicAddress(this.input.address).verify(
      hashToString(JSON.stringify(this.outputs)),
      this.input.signature,
    );
  }
}
