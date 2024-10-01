import {ZKsyncPlugin, types, constants, Web3ZKsyncL2, utils} from 'web3-plugin-zksync'
import {Web3} from 'web3'
import {DAI_L2, richAccount} from './helpers/constants'

const test = async () => {
    const web3 = new Web3('http://localhost:8545')
    const l2Provider = Web3ZKsyncL2.initWithDefaultProvider(types.Network.Localhost)
    web3.registerPlugin(new ZKsyncPlugin(l2Provider))

    const smartAccount = new web3.ZKsync.SmartAccount({ address: richAccount.address, secret: richAccount.privateKey })


    console.log('getAddress:', smartAccount.getAddress())
    console.log('getBalance:', await smartAccount.getBalance())
    console.log('getBalance of the token:', await smartAccount.getBalance(DAI_L2))

    console.log('---------Withdraw example---------')
    console.log('Balance before:', await smartAccount.getBalance())
    const withdrawTx = await smartAccount.withdraw({
        token: constants.ETH_ADDRESS,
        to: smartAccount.getAddress(),
        amount: web3.utils.toWei(2,'ether'),
    })
    console.log('transaction hash: ',withdrawTx.hash)
    await withdrawTx.wait() // <== can be long in real networks.
    console.log('Balance after:', await smartAccount.getBalance())

    console.log('---------Withdraw token example---------')
    console.log('Balance before:', await smartAccount.getBalance(DAI_L2))
    const withdrawTokenTx = await smartAccount.withdraw({
        token: DAI_L2,
        to: smartAccount.getAddress(),
        amount: 500,
    })
    console.log('transaction hash: ',withdrawTokenTx.hash)
    await withdrawTokenTx.wait() // <== can be long in real networks.
    console.log('Balance after:', await smartAccount.getBalance(DAI_L2))


    console.log('---------Transfer example---------')
    const recipient = web3.ZKsync.Wallet.createRandom()

    console.log('Balance before:', await smartAccount.getBalance())
    console.log('Recipient balance before:', await recipient.getBalance())
    const transferTx = await smartAccount.transfer({
        token: constants.ETH_ADDRESS,
        to: recipient.getAddress(),
        amount: web3.utils.toWei(1,'ether'),
    });
    await transferTx.wait();
    console.log('Balance after:', await smartAccount.getBalance())
    console.log('Recipient balance after:', await recipient.getBalance())

    console.log('---------Transfer token example---------')
    console.log('Balance before:', await smartAccount.getBalance(DAI_L2))
    console.log('Recipient balance before:', await recipient.getBalance(DAI_L2))
    const transferTokenTx = await smartAccount.transfer({
        token: DAI_L2,
        to: recipient.getAddress(),
        amount: web3.utils.toWei(1,'ether'),
    });
    await transferTokenTx.wait();
    console.log('Balance after:', await smartAccount.getBalance(DAI_L2))
    console.log('Recipient balance after:', await recipient.getBalance(DAI_L2))

    console.log('All balances',await smartAccount.getAllBalances())



    console.log('---------Send transaction example---------')
    const populated = await smartAccount.populateTransaction({
        from: smartAccount.getAddress(),
        to: recipient.getAddress(),
        value: 1,
    })
    console.log('Populated:', populated)
    const signed = await smartAccount.signTransaction(populated)
    console.log('signed:', signed)
    const transactionHash = await smartAccount.sendRawTransaction(signed)

    console.log('transactionHash:', transactionHash)
    const receipt = await utils.waitTxReceipt(l2Provider.eth, transactionHash)
    console.log('receipt:', receipt)
}


test().catch(console.error)
