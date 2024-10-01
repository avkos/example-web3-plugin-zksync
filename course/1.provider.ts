import {types, Web3ZKsyncL2, utils} from 'web3-plugin-zksync'
import {DAI_L1, richAccount} from './helpers/constants'

const test = async () => {
    const l2Provider = Web3ZKsyncL2.initWithDefaultProvider(types.Network.Localhost)
    const web3Account = l2Provider.eth.accounts.privateKeyToAccount(richAccount.privateKey)
    l2Provider.eth.accounts.wallet.add(web3Account)

    const l2TokenAddress = await l2Provider.l2TokenAddress(DAI_L1)
    console.log('l2TokenAddress:', l2TokenAddress)

    console.log('getBalance:', await l2Provider.getBalance(web3Account.address))
    console.log('getBalance of the DAI token:', await l2Provider.getBalance(web3Account.address, 'latest', l2TokenAddress))
    console.log('getBalance of the DAI token (2):', await l2Provider.getTokenBalance(l2TokenAddress, web3Account.address ))


    const populated = await l2Provider.populateTransaction({
        from: web3Account.address,
        to: l2Provider.eth.accounts.create().address,
        value: 1,
    })

    console.log('populated:', populated)
    const signed = await l2Provider.signTransaction(populated)
    console.log('signed:', signed)
    const transactionHash = await l2Provider.sendRawTransaction(signed)

    console.log('transactionHash:', transactionHash)
    const receipt = await utils.waitTxReceipt(l2Provider.eth, transactionHash)
    console.log('receipt:', receipt)
}


test().catch(console.error)
