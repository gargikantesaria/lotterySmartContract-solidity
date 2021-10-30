const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require('../compile');

let accounts, helloWorld;
beforeEach(async () => {
    // Get all the test accounts from ganache
    accounts = await web3.eth.getAccounts();

    // Use one of the account to deploy our contract
    helloWorld = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data: bytecode , arguments: ['Gargi here']})
    .send({from: accounts[0], gas: '1000000'})
})

describe('helloWorldContract', () => {
    it('deploys a contract', () => {
        // console.log('It deploys a contract acocunts',accounts); 
        console.log('Deploy contract log', helloWorld.options.address);
        assert.ok(helloWorld.options.address);
    });

    it('compare default word of the contract', async () => {
        const getDefaultWord = await helloWorld.methods.word().call();
        assert.equal(getDefaultWord, 'Gargi here');
    })

    it('get function of the contract execution', async () => {
        const getDefaultWordFunction = await helloWorld.methods.getWord().call();
        console.log(getDefaultWordFunction);
    })

    it('set the word and retrieve it from contract', async () => {
        const changeMessage = await helloWorld.methods.setWord('Change Word').send({from: accounts[0]});
        if(changeMessage){
            const getDefaultWordFunction = await helloWorld.methods.getWord().call();
            console.log(getDefaultWordFunction);
        }
    })
})