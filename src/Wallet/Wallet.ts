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
    const { balance } = this;

    const transactions = blockchain.chain.map(block => block.data).flat();

    const inputTransactions = transactions
      .filter(transaction => transaction.input.address === this.publicKey);

    if (inputTransactions.length > 0) {
      const [lastTransactionCreated] = inputTransactions
        .sort((a, b) => b.input.timestamp - a.input.timestamp);

      const { timestamp } = lastTransactionCreated.input;

      const walletOutput = lastTransactionCreated.outputs
        .find(output => output.address === this.publicKey);

      const amount = walletOutput ? walletOutput.amount : 0;

      const transactionsAfterLastCreated = transactions
        .filter(transaction => transaction.input.timestamp > timestamp);

      return transactionsAfterLastCreated.reduce((totalAmount, transaction) => {
        const output = transaction.outputs.find(o => o.address === this.publicKey);

        if (output) {
          return totalAmount + output.amount;
        }

        return totalAmount;
      }, amount);
    }

    return balance;
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
