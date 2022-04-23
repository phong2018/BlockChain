
const hash=require('crypto-js/sha256');

class Block{
    constructor(prevHash, data){
        this.prevHash=prevHash;
        this.data=data;
        this.timeStampe=new Date();
        
        this.hash=this.caculateHash();
        this.mineVar=0;
    };
    
    caculateHash(){
        const valHash=hash(this.prevHash+JSON.stringify(this.data)+this.timeStampe+this.mineVar).toString();
        //console.log(valHash);
        return valHash; 
    }

    mine(difficulty){
        while(!this.hash.startsWith('0'.repeat(difficulty))){
            this.mineVar++;
            this.hash=this.caculateHash();
        }
    }
}

class Blockchain{
    constructor(difficulty){
        const genesisBlock=new Block('0000',{genesis:true});
        this.difficulty=difficulty;
        this.chain=[genesisBlock];
    }

    getLastBlock(){
        return this.chain[this.chain.length-1];
    }

    addBlock(data){
        const lastBlock=this.getLastBlock();
        const newBlock=new Block(lastBlock.hash,data);
     
        console.log('start mining');
        console.time('mine');
        newBlock.mine(this.difficulty);
        console.timeEnd('mine');
        console.log('end mining',newBlock);

        this.chain.push(newBlock);
    }

    isValid(){
        for(let i=1;i<this.chain.length;i++){
            const currentBlock=this.chain[i];
            const prevBlock=this.chain[i-1];
            if(currentBlock.hash != currentBlock.caculateHash()){
                return false;
            }
            if(currentBlock.prevHash != prevBlock.hash){
                return false;
            }
        }

        return true;
    }
}

const block =new Block('',{'key':'HEllo'});
console.log(block);

const phongChain=new Blockchain(3);
//console.log(phongChain);
phongChain.addBlock({from:'Phong',to:'phong1',ammount:100});

phongChain.addBlock({from:'Phong1',to:'phong2',ammount:200});

phongChain.addBlock({from:'Phong1',to:'phong3',ammount:300});

phongChain.addBlock({from:'Phong1',to:'phong3',ammount:300});

// test valid true
console.log(phongChain.chain);
console.log('chain valid: ', phongChain.isValid());

// test valid false
phongChain.chain[1].data={from:'Phong1',to:'phong2',ammount:250};
console.log('chain valid: ', phongChain.isValid());

// test valid false
phongChain.chain[1].hash=phongChain.chain[1].caculateHash();
console.log('chain valid: ', phongChain.isValid());