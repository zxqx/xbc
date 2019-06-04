import Block, { BlockData } from '../Block';

export default class Blockchain {
  chain: Block[];

  constructor(chain: Block[] = [Block.getGenesisBlock()]) {
    this.chain = chain;
  }

  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(data: BlockData) {
    const prevBlock = this.getLastBlock();
    const block = Block.mineBlock(prevBlock, data);

    this.chain.push(block);
  }

  static genesisBlockIsValid(chain: Block[]) {
    return JSON.stringify(chain[0]) === JSON.stringify(Block.getGenesisBlock());
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
      const prevBlock = chain[i - 1];

      if (block.prevHash !== prevBlock.hash) {
        return false;
      }

      if (block.hash !== Block.hash(block)) {
        return false;
      }
    }

    return true;
  }

  sync({ chain }: Blockchain) {
    if (this.incomingChainIsValid(chain)) {
      this.chain = chain;
    }
  }
}