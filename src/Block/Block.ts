import { hashToString } from '../util';

export type BlockData = object[];

export const MINE_RATE = 5000;

export default class Block {
  lastHash: string;
  hash: string;
  data: BlockData;
  timestamp: number;
  nonce: number;
  difficulty: number;

  constructor({ lastHash, hash, data, timestamp, nonce, difficulty }: Block) {
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.timestamp = timestamp;
    this.nonce = nonce;
    this.difficulty = difficulty;
  }

  static getGenesisBlock() {
    return new this({
      lastHash: 'none',
      hash: 'genesis',
      data: [],
      timestamp: 1559618129346,
      nonce: 0,
      difficulty: 1,
    });
  }

  static hash({ lastHash, data, timestamp, nonce }: Omit<Block, 'hash'>) {
    return hashToString(`${lastHash}${JSON.stringify(data)}${timestamp}`);
  }

  static getAdjustedDifficulty(lastBlock: Block, timestamp: number) {
    const { timestamp: lastTimestamp, difficulty } = lastBlock;

    if (lastTimestamp + MINE_RATE > timestamp) {
      return difficulty + 1;
    }

    return difficulty - 1;
  }

  static mineBlock(lastBlock: Block, data: BlockData) {
    const { hash: lastHash, difficulty } = lastBlock;

    let timestamp = null;
    let hash = null;
    let nonce = 0;

    do {
      timestamp = Date.now();
      hash = Block.hash({ lastHash, data, timestamp, nonce, difficulty });
      nonce++;
    }
    while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));

    return new this({
      lastHash,
      hash,
      data,
      timestamp,
      nonce,
      difficulty: Block.getAdjustedDifficulty(lastBlock, timestamp),
    });
  }
}
