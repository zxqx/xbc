import Blockchain from './';
import Block from '../Block';

describe('Blockchain', () => {
  it('creates a new blockchain with genesis block by default', () => {
    const blockchain = new Blockchain();

    expect(blockchain.chain).toEqual([Block.getGenesisBlock()]);
  });

  it('creates a new blockchain with a provided chain', () => {
    const chain = [
      {
        lastHash: 'lastHash',
        hash: 'hash',
        data: [{ test: 'test' }],
        timestamp: 1,
      }
    ];

    const blockchain = new Blockchain(chain);

    expect(blockchain.chain).toEqual(chain);
  });

  it('gets last block in the blockchain', () => {
    const chain = [
      {
        lastHash: 'none',
        hash: 'firstHash',
        data: [{ test: 'test' }],
        timestamp: 1,
      },
      {
        lastHash: 'firstHash',
        hash: 'secondHash',
        data: [{ test: 'test' }],
        timestamp: 2,
      }
    ];

    const blockchain = new Blockchain(chain);

    expect(blockchain.getLastBlock()).toEqual(chain[1]);
  });

  it('adds a block to the blockchain', () => {
    const blockchain = new Blockchain();
    const blockData = [{ test: 'test' }];

    blockchain.addBlock(blockData);

    expect(blockchain.chain.length).toBe(2);
    expect(blockchain.getLastBlock().data).toEqual(blockData);
  });

  it('checks if genesis block is valid', () => {
    const blockchain = new Blockchain();

    expect(Blockchain.genesisBlockIsValid(blockchain.chain)).toBe(true);
  });

  it('validates valid incoming chain', () => {
    const blockchain1 = new Blockchain();
    blockchain1.addBlock([{ transaction: 7.44 }]);
    blockchain1.addBlock([{ transaction: 2.50 }]);

    const blockchain2 = new Blockchain();
    blockchain2.addBlock([{ transaction: 7.44 }]);
    blockchain2.addBlock([{ transaction: 2.12 }]);
    blockchain2.addBlock([{ transaction: 12.75 }]);

    expect(blockchain1.incomingChainIsValid(blockchain2.chain)).toBe(true);
  });

  it('invalidates shorter incoming chain', () => {
    const blockchain1 = new Blockchain();
    blockchain1.addBlock([{ transaction: 7.44 }]);
    blockchain1.addBlock([{ transaction: 2.50 }]);

    const blockchain2 = new Blockchain();
    blockchain2.addBlock([{ transaction: 2.12 }]);

    expect(blockchain1.incomingChainIsValid(blockchain2.chain)).toBe(false);
  });

  it('invalidates incoming chain with invalid genesis block', () => {
    const blockchain1 = new Blockchain();

    const chain = [
      {
        lastHash: 'lastHash',
        hash: 'hash',
        data: [{ test: 'test' }],
        timestamp: 1,
      }
    ];

    const blockchain2 = new Blockchain(chain);

    expect(blockchain1.incomingChainIsValid(blockchain2.chain)).toBe(false);
  });

  it('invalidates incoming chain containing block with invalid previous hash', () => {
    const blockchain1 = new Blockchain();
    blockchain1.addBlock([{ transaction: 7.44 }]);

    const blockchain2 = new Blockchain();
    blockchain2.addBlock([{ transaction: 7.44 }]);
    blockchain2.addBlock([{ transaction: 2.50 }]);

    blockchain2.chain[2].lastHash = 'hacked';

    expect(blockchain1.incomingChainIsValid(blockchain2.chain)).toBe(false);
  });

  it('invalidates incoming chain containing block with invalid hash', () => {
    const blockchain1 = new Blockchain();
    blockchain1.addBlock([{ transaction: 7.44 }]);

    const blockchain2 = new Blockchain();
    blockchain2.addBlock([{ transaction: 7.44 }]);
    blockchain2.addBlock([{ transaction: 2.50 }]);

    blockchain2.chain[2].hash = 'hacked';

    expect(blockchain1.incomingChainIsValid(blockchain2.chain)).toBe(false);
  });

  it('syncs blockchain with valid incoming blockchain', () => {
    const blockchain1 = new Blockchain();
    blockchain1.addBlock([{ transaction: 7.44 }]);

    const blockchain2 = new Blockchain();
    blockchain2.addBlock([{ transaction: 7.44 }]);
    blockchain2.addBlock([{ transaction: 2.50 }]);
    
    blockchain1.sync(blockchain2);

    expect(blockchain1.chain).toEqual(blockchain2.chain);
  });

  it('does not syncs blockchain with invalid incoming blockchain', () => {
    const blockchain1 = new Blockchain();
    blockchain1.addBlock([{ transaction: 7.44 }]);
    blockchain1.addBlock([{ transaction: 2.50 }]);

    const blockchain2 = new Blockchain();
    blockchain2.addBlock([{ transaction: 7.44 }]);
    
    blockchain1.sync(blockchain2);

    expect(blockchain1.chain).not.toEqual(blockchain2.chain);
  });
});