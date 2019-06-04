import { SHA256 } from 'crypto-js';

export type BlockData = object[];

export default class Block {
  prevHash: string;
  hash: string;
  data: BlockData;
  timestamp: number;

  constructor({ prevHash, hash, data, timestamp }: Block) {
    this.prevHash = prevHash;
    this.hash = hash;
    this.data = data;
    this.timestamp = timestamp;
  }

  static getGenesisBlock() {
    return new this({
      prevHash: 'none',
      hash: 'genesis',
      data: [],
      timestamp: 1559618129346,
    });
  }

  static mineBlock(prevBlock: Block, data: BlockData) {
    const prevHash = prevBlock.hash;
    const timestamp = Date.now();
    const hash = Block.hash({ prevHash, data, timestamp });

    return new this({
      prevHash,
      hash,
      data,
      timestamp,
    });
  }

  static hash({ prevHash, data, timestamp }: Omit<Block, 'hash'>) {
    return SHA256(`${prevHash}${JSON.stringify(data)}${timestamp}`).toString();
  }
}