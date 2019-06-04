import Block from './Block';

const block = Block.mineBlock(Block.getGenesisBlock(), [{ test: 'test' }]);
console.log(Block.mineBlock(block, [{ more: 'data'}]));