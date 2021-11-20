const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

const provider = new HDWalletProvider(
    'battle route nice ripple yard general brass such carbon pulse abandon behave', //pneumonic from meta mask
    'https://rinkeby.infura.io/v3/81128292973a46fdb1fc79f94f717a72' // rinkeby network API from infura
)

const web3 = new Web3(provider);

const deploy =  async() => {
    // Get list of all the accounts
    const accounts = await web3.eth.getAccounts();
    console.log("from deployment account", accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data: bytecode})
    .send({ gas: '400000', from: accounts[0] });

    console.log('Deploy contract to', result.options.address);
}
deploy();
