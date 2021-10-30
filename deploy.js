const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

const provider = new HDWalletProvider(
    'replace_your_pneumonic_code', //pneumonic from meta mask
    'replace_your_rinkeBy_network_API_from_Infura' // rinkeby network API from infura
)

const web3 = new Web3(provider);

const deploy =  async() => {
    // Get list of all the accounts
    const accounts = await web3.eth.getAccounts();
    console.log("from deployment account", accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data: bytecode, arguments: ['Hi there! This is my first contract']})
    .send({ gas: '400000', from: accounts[0] });

    console.log('Deploy contract to', result.options.address);
}
deploy();
