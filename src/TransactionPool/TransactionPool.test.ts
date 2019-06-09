import TransactionPool from './TransactionPool';
import Transaction from '../Transaction/Transaction';
import Wallet from '../Wallet';

describe('TransactionPool', () => {
  it('adds a new transaction to the pool', () => {
    const pool = new TransactionPool();

    const senderWallet = new Wallet();
    senderWallet.balance = 100;

    const transaction = new Transaction({
      senderWallet,
      recipientAddress: 'sjd29j29rjlsfsf',
      amount: 60,
    });

    pool.addOrUpdateTransaction(transaction);

    expect(pool.transactions).toEqual([transaction]);
  });

  it('updates an existing transaction in the pool if it already exists', () => {
    const pool = new TransactionPool();

    const senderWallet = new Wallet();
    senderWallet.balance = 100;

    const transaction = new Transaction({
      senderWallet,
      recipientAddress: 'sjd29j29rjlsfsf',
      amount: 60,
    });

    transaction.update(senderWallet, 'jgdjf0qrjfkaj2kja', 22);

    pool.addOrUpdateTransaction(transaction);

    expect(pool.transactions).toEqual([transaction]);
  });
});
