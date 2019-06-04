import Blockchain from './Blockchain';

const blockchain1 = new Blockchain();
blockchain1.addBlock([{ data: 'more data' }]);
blockchain1.addBlock([{ data2: 'even more data' }]);

const blockchain2 = new Blockchain();
blockchain2.addBlock([{ data: 'more data' }]);
blockchain2.addBlock([{ data2: 'even more data' }]);
blockchain2.addBlock([{ data3: 'even more data' }]);

console.log(blockchain1.incomingChainIsValid(blockchain2.chain));