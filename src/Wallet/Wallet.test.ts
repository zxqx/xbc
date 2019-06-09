import Wallet from '.';
import TransactionPool from '../TransactionPool';

describe('Wallet', () => {
  it('creates a new wallet with an empty balance', () => {
    const wallet = new Wallet();

    expect(wallet.balance).toEqual(0);
  });

  it('creates a transaction and adds it to a transaction pool', () => {
    const pool = new TransactionPool();
    const wallet = new Wallet();
    wallet.balance = 120;

    const recipientAddress = 'fgje9qjwrsfjsaidj92jsk';

    wallet.createTransaction(pool, recipientAddress, 40);

    expect(pool.transactions.length).toEqual(1);
    expect(pool.transactions[0].input.address).toEqual(wallet.publicKey);
    expect(pool.transactions[0].outputs[0].address).toEqual(wallet.publicKey);
    expect(pool.transactions[0].outputs[1].address).toEqual(recipientAddress);
  });
});
