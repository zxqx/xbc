import Wallet, { Signature } from '../Wallet';
import { hashToString, generateUuid, getKeyFromPublic } from '../util';

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
    return getKeyFromPublic(this.input.address).verify(
      hashToString(JSON.stringify(this.outputs)),
      this.input.signature,
    );
  }
}
