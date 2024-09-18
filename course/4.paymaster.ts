import {
    ZKsyncPlugin,
    types,
    Web3ZKsyncL2,
} from 'web3-plugin-zksync'
import { Web3} from 'web3'

const test = async () => {
    const web3 = new Web3('http://localhost:8545')
    const l2Provider = Web3ZKsyncL2.initWithDefaultProvider(types.Network.Localhost)
    web3.registerPlugin(new ZKsyncPlugin(l2Provider))

    console.log('--------Send ETH using paymaster---------')
    console.log('--------Send TOKEN using paymaster---------')
    console.log('--------Withdraw using paymaster---------')
    console.log('--------Deposit using paymaster---------')
}


test().catch(console.error)
