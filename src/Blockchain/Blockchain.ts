import Block from '../Block';
import { log } from '../util';

export default class Blockchain {
  chain: Block[];

  constructor(chain: Block[] = [Block.getGenesisBlock()]) {
    this.chain = chain;
  }

  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(data: object[]) {
    const lastBlock = this.getLastBlock();
    const block = Block.mine(lastBlock, data);

    this.chain.push(block);

    log('Added block to chain', block);
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
}
