import {getPaymasterParams, Web3ZKsyncL2, ZKsyncPlugin} from 'web3-plugin-zksync'
import {Web3} from 'web3'
import {APPROVAL_TOKEN, PAYMASTER, USDC_L1} from "./constant";
import {ZKsyncWallet,types} from "web3-plugin-zksync";

const privateKey = process.env.PK as string

const test = async () => {
    const l1='https://eth-sepolia.g.alchemy.com/v2/VCOFgnRGJF_vdAY2ZjgSksL6-6pYvRkz'
    const l2=Web3ZKsyncL2.initWithDefaultProvider(types.Network.Sepolia)

    const web3 = new Web3(l1)
    web3.registerPlugin(new ZKsyncPlugin(l2))
    const wallet = new web3.ZKsync.Wallet(privateKey)
    const amount = BigInt(5)
    const minimalAllowance = 1;

    const l2Provider = wallet.provider!
    const USDC_L2 = await l2Provider.l2TokenAddress(USDC_L1);
    console.log('USDC L2 contract address',USDC_L2)
    console.log('-----BALANCES BEFORE TRANSFER-----')
    console.log('Paymaster ETH',await l2Provider.getBalance(PAYMASTER))
    console.log('Paymaster ApprovalToken',await l2Provider.getTokenBalance(
        APPROVAL_TOKEN,
        PAYMASTER,
    ),'increased by 1, because transaction was paid by paymaster, using Approval Token')

    console.log('Sender ETH',await wallet.getBalance())
    console.log('Sender USDC',await wallet.getBalance(USDC_L2))
    console.log('Sender ApprovalToken',await wallet.getBalance(APPROVAL_TOKEN),'decreased by 1, because transaction was paid by paymaster, using Approval Token')
    const random = ZKsyncWallet.createRandom()
    console.log('Receiver USDC',await l2Provider.getTokenBalance(USDC_L2,random.getAddress()))


    const tx = await wallet.transfer({
        token: USDC_L2,
        to: random.getAddress(),
        amount: amount,
        paymasterParams: getPaymasterParams(PAYMASTER, {
            type: 'ApprovalBased',
            token: APPROVAL_TOKEN,
            minimalAllowance: minimalAllowance,
            innerInput: new Uint8Array(),
        }),
    });
    const result = await tx.wait();
    console.log('transaction', result.transactionHash)

    console.log('-----BALANCES AFTER TRANSFER-----')
    console.log('Paymaster ETH',await l2Provider.getBalance(PAYMASTER))
    console.log('Paymaster ApprovalToken',await l2Provider.getTokenBalance(
        APPROVAL_TOKEN,
        PAYMASTER,
    ))

    console.log('Sender ETH',await wallet.getBalance())
    console.log('Sender USDC',await wallet.getBalance(USDC_L2))
    console.log('Sender ApprovalToken',await wallet.getBalance(APPROVAL_TOKEN))
    console.log('Receiver USDC',await l2Provider.getTokenBalance(USDC_L2,random.getAddress()))

}

test().catch(console.error)
