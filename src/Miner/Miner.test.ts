import TransactionPool from '../TransactionPool';
import Wallet from '../Wallet';
import Miner from './Miner';
import { BLOCKCHAIN_WALLET_ADDRESS, BLOCK_MINE_REWARD } from '../config';

describe('Miner', () => {
  it('mines a block of transactions from the transaction pool', () => {
    const pool = new TransactionPool();
    const miner = new Miner();
    const wallet = new Wallet();
    wallet.balance = 1000;

    wallet.createTransaction(pool, 'sjw8j2029jfaskdj', 50);
    wallet.createTransaction(pool, 'fsfij28hfajk2has', 75);
    wallet.createTransaction(pool, 'sjf82hjaosfjw28a', 75);
    wallet.createTransaction(pool, 'js82hj2iuhjfsih2', 100);
    wallet.createTransaction(pool, 'ksjuwn92jfksgkgj', 400);

    miner.mine(pool);

    const mineRewardTransactionSenderOutput = miner.blockchain.chain[1].data[1].outputs[0];
    const mineRewardTransactionRecipientOutput = miner.blockchain.chain[1].data[1].outputs[1];

    expect(miner.blockchain.chain.length).toEqual(2);
    expect(mineRewardTransactionSenderOutput.address).toEqual(BLOCKCHAIN_WALLET_ADDRESS);
    expect(mineRewardTransactionRecipientOutput.amount).toEqual(BLOCK_MINE_REWARD);
    expect(pool.transactions.length).toEqual(0);
  });
});
