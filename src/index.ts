import Blockchain from './Blockchain';
import { MINE_RATE } from './Block';

const NUMBER_OF_BLOCKS = 10;

const bc = new Blockchain();

const start = Date.now();

for (let i = 0; i < NUMBER_OF_BLOCKS; i++) {
  bc.addBlock([{ transaction: i + 1 }]);
}

const end = Date.now();

console.log(`Actual mine rate: ${((end - start) / 1000) / NUMBER_OF_BLOCKS}s`);
console.log(`Ideal mine rate: ${MINE_RATE / 1000}s`);
