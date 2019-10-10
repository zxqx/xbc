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

  it('verifies a valid transaction', () => {
    const senderWallet = new Wallet();
    senderWallet.balance = 420;

    const transaction = new Transaction({
      senderWallet,
      recipientAddress: 's82jr0rjwkqwpor',
      amount: 170,
    });

    expect(transaction.verify()).toBe(true);
  });

  it('fails to verify a transaction containing altered data', () => {
    const senderWallet = new Wallet();
    senderWallet.balance = 420;

    const transaction = new Transaction({
      senderWallet,
      recipientAddress: 's82jr0rjwkqwpor',
      amount: 170,
    });

    transaction.outputs[0].amount = 300;

    expect(transaction.verify()).toBe(false);
  });

  it('updates a transaction and generates a new signature', () => {
    const senderWallet = new Wallet();
    senderWallet.balance = 420;

    const transaction = new Transaction({
      senderWallet,
      recipientAddress: 's82jr0rjwkqwpor',
      amount: 170,
    });

    transaction.update(senderWallet, 'dje923j0asjisjd20', 150);

    expect(transaction.outputs.map(output => output.amount)).toEqual([100, 170, 150]);
    expect(transaction.verify()).toBe(true);
  });

  it('fails to update a transaction if sender output does not exist', () => {
    const senderWallet = new Wallet();
    senderWallet.balance = 420;

    const unknownWallet = new Wallet();

    const transaction = new Transaction({
      senderWallet,
      recipientAddress: 's82jr0rjwkqwpor',
      amount: 170,
    });

    expect(() => transaction.update(unknownWallet, 'dje923j0asjisjd20', 150)).toThrow();
  });

  it('fails to update a transaction if amount exceeds wallet balance', () => {
    const senderWallet = new Wallet();
    senderWallet.balance = 420;

    const transaction = new Transaction({
      senderWallet,
      recipientAddress: 's82jr0rjwkqwpor',
      amount: 170,
    });

    expect(() => transaction.update(senderWallet, 'dje923j0asjisjd20', 800)).toThrow();
  });
});
