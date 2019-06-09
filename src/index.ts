import Miner from './Miner';
import Blockchain from './Blockchain';
import Wallet from './Wallet';
import { MINE_RATE } from './config';

const NUMBER_OF_BLOCKS = 50;

const miner = new Miner();
const peerBlockchain = new Blockchain();
const wallet = new Wallet();
wallet.balance = 99999;

const start = Date.now();

for (let i = 0; i < NUMBER_OF_BLOCKS; i++) {
  wallet.createTransaction(miner.transactionPool, `ksjuwn92jfksgkgj-${i}`, 400);
  miner.mine();
}

const end = Date.now();

// eslint-disable-next-line
console.log(
  `Generated blockchain is ${peerBlockchain.incomingChainIsValid(miner.blockchain.chain) ? 'valid' : 'invalid'}`,
);

// eslint-disable-next-line
console.log(`Actual mine rate: ${((end - start) / 1000) / NUMBER_OF_BLOCKS}s`);

// eslint-disable-next-line
console.log(`Ideal mine rate: ${MINE_RATE / 1000}s`);
