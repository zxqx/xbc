import Transaction from '../Transaction';

export default class TransactionPool {
  transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  getExistingTransaction(transaction: Transaction) {
    return this.transactions.find(t => t.id === transaction.id);
  }

  addOrUpdateTransaction(transaction: Transaction) {
    const existingTransaction = this.getExistingTransaction(transaction);

    if (existingTransaction) {
      const index = this.transactions.indexOf(existingTransaction);
      this.transactions[index] = transaction;

      return;
    }

    this.transactions.push(transaction);
  }
}
