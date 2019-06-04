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
    const lastBlock = this.getLastBlock();
    const block = Block.mineBlock(lastBlock, data);

    this.chain.push(block);
  }

  static genesisBlockIsValid(chain: Block[]) {
    return JSON.stringify(chain[0]) === JSON.stringify(Block.getGenesisBlock());
  }

  static blockIsValid(block: Block, lastBlock: Block) {
    if (block.lastHash === lastBlock.hash && block.hash === Block.hash(block)) {
      return true;
    }

    return false;
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
    }
  }
}