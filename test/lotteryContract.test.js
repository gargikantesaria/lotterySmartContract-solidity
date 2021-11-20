const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require('../compile');

let accounts, lotteryContract;

beforeEach(async () => {
    // Get all the test accounts from ganache
    accounts = await web3.eth.getAccounts();

    // Use one of the account to deploy our contract
    console.log(interface, bytecode);
    lotteryContract = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data: bytecode})
    .send({from: accounts[0], gas: '1000000'})
})

describe('lotteryContract', () => {
    it('deploys a contract', () => {
        // console.log('It deploys a contract acocunts',accounts); 
        console.log('Deploy contract log', lotteryContract.options.address);
        assert.ok(lotteryContract.options.address);
    });

    it('allows one player to enter', async () => {
        await lotteryContract.methods.getPlayersAddress().send({
            from: accounts[0],
            value: web3.utils.toWei('0.01', 'ether')
        })
        const players =  await lotteryContract.methods.getAllPlayers().call({
            from: accounts[0]
        })

        assert.equal(accounts[0], players[0]);
        assert.equal(1, players.length);
    })

    it('allows multiple player to enter', async () => {
        await lotteryContract.methods.getPlayersAddress().send({
            from: accounts[0],
            value: web3.utils.toWei('0.01', 'ether')
        })
        await lotteryContract.methods.getPlayersAddress().send({
            from: accounts[1],
            value: web3.utils.toWei('0.01', 'ether')
        })

        const players = await lotteryContract.methods.getAllPlayers().call({
            from: accounts[0]
        })

        assert.equal(accounts[0], players[0]);
        assert.equal(accounts[1], players[1]);
        assert.equal(2, players.length);
    })

    it('requires minimum ether to enter by players', async () => {
        try {
            await lotteryContract.methods.getPlayersAddress().send({
                from: accounts[0],
                value: 0
            })
            assert(false);
        } catch (err){
            assert(err);
        }
    })

    it('only manager can pick winner', async () => {
        try{
            await lotteryContract.methods.getWinner().send({
                from: accounts[0]
            })
        } catch (err){
            assert(err);
        }
    })

    it('send money to winner and reset the players array', async () => {
        await lotteryContract.methods.getPlayersAddress().send({
            from: accounts[0],
            value: web3.utils.toWei('1', 'ether')
        })
        const initialBalance = await web3.eth.getBalance(accounts[0]);

        await lotteryContract.methods.getWinner().send({ from: accounts[0] });

        const finalBalance = await web3.eth.getBalance(accounts[0]);

        const difference = finalBalance - initialBalance;
        console.log(difference);
        assert(difference > web3.utils.toWei('0.1', 'ether'));
    })
})

