import Blockchain from './Blockchain';

const blockchain1 = new Blockchain();
blockchain1.addBlock([{ transaction: 7.44 }]);
blockchain1.addBlock([{ transaction: 2.50 }]);

const blockchain2 = new Blockchain();
blockchain2.addBlock([{ transaction: 7.44 }]);
blockchain2.addBlock([{ transaction: 2.12 }]);
blockchain2.addBlock([{ transaction: 12.75 }]);

console.log(blockchain1.incomingChainIsValid(blockchain2.chain));