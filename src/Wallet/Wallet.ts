import Transaction from '../Transaction';
import TransactionPool from '../TransactionPool';
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

  createTransaction(transactionPool: TransactionPool, recipientAddress: string, amount: number) {
    let transaction = transactionPool.getExistingTransactionByInputAddress(this.publicKey);

    if (transaction) {
      transaction.update(this, recipientAddress, amount);
      return transaction;
    }

    transaction = new Transaction({
      senderWallet: this,
      recipientAddress,
      amount,
    });

    transactionPool.addOrUpdateTransaction(transaction);

    return transaction;
  }
}
