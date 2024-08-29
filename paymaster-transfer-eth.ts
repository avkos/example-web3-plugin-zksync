import {getPaymasterParams, Web3ZKsyncL2, ZKsyncPlugin} from 'web3-plugin-zksync'
import {Web3} from 'web3'
import {APPROVAL_TOKEN, PAYMASTER} from "./constant";
import {ZKsyncWallet,types} from "web3-plugin-zksync";

const privateKey = process.env.PK as string

const test = async () => {
    const l1='https://eth-sepolia.g.alchemy.com/v2/VCOFgnRGJF_vdAY2ZjgSksL6-6pYvRkz'
    const l2=Web3ZKsyncL2.initWithDefaultProvider(types.Network.Sepolia)

    const web3 = new Web3(l1)
    web3.registerPlugin(new ZKsyncPlugin(l2))
    const wallet = new web3.ZKsync.Wallet(privateKey)
    const amount = web3.utils.toWei('0.0001', 'ether');
    const minimalAllowance = 1;

    const l2Provider = wallet.provider!

    console.log('-----BALANCES BEFORE TRANSFER-----')
    console.log('Paymaster ETH',await l2Provider.getBalance(PAYMASTER))
    console.log('Paymaster ApprovalToken',await l2Provider.getTokenBalance(
        APPROVAL_TOKEN,
        PAYMASTER,
    ))

    console.log('Sender ETH',await wallet.getBalance())
    console.log('Sender ApprovalToken',await wallet.getBalance(APPROVAL_TOKEN))

    const random = ZKsyncWallet.createRandom()
    console.log('Receiver ApprovalToken',await l2Provider.getBalance(random.getAddress()))

    const tx = await wallet.transfer({
        to: random.getAddress(),
        amount: amount,
        paymasterParams: getPaymasterParams(PAYMASTER, {
            type: 'ApprovalBased',
            token: APPROVAL_TOKEN,
            minimalAllowance: minimalAllowance,
            innerInput: new Uint8Array(),
        }),
    })!;
    const result = await tx.wait();

    console.log('transaction', result.transactionHash)
    console.log('-----BALANCES AFTER TRANSFER-----')
    console.log('Paymaster ETH', await l2Provider.getBalance(PAYMASTER))
    console.log('Paymaster ApprovalToken',await l2Provider.getTokenBalance(
        APPROVAL_TOKEN,
        PAYMASTER,
    ),'increased by 1, because transaction was paid by paymaster, using Approval Token')

    console.log('Sender ETH',await wallet.getBalance())
    console.log('Sender ApprovalToken',await wallet.getBalance(APPROVAL_TOKEN), 'decreased by 1, because transaction was paid by paymaster, using Approval Token')

    console.log('Receiver ApprovalToken',await l2Provider.getBalance(random.getAddress()))
}

test().catch(console.error)
