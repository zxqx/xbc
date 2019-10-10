import Wallet from '.';
import Blockchain from '../Blockchain';
import TransactionPool from '../TransactionPool';

describe('Wallet', () => {
  it('creates a new wallet with an empty balance', () => {
    const wallet = new Wallet();

    expect(wallet.balance).toEqual(0);
  });

  it('creates a transaction and adds it to a transaction pool', () => {
    const pool = new TransactionPool();
    const blockchain = new Blockchain();
    const wallet = new Wallet();
    wallet.balance = 120;

    const recipientAddress = 'fgje9qjwrsfjsaidj92jsk';

    wallet.createTransaction(pool, blockchain, recipientAddress, 40);

    expect(pool.transactions.length).toEqual(1);
    expect(pool.transactions[0].input.address).toEqual(wallet.publicKey);
    expect(pool.transactions[0].outputs[0].address).toEqual(wallet.publicKey);
    expect(pool.transactions[0].outputs[1].address).toEqual(recipientAddress);
  });

  it('calculates its balance', () => {
    const pool = new TransactionPool();
    const blockchain = new Blockchain();

    const wallet1 = new Wallet();
    wallet1.balance = 80;

    const wallet2 = new Wallet();
    wallet2.balance = 120;

    const transaction1 = wallet1.createTransaction(pool, blockchain, '4sjw8j2198jfsaij19', 18);
    const transaction2 = wallet2.createTransaction(pool, blockchain, '1823128rhf8jwf8wfdj', 37);
    const transaction3 = wallet1.createTransaction(pool, blockchain, '821hf89jss8jd18289', 45);
    const transaction4 = wallet2.createTransaction(pool, blockchain, wallet1.publicKey, 12);

    pool.addOrUpdateTransaction(transaction1);
    pool.addOrUpdateTransaction(transaction2);
    pool.addOrUpdateTransaction(transaction3);
    pool.addOrUpdateTransaction(transaction4);

    blockchain.addBlock(pool.transactions);

    expect(wallet1.calculateBalance(blockchain)).toEqual(29);
  });
});
