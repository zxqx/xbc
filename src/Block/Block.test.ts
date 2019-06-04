import Block from '.';

describe('Block', () => {
  it('generates a genesis block', () => {
    const block = Block.getGenesisBlock();

    expect(block.lastHash).toEqual('none');
    expect(block.hash).toEqual('genesis');
  });

  it('mines a new block with a reference to the previous block', () => {
    const genesisBlock = Block.getGenesisBlock();
    const blockData = [{ transaction: 4.20 }];
    const block = Block.mineBlock(genesisBlock, blockData);

    expect(block.lastHash).toEqual(genesisBlock.hash);
  });
});
