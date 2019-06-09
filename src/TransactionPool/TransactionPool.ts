import Transaction from '../Transaction';

export default class TransactionPool {
  transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  getExistingTransactionById(id: string) {
    return this.transactions.find(transaction => transaction.id === id);
  }

  getExistingTransactionByInputAddress(address: string) {
    return this.transactions.find(t => t.input.address === address);
  }

  addOrUpdateTransaction(transaction: Transaction) {
    const existingTransaction = this.getExistingTransactionById(transaction.id);

    if (existingTransaction) {
      const index = this.transactions.indexOf(existingTransaction);
      this.transactions[index] = transaction;

      return;
    }

    this.transactions.push(transaction);
  }
}
