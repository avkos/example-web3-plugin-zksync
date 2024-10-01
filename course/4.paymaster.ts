import {
    ZKsyncPlugin,
    types,
    Web3ZKsyncL2, getPaymasterParams,
} from 'web3-plugin-zksync'
import {Web3} from 'web3'
import {ETH_ADDRESS, ETH_ADDRESS_IN_CONTRACTS} from "../../web3-plugin-zksync/src/constants";
import {richAccount, APPROVAL_TOKEN, PAYMASTER, DAI_L2} from "./helpers/constants";

const test = async () => {
    const web3 = new Web3('http://localhost:8545')
    const l2Provider = Web3ZKsyncL2.initWithDefaultProvider(types.Network.Localhost)
    web3.registerPlugin(new ZKsyncPlugin(l2Provider))
    const wallet = new web3.ZKsync.Wallet(richAccount.privateKey)
    const account = new web3.ZKsync.SmartAccount({secret: richAccount.privateKey, address: richAccount.address})
    const recipient = web3.ZKsync.Wallet.createRandom()

    console.log('--------Send ETH using paymaster---------')
    {
        const token = await wallet.l2TokenAddress(ETH_ADDRESS_IN_CONTRACTS);
        const paymasterBalanceBeforeTransfer = await l2Provider.getBalance(PAYMASTER);
        const paymasterTokenBalanceBeforeTransfer = await l2Provider.getTokenBalance(
            APPROVAL_TOKEN,
            PAYMASTER,
        );
        const senderBalanceBeforeTransfer = await wallet.getBalance(token);
        const senderApprovalTokenBalanceBeforeTransfer = await wallet.getBalance(APPROVAL_TOKEN);
        const receiverBalanceBeforeTransfer = await recipient.getBalance(token);

        console.log('Balances before transfer:', {
            paymasterBalanceBeforeTransfer,
            paymasterTokenBalanceBeforeTransfer,
            senderBalanceBeforeTransfer,
            senderApprovalTokenBalanceBeforeTransfer,
            receiverBalanceBeforeTransfer,
        })
        // const result = await wallet.transfer({
        //     token: token,
        //     to: recipient.getAddress(),
        //     amount: web3.utils.toWei(0.1, 'ether'),
        //     paymasterParams: getPaymasterParams(PAYMASTER, {
        //         type: 'ApprovalBased',
        //         token: APPROVAL_TOKEN,
        //         minimalAllowance: 1,
        //         innerInput: new Uint8Array(),
        //     }),
        // });
        // or
        const result = await account.transfer({
            token: ETH_ADDRESS,
            to: recipient.getAddress(),
            amount: web3.utils.toWei(0.1, 'ether'),
            paymasterParams: getPaymasterParams(PAYMASTER, {
                type: 'ApprovalBased',
                token: APPROVAL_TOKEN,
                minimalAllowance: 1,
                innerInput: new Uint8Array(),
            }),
        });
        console.log('transaction hash:', result.hash);
        await result.wait();

        const paymasterBalanceAfterTransfer = await l2Provider.getBalance(PAYMASTER);
        const paymasterTokenBalanceAfterTransfer = await l2Provider.getTokenBalance(
            APPROVAL_TOKEN,
            PAYMASTER,
        );
        const senderBalanceAfterTransfer = await wallet.getBalance(token);
        const senderApprovalTokenBalanceAfterTransfer = await wallet.getBalance(APPROVAL_TOKEN);
        const receiverBalanceAfterTransfer = await recipient.getBalance(token);
        console.log('Balances after transfer:', {
            paymasterBalanceAfterTransfer,
            paymasterTokenBalanceAfterTransfer,
            senderBalanceAfterTransfer,
            senderApprovalTokenBalanceAfterTransfer,
            receiverBalanceAfterTransfer,
        })
    }
    console.log('--------Send TOKEN using paymaster---------')
    {
        const amount = 4
        const minimalAllowance = 1

        const paymasterBalanceBeforeTransfer = await l2Provider.getBalance(PAYMASTER);
        const paymasterTokenBalanceBeforeTransfer = await l2Provider.getTokenBalance(APPROVAL_TOKEN, PAYMASTER)
        const senderBalanceBeforeTransfer = await wallet.getBalance(DAI_L2);
        const senderApprovalTokenBalanceBeforeTransfer = await wallet.getBalance(APPROVAL_TOKEN);
        const receiverBalanceBeforeTransfer = await recipient.getBalance(DAI_L2);

        console.log('Balances before transfer:', {
            paymasterBalanceBeforeTransfer,
            paymasterTokenBalanceBeforeTransfer,
            senderBalanceBeforeTransfer,
            senderApprovalTokenBalanceBeforeTransfer,
            receiverBalanceBeforeTransfer,
        })
        const tx = await wallet.transfer({
            token: DAI_L2,
            to: recipient.getAddress(),
            amount,
            paymasterParams: getPaymasterParams(PAYMASTER, {
                type: 'ApprovalBased',
                token: APPROVAL_TOKEN,
                minimalAllowance: minimalAllowance,
                innerInput: new Uint8Array(),
            }),
        });
        const result = await tx.wait();

        const paymasterBalanceAfterTransfer = await l2Provider.getBalance(PAYMASTER);
        const paymasterTokenBalanceAfterTransfer = await l2Provider.getTokenBalance(APPROVAL_TOKEN, PAYMASTER)
        const senderBalanceAfterTransfer = await wallet.getBalance(DAI_L2);
        const senderApprovalTokenBalanceAfterTransfer = await wallet.getBalance(APPROVAL_TOKEN);
        const receiverBalanceAfterTransfer = await recipient.getBalance(DAI_L2)
        console.log('Balances after transfer:', {
            paymasterBalanceAfterTransfer,
            paymasterTokenBalanceAfterTransfer,
            senderBalanceAfterTransfer,
            senderApprovalTokenBalanceAfterTransfer,
            receiverBalanceAfterTransfer,
        })
    }
    console.log('--------Withdraw using paymaster---------')
    {
        const amount = 7000000000;
        const minimalAllowance = 1;

        const token = await wallet.l2TokenAddress(ETH_ADDRESS_IN_CONTRACTS);
        const paymasterBalanceBeforeWithdrawal = await l2Provider.eth.getBalance(PAYMASTER);
        const paymasterTokenBalanceBeforeWithdrawal = await l2Provider.getTokenBalance(
            APPROVAL_TOKEN,
            PAYMASTER,
        );
        const l2BalanceBeforeWithdrawal = await wallet.getBalance(token);
        const l2ApprovalTokenBalanceBeforeWithdrawal = await wallet.getBalance(APPROVAL_TOKEN);

        console.log('Balances before withdrawal:', {
            paymasterBalanceBeforeWithdrawal,
            paymasterTokenBalanceBeforeWithdrawal,
            l2BalanceBeforeWithdrawal,
            l2ApprovalTokenBalanceBeforeWithdrawal,
        })
        const tx = await wallet.withdraw({
            token: token,
            to: wallet.getAddress(),
            amount: amount,
            paymasterParams: getPaymasterParams(PAYMASTER, {
                type: 'ApprovalBased',
                token: APPROVAL_TOKEN,
                minimalAllowance: minimalAllowance,
                innerInput: new Uint8Array(),
            }),
        });
        const withdrawTx = await tx.waitFinalize();

        const result = await wallet.finalizeWithdrawal(withdrawTx.transactionHash);

        const paymasterBalanceAfterWithdrawal = await l2Provider.getBalance(PAYMASTER);
        const paymasterTokenBalanceAfterWithdrawal = await l2Provider.getTokenBalance(
            APPROVAL_TOKEN,
            PAYMASTER,
        );
        const l2BalanceAfterWithdrawal = await wallet.getBalance(token);
        const l2ApprovalTokenBalanceAfterWithdrawal = await wallet.getBalance(APPROVAL_TOKEN);
        console.log('Balances after withdrawal:', {
            paymasterBalanceAfterWithdrawal,
            paymasterTokenBalanceAfterWithdrawal,
            l2BalanceAfterWithdrawal,
            l2ApprovalTokenBalanceAfterWithdrawal,
        })
    }

}


test().catch(console.error)
