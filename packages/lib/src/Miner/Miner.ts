import Blockchain from '../Blockchain';
import Wallet from '../Wallet';
import TransactionPool from '../TransactionPool';
import { BLOCK_MINE_REWARD } from '../config';

export default class Miner {
  blockchain: Blockchain;
  wallet: Wallet;
  transactionPool: TransactionPool;

  constructor() {
    this.blockchain = new Blockchain();
    this.wallet = new Wallet();
    this.transactionPool = new TransactionPool();
  }

  createMiningRewardTransaction() {
    return this.blockchain.wallet.createTransaction(
      this.transactionPool,
      this.blockchain,
      this.wallet.publicKey,
      BLOCK_MINE_REWARD,
    );
  }

  mine() {
    const validTransactions = this.transactionPool.getValidTransactions();
    const miningRewardTransaction = this.createMiningRewardTransaction();

    this.blockchain.addBlock([
      ...validTransactions,
      miningRewardTransaction,
    ]);

    this.transactionPool.clear();
  }
}
