import Blockchain from './Blockchain';

const blockchain = new Blockchain();
blockchain.addBlock([{ data: 'more data' }]);
blockchain.addBlock([{ data2: 'even more data' }]);
console.log(blockchain);