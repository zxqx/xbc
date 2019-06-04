import Block, { BlockData } from './Block';

export default class Blockchain {
  chain: Block[];

  constructor(chain: Block[] = [Block.getGenesisBlock()]) {
    this.chain = chain;
  }

  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(data: BlockData) {
    const lastBlock = this.getLastBlock();
    const block = Block.mineBlock(lastBlock, data);
    this.chain.push(block);
  }
}