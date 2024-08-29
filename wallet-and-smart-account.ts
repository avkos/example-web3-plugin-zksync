import {types, Web3ZKsyncL2, ZKsyncPlugin} from 'web3-plugin-zksync'
import {Web3} from 'web3'

const privateKey = process.env.PK as string

const test = async () => {
    const l1 = 'https://eth-sepolia.g.alchemy.com/v2/VCOFgnRGJF_vdAY2ZjgSksL6-6pYvRkz'
    const l2 = Web3ZKsyncL2.initWithDefaultProvider(types.Network.Sepolia)

    const web3 = new Web3(l1)
    web3.registerPlugin(new ZKsyncPlugin(l2))
    const wallet = new web3.ZKsync.Wallet(privateKey)
    const smartAccount = new web3.ZKsync.SmartAccount({
        address: wallet.getAddress(),
        secret: privateKey
    })
    const ecdsaAccount = web3.ZKsync.ECDSASmartAccount.create(wallet.getAddress(),
        privateKey)
    const balance = await wallet.getBalance()
    console.log('Get balance using wallet', balance)

    const saBalance = await smartAccount.getBalance()
    console.log('Get balance using Smart account', saBalance)

    const ecdsaAccountBalance = await ecdsaAccount.getBalance()
    console.log('Get balance using ECDSA', ecdsaAccountBalance)
}

test().catch(console.error)
