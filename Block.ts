import { SHA256 } from 'crypto-js';

type BlockData = object[];

export default class Block {
  lastHash: string;
  hash: string;
  data: BlockData;
  timestamp: number;

  constructor({ lastHash, hash, data, timestamp }: Block) {
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.timestamp = timestamp;
  }

  static getGenesisBlock() {
    return new this({
      lastHash: 'none',
      hash: 'genesis',
      data: [],
      timestamp: 1559618129346,
    });
  }

  static mineBlock(lastBlock: Block, data: BlockData) {
    const lastHash = lastBlock.hash;
    const timestamp = Date.now();
    const hash = Block.hashBlock({ lastHash, data, timestamp });

    return new this({
      lastHash,
      hash,
      data,
      timestamp,
    });
  }

  static hashBlock({ lastHash, data, timestamp }: Omit<Block, 'hash'>) {
    return SHA256(`${lastHash}${JSON.stringify(data)}${timestamp}`).toString();
  }
}