import Blockchain from '../Blockchain';
import Wallet from '../Wallet';
import TransactionPool from '../TransactionPool';
import Transaction from '../Transaction';
import { BLOCK_MINE_REWARD } from '../config';

export default class Miner {
  blockchain: Blockchain;
  wallet: Wallet;

  constructor() {
    this.blockchain = new Blockchain();
    this.wallet = new Wallet();
  }

  mine(transactionPool: TransactionPool) {
    const validTransactions = transactionPool.getValidTransactions();

    const miningRewardTransaction = new Transaction({
      senderWallet: this.blockchain.wallet,
      recipientAddress: this.wallet.publicKey,
      amount: BLOCK_MINE_REWARD,
    });

    this.blockchain.addBlock([
      ...validTransactions,
      miningRewardTransaction,
    ]);

    transactionPool.clear();
  }
}
