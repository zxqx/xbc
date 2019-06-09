import Blockchain from '../Blockchain';
import Wallet from '../Wallet';
import TransactionPool from '../TransactionPool';
import Transaction from '../Transaction';
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
    return new Transaction({
      senderWallet: this.blockchain.wallet,
      recipientAddress: this.wallet.publicKey,
      amount: BLOCK_MINE_REWARD,
    });
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
