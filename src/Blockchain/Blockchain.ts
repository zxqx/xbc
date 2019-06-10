import { flatten } from 'lodash';
import Block from '../Block';
import Wallet from '../Wallet';
import Transaction from '../Transaction';
import { log } from '../util';

export default class Blockchain {
  chain: Block[];
  wallet: Wallet;

  constructor(chain: Block[] = [Block.getGenesisBlock()]) {
    this.chain = chain;
    this.wallet = Wallet.getBlockchainWallet();
  }

  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(data: Transaction[]) {
    const lastBlock = this.getLastBlock();
    const block = Block.mine(lastBlock, data);

    this.chain.push(block);
  }

  static genesisBlockIsValid(chain: Block[]) {
    return JSON.stringify(chain[0]) === JSON.stringify(Block.getGenesisBlock());
  }

  static blockIsValid(block: Block, lastBlock: Block) {
    if (block.lastHash !== lastBlock.hash) {
      return false;
    }

    if (block.hash !== Block.hash(block)) {
      return false;
    }

    return true;
  }

  incomingChainIsValid(chain: Block[]) {
    if (chain.length <= this.chain.length) {
      return false;
    }

    if (!Blockchain.genesisBlockIsValid(chain)) {
      return false;
    }

    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];
      const lastBlock = chain[i - 1];

      if (!Blockchain.blockIsValid(block, lastBlock)) {
        return false;
      }
    }

    return true;
  }

  sync({ chain }: Blockchain) {
    if (this.incomingChainIsValid(chain)) {
      this.chain = chain;

      log('Updated chain', chain);
    }
  }

  getAllTransactions() {
    return flatten(this.chain.map(block => block.data));
  }

  getAllTransactionsCreatedByWallet(wallet: Wallet) {
    const transactions = this.getAllTransactions();

    return transactions.filter(transaction => transaction.input.address === wallet.publicKey);
  }

  getLastTransactionCreatedByWallet(wallet: Wallet) {
    const transactionsCreated = this.getAllTransactionsCreatedByWallet(wallet);

    if (transactionsCreated.length === 0) {
      return false;
    }

    return transactionsCreated.sort((a, b) => b.input.timestamp - a.input.timestamp)[0];
  }

  getTransactionsAfterTime(timestamp: number) {
    const transactions = this.getAllTransactions();

    return transactions.filter(transaction => transaction.input.timestamp > timestamp);
  }
}
