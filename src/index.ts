import Blockchain from './Blockchain';
import TransactionPool from './TransactionPool';
import Wallet from './Wallet';
import { MINE_RATE } from './config';

const NUMBER_OF_BLOCKS = 50;

const bc1 = new Blockchain();
const bc2 = new Blockchain();

const pool = new TransactionPool();
const wallet = new Wallet();
wallet.balance = 999999;

const start = Date.now();

for (let i = 0; i < NUMBER_OF_BLOCKS; i++) {
  const blockData = [wallet.createTransaction(pool, `sjd29ejf9jf92-${i}`, 50)];

  bc1.addBlock(blockData);
}

const end = Date.now();

console.log(`Generated blockchain is ${bc2.incomingChainIsValid(bc1.chain) ? 'valid' : 'invalid'}`);
console.log(`Actual mine rate: ${((end - start) / 1000) / NUMBER_OF_BLOCKS}s`);
console.log(`Ideal mine rate: ${MINE_RATE / 1000}s`);
