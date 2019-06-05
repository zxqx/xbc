import Transaction from '.';
import Wallet from '../Wallet';

describe('Transaction', () => {
  it('should create a new transaction', () => {
    const recipientAddress = 'jg092jwpfsfkjal2';
    const senderWallet = new Wallet();
    senderWallet.balance = 100;

    const transaction = new Transaction({
      senderWallet,
      recipientAddress,
      amount: 74,
    });

    expect(transaction.outputs).toEqual([
      {
        amount: 26,
        address: senderWallet.publicKey,
      },
      {
        amount: 74,
        address: recipientAddress,
      },
    ]);

    expect(transaction.input.amount).toEqual(senderWallet.balance);
  });

  it('fails to create a new transaction if amount exceeds wallet balance', () => {
    const senderWallet = new Wallet();
    senderWallet.balance = 47;

    expect(() => new Transaction({
      senderWallet,
      recipientAddress: 'sjf832j230sjfak2jfj2',
      amount: 50,
    })).toThrow();
  });
});
