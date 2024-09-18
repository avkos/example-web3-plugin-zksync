import {
    ZKsyncPlugin,
} from 'web3-plugin-zksync'
import {Web3} from 'web3'

const test = async () => {
    const web3 = new Web3('http://localhost:8545')
    web3.registerPlugin(new ZKsyncPlugin(window.ethereum))

}


test().catch(console.error)
