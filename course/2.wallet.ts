import {ZKsyncPlugin, types, constants, Web3ZKsyncL2, utils} from 'web3-plugin-zksync'
import {Web3} from 'web3'
import {DAI_L1, DAI_L2, richAccount} from './helpers/constants'

const test = async () => {
    const web3 = new Web3('http://localhost:8545')
    const l2Provider = Web3ZKsyncL2.initWithDefaultProvider(types.Network.Localhost)
    web3.registerPlugin(new ZKsyncPlugin(l2Provider))

    const wallet = new web3.ZKsync.Wallet(richAccount.privateKey)


    console.log('getAddress:', wallet.getAddress())
    console.log('getBalance L2:', await wallet.getBalance())
    console.log('getBalance L1:', await wallet.getBalanceL1())

    console.log('getBalance of the token L2:', await wallet.getBalance(DAI_L2))
    console.log('getBalance of the token L1:', await wallet.getBalanceL1(DAI_L1))


    console.log('---------Deposit example---------')
    console.log('Balance L1 before:', await wallet.getBalanceL1())
    console.log('Balance L2 before:', await wallet.getBalance())
    const depositTx = await wallet.deposit({
        token: constants.ETH_ADDRESS,
        to: wallet.getAddress(),
        amount: web3.utils.toWei(2, 'ether'),
        refundRecipient: wallet.getAddress(),
    })
    console.log('transaction hash: ', depositTx.hash)
    await depositTx.waitFinalize() // <== can be long in real networks.
    console.log('Balance L1 before after:', await wallet.getBalanceL1())
    console.log('Balance L2 before after:', await wallet.getBalance())


    console.log('---------Deposit token example---------')
    console.log('Balance L1 before:', await wallet.getBalanceL1(DAI_L1))
    console.log('Balance L2 before:', await wallet.getBalance(DAI_L2))
    const depositTokenTx = await wallet.deposit({
        token: DAI_L1,
        to: wallet.getAddress(),
        amount: 50000,
        approveERC20: true,
        refundRecipient: wallet.getAddress(),
    })
    console.log('transaction hash: ', depositTokenTx.hash)
    await depositTokenTx.waitFinalize() // <== can be long in real networks.
    console.log('Balance L1 before after:', await wallet.getBalanceL1(DAI_L1))
    console.log('Balance L2 before after:', await wallet.getBalance(DAI_L2))


    console.log('---------Withdraw example---------')
    console.log('Balance L1 before:', await wallet.getBalanceL1())
    console.log('Balance L2 before:', await wallet.getBalance())
    const withdrawTx = await wallet.withdraw({
        token: DAI_L2,
        to: wallet.getAddress(),
        amount: web3.utils.toWei(2, 'ether'),
    })
    console.log('transaction hash: ', withdrawTx.hash)
    const tx1 = await withdrawTx.waitFinalize() // <== can be long in real networks.
    await wallet.finalizeWithdrawal(tx1.transactionHash)
    console.log('Balance L1 after:', await wallet.getBalanceL1())
    console.log('Balance L2 after:', await wallet.getBalance())


    console.log('---------Withdraw token example---------')
    console.log('Balance L1 before:', await wallet.getBalanceL1(DAI_L1))
    console.log('Balance L2 before:', await wallet.getBalance(DAI_L2))
    const withdrawTokenTx = await wallet.withdraw({
        token: constants.ETH_ADDRESS,
        to: wallet.getAddress(),
        amount: web3.utils.toWei(2, 'ether'),
    })
    console.log('transaction hash: ', withdrawTokenTx.hash)
    const tx2 = await withdrawTokenTx.waitFinalize() // <== can be long in real networks.
    await wallet.finalizeWithdrawal(tx2.transactionHash)
    console.log('Balance L1 after:', await wallet.getBalanceL1(DAI_L1))
    console.log('Balance L2 after:', await wallet.getBalance(DAI_L2))


    console.log('---------Transfer example---------')
    const recipient = web3.ZKsync.Wallet.createRandom()

    console.log('Balance before:', await wallet.getBalance())
    console.log('Recipient balance before:', await recipient.getBalance())
    const transferTx = await wallet.transfer({
        token: constants.ETH_ADDRESS,
        to: recipient.getAddress(),
        amount: web3.utils.toWei(1, 'ether'),
    });
    await transferTx.wait();
    console.log('Balance after:', await wallet.getBalance())
    console.log('Recipient balance after:', await recipient.getBalance())


    console.log('---------Transfer token example---------')
    console.log('Balance before:', await wallet.getBalance(DAI_L2))
    console.log('Recipient balance before:', await recipient.getBalance(DAI_L2))
    const transferTokenTx = await wallet.transfer({
        token: DAI_L2,
        to: recipient.getAddress(),
        amount: 100,
    });
    await transferTokenTx.wait();
    console.log('Balance after:', await wallet.getBalance(DAI_L2))
    console.log('Recipient balance after:', await recipient.getBalance(DAI_L2))


    console.log('All balances', await wallet.getAllBalances())


    console.log('---------Send transaction example---------')
    const populated = await wallet.populateTransaction({
        from: wallet.getAddress(),
        to: recipient.getAddress(),
        value: 1,
    })

    console.log('Populated:', populated)
    const signed = await wallet.signTransaction(populated)
    console.log('signed:', signed)
    const transactionHash = await wallet.sendRawTransaction(signed)

    console.log('transactionHash:', transactionHash)
    const receipt = await utils.waitTxReceipt(wallet.provider.eth, transactionHash)
    console.log('receipt:', receipt)

    const signAndSendTx = await wallet.signAndSend({
        from: wallet.getAddress(),
        to: recipient.getAddress(),
        value: 2,
    })
    const receipt2 = await signAndSendTx.wait()
    console.log('signAndSendTx receipt:', receipt2)
}


test().catch(console.error)
