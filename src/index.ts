import Blockchain from './Blockchain';

const bc = new Blockchain();

for (let i = 0; i < 10; i++) {
  bc.addBlock([{ test: 'some-data' }]);
}
