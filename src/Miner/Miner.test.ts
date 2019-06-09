import TransactionPool from '../TransactionPool';
import Wallet from '../Wallet';
import Miner from './Miner';
import { BLOCKCHAIN_WALLET_ADDRESS, BLOCK_MINE_REWARD } from '../config';

describe('Miner', () => {
  it('mines a block of transactions from the transaction pool', () => {
    const miner = new Miner();
    const wallet = new Wallet();
    wallet.balance = 1000;

    wallet.createTransaction(miner.transactionPool, miner.blockchain, 'sjw8j2029jfaskdj', 50);
    wallet.createTransaction(miner.transactionPool, miner.blockchain, 'fsfij28hfajk2has', 75);
    wallet.createTransaction(miner.transactionPool, miner.blockchain, 'sjf82hjaosfjw28a', 75);
    wallet.createTransaction(miner.transactionPool, miner.blockchain, 'js82hj2iuhjfsih2', 100);
    wallet.createTransaction(miner.transactionPool, miner.blockchain, 'ksjuwn92jfksgkgj', 400);

    miner.mine();

    const mineRewardTransactionSenderOutput = miner.blockchain.chain[1].data[1].outputs[0];
    const mineRewardTransactionRecipientOutput = miner.blockchain.chain[1].data[1].outputs[1];

    expect(miner.blockchain.chain.length).toEqual(2);
    expect(mineRewardTransactionSenderOutput.address).toEqual(BLOCKCHAIN_WALLET_ADDRESS);
    expect(mineRewardTransactionRecipientOutput.amount).toEqual(BLOCK_MINE_REWARD);
    expect(miner.transactionPool.transactions.length).toEqual(0);
  });
});
