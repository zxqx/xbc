import { hashToString, log } from '../util';
import { MINE_RATE } from '../config';

export default class Block {
  lastHash: string;
  hash: string;
  data: object[];
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

  static hash({ lastHash, data, timestamp, nonce, difficulty }: Omit<Block, 'hash'>) {
    return hashToString(`${lastHash}${JSON.stringify(data)}${timestamp}${nonce}${difficulty}`);
  }

  static getAdjustedDifficulty(lastBlock: Block, currentTime: number) {
    const { timestamp, difficulty } = lastBlock;

    if (timestamp + MINE_RATE > currentTime) {
      return difficulty + 1;
    }

    return difficulty - 1 || 1;
  }

  static mine(lastBlock: Block, data: object[]) {
    const { hash: lastHash } = lastBlock;

    let hash = null;
    let timestamp = null;
    let nonce = 0;
    let { difficulty } = lastBlock;

    do {
      nonce++;
      timestamp = Date.now();
      difficulty = Block.getAdjustedDifficulty(lastBlock, timestamp);
      hash = Block.hash({ lastHash, data, timestamp, nonce, difficulty });
    }
    while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));

    const block = new this({
      lastHash,
      hash,
      data,
      timestamp,
      nonce,
      difficulty,
    });

    log(`Block mined in ${(timestamp - lastBlock.timestamp) / 1000}s`, block);

    return block;
  }
}
