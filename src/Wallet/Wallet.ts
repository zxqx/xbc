import Transaction from '../Transaction';
import TransactionPool from '../TransactionPool';
import { generateKeyPair } from '../util';
import { BLOCKCHAIN_WALLET_ADDRESS, BLOCKCHAIN_WALLET_BALANCE } from '../config';
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

  static getBlockchainWallet() {
    const wallet = new this();
    wallet.publicKey = BLOCKCHAIN_WALLET_ADDRESS;
    wallet.balance = BLOCKCHAIN_WALLET_BALANCE;

    return wallet;
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
