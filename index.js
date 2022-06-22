const SHA256 = require('crypto-js/sha256');

class Block {
  constructor(timestamp, transactions, previousHash = '') {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
  }

  mineBlock(difficulty) {
    while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      this.nonce++;
      this.hash = this.calculateHash();
    }

    console.log('Block mined', this.hash);
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 5;
  }

  createGenesisBlock() {
    return new Block('01/01/2018', 'Genesis Block', '0');
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    //newBlock.hash = newBlock.calculateHash();
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }

  isChainValid() {
    console.log(this.chain);
    console.log('Chain length', this.chain.length);

    for(let i = 1; i < this.chain.length; i++) {

      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];
      
      if(currentBlock.hash !== currentBlock.calculateHash()) {
        console.log('data has been changed');
        return false;
      }

      if(currentBlock.previousHash !== previousBlock.hash) {
        console.log('hash been regenerated, previous hash will not match on next block');
        return false;
      }

    }

    return true;
  }
}

let jCoin = new Blockchain();
jCoin.addBlock(new Block('10/11/2018', { amount: 4 }));
jCoin.addBlock(new Block('17/11/2018', { amount: 8 }));
console.log(JSON.stringify(jCoin, null, 4));