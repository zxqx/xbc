import Block, { MINE_RATE } from '.';

describe('Block', () => {
  it('generates a genesis block', () => {
    const block = Block.getGenesisBlock();

    expect(block.lastHash).toEqual('none');
    expect(block.hash).toEqual('genesis');
  });

  it('sets the block data', () => {
    const blockData = [{ transaction: 4.20 }];
    const lastBlock = Block.getGenesisBlock();
    const block = Block.mineBlock(lastBlock, blockData);

    expect(block.data).toEqual(blockData);
  });

  it('mines a new block with a reference to the previous block', () => {
    const genesisBlock = Block.getGenesisBlock();
    const blockData = [{ transaction: 4.20 }];
    const block = Block.mineBlock(genesisBlock, blockData);

    expect(block.lastHash).toEqual(genesisBlock.hash);
  });

  it('generates a block hash that correlates with difficulty', () => {
    const lastBlock = Block.getGenesisBlock();
    const blockData = [{ transaction: 4.20 }];
    const block = Block.mineBlock(lastBlock, blockData);

    expect(block.hash.substring(0, 1)).toEqual('0'.repeat(lastBlock.difficulty));
  });

  it('adjusts difficulty up when actual mine rate is too high', () => {
    const lastBlock = new Block({
      lastHash: 'gji8j20rjwifjsgasj',
      hash: 'sjf8wj20ejqwiorjsaglkjsa',
      data: [{ transaction: 7.20 }],
      timestamp: 7000,
      nonce: 32742,
      difficulty: 6,
    });

    const timestamp = lastBlock.timestamp + MINE_RATE - 1000;

    expect(Block.getAdjustedDifficulty(lastBlock, timestamp)).toEqual(7);
  });

  it('adjusts difficulty down when actual mine rate is too low', () => {
    const lastBlock = new Block({
      lastHash: 'gji8j20rjwifjsgasj',
      hash: 'sjf8wj20ejqwiorjsaglkjsa',
      data: [{ transaction: 7.20 }],
      timestamp: 7000,
      nonce: 32742,
      difficulty: 6,
    });

    const timestamp = lastBlock.timestamp + MINE_RATE + 1000;

    expect(Block.getAdjustedDifficulty(lastBlock, timestamp)).toEqual(5);
  });
});
