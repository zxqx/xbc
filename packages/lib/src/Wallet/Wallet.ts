import Blockchain from '../Blockchain';
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

  calculateBalance(blockchain: Blockchain) {
    const lastTransactionCreated = blockchain.getLastTransactionCreatedByWallet(this);

    if (!lastTransactionCreated) {
      return this.balance;
    }

    const recentTransactions = blockchain.getTransactionsAfterTime(lastTransactionCreated.input.timestamp);
    const lastOutput = lastTransactionCreated.getOutputByAddress(this.publicKey);
    const amount = lastOutput ? lastOutput.amount : 0;

    return recentTransactions.reduce((totalAmount, transaction) => {
      const recentOutput = transaction.getOutputByAddress(this.publicKey);

      return recentOutput ? totalAmount + recentOutput.amount : totalAmount;
    }, amount);
  }

  sign(data: string) {
    return this.keyPair.sign(data);
  }

  createTransaction(
    transactionPool: TransactionPool,
    blockchain: Blockchain,
    recipientAddress: string,
    amount: number,
  ) {
    this.balance = this.calculateBalance(blockchain);

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
